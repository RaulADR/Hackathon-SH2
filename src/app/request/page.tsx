"use client";

import Link from "next/link";
import type {
  FeatureCollection,
  MultiPolygon,
  Polygon as GeoPolygon,
} from "geojson";
import { useEffect, useMemo, useState } from "react";

import { useRomanian } from "~/app/_components/language-context";
import { DroneIcon } from "~/app/_components/drone-icon";
import { SignaturePad } from "~/app/_components/signature-pad";
import { createFilledAnexa1, type Anexa1Data } from "~/lib/anexa1-pdf";
import { extractEmailAddresses } from "~/lib/contacts";
import {
  getTowerOptions,
  hasUnmappedTowerContact,
  isTowerContact,
} from "~/lib/ctr";
import { normalizeDrones, type PilotDrone } from "~/lib/drone";
import {
  areasOverlap,
  geoJsonRingToLatLng,
  type LatLngPoint,
} from "~/lib/geometry";
import type { LocalPlan } from "~/lib/local-plan";
import { getRomaniaTime } from "~/lib/time";
import { api } from "~/trpc/react";

type ZoneProperties = {
  zone_id?: string;
  contact?: string;
  status?: string;
};
type ZoneCollection = FeatureCollection<
  GeoPolygon | MultiPolygon,
  ZoneProperties
>;
type PilotProfile = {
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  operatorId?: string;
  location?: string;
  registration?: string;
  insuranceUntil?: string;
  drones?: PilotDrone[] | string[];
};
const AREA_KEY = "aerio.flightArea";

function pilotFullName(profile: PilotProfile): string {
  const fullName = [profile.firstName, profile.lastName]
    .filter(Boolean)
    .join(" ");
  return fullName.length > 0 ? fullName : (profile.name ?? "");
}

function defaultFlightCategory(drone?: PilotDrone): string {
  if (!drone) return "";
  if (drone.massGrams < 250) return "A1";
  if (
    drone.droneClass === "C2" &&
    drone.massGrams >= 900 &&
    drone.massGrams <= 4000
  )
    return "A2";
  return "A3";
}

function polygonRings(
  feature: ZoneCollection["features"][number],
): LatLngPoint[][] {
  if (feature.geometry.type === "Polygon") {
    const ring = feature.geometry.coordinates[0];
    return ring ? [geoJsonRingToLatLng(ring)] : [];
  }
  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates.flatMap((polygon) => {
      const ring = polygon[0];
      return ring ? [geoJsonRingToLatLng(ring)] : [];
    });
  }
  return [];
}

function readJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch (error) {
    console.error(`Could not read ${key} from local storage.`, error);
    return fallback;
  }
}

function getDefaultFlightDate(): string {
  const now = getRomaniaTime();
  if (now.minutes < 19 * 60) return now.date;
  const nextDate = new Date(`${now.date}T00:00:00Z`);
  nextDate.setUTCDate(nextDate.getUTCDate() + 1);
  return nextDate.toISOString().slice(0, 10);
}

