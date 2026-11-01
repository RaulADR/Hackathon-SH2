"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useRomanian } from "~/app/_components/language-context";
import { createFilledAnexa1, type Anexa1Data } from "~/lib/anexa1-pdf";
import { extractEmailAddresses } from "~/lib/contacts";
import type { DroneClass } from "~/lib/drone";
import type { LocalPlan, PlanStatus } from "~/lib/local-plan";

const PLANS_KEY = "aerio.localPlans";
const APPROVED_KEY = "aerio.approvedPlans";

const droneClasses: readonly DroneClass[] = [
  "none",
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
];

function isDroneClass(value: unknown): value is DroneClass {
  return (
    typeof value === "string" &&
    droneClasses.some((droneClass) => droneClass === value)
  );
}

function normalizeLocalPlan(value: unknown): LocalPlan | null {
  if (typeof value !== "object" || value === null) return null;
  const plan = value as Record<string, unknown>;
  if (
    typeof plan.id !== "string" ||
    typeof plan.flightDate !== "string" ||
    typeof plan.startTime !== "string" ||
    typeof plan.endTime !== "string" ||
    !Array.isArray(plan.area) ||
    plan.area.length < 3 ||
    !plan.area.every(
      (point) =>
        Array.isArray(point) &&
        point.length === 2 &&
        typeof point[0] === "number" &&
        typeof point[1] === "number",
    ) ||
    typeof plan.drone !== "string" ||
    typeof plan.purpose !== "string" ||
    typeof plan.pilot !== "string" ||
    typeof plan.email !== "string" ||
    !(
      plan.status === "prepared" ||
      plan.status === "sent" ||
      plan.status === "approved"
    )
  ) {
    return null;
  }
  const optionalStrings = [
    "phone",
    "operatorId",
    "location",
    "registration",
    "insuranceUntil",
    "tower",
    "flightCategory",
    "operationMode",
    "maxAltitude",
    "signatureDataUrl",
  ] as const;
  if (
    optionalStrings.some(
      (key) => plan[key] !== undefined && typeof plan[key] !== "string",
    ) ||
    (plan.droneMassGrams !== undefined &&
      typeof plan.droneMassGrams !== "number") ||
    (plan.ctrIndicator !== undefined &&
      typeof plan.ctrIndicator !== "boolean") ||
    (plan.droneClass !== undefined && !isDroneClass(plan.droneClass)) ||
    (plan.contacts !== undefined &&
      (!Array.isArray(plan.contacts) ||
        !plan.contacts.every((contact) => typeof contact === "string")))
  ) {
    return null;
  }
  const contacts = Array.isArray(plan.contacts) ? plan.contacts : [];
  return {
    id: plan.id,
    flightDate: plan.flightDate,
    startTime: plan.startTime,
    endTime: plan.endTime,
    area: plan.area as LocalPlan["area"],
    drone: plan.drone,
    purpose: plan.purpose,
    pilot: plan.pilot,
    email: plan.email,
    phone: typeof plan.phone === "string" ? plan.phone : "",
    operatorId: typeof plan.operatorId === "string" ? plan.operatorId : "",
    location: typeof plan.location === "string" ? plan.location : "",
    registration:
      typeof plan.registration === "string" ? plan.registration : "",
    insuranceUntil:
      typeof plan.insuranceUntil === "string" ? plan.insuranceUntil : "",
    contacts: extractEmailAddresses(contacts.join(" ")),
    ...(typeof plan.droneMassGrams === "number"
      ? { droneMassGrams: plan.droneMassGrams }
      : {}),
    ...(isDroneClass(plan.droneClass) ? { droneClass: plan.droneClass } : {}),
    ...(typeof plan.tower === "string" ? { tower: plan.tower } : {}),
    ...(typeof plan.flightCategory === "string"
      ? { flightCategory: plan.flightCategory }
      : {}),
    ...(typeof plan.operationMode === "string"
      ? { operationMode: plan.operationMode }
      : {}),
    ...(typeof plan.maxAltitude === "string"
      ? { maxAltitude: plan.maxAltitude }
      : {}),
    ...(typeof plan.signatureDataUrl === "string"
      ? { signatureDataUrl: plan.signatureDataUrl }
      : {}),
    ...(typeof plan.ctrIndicator === "boolean"
      ? { ctrIndicator: plan.ctrIndicator }
      : {}),
    status: plan.status,
  };
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
    `Pilot: ${plan.pilot || (romanian ? "Necompletat" : "Not provided")}`,
    `Email: ${plan.email || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Telefon" : "Phone"}: ${plan.phone || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "ID operator AACR" : "AACR operator ID"}: ${plan.operatorId || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Localitate / adresă" : "Location / address"}: ${plan.location || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Înregistrare dronă" : "Drone registration"}: ${plan.registration || (romanian ? "Necompletat" : "Not provided")}`,
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
  downloadBlob(
    contents,
    `aerio-flight-request-${plan.flightDate}.txt`,
    "text/plain;charset=utf-8",
  );

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
  downloadBlob(
    JSON.stringify(geoJson, null, 2),
    `aerio-flight-area-${plan.flightDate}.geojson`,
    "application/geo+json",
  );
}

