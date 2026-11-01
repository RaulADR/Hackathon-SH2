"use client";

import Link from "next/link";

import { useRomanian } from "~/app/_components/language-context";
import { api } from "~/trpc/react";

type FlightStatus = "prepared" | "sent" | "approved";

function PinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function WeatherIcon({
  name,
}: {
  name: "wind" | "visibility" | "temp" | "cloud" | "sun" | "alert";
}) {
  if (name === "wind") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M3 8h12a3 3 0 1 0-3-3M2 12h17a2.5 2.5 0 1 1-2.5 2.5M4 16h8a2.5 2.5 0 1 1-2.5 2.5" />
      </svg>
    );
  }
  if (name === "visibility") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M2.5 12s3.2-6 9.5-6 9.5 6 9.5 6-3.2 6-9.5 6-9.5-6-9.5-6Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    );
  }
  if (name === "temp") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M14 14.8V5a3 3 0 0 0-6 0v9.8a5 5 0 1 0 6 0Z" />
        <path d="M11 8v9" />
      </svg>
    );
  }
  if (name === "cloud") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M7.5 18h9a4 4 0 0 0 .4-8A5.5 5.5 0 0 0 6.3 9 4.5 4.5 0 0 0 7.5 18Z" />
        <path d="m9 21 1-2m4 2 1-2" />
      </svg>
    );
  }
  if (name === "alert") {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="m12 3 9 16H3L12 3Z" />
        <path d="M12 9v4m0 3h.01" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  );
}

const dashboardLinks = [
  {
    href: "/profile",
    icon: "drone",
    kicker: "HANGAR",
    title: "Dronele mele",
    action: "Gestionează flota",
  },
  {
    href: "/airspace",
    icon: "pin",
    kicker: "ZONE SALVATE",
    title: "Unde zbori",
    action: "Deschide harta",
  },
  {
    href: "/request",
    icon: "plan",
    kicker: "PLANIFICARE",
    title: "Planuri de zbor",
    action: "Pregătește o cerere",
  },
  {
    href: "/learn",
    icon: "academy",
    kicker: "ÎNVAȚĂ",
    title: "Academia Aerio",
    action: "Deschide ghidul",
  },
];

