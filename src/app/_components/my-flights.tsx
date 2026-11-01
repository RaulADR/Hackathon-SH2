"use client";

import Link from "next/link";
import { useState } from "react";

import { useRomanian } from "~/app/_components/language-context";
import { createFilledAnexa1, type Anexa1Data } from "~/lib/anexa1-pdf";
import type { LocalPlan, PlanStatus } from "~/lib/local-plan";
import { api } from "~/trpc/react";

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
  const [pdfDownloadId, setPdfDownloadId] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState("");
  const [pdfErrorPlanId, setPdfErrorPlanId] = useState<string | null>(null);
  const utils = api.useUtils();
  const plansQuery = api.flight.list.useQuery();
  const updateStatus = api.flight.updateStatus.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.flight.list.invalidate(),
        utils.flight.candidateTimes.invalidate(),
      ]);
    },
  });
  const plans = plansQuery.data ?? [];
  const loadError =
    plansQuery.error?.message ?? updateStatus.error?.message ?? "";

  function updatePlan(id: string, status: PlanStatus) {
    updateStatus.mutate({ id, status });
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
          ? "Toate cererile salvate în cont, împreună cu statusul și documentele lor."
          : "All requests saved to your account, with their status and document records."}
      </p>
      <section className="content-card flights-page">
        <div className="section-heading">
          <span className="eyebrow">
            {romanian
              ? "PLANURI SALVATE · CONTUL MEU"
              : "SAVED PLANS · MY ACCOUNT"}
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
        {plansQuery.isPending && (
          <p className="muted" role="status">
            {romanian ? "Se încarcă zborurile…" : "Loading saved flights…"}
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
                  {plan.documents.length > 0 && (
                    <span className="field-hint">
                      {romanian ? "Documente pregătite:" : "Document records:"}{" "}
                      {plan.documents
                        .map((document) => document.fileName)
                        .join(", ")}
                    </span>
                  )}
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
                      ? "Detaliile zborului sunt salvate în cont; fișierul PDF este generat la descărcare și nu este transmis automat sau considerat aprobare. Verifică-l și confirmă cerințele oficiale."
                      : "Flight details are saved to your account; the PDF is generated when downloaded and is not submitted automatically or treated as an approval. Review it and confirm official requirements."}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
        <p className="small-note">
          {romanian
            ? "„Marchează trimis” și „Înregistrează aprobarea” salvează statusul în cont, dar nu transmit emailuri și nu verifică aprobări oficiale."
            : "“Mark sent” and “Record authority approval” save status to your account, but do not send email or verify official approvals."}
        </p>
      </section>
    </>
  );
}
