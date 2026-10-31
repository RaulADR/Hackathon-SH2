"use client";

import Link from "next/link";
import type {
  FeatureCollection,
  MultiPolygon,
  Polygon as GeoPolygon,
} from "geojson";
import { useEffect, useMemo, useState } from "react";

import { useRomanian } from "~/app/_components/language-context";
import { extractEmailAddresses } from "~/lib/contacts";
import {
  areasOverlap,
  geoJsonRingToLatLng,
  type LatLngPoint,
} from "~/lib/geometry";
import { getRomaniaTime } from "~/lib/time";
import { api } from "~/trpc/react";

type ZoneProperties = { zone_id?: string; contact?: string };
type ZoneCollection = FeatureCollection<
  GeoPolygon | MultiPolygon,
  ZoneProperties
>;
type PlanStatus = "prepared" | "sent" | "approved";
type LocalPlan = {
  id: string;
  flightDate: string;
  startTime: string;
  endTime: string;
  area: LatLngPoint[];
  drone: string;
  purpose: string;
  pilot: string;
  email: string;
  phone: string;
  operatorId: string;
  registration: string;
  insuranceUntil: string;
  contacts: string[];
  status: PlanStatus;
};
type PilotProfile = {
  name?: string;
  email?: string;
  phone?: string;
  operatorId?: string;
  registration?: string;
  insuranceUntil?: string;
  drones?: string[];
};
const PLANS_KEY = "aerio.localPlans";
const AREA_KEY = "aerio.flightArea";
const APPROVED_KEY = "aerio.approvedPlans";

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

function downloadPackage(plan: LocalPlan, romanian: boolean) {
  const contents = [
    romanian
      ? "AERIO — PACHET DE PREGĂTIRE A CERERII DE ZBOR"
      : "AERIO — FLIGHT REQUEST PREPARATION PACKAGE",
    romanian
      ? "Document de planificare, nu reprezintă o cerere oficială, un plan de zbor sau permisiunea de a zbura."
      : "Planning document only. Not an official application, flight plan, or permission to fly.",
    "",
    `${romanian ? "Pilot" : "Pilot"}: ${plan.pilot || (romanian ? "Necompletat" : "Not provided")}`,
    `Email: ${plan.email || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Telefon" : "Phone"}: ${plan.phone || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "ID operator AACR" : "AACR operator ID"}: ${plan.operatorId || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Înregistrare dronă" : "Drone registration"}: ${plan.registration || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Asigurare valabilă până la" : "Insurance valid until"}: ${plan.insuranceUntil || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Asigurare valabilă până la" : "Insurance valid until"}: ${plan.insuranceUntil || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Data" : "Date"}: ${plan.flightDate}`,
    `${romanian ? "Ora propusă" : "Proposed time"}: ${plan.startTime}–${plan.endTime} (${romanian ? "ora României" : "Romania local time"})`,
    `${romanian ? "Dronă" : "Drone"}: ${plan.drone}`,
    `${romanian ? "Scop" : "Purpose"}: ${plan.purpose}`,
    `${romanian ? "Coordonatele zonei (latitudine, longitudine)" : "Area vertices (latitude, longitude)"}: ${plan.area.map(([lat, lng]) => `${lat.toFixed(6)}, ${lng.toFixed(6)}`).join("; ")}`,
    `${romanian ? "Contacte ROMATSA găsite în setul local" : "ROMATSA zone contacts found in local dataset"}: ${plan.contacts.join(", ") || (romanian ? "Nu a fost găsită nicio adresă de email" : "No email address found")}`,
    "",
    romanian
      ? "Verifică harta ROMATSA actuală, NOTAM-urile, AIP-ul și instrucțiunile autorităților. Trimite documentele personal prin canalele oficiale relevante."
      : "Verify the current ROMATSA map, NOTAMs, AIP and authority instructions. Submit through the relevant official channels yourself.",
  ].join("\r\n");
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `aerio-flight-request-${plan.flightDate}.txt`;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);

  const geoJson = {
    type: "Feature",
    properties: {
      application: "Aerio planning draft",
      flightDate: plan.flightDate,
    },
    geometry: {
      type: "Polygon",
      coordinates: [
        [
          ...plan.area.map(([lat, lng]) => [lng, lat]),
          [plan.area[0]![1], plan.area[0]![0]],
        ],
      ],
    },
  };
  const geoBlob = new Blob([JSON.stringify(geoJson, null, 2)], {
    type: "application/geo+json",
  });
  const geoUrl = URL.createObjectURL(geoBlob);
  const geoAnchor = document.createElement("a");
  geoAnchor.href = geoUrl;
  geoAnchor.download = `aerio-flight-area-${plan.flightDate}.geojson`;
  geoAnchor.click();
  window.setTimeout(() => URL.revokeObjectURL(geoUrl), 1000);
}