export default function Home() {
  const ro = useRomanian();
  const flightsQuery = api.flight.list.useQuery();
  const flightsError = flightsQuery.error?.message ?? "";
  const flights = flightsQuery.data ?? [];

  const visibleFlights = [...flights].sort((first, second) =>
    `${first.flightDate}T${first.startTime}`.localeCompare(
      `${second.flightDate}T${second.startTime}`,
    ),
  );

  function formatFlightDate(date: string): string {
    const parsedDate = new Date(`${date}T00:00:00`);
    if (Number.isNaN(parsedDate.valueOf())) return date;
    return new Intl.DateTimeFormat(ro ? "ro-RO" : "en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  }

  function getFlightStatus(status: FlightStatus): string {
    if (status === "approved") {
      return ro ? "Aprobare înregistrată local" : "Approval recorded locally";
    }
    if (status === "sent") {
      return ro ? "Marcat ca trimis local" : "Marked sent locally";
    }
    return ro ? "Pregătit · netrimis" : "Prepared · not sent";
  }

  return (
    <section className="weather-dashboard">
      <header className="dashboard-welcome">
        <div>
          <p className="dashboard-greeting">
            {ro ? "BUNĂ ZIUA, PILOT" : "GOOD DAY, PILOT"}
          </p>
          <h2>
            {ro
              ? "Cerul e limpede. Hai să zburăm."
              : "The sky is clear. Let’s fly."}
          </h2>
          <p className="dashboard-location">
            {ro ? "Recomandări demo pentru" : "Demo recommendations for"}{" "}
            <strong>Craiova</strong>
            <span aria-hidden="true"> · </span>
            {ro ? "date demonstrative" : "demonstration data"}
          </p>
        </div>
        <div className="dashboard-city">
          <PinIcon />
          <span>Craiova</span>
        </div>
      </header>

      <section
        className="weather-hero"
        aria-labelledby="weather-recommendation"
      >
        <div className="weather-main">
          <span className="weather-kicker">
            <WeatherIcon name="sun" />
            {ro ? "METEO · EXEMPLU DEMO" : "WEATHER · DEMO EXAMPLE"}
          </span>
          <h3 id="weather-recommendation">
            {ro
              ? "Nu recomand zbor acum."
              : "Flight not recommended right now."}
          </h3>
          <p className="weather-summary">
            {ro
              ? "Exemplu de condiții nefavorabile pentru zbor."
              : "Example of conditions unfavorable for flight."}
          </p>
          <div className="weather-actions">
            <Link className="weather-primary-action" href="/request">
              {ro ? "Planifică zborul" : "Plan a flight"}
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="weather-secondary-action" href="/airspace">
              <PinIcon />
              {ro ? "Vezi zona pe hartă" : "View area on map"}
            </Link>
          </div>
          <div
            className="weather-metrics"
            aria-label={
              ro
                ? "Condiții meteo demonstrative"
                : "Demonstration weather conditions"
            }
          >
            <span>
              <WeatherIcon name="wind" />
              {ro ? "16 km/h · rafale 38" : "16 km/h · gusts 38"}
            </span>
            <span>
              <WeatherIcon name="visibility" />
              18,2 km
            </span>
            <span>
              <WeatherIcon name="temp" />
              10°
            </span>
            <span>
              <WeatherIcon name="cloud" />
              {ro ? "100% nori" : "100% clouds"}
            </span>
          </div>
        </div>

        <div className="weather-side">
          <article className="weather-now">
            <div className="weather-now-heading">
              <span>
                <WeatherIcon name="sun" />
                {ro ? "VREMEA ACUM · DEMO" : "CURRENT WEATHER · DEMO"}
              </span>
              <span className="weather-status">
                {ro ? "Exemplu" : "Example"}
              </span>
            </div>
            <strong>{ro ? "10° · Ploaie slabă" : "10° · Light rain"}</strong>
            <p>
              {ro
                ? "Date demonstrative, nu condiții live."
                : "Demo data, not current conditions."}
            </p>
          </article>
          <Link className="recommended-area" href="/airspace">
            <span className="recommended-icon">
              <PinIcon />
            </span>
            <span className="recommended-copy">
              <span>
                {ro
                  ? "ZONA TA · HARTĂ AERONAUTICĂ"
                  : "YOUR AREA · AIRSPACE MAP"}
              </span>
              <strong>
                {ro ? "Verifică zona de zbor" : "Check your flight area"}
              </strong>
              <small>
                {ro
                  ? "Verifică referințele ROMATSA."
                  : "Review ROMATSA and MApN references."}
              </small>
            </span>
            <span className="recommended-arrow" aria-hidden="true">
              ›
            </span>
          </Link>
        </div>
      </section>

      <Link className="notam-notice" href="/airspace">
        <span className="notice-icon">
          <WeatherIcon name="alert" />
        </span>
        <span>
          <strong>
            {ro ? "Verifică NOTAM-urile active" : "Check active NOTAMs"}
          </strong>
          {ro
            ? " în sursele oficiale înainte de decolare. Aerio nu oferă date NOTAM sau meteo în timp real."
            : " with official sources before takeoff. Aerio does not provide live NOTAM or weather data."}
        </span>
        <span className="recommended-arrow" aria-hidden="true">
          ›
        </span>
      </Link>

      <section
        className="dashboard-links"
        aria-label={ro ? "Acces rapid" : "Quick access"}
      >
        {dashboardLinks.map((item) => (
          <Link
            className="dashboard-link-card"
            href={item.href}
            key={item.href}
          >
            <span
              className={`dashboard-link-icon ${item.icon}`}
              aria-hidden="true"
            >
              {item.icon === "drone" ? "⌘" : item.icon === "pin" ? "⌖" : "↗"}
            </span>
            <span className="dashboard-link-copy">
              <span>
                {ro
                  ? item.kicker
                  : item.kicker === "ZONE SALVATE"
                    ? "SAVED AREAS"
                    : item.kicker === "HANGAR"
                      ? "HANGAR"
                      : "PLANNING"}
              </span>
              <strong>
                {ro
                  ? item.title
                  : item.href === "/profile"
                    ? "My drones"
                    : item.href === "/airspace"
                      ? "Where you fly"
                      : item.href === "/request"
                        ? "Flight plans"
                        : "Aerio Academy"}
              </strong>
              <small>
                {ro
                  ? item.action
                  : item.href === "/profile"
                    ? "Manage your fleet"
                    : item.href === "/airspace"
                      ? "Open the map"
                      : item.href === "/request"
                        ? "Prepare a request"
                        : "Open the guide"}
              </small>
            </span>
            <span className="recommended-arrow" aria-hidden="true">
              ›
            </span>
          </Link>
        ))}
      </section>

      <section className="dashboard-bottom">
        <article className="dashboard-panel">
          <div className="dashboard-panel-heading">
            <div>
              <span>{ro ? "ÎNCEPUT RAPID" : "QUICK START"}</span>
              <h3>{ro ? "Primii pași" : "Getting started"}</h3>
            </div>
            <span className="steps-count">01—03</span>
          </div>
          <ol className="dashboard-steps">
            <li>
              <span>01</span>
              <div>
                <strong>{ro ? "Adaugă o dronă" : "Add a drone"}</strong>
                <small>
                  {ro
                    ? "Completează profilul flotei."
                    : "Set up your fleet profile."}
                </small>
              </div>
              <Link
                href="/profile"
                aria-label={ro ? "Adaugă o dronă" : "Add a drone"}
              >
                ↗
              </Link>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>{ro ? "Desenează o zonă" : "Draw an area"}</strong>
                <small>
                  {ro
                    ? "Consultă harta de referință."
                    : "Review the reference map."}
                </small>
              </div>
              <Link
                href="/airspace"
                aria-label={ro ? "Desenează o zonă" : "Draw an area"}
              >
                ↗
              </Link>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>
                  {ro ? "Pregătește cererea" : "Prepare a request"}
                </strong>
                <small>
                  {ro
                    ? "Generează documentele local."
                    : "Generate documents locally."}
                </small>
              </div>
              <Link
                href="/request"
                aria-label={ro ? "Pregătește cererea" : "Prepare a request"}
              >
                ↗
              </Link>
            </li>
          </ol>
        </article>
        <article className="dashboard-panel academy-panel">
          <span>{ro ? "ÎNAINTE DE ZBOR" : "BEFORE YOU FLY"}</span>
          <h3>
            {ro
              ? "Verifică întotdeauna sursele oficiale."
              : "Always check official sources."}
          </h3>
          <p>
            {ro
              ? "Acest ecran meteo este demonstrativ. Aerio nu afișează condiții live și nu acordă autorizare de zbor."
              : "This weather screen is for demonstration. Aerio does not show live conditions or grant flight clearance."}
          </p>
          <Link href="/learn">
            {ro ? "Deschide ghidul Aerio" : "Open the Aerio guide"}{" "}
            <span aria-hidden="true">↗</span>
          </Link>
        </article>
      </section>

      <section className="my-flights dashboard-panel">
        <div className="dashboard-panel-heading">
          <div>
            <span>
              {ro ? "ACTIVITATE · ACEST DISPOZITIV" : "ACTIVITY · THIS DEVICE"}
            </span>
            <h3>{ro ? "Zborurile mele" : "My flights"}</h3>
          </div>
          <Link className="my-flights-view-all" href="/flights">
            {ro ? "Vezi toate" : "View all"} <span aria-hidden="true">↗</span>
          </Link>
        </div>
        {flightsError && (
          <p className="my-flights-error" role="status">
            {flightsError}
          </p>
        )}
        {visibleFlights.length > 0 ? (
          <ul className="my-flights-list">
            {visibleFlights.map((flight) => (
              <li key={flight.id}>
                <span className="flight-date">
                  <strong>{formatFlightDate(flight.flightDate)}</strong>
                  <small>
                    {flight.startTime}–{flight.endTime}
                  </small>
                </span>
                <span className="flight-description">
                  <strong>{flight.drone}</strong>
                  <small>{flight.purpose}</small>
                </span>
                <span className={`flight-status status-${flight.status}`}>
                  <i aria-hidden="true" />
                  {getFlightStatus(flight.status)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          !flightsError && (
            <div className="my-flights-empty">
              <p>
                {ro
                  ? "Zborurile planificate și statusul lor vor apărea aici."
                  : "Your planned flights and their status will appear here."}
              </p>
              <Link href="/request">
                {ro ? "Planifică primul zbor" : "Plan your first flight"}{" "}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )
        )}
        <p className="my-flights-note">
          {ro
            ? "Statusurile sunt salvate local. „Trimis” și „Aprobare” nu confirmă transmiterea sau aprobarea oficială."
            : "Statuses are stored locally. “Sent” and “Approval” do not confirm official submission or clearance."}
        </p>
      </section>
    </section>
  );
}
