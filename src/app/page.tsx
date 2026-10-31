"use client";

import Link from "next/link";
import { useRomanian } from "~/app/_components/language-context";

export default function Home() {
  const ro = useRomanian();
  return (
    <>
      <section className="page-heading">
        <div>
          <span className="eyebrow">
            {ro
              ? "ROMÂNIA · PLANIFICARE ZBOR CU DRONA"
              : "ROMANIA · DRONE FLIGHT PLANNING"}
          </span>
          <h2>
            {ro
              ? "Planifică zborul cu mai multă claritate."
              : "Plan with a clearer picture."}
          </h2>
          <p>
            {ro
              ? "Verifică referințele de spațiu aerian, desenează zona de zbor și pregătește documentele într-un singur loc."
              : "Review reference airspace, sketch a flight area and prepare the paperwork in one place."}
          </p>
        </div>
        <Link className="button button-primary" href="/request">
          {ro ? "Creează o cerere de zbor" : "Create a flight request"}{" "}
          <span aria-hidden="true">→</span>
        </Link>
      </section>
      <div className="notice notice-warning prominent-notice">
        {ro
          ? "Aerio este un prototip de planificare. Nu afișează disponibilitatea în timp real, nu trimite cereri către autorități și nu acordă permisiunea de zbor."
          : "Aerio is a planning prototype. It does not show live airspace availability, submit requests to authorities, or grant permission to fly."}
      </div>
      <section className="overview-grid">
        <Link href="/airspace" className="feature-card">
          <span className="feature-icon">⌖</span>
          <span className="eyebrow">{ro ? "01 · HARTĂ" : "01 · MAP"}</span>
          <h2>{ro ? "Verifică zona" : "Check the area"}</h2>
          <p>
            {ro
              ? "Compară poligonul cu stratul ROMATSA inclus și deschide AEROFOTO."
              : "Compare a proposed polygon with the bundled ROMATSA UAS reference layer and open AEROFOTO."}
          </p>
          <span className="card-link">
            {ro ? "Deschide harta →" : "Open airspace map →"}
          </span>
        </Link>
        <Link href="/request" className="feature-card">
          <span className="feature-icon">↗</span>
          <span className="eyebrow">
            {ro ? "02 · PLANIFICARE" : "02 · PLAN"}
          </span>
          <h2>{ro ? "Pregătește o cerere" : "Prepare a request"}</h2>
          <p>
            {ro
              ? "Alege drona, scopul și un interval candidat fără suprapunere cu altă ciornă salvată."
              : "Choose your drone, purpose and a candidate time that does not overlap another saved draft."}
          </p>
          <span className="card-link">
            {ro ? "Începe planificarea →" : "Start planning →"}
          </span>
        </Link>
        <Link href="/profile" className="feature-card">
          <span className="feature-icon">◎</span>
          <span className="eyebrow">{ro ? "03 · PROFIL" : "03 · PROFILE"}</span>
          <h2>{ro ? "Păstrează datele pregătite" : "Keep details ready"}</h2>
          <p>
            {ro
              ? "Salvează local datele pilotului și dronei pentru a le reutiliza în documente."
              : "Save pilot and aircraft details on this device to reuse when preparing a request package."}
          </p>
          <span className="card-link">
            {ro ? "Editează profilul →" : "Edit pilot profile →"}
          </span>
        </Link>
      </section>
      <section className="content-card home-guidance">
        <div>
          <span className="eyebrow">
            {ro ? "ÎNAINTE DE FIECARE ZBOR" : "BEFORE EVERY FLIGHT"}
          </span>
          <h2>
            {ro
              ? "Verifică sursele oficiale înainte de zbor."
              : "Use official sources for the final decision."}
          </h2>
          <p>
            {ro
              ? "Restricțiile se pot schimba. Verifică harta ROMATSA, NOTAM-urile, AIP-ul și instrucțiunile fiecărei zone. AEROFOTO este un proces separat al MApN."
              : "Airspace changes. Check the current ROMATSA map, NOTAMs, applicable AIP and the instructions for every intersecting zone. AEROFOTO is a separate MApN process."}
          </p>
        </div>
        <div className="external-links">
          <a
            href="https://flightplan.romatsa.ro/init/drones"
            target="_blank"
            rel="noreferrer"
          >
            {ro ? "Harta UAS ROMATSA ↗" : "ROMATSA UAS map ↗"}
          </a>
          <a href="https://aerofoto.mapn.ro/" target="_blank" rel="noreferrer">
            MApN AEROFOTO ↗
          </a>
          <a href="https://www.caa.ro/" target="_blank" rel="noreferrer">
            {ro ? "Autoritatea Aeronautică (AACR) ↗" : "Romanian CAA (AACR) ↗"}
          </a>
        </div>
      </section>
    </>
  );
}