function downloadBlob(contents: BlobPart, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
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
    `Pilot: ${plan.pilot}`,
    `Email: ${plan.email}`,
    `${romanian ? "Telefon" : "Phone"}: ${plan.phone || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "ID operator AACR" : "AACR operator ID"}: ${plan.operatorId || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Localitate / adresă" : "Location / address"}: ${plan.location || (romanian ? "Necompletat" : "Not provided")}`,
    `${romanian ? "Înregistrare dronă" : "Drone registration"}: ${plan.registration || (romanian ? "Necompletat" : "Not provided")}`,
    "",
    `${romanian ? "Cu stimă" : "Regards"},`,
    plan.pilot,
  ].join("\n");
  return `mailto:${plan.contacts.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function MyFlights() {
  const romanian = useRomanian();
  const [plans, setPlans] = useState<LocalPlan[]>([]);
  const [loadError, setLoadError] = useState("");
  const [pdfDownloadId, setPdfDownloadId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [pdfErrorPlanId, setPdfErrorPlanId] = useState<string | null>(null);

  useEffect(() => {
    function loadPlans() {
      try {
        const stored = localStorage.getItem(PLANS_KEY);
        const parsed: unknown = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(parsed)) {
          throw new Error("Saved flight plans must be a list.");
        }
        const normalizedPlans = parsed.map(normalizeLocalPlan);
        const validPlans = normalizedPlans.filter(
          (plan): plan is LocalPlan => plan !== null,
        );
        if (validPlans.length !== parsed.length) {
          console.error("Some saved flight plans have invalid data.");
          setLoadError(
            romanian
              ? "Unele zboruri salvate nu pot fi afișate."
              : "Some saved flights could not be displayed.",
          );
        } else {
          setLoadError("");
        }
        setPlans(validPlans);
      } catch (error) {
        console.error("Could not read saved flight plans.", error);
        setLoadError(
          romanian
            ? "Zborurile salvate nu au putut fi încărcate."
            : "Saved flights could not be loaded.",
        );
        setPlans([]);
      }
    }

    loadPlans();
    window.addEventListener("aerio:plans-updated", loadPlans);
    window.addEventListener("storage", loadPlans);
    return () => {
      window.removeEventListener("aerio:plans-updated", loadPlans);
      window.removeEventListener("storage", loadPlans);
    };
  }, [romanian]);

  function updatePlan(id: string, status: PlanStatus) {
    try {
      const next = plans.map((plan) =>
        plan.id === id ? { ...plan, status } : plan,
      );
      localStorage.setItem(PLANS_KEY, JSON.stringify(next));
      if (status === "approved") {
        const plan = next.find((item) => item.id === id);
        const storedApproved = localStorage.getItem(APPROVED_KEY);
        const parsedApproved: unknown = storedApproved
          ? JSON.parse(storedApproved)
          : [];
        if (!Array.isArray(parsedApproved)) {
          throw new Error("Saved approved plans must be a list.");
        }
        const approvedEntries: unknown[] = parsedApproved;
        const approved = approvedEntries.filter(
          (item): item is { id: string } =>
            typeof item === "object" &&
            item !== null &&
            "id" in item &&
            typeof item.id === "string",
        );
        if (approved.length !== approvedEntries.length) {
          throw new Error("Saved approved plans contain invalid data.");
        }
        if (plan && !approved.some((item) => item.id === id)) {
          localStorage.setItem(
            APPROVED_KEY,
            JSON.stringify([...approved, { id, area: plan.area }]),
          );
        }
      }
      setPlans(next);
      setLoadError("");
      window.dispatchEvent(new Event("aerio:plans-updated"));
    } catch (error) {
      console.error("Could not update the saved flight status.", error);
      setLoadError(
        romanian
          ? "Statusul zborului nu a putut fi salvat."
          : "The flight status could not be saved.",
      );
    }
  }

  async function downloadAnexa1(plan: LocalPlan) {
    setPdfError("");
    setPdfErrorPlanId(null);
    setPdfDownloadId(plan.id);
    try {
      if (!plan.signatureDataUrl) {
        throw new Error(
          romanian
            ? "Această cerere nu are semnătură. Creează o cerere nouă și semneaz-o înainte de descărcarea PDF-ului."
            : "This request has no signature. Create a new request and sign it before downloading its PDF.",
        );
      }
      const [templateResponse, fontResponse] = await Promise.all([
        fetch("/anexa1.pdf"),
        fetch("/fonts/NotoSans.ttf"),
      ]);
      if (!templateResponse.ok) {
        throw new Error(
          `Anexa 1 download failed (${templateResponse.status}).`,
        );
      }
      if (!fontResponse.ok) {
        throw new Error(`PDF font download failed (${fontResponse.status}).`);
      }
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
      downloadBlob(
        pdfBuffer,
        `aerio-anexa1-${plan.flightDate}.pdf`,
        "application/pdf",
      );
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

  return (
    <>
      <p className="route-description">
        {romanian
          ? "Toate cererile salvate pe acest dispozitiv, împreună cu statusul și documentele lor."
          : "All requests saved on this device, with their status and documents."}
      </p>
      <section className="content-card flights-page">
        <div className="section-heading">
          <span className="eyebrow">
            {romanian
              ? "PLANURI SALVATE · ACEST DISPOZITIV"
              : "SAVED PLANS · THIS DEVICE"}
          </span>
          <h2>{romanian ? "Zborurile mele" : "My flights"}</h2>
        </div>
        <p className="small-note">
          {romanian
            ? "Anexa 1 este formular pentru operațiuni în CTR. Setul ROMATSA inclus nu clasifică explicit CTR-urile; verifică dacă formularul și turnul selectat se aplică zborului tău."
            : "Anexa 1 is for CTR operations. The bundled ROMATSA data does not explicitly classify CTRs; verify that this form and the selected tower apply to your flight."}
        </p>
        {loadError && (
          <p className="notice notice-warning" role="alert">
            {loadError}
          </p>
        )}
        {plans.length === 0 ? (
          <div className="flights-empty-state">
            <p className="muted">
              {romanian
                ? "Cererile de zbor salvate vor apărea aici."
                : "Your saved flight requests will appear here."}
            </p>
            <Link className="button button-primary" href="/request">
              {romanian ? "Planifică primul zbor" : "Plan your first flight"}
            </Link>
          </div>
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
                    className="button button-primary"
                    type="button"
                    onClick={() => void downloadAnexa1(plan)}
                    disabled={
                      pdfDownloadId === plan.id || !plan.signatureDataUrl
                    }
                  >
                    {pdfDownloadId === plan.id
                      ? romanian
                        ? "Se generează PDF-ul…"
                        : "Generating PDF…"
                      : romanian
                        ? "Descarcă PDF · Anexa 1"
                        : "Download PDF · Anexa 1"}
                  </button>
                  {!plan.signatureDataUrl && (
                    <span className="field-hint">
                      {romanian
                        ? "Cerere veche, fără semnătură."
                        : "Legacy request without a signature."}
                    </span>
                  )}
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
                      {romanian ? "Ciornă email" : "Email draft"}
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
                {pdfError && pdfErrorPlanId === plan.id && (
                  <p className="notice notice-warning" role="alert">
                    {romanian
                      ? "PDF-ul Anexa 1 nu a putut fi generat: "
                      : "Could not generate the Anexa 1 PDF: "}
                    {pdfError}
                  </p>
                )}
                {plan.ctrIndicator && (
                  <p className="small-note">
                    {romanian
                      ? "Datele rămân în acest browser. PDF-ul este o copie de lucru, nu este trimis automat și nu reprezintă o aprobare; verifică-l, semnează-l și confirmă cerințele oficiale."
                      : "Your data stays in this browser. The PDF is a working copy, is not submitted automatically, and is not an approval; review and sign it, then confirm official requirements."}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
        <p className="small-note">
          {romanian
            ? "„Marchează trimis” și „Înregistrează aprobarea” actualizează doar acest browser. Aerio nu trimite emailuri și nu verifică aprobări."
            : "“Mark sent” and “Record authority approval” only update this browser. Aerio does not send emails or verify approvals."}
        </p>
      </section>
    </>
  );
}
