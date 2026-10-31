"use client";

import Link from "next/link";
import { useRomanian } from "~/app/_components/language-context";

export default function LearnPage() {
  const ro = useRomanian();
  return (
    <>
      <p className="route-description">
        {ro
          ? "O listă inițială pentru planificare. Confirmă regulile și restricțiile curente din sursele oficiale."
          : "A starting checklist for planning. Confirm the rules and current restrictions with official sources."}
      </p>
      <div className="notice notice-warning prominent-notice">
        {ro
          ? "Acest ghid este informativ, nu reprezintă consultanță juridică sau autorizație. Cerințele depind de aeronavă, operațiune, spațiul aerian și regulile actuale din România/UE."
          : "This guide is informational, not legal advice or authorization. Requirements depend on the aircraft, operation, airspace and current Romanian/EU rules."}
      </div>
      <section className="guidance-grid">
        <article className="content-card guidance-card">
          <span className="guidance-number">01</span>
          <h2>
            {ro
              ? "Înregistrarea operatorului și dronei"
              : "Operator and drone registration"}
          </h2>
          <p>
            {ro
              ? "Înregistrează-te ca operator la AACR când este necesar și afișează ID-ul pe aeronavă. Vizitatorii trebuie să confirme la AACR recunoașterea înregistrării din țara de origine."
              : "Register as an operator with AACR when required and display your operator ID on the aircraft. Visitors should confirm recognition of their home-country registration with AACR before operating in Romania."}
          </p>
          <a href="https://www.caa.ro/" target="_blank" rel="noreferrer">
            AACR ↗
          </a>
        </article>
        <article className="content-card guidance-card">
          <span className="guidance-number">02</span>
          <h2>
            {ro
              ? "Verifică spațiul aerian și restricțiile"
              : "Check airspace and restrictions"}
          </h2>
          <p>
            {ro
              ? "Folosește harta actuală ROMATSA și verifică NOTAM/AIP. O zonă restricționată poate necesita aprobări separate; urmează contactele și documentele indicate pentru fiecare zonă."
              : "Use ROMATSA’s current drone map and check NOTAMs/AIP. A restricted area can require separate permissions; follow the contact and documents shown for each zone."}
          </p>
          <a
            href="https://flightplan.romatsa.ro/init/drones"
            target="_blank"
            rel="noreferrer"
          >
            {ro ? "Harta UAS ROMATSA ↗" : "ROMATSA UAS map ↗"}
          </a>
        </article>
        <article className="content-card guidance-card">
          <span className="guidance-number">03</span>
          <h2>{ro ? "Spațiu aerian controlat" : "Controlled airspace"}</h2>
          <p>
            {ro
              ? "Dacă este necesar, coordonează-te cu serviciile de trafic aerian și depune planul de zbor cerut. Contactează turnul de control înainte de zbor când instrucțiunile aplicabile o cer."
              : "Where required, coordinate with the relevant air traffic services and submit the necessary flight plan. Contact the control tower before flight when the applicable instructions require it."}
          </p>
          <a href="https://www.romatsa.ro/" target="_blank" rel="noreferrer">
            ROMATSA ↗
          </a>
        </article>
        <article className="content-card guidance-card">
          <span className="guidance-number">04</span>
          <h2>{ro ? "Fotografiere și MApN" : "Photography and MApN"}</h2>
          <p>
            {ro
              ? "Aprobarea foto/video MApN se aplică în zonele restricționate sau militare relevante; verifică instrucțiunile actuale ROMATSA. AEROFOTO este serviciul oficial MApN."
              : "MApN photo/video approval applies in the relevant restricted or military areas; check the current ROMATSA zone instructions. AEROFOTO is MApN’s official service."}
          </p>
          <a href="https://aerofoto.mapn.ro/" target="_blank" rel="noreferrer">
            MApN AEROFOTO ↗
          </a>
        </article>
        <article className="content-card guidance-card">
          <span className="guidance-number">05</span>
          <h2>
            {ro
              ? "Persoane și contact vizual"
              : "People and visual line of sight"}
          </h2>
          <p>
            {ro
              ? "Păstrează contactul vizual direct și respectă regulile categoriei aplicabile. Nu zbura deasupra mulțimilor sau zonelor dens populate fără autorizație ori excepție valabilă."
              : "Maintain visual line of sight and comply with the applicable category rules. Do not fly over crowds or densely populated areas unless a valid authorization or exception applies."}
          </p>
          <a
            href="https://www.easa.europa.eu/en/domains/civil-drones-rpas"
            target="_blank"
            rel="noreferrer"
          >
            EASA drone rules ↗
          </a>
        </article>
        <article className="content-card guidance-card">
          <span className="guidance-number">06</span>
          <h2>{ro ? "Asigurare și greutate" : "Insurance and weight"}</h2>
          <p>
            {ro
              ? "Verifică obligațiile de asigurare pentru aeronavă și operațiune. Cerințele românești pot viza dronele de peste 20 kg; confirmă regula actuală cu AACR și asigurătorul."
              : "Check insurance obligations for your aircraft and operation. Romanian requirements can apply to drones above 20 kg; verify the current rule with AACR and your insurer."}
          </p>
          <Link href="/profile">
            {ro
              ? "Pregătește datele pilotului →"
              : "Keep your pilot details ready →"}
          </Link>
        </article>
      </section>
      <p className="small-note">
        {ro
          ? "Linkurile sunt oferite ca referință. Aerio nu verifică aceste pagini în timp real; consultă întotdeauna publicațiile oficiale actuale înainte de zbor."
          : "Source links are provided for convenience. Aerio does not validate these pages in real time; always check the official, current publication before flying."}
      </p>
    </>
  );
}