function emailDraftUrl(plan: LocalPlan, romanian: boolean) {
  const subject = `${romanian ? "Cerere zbor dronă" : "Drone flight request"} · ${plan.flightDate}`;
  const body = [
    romanian ? "Bună ziua," : "Hello,",
    "",
    romanian
      ? "Vă rog să analizați detaliile propuse mai jos. Acest mesaj este o ciornă și nu a fost trimis."
      : "Please review the proposed flight details below. This is a draft and has not been sent.",
    `${romanian ? "Data și ora" : "Date and time"}: ${plan.flightDate} · ${plan.startTime}–${plan.endTime}`,
    `${romanian ? "Dronă" : "Drone"}: ${plan.drone}`,
    `${romanian ? "Scop" : "Purpose"}: ${plan.purpose}`,
    `${romanian ? "Pilot" : "Pilot"}: ${plan.pilot}`,
    `Email: ${plan.email}`,
    `${romanian ? "Telefon" : "Phone"}: ${plan.phone || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "ID operator AACR" : "AACR operator ID"}: ${plan.operatorId || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Înregistrare dronă" : "Drone registration"}: ${plan.registration || (romanian ? "Necompletat" : "Not provided")}`,
    "",
    `${romanian ? "Cu stimă" : "Regards"},`,
    plan.pilot,
  ].join("\n");
  return `mailto:${plan.contacts.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export default function RequestPage() {
  const romanian = useRomanian();
  const [area, setArea] = useState<LatLngPoint[]>([]);
  const [plans, setPlans] = useState<LocalPlan[]>([]);
  const [profile, setProfile] = useState<PilotProfile>({});
  const [zones, setZones] = useState<ZoneCollection | null>(null);
  const [flightDate, setFlightDate] = useState("");
  const [duration, setDuration] = useState(60);
  const [startTime, setStartTime] = useState("");
  const [drone, setDrone] = useState("");
  const [purpose, setPurpose] = useState("");
  const utils = api.useUtils();
  const slotsQuery = api.flight.candidateTimes.useQuery(
    { flightDate, duration, area },
    { enabled: flightDate.length === 10 && area.length >= 3 },
  );
  const preparePlan = api.flight.prepare.useMutation({
    onSuccess: (saved) => {
      const contacts = contactEmails;
      const plan: LocalPlan = {
        id: saved.id,
        flightDate,
        startTime,
        endTime:
          slotsQuery.data?.find((slot) => slot.startTime === startTime)
            ?.endTime ?? "",
        area,
        drone,
        purpose,
        pilot: profile.name ?? "",
        email: profile.email ?? "",
        phone: profile.phone ?? "",
        operatorId: profile.operatorId ?? "",
        registration: profile.registration ?? "",
        insuranceUntil: profile.insuranceUntil ?? "",
        contacts,
        status: "prepared",
      };
      setPlans((previous) => {
        const next = [plan, ...previous];
        localStorage.setItem(PLANS_KEY, JSON.stringify(next));
        return next;
      });
      setStartTime("");
      void utils.flight.candidateTimes.invalidate();
    },
  });

  useEffect(() => {
    setArea(readJson<LatLngPoint[]>(AREA_KEY, []));
    const savedPlans = readJson<LocalPlan[]>(PLANS_KEY, []);
    setPlans(
      savedPlans.map((plan) => ({
        ...plan,
        phone: plan.phone ?? "",
        operatorId: plan.operatorId ?? "",
        registration: plan.registration ?? "",
        insuranceUntil: plan.insuranceUntil ?? "",
        contacts: extractEmailAddresses((plan.contacts ?? []).join(" ")),
      })),
    );
    setProfile(readJson<PilotProfile>("aerio.profile", {}));
    setDrone(readJson<PilotProfile>("aerio.profile", {}).drones?.[0] ?? "");
    setFlightDate(getRomaniaTime().date);
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

  function updatePlan(id: string, status: PlanStatus) {
    setPlans((current) => {
      const next = current.map((plan) =>
        plan.id === id ? { ...plan, status } : plan,
      );
      localStorage.setItem(PLANS_KEY, JSON.stringify(next));
      if (status === "approved") {
        const plan = next.find((item) => item.id === id);
        const approved = readJson<{ id: string; area: LatLngPoint[] }[]>(
          APPROVED_KEY,
          [],
        );
        if (plan && !approved.some((item) => item.id === id)) {
          localStorage.setItem(
            APPROVED_KEY,
            JSON.stringify([...approved, { id, area: plan.area }]),
          );
        }
      }
      return next;
    });
  }

  function createPlan(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const selectedSlot = slotsQuery.data?.find(
      (slot) => slot.startTime === startTime,
    );
    if (!selectedSlot) return;
    preparePlan.mutate({
      flightDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      area,
      drone,
      purpose,
    });
  }

  return (
    <>
      <p className="route-description">
        {romanian
          ? "Alege zona, aeronava și un interval candidat, apoi pregătește documentele."
          : "Choose the area, aircraft and a candidate time, then prepare your documents."}
      </p>
      <div className="notice notice-warning prominent-notice">
        {romanian
          ? "Intervalele candidate verifică doar ciornele suprapuse salvate în baza de date Aerio a acestei instalări. Nu reprezintă disponibilitate în timp real sau intervale aprobate de autorități."
          : "Candidate times only check overlapping planning drafts saved to this Aerio database. They are not live airspace availability or authority-approved slots."}
      </div>
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
                      ? "Salvată pe acest dispozitiv"
                      : "Saved on this device"
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
              <label className="field">
                <span>{romanian ? "Dronă" : "Drone"}</span>
                <input
                  value={drone}
                  onChange={(event) => setDrone(event.target.value)}
                  maxLength={120}
                  placeholder={
                    romanian
                      ? "Model sau nume aeronavă"
                      : "Model or aircraft name"
                  }
                  required
                />
              </label>
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
                      ? "Nu există intervale candidate pentru această dată și durată."
                      : "No candidate times for this date and duration."}
                  </p>
                )}
              </div>
            )}
            {preparePlan.error && (
              <p className="notice notice-warning" role="alert">
                {preparePlan.error.message}
              </p>
            )}
            <button
              className="button button-primary submit-button"
              type="submit"
              disabled={
                !startTime ||
                !drone.trim() ||
                !purpose.trim() ||
                preparePlan.isPending
              }
            >
              {preparePlan.isPending
                ? romanian
                  ? "Se pregătește…"
                  : "Preparing…"
                : romanian
                  ? "Pregătește pachetul cererii"
                  : "Prepare request package"}
            </button>
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
              {profile.name?.trim()
                ? profile.name
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
              {romanian ? "Editează profilul local →" : "Edit local profile →"}
            </Link>
          </section>
        </aside>
      </div>
      <section className="content-card plans-section">
        <div className="section-heading">
          <span className="eyebrow">
            {romanian
              ? "PLANURI SALVATE · ACEST DISPOZITIV"
              : "SAVED PLANS · THIS DEVICE"}
          </span>
          <h2>{romanian ? "Pachete de cerere" : "Request packages"}</h2>
        </div>
        {plans.length === 0 ? (
          <p className="muted">
            {romanian
              ? "Pachetele de cerere înregistrate local vor apărea aici."
              : "Your locally recorded request packages will appear here."}
          </p>
        ) : (
          <div className="plan-list">
            {plans.map((plan) => (
              <article className="plan-row" key={plan.id}>
                <div>
                  <strong>
                    {plan.flightDate} · {plan.startTime}–{plan.endTime}
                  </strong>
                  <span>
                    {plan.drone} · {plan.purpose}
                  </span>
                  <span className={`plan-status status-${plan.status}`}>
                    {plan.status === "prepared"
                      ? romanian
                        ? "Pregătit · netrimis"
                        : "Prepared · not sent"
                      : plan.status === "sent"
                        ? romanian
                          ? "Marcat ca trimis local"
                          : "Marked sent locally"
                        : romanian
                          ? "Aprobare înregistrată local"
                          : "Approval recorded locally"}
                  </span>
                </div>
                <div className="plan-actions">
                  <button
                    className="button button-quiet"
                    type="button"
                    onClick={() => downloadPackage(plan, romanian)}
                  >
                    {romanian ? "Descarcă pachetul" : "Download package"}
                  </button>
                  {plan.contacts.length > 0 && (
                    <a
                      className="button button-quiet"
                      href={emailDraftUrl(plan, romanian)}
                    >
                      {romanian ? "Deschide ciorna email" : "Open email draft"}
                    </a>
                  )}
                  {plan.status === "prepared" && (
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => updatePlan(plan.id, "sent")}
                    >
                      {romanian ? "Marchează trimis" : "Mark sent"}
                    </button>
                  )}
                  {plan.status !== "approved" && (
                    <button
                      className="button button-quiet"
                      type="button"
                      onClick={() => updatePlan(plan.id, "approved")}
                    >
                      {romanian
                        ? "Înregistrează aprobarea"
                        : "Record authority approval"}
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
        <p className="small-note">
          {romanian
            ? "„Marchează trimis” și „Înregistrează aprobarea” actualizează doar acest browser. Aerio nu trimite emailuri și nu verifică aprobări. Aprobările înregistrate local apar pe hartă doar pe acest dispozitiv."
            : "“Mark sent” and “Record authority approval” only update this browser. Aerio does not send emails or verify approvals. Locally recorded approvals appear as map overlays on this device."}
        </p>
      </section>
    </>
  );
}