export default function RequestPage() {
  const romanian = useRomanian();
  const [area, setArea] = useState<LatLngPoint[]>([]);
  const [profile, setProfile] = useState<PilotProfile>({});
  const [zones, setZones] = useState<ZoneCollection | null>(null);
  const [flightDate, setFlightDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [drone, setDrone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [flightCategory, setFlightCategory] = useState("");
  const [operationMode, setOperationMode] = useState("");
  const [maxAltitude, setMaxAltitude] = useState("");
  const [signatureDataUrl, setSignatureDataUrl] = useState("");
  const [pdfDownloadId, setPdfDownloadId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [pdfErrorPlanId, setPdfErrorPlanId] = useState<string | null>(null);
  const [saveError, setSaveError] = useState("");
  const profileDrones = useMemo(
    () => normalizeDrones(profile.drones),
    [profile.drones],
  );
  const profileName = pilotFullName(profile);
  const selectedDrone = profileDrones.find((item) => item.id === drone);
  const utils = api.useUtils();
  const profileQuery = api.account.profile.useQuery();
  const slotsQuery = api.flight.candidateTimes.useQuery(
    { flightDate, duration, area },
    { enabled: flightDate.length === 10 && area.length >= 3 },
  );
  const preparePlan = api.flight.prepare.useMutation({
    onSuccess: () => {
      setSaveError("");
      setStartTime("");
      setSignatureDataUrl("");
      void utils.flight.candidateTimes.invalidate();
      void utils.flight.list.invalidate();
    },
    onError: (error) => setSaveError(error.message),
  });

  useEffect(() => {
    setArea(readJson<LatLngPoint[]>(AREA_KEY, []));
    setFlightDate(getDefaultFlightDate());
    void fetch("/data/romatsa-uav-zones.json")
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`ROMATSA data request failed (${response.status}).`);
        return (await response.json()) as ZoneCollection;
      })
      .then(setZones)
      .catch((error: unknown) =>
        console.error("Could not load ROMATSA contact data.", error),
      );
  }, []);

  useEffect(() => {
    if (!profileQuery.data) return;
    const savedProfile = profileQuery.data;
    const savedDrones = normalizeDrones(savedProfile.drones);
    setProfile({ ...savedProfile, drones: savedDrones });
    setDrone(savedDrones[0]?.id ?? "");
    setFlightCategory(defaultFlightCategory(savedDrones[0]));
  }, [profileQuery.data]);

  const contactEmails = useMemo(() => {
    if (!zones || area.length < 3) return [];
    const unique = new Set<string>();
    for (const feature of zones.features) {
      if (!polygonRings(feature).some((ring) => areasOverlap(area, ring)))
        continue;
      for (const email of extractEmailAddresses(
        feature.properties?.contact ?? "",
      )) {
        unique.add(email);
      }
    }
    return [...unique];
  }, [zones, area]);

  const intersectingZones = useMemo(() => {
    if (!zones || area.length < 3) return [];
    return zones.features.filter((feature) =>
      polygonRings(feature).some((ring) => areasOverlap(area, ring)),
    );
  }, [zones, area]);

  const ctrContactZones = useMemo(
    () =>
      intersectingZones.filter((feature) =>
        isTowerContact(feature.properties?.contact ?? ""),
      ),
    [intersectingZones],
  );
  const ctrTowerOptions = useMemo(
    () =>
      getTowerOptions(
        ctrContactZones.map((feature) => feature.properties?.contact ?? ""),
      ),
    [ctrContactZones],
  );
  const unmappedTowerContact = useMemo(
    () =>
      hasUnmappedTowerContact(
        ctrContactZones.map((feature) => feature.properties?.contact ?? ""),
      ),
    [ctrContactZones],
  );
  const tower =
    ctrTowerOptions.length === 1 && !unmappedTowerContact
      ? (ctrTowerOptions[0] ?? "")
      : "";
  const overlapsRestrictedZone = intersectingZones.some((feature) =>
    /restricted|restricționat/i.test(feature.properties?.status ?? ""),
  );

  function createPlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedSlot = slotsQuery.data?.find(
      (slot) => slot.startTime === startTime,
    );
    if (!selectedSlot) return;
    if (
      !selectedDrone?.cameraModel.trim() ||
      !selectedDrone.cameraResolution.trim() ||
      selectedDrone.droneClass === "none"
    )
      return;
    if (
      !tower ||
      !flightCategory ||
      !operationMode ||
      !maxAltitude ||
      Number(maxAltitude) < 1 ||
      Number(maxAltitude) > 400 ||
      !signatureDataUrl ||
      !profileName.trim() ||
      !profile.operatorId?.trim()
    )
      return;
    preparePlan.mutate({
      flightDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      area,
      droneId: selectedDrone.id,
      purpose,
      contacts: contactEmails,
      tower,
      flightCategory,
      operationMode,
      maxAltitude,
      signatureDataUrl,
      ctrIndicator: ctrContactZones.length > 0,
    });
  }

  async function downloadAnexa1(plan: LocalPlan) {
    setPdfError("");
    setPdfErrorPlanId(null);
    setPdfDownloadId(plan.id);
    try {
      if (!plan.signatureDataUrl)
        throw new Error(
          romanian
            ? "Această cerere nu are semnătură. Creează o cerere nouă și semneaz-o înainte de descărcarea PDF-ului."
            : "This request has no signature. Create a new request and sign it before downloading its PDF.",
        );
      const [templateResponse, fontResponse] = await Promise.all([
        fetch("/anexa1.pdf"),
        fetch("/fonts/NotoSans.ttf"),
      ]);
      if (!templateResponse.ok)
        throw new Error(
          `Anexa 1 download failed (${templateResponse.status}).`,
        );
      if (!fontResponse.ok)
        throw new Error(`PDF font download failed (${fontResponse.status}).`);
      const [template, font] = await Promise.all([
        templateResponse.arrayBuffer(),
        fontResponse.arrayBuffer(),
      ]);
      const data: Anexa1Data = {
        pilot: plan.pilot,
        email: plan.email,
        phone: plan.phone,
        operatorId: plan.operatorId,
        location: plan.location,
        registration: plan.registration,
        droneMassGrams: plan.droneMassGrams,
        droneClass: plan.droneClass,
        flightDate: plan.flightDate,
        startTime: plan.startTime,
        endTime: plan.endTime,
        drone: plan.drone,
        purpose: plan.purpose,
        area: plan.area,
        tower: plan.tower ?? "",
        flightCategory: plan.flightCategory ?? "",
        operationMode: plan.operationMode ?? "",
        maxAltitude: plan.maxAltitude ?? "",
        signatureDataUrl: plan.signatureDataUrl,
      };
      const pdfBytes = await createFilledAnexa1(template, font, data);
      const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
      new Uint8Array(pdfBuffer).set(pdfBytes);
      const blob = new Blob([pdfBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `aerio-anexa1-${plan.flightDate}.pdf`;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Could not generate the filled Anexa 1 PDF.", error);
      setPdfError(
        error instanceof Error
          ? error.message
          : romanian
            ? "PDF-ul nu a putut fi generat."
            : "The PDF could not be generated.",
      );
      setPdfErrorPlanId(plan.id);
    } finally {
      setPdfDownloadId(null);
    }
  }

  function downloadCurrentAnexa1() {
    const selectedSlot = slotsQuery.data?.find(
      (slot) => slot.startTime === startTime,
    );
    if (
      !selectedSlot ||
      !selectedDrone ||
      area.length < 3 ||
      !purpose.trim() ||
      !signatureDataUrl
    )
      return;

    void downloadAnexa1({
      id: "current",
      flightDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      area,
      drone: `${selectedDrone.nickname} — ${selectedDrone.model}`,
      purpose: purpose.trim(),
      pilot: pilotFullName(profile),
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      operatorId: profile.operatorId ?? "",
      location: profile.location ?? "",
      registration: profile.registration ?? "",
      insuranceUntil: profile.insuranceUntil ?? "",
      contacts: contactEmails,
      droneMassGrams: selectedDrone.massGrams,
      droneClass: selectedDrone.droneClass,
      tower: tower || undefined,
      flightCategory: flightCategory || undefined,
      operationMode: operationMode || undefined,
      maxAltitude: maxAltitude || undefined,
      ctrIndicator: ctrContactZones.length > 0,
      status: "prepared",
      documents: [],
    });
  }

  const maxAltitudeNumber = Number(maxAltitude);
  const validAltitude =
    Number.isFinite(maxAltitudeNumber) &&
    maxAltitudeNumber >= 1 &&
    maxAltitudeNumber <= 400;
  const hasCompleteProfile = Boolean(
    profileName.trim() && profile.operatorId?.trim(),
  );
  const canUseSelectedDrone = Boolean(
    selectedDrone?.cameraModel.trim() &&
    selectedDrone.cameraResolution.trim() &&
    selectedDrone.droneClass !== "none",
  );
  const selectableCategories =
    selectedDrone && selectedDrone.massGrams < 250
      ? ["A1"]
      : selectedDrone?.droneClass === "C2" &&
          selectedDrone.massGrams >= 900 &&
          selectedDrone.massGrams <= 4000
        ? ["A2", "A3"]
        : ["A3"];
  const canPrepareRequest = Boolean(
    area.length >= 3 &&
    flightDate &&
    startTime &&
    canUseSelectedDrone &&
    purpose.trim() &&
    hasCompleteProfile &&
    tower &&
    flightCategory &&
    operationMode &&
    validAltitude &&
    signatureDataUrl,
  );

  return (
    <>
      <p className="route-description">
        {romanian
          ? "Alege zona, aeronava și un interval candidat, apoi pregătește documentele."
          : "Choose the area, aircraft and a candidate time, then prepare your documents."}
      </p>
      <div className="request-layout">
        <section className="content-card request-form-card">
          <form onSubmit={createPlan}>
            <div className="section-heading">
              <span className="eyebrow">
                {romanian ? "01 · DETALII ZBOR" : "01 · FLIGHT DETAILS"}
              </span>
              <h2>{romanian ? "Planifică zborul" : "Plan the flight"}</h2>
            </div>
            <div className="selected-area-row">
              <div>
                <strong>
                  {area.length >= 3
                    ? romanian
                      ? `${area.length} puncte selectate`
                      : `${area.length} polygon points selected`
                    : romanian
                      ? "Nicio zonă selectată"
                      : "No flight area selected"}
                </strong>
                <span>
                  {area.length >= 3
                    ? romanian
                      ? "Salvată în contul tău"
                      : "Saved to your account"
                    : romanian
                      ? "Alege mai întâi poligonul pe harta spațiului aerian"
                      : "Choose your polygon on the airspace map first"}
                </span>
              </div>
              <Link className="button button-quiet" href="/airspace">
                {romanian ? "Deschide harta" : "Open map"}
              </Link>
            </div>
            <div className="form-grid">
              <label className="field">
                <span>{romanian ? "Data zborului" : "Flight date"}</span>
                <input
                  type="date"
                  min={getRomaniaTime().date}
                  value={flightDate}
                  onChange={(event) => {
                    setFlightDate(event.target.value);
                    setStartTime("");
                  }}
                  required
                />
              </label>
              <label className="field">
                <span>{romanian ? "Durată" : "Duration"}</span>
                <select
                  value={duration}
                  onChange={(event) => {
                    setDuration(Number(event.target.value));
                    setStartTime("");
                  }}
                >
                  {[30, 60, 90, 120, 180].map((minutes) => (
                    <option value={minutes} key={minutes}>
                      {minutes} {romanian ? "minute" : "minutes"}
                    </option>
                  ))}
                </select>
              </label>
              <fieldset className="drone-picker-field">
                <legend>
                  {romanian
                    ? "Alege drona pentru zbor"
                    : "Choose a drone for this flight"}
                </legend>
                {profileDrones.length > 0 ? (
                  <div className="drone-choice-list">
                    {profileDrones.map((item) => (
                      <label
                        className={`drone-choice ${drone === item.id ? "selected" : ""} ${!item.cameraModel.trim() || !item.cameraResolution.trim() ? "unavailable" : ""}`}
                        key={item.id}
                      >
                        <input
                          type="radio"
                          name="selected-drone"
                          value={item.id}
                          checked={drone === item.id}
                          onChange={() => {
                            setDrone(item.id);
                            setFlightCategory(defaultFlightCategory(item));
                          }}
                          disabled={
                            !item.cameraModel.trim() ||
                            !item.cameraResolution.trim()
                          }
                          required
                        />
                        <span className="drone-choice-icon">
                          <DroneIcon />
                        </span>
                        <span className="drone-choice-info">
                          <strong>{item.nickname}</strong>
                          <span>
                            {item.model} · {item.massGrams} g
                          </span>
                          <span>
                            {item.cameraModel && item.cameraResolution
                              ? `${item.cameraModel} · ${item.cameraResolution}`
                              : romanian
                                ? "Configurează camera și rezoluția în profil"
                                : "Set up camera and resolution in Profile"}
                          </span>
                        </span>
                        <span className="drone-choice-check" aria-hidden="true">
                          {drone === item.id ? "✓" : ""}
                        </span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <span className="fleet-picker-empty">
                    {romanian
                      ? "Adaugă o dronă în flotă înainte de a planifica zborul."
                      : "Add a drone to your fleet before planning a flight."}{" "}
                    <Link href="/profile">
                      {romanian ? "Gestionează flota →" : "Manage fleet →"}
                    </Link>
                  </span>
                )}
                {profileDrones.some(
                  (item) =>
                    !item.cameraModel.trim() || !item.cameraResolution.trim(),
                ) && (
                  <span className="fleet-picker-note">
                    {romanian
                      ? "Dronele vechi fără rezoluție nu pot fi folosite până nu completezi detaliile."
                      : "Older drones without a resolution cannot be selected until their details are completed."}{" "}
                    <Link href="/profile">
                      {romanian ? "Editează flota →" : "Edit fleet →"}
                    </Link>
                  </span>
                )}
              </fieldset>
              <fieldset className="drone-picker-field">
                <legend>
                  {romanian
                    ? "Anexa 1 · turn de control și detalii zbor"
                    : "Anexa 1 · control tower and flight details"}
                </legend>
                <p className="small-note">
                  {romanian
                    ? "Turnul este completat automat numai când contactul TWR ROMATSA al zonei intersectate indică un singur turn cunoscut. Setul local nu clasifică oficial limitele CTR; confirmă turnul pe harta oficială."
                    : "The tower is filled automatically only when an intersecting ROMATSA zone contact identifies exactly one known tower. The local dataset does not officially classify CTR boundaries; confirm the tower on the official map."}
                </p>
                {overlapsRestrictedZone && (
                  <p className="notice notice-warning">
                    {romanian
                      ? "Poligonul intersectează o zonă marcată restricționată în setul local. Formularul Anexa 1 nu autorizează zborul în acea zonă; verifică și obține separat aprobările necesare."
                      : "The polygon intersects a zone marked restricted in the local dataset. Anexa 1 does not authorize flight there; verify and obtain any separate required approvals."}
                  </p>
                )}
                <div className="form-grid">
                  <div className="field">
                    <span>
                      {romanian
                        ? "Turn TWR identificat automat"
                        : "Automatically identified TWR"}
                    </span>
                    <output className="tower-auto-value">
                      {tower ||
                        (romanian
                          ? "Nu se poate determina un singur turn din datele zonei"
                          : "A single tower cannot be determined from this zone data")}
                    </output>
                  </div>
                  <label className="field">
                    <span>
                      {romanian ? "Categoria de zbor" : "Flight category"}
                    </span>
                    <select
                      value={flightCategory}
                      onChange={(event) =>
                        setFlightCategory(event.target.value)
                      }
                      required
                      disabled={!selectedDrone}
                    >
                      {selectableCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="field">
                    <span>
                      {romanian ? "Mod de operare" : "Operation mode"}
                    </span>
                    <select
                      value={operationMode}
                      onChange={(event) => setOperationMode(event.target.value)}
                      required
                    >
                      <option value="">
                        {romanian ? "Alege modul" : "Select mode"}
                      </option>
                      <option value="Visual Line Of Sight (VLOS)">
                        {romanian
                          ? "În raza vizuală directă (VLOS)"
                          : "Visual Line Of Sight (VLOS)"}
                      </option>
                      <option value="Beyond Visual Line Of Sight (BVLOS)">
                        {romanian
                          ? "În afara razei vizuale (BVLOS)"
                          : "Beyond Visual Line Of Sight (BVLOS)"}
                      </option>
                    </select>
                  </label>
                  <label className="field">
                    <span>
                      {romanian
                        ? "Altitudine maximă AGL (ft)"
                        : "Maximum altitude AGL (ft)"}
                    </span>
                    <input
                      type="number"
                      min="1"
                      max="400"
                      step="1"
                      value={maxAltitude}
                      onChange={(event) => setMaxAltitude(event.target.value)}
                      required
                    />
                  </label>
                </div>
                {area.length >= 3 && zones && !tower && (
                  <p className="notice notice-warning">
                    {romanian
                      ? "Anexa 1 nu poate fi generată: datele zonei selectate nu identifică exact un singur turn. Verifică CTR-ul și turnul competent pe harta oficială."
                      : "Anexa 1 cannot be generated: the selected zone data does not identify exactly one tower. Verify the CTR and responsible tower on the official map."}
                  </p>
                )}
                <p className="small-note">
                  {romanian
                    ? "Categoria se calculează automat: A1 sub 250 g, A3 de la 250 g; pentru o dronă C2 între 900 g și 4 kg poți selecta A2 sau A3. Altitudinea se introduce în ft și este inclusă în PDF în ft."
                    : "Category is derived automatically: A1 below 250 g, A3 from 250 g; for a C2 drone weighing 900 g–4 kg you may choose A2 or A3. Enter altitude in ft; the PDF includes it in ft."}
                </p>
                {selectedDrone?.droneClass === "none" && (
                  <p className="notice notice-warning">
                    {romanian
                      ? "Completează clasa certificată a dronei în profil pentru a putea genera Anexa 1."
                      : "Set the drone’s certified class in your profile to generate Anexa 1."}{" "}
                    <Link href="/profile">
                      {romanian ? "Editează drona →" : "Edit drone →"}
                    </Link>
                  </p>
                )}
              </fieldset>
              <label className="field">
                <span>{romanian ? "Scop" : "Purpose"}</span>
                <input
                  value={purpose}
                  onChange={(event) => setPurpose(event.target.value)}
                  maxLength={500}
                  placeholder={
                    romanian
                      ? "de ex. fotografie, inspecție"
                      : "e.g. photography, inspection"
                  }
                  required
                />
              </label>
            </div>
            <div className="section-heading slot-heading">
              <span className="eyebrow">
                {romanian ? "02 · INTERVALE CANDIDATE" : "02 · CANDIDATE TIMES"}
              </span>
              <h2>
                {romanian
                  ? "Alege un interval de planificare liber"
                  : "Choose an open planning slot"}
              </h2>
            </div>
            {area.length < 3 ? (
              <p className="notice notice-info">
                {romanian
                  ? "Selectează și închide un poligon pe "
                  : "Select and close a polygon on the "}
                <Link href="/airspace">
                  {romanian ? "harta spațiului aerian" : "airspace map"}
                </Link>
                {romanian
                  ? " înainte de verificarea intervalelor."
                  : " before checking times."}
              </p>
            ) : !flightDate ? (
              <p className="muted">
                {romanian
                  ? "Alege data pentru calcularea intervalelor candidate."
                  : "Choose a date to calculate candidate times."}
              </p>
            ) : slotsQuery.isLoading ? (
              <p className="muted">
                {romanian
                  ? "Se verifică ciornele de planificare salvate…"
                  : "Checking saved planning drafts…"}
              </p>
            ) : slotsQuery.error ? (
              <p className="notice notice-warning" role="alert">
                {romanian
                  ? "Intervalele candidate nu au putut fi verificate: "
                  : "Could not check candidate times: "}
                {slotsQuery.error.message}
              </p>
            ) : (
              <div className="slot-grid">
                {(slotsQuery.data ?? []).map((slot) => (
                  <button
                    className={`slot-button ${startTime === slot.startTime ? "selected" : ""}`}
                    type="button"
                    key={slot.startTime}
                    onClick={() => setStartTime(slot.startTime)}
                  >
                    <strong>
                      {slot.startTime}–{slot.endTime}
                    </strong>
                    <span>
                      {romanian
                        ? "Fără suprapuneri cu ciornele salvate"
                        : "Clear of saved overlapping drafts"}
                    </span>
                  </button>
                ))}
                {slotsQuery.data?.length === 0 && (
                  <p className="muted">
                    {romanian
                      ? "Nu există intervale pentru această dată. Încearcă o dată viitoare; se verifică toate planurile salvate în instalarea curentă."
                      : "No candidate times for this date. Try a future date; all saved plans in this installation are checked."}
                  </p>
                )}
              </div>
            )}
            {!hasCompleteProfile && (
              <p className="notice notice-warning">
                {romanian
                  ? "Completează numele pilotului și ID-ul operatorului AACR în profil înainte de a pregăti cererea."
                  : "Add the pilot name and AACR operator ID to your profile before preparing the request."}{" "}
                <Link href="/profile">
                  {romanian ? "Editează profilul →" : "Edit profile →"}
                </Link>
              </p>
            )}
            <SignaturePad
              value={signatureDataUrl}
              onChange={setSignatureDataUrl}
              romanian={romanian}
            />
            {saveError && (
              <p className="notice notice-warning" role="alert">
                {saveError}
              </p>
            )}
            <button
              className="button button-primary submit-button"
              type="submit"
              disabled={!canPrepareRequest || preparePlan.isPending}
            >
              {preparePlan.isPending
                ? romanian
                  ? "Se pregătește…"
                  : "Preparing…"
                : romanian
                  ? "Pregătește pachetul cererii"
                  : "Prepare request package"}
            </button>
            <div className="request-pdf-action">
              <button
                className="button button-primary"
                type="button"
                onClick={downloadCurrentAnexa1}
                disabled={!canPrepareRequest || pdfDownloadId === "current"}
              >
                {pdfDownloadId === "current"
                  ? romanian
                    ? "Se generează PDF-ul…"
                    : "Generating PDF…"
                  : romanian
                    ? "Descarcă PDF · Anexa 1"
                    : "Download PDF · Anexa 1"}
              </button>
              <span className="field-hint">
                {romanian
                  ? "Semnează cererea și completează toate câmpurile obligatorii înainte de descărcarea PDF-ului."
                  : "Sign the request and complete all required fields before downloading the PDF."}
              </span>
            </div>
            {pdfError && pdfErrorPlanId === "current" && (
              <p className="notice notice-warning" role="alert">
                {pdfError}
              </p>
            )}
          </form>
        </section>
        <aside className="request-aside">
          <section className="content-card">
            <span className="eyebrow">
              {romanian ? "CONTACTE ZONĂ" : "ZONE CONTACTS"}
            </span>
            <h2>
              {romanian
                ? "Verifică autoritatea relevantă"
                : "Check the right authority"}
            </h2>
            <p className="muted">
              {romanian
                ? "Contactele provin din înregistrările ROMATSA intersectate din setul inclus. Verifică întotdeauna instrucțiunile actuale ale zonei."
                : "Contacts are extracted from intersecting ROMATSA records in the bundled snapshot. Always verify the zone’s current instructions."}
            </p>
            {contactEmails.length ? (
              <ul className="contact-list">
                {contactEmails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`}>{email}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="small-note">
                {romanian
                  ? "Nu a fost găsit un email pentru zona selectată. Deschide harta pentru detalii și contacte oficiale."
                  : "No contact email detected for the selected area. Open the map to review zone details and official contacts."}
              </p>
            )}
            <a
              className="text-link"
              href="https://aerofoto.mapn.ro/"
              target="_blank"
              rel="noreferrer"
            >
              MApN AEROFOTO ↗
            </a>
          </section>
          <section className="content-card">
            <span className="eyebrow">
              {romanian ? "DATELE TALE" : "YOUR DETAILS"}
            </span>
            <h2>
              {profileName?.trim()
                ? profileName
                : romanian
                  ? "Profilul pilotului nu este completat"
                  : "Pilot profile not set"}
            </h2>
            <p className="muted">
              {profile.email?.trim()
                ? profile.email
                : romanian
                  ? "Adaugă datele pilotului pentru a le include în pachetul generat."
                  : "Add your pilot details to include them in the generated package."}
            </p>
            <Link className="text-link" href="/profile">
              {romanian ? "Editează profilul →" : "Edit profile →"}
            </Link>
          </section>
        </aside>
      </div>
    </>
  );
}
