"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { LanguageContext } from "~/app/_components/language-context";
import { api } from "~/trpc/react";

const links = [
  { href: "/", en: "Today", ro: "Acasă", icon: "today" },
  { href: "/airspace", en: "Airspace", ro: "Hartă", icon: "map" },
  {
    href: "/request",
    en: "Plan flight",
    ro: "Planifică zbor",
    icon: "request",
  },
  {
    href: "/flights",
    en: "My flights",
    ro: "Zborurile mele",
    icon: "flights",
  },
  { href: "/profile", en: "My drones", ro: "Dronele mele", icon: "profile" },
  { href: "/learn", en: "Academy", ro: "Academie", icon: "learn" },
];

function NavigationIcon({ name }: { name: string }) {
  if (name === "today") {
    return (
      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
      </svg>
    );
  }
  if (name === "map") {
    return (
      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m9 4-6 2v14l6-2 6 2 6-2V4l-6 2-6-2Z" />
        <path d="M9 4v14m6-12v14" />
      </svg>
    );
  }
  if (name === "request") {
    return (
      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
        <path d="m12 3 7 3v6c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6l7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }
  if (name === "profile") {
    return (
      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3.5" y="5" width="17" height="14" rx="3" />
        <circle cx="9.2" cy="11" r="2" />
        <path d="M6.5 16c.5-1.6 1.5-2.5 2.7-2.5s2.2.9 2.7 2.5M14 9.5h3m-3 3.5h3" />
      </svg>
    );
  }
  if (name === "flights") {
    return (
      <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v14H3.5V6A1.5 1.5 0 0 1 5 4.5Z" />
        <path d="M8 2.5v4m8-4v4M3.5 9.5h17M7.5 13h3m-3 3.5h6" />
      </svg>
    );
  }
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.6A2.6 2.6 0 0 1 6.6 3H20v15H6.6A2.6 2.6 0 0 0 4 20.6V5.6Z" />
      <path d="M8.5 7h7m-7 3.5h5" />
    </svg>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [light, setLight] = useState(false);
  const [romanian, setRomanian] = useState(false);
  const [pilotName, setPilotName] = useState("");
  const [accountEmail, setAccountEmail] = useState("");
  const [sessionError, setSessionError] = useState("");
  const [entryChecked, setEntryChecked] = useState(false);
  const authQuery = api.auth.me.useQuery(undefined, { retry: false });
  const utils = api.useUtils();

  useEffect(() => {
    const savedTheme = localStorage.getItem("aerio.theme") === "light";
    const storedLanguage = localStorage.getItem("aerio.language");
    const savedLanguage = storedLanguage === null || storedLanguage === "ro";
    setLight(savedTheme);
    setRomanian(savedLanguage);
    document.documentElement.dataset.theme = savedTheme ? "light" : "dark";
    document.documentElement.lang = savedLanguage ? "ro" : "en";
  }, []);

  useEffect(() => {
    const isAuthPage = pathname === "/login" || pathname === "/signup";
    if (authQuery.isPending) {
      setEntryChecked(false);
      return;
    }
    if (authQuery.data) {
      const fullName = [
        authQuery.data.profile?.firstName,
        authQuery.data.profile?.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim();
      setPilotName(fullName);
      setAccountEmail(authQuery.data.email);
      if (isAuthPage) {
        router.replace("/");
        return;
      }
      setEntryChecked(true);
      return;
    }
    setPilotName("");
    setAccountEmail("");
    if (!isAuthPage) {
      router.replace("/login");
      return;
    }
    setEntryChecked(true);
  }, [authQuery.data, authQuery.isPending, pathname, router]);

  function toggleTheme() {
    const next = !light;
    setLight(next);
    localStorage.setItem("aerio.theme", next ? "light" : "dark");
    document.documentElement.dataset.theme = next ? "light" : "dark";
  }

  function toggleLanguage() {
    const next = !romanian;
    setRomanian(next);
    localStorage.setItem("aerio.language", next ? "ro" : "en");
    document.documentElement.lang = next ? "ro" : "en";
  }

  async function signOut() {
    setSessionError("");
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok)
        throw new Error(`Sign-out failed (${response.status}).`);
      await utils.auth.me.invalidate();
      setEntryChecked(false);
      router.replace("/login");
    } catch (error) {
      console.error("Could not end the account session.", error);
      setSessionError(
        romanian
          ? "Deconectarea nu a reușit. Încearcă din nou."
          : "Sign out failed. Please try again.",
      );
    }
  }

  const pageTitles: Record<string, { en: string; ro: string }> = {
    "/": { en: "Dashboard", ro: "Panou de control" },
    "/airspace": { en: "Airspace", ro: "Spațiu aerian" },
    "/request": { en: "Flight request", ro: "Cerere de zbor" },
    "/flights": { en: "My flights", ro: "Zborurile mele" },
    "/profile": { en: "Profile", ro: "Profil" },
    "/learn": { en: "Learn", ro: "Ghid" },
    "/login": { en: "Sign in", ro: "Autentificare" },
    "/signup": { en: "Sign up", ro: "Creează cont" },
  };
  const title = pageTitles[pathname] ?? { en: "Aerio", ro: "Aerio" };

  if (!entryChecked) {
    return (
      <LanguageContext.Provider value={romanian}>
        <div className="entry-loading" aria-live="polite">
          Aerio
        </div>
      </LanguageContext.Provider>
    );
  }

  if (pathname === "/login" || pathname === "/signup") {
    return (
      <LanguageContext.Provider value={romanian}>
        <main className="standalone-login">{children}</main>
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={romanian}>
      <div className={`app-shell ${pathname === "/" ? "home-shell" : ""}`}>
        <div className="flying-drone" aria-hidden="true">
          <img src="/drone-outline.svg" alt="" />
        </div>
        <div className="flying-drone drone-b" aria-hidden="true">
          <img src="/drone-purple.svg" alt="" />
        </div>
        <aside
          className="sidebar glass"
          aria-label={romanian ? "Navigare principală" : "Primary navigation"}
        >
          <Link className="brand" href="/" aria-label="Aerio home">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.2 14 9l5.8 2-5.8 2-2 5.8-2-5.8L4.2 11 10 9l2-5.8Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span className="brand-text">
              <strong>Aerio</strong>
              <small>{romanian ? "Birou de zbor" : "Flight desk"}</small>
            </span>
          </Link>
          <nav
            className="main-nav"
            aria-label={romanian ? "Secțiuni" : "Sections"}
          >
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  className={`nav-link ${isActive ? "active" : ""}`}
                  href={link.href}
                  key={link.href}
                  aria-label={romanian ? link.ro : link.en}
                  aria-current={isActive ? "page" : undefined}
                >
                  <NavigationIcon name={link.icon} />
                  <span>{romanian ? link.ro : link.en}</span>
                </Link>
              );
            })}
          </nav>
          <section className="sidebar-note">
            {pathname === "/" ? (
              <>
                <p className="note-kicker">
                  {romanian ? "LOCAȚIA MEA" : "MY LOCATION"}
                </p>
                <p className="note-weather">Craiova</p>
                <div className="note-metrics">
                  <span>{romanian ? "România" : "Romania"}</span>
                  <span>{romanian ? "Locație demo" : "Demo location"}</span>
                </div>
              </>
            ) : (
              <>
                <p className="note-kicker">
                  {romanian ? "PLANIFICARE ÎN ROMÂNIA" : "ROMANIA FLIGHT DESK"}
                </p>
                <p className="note-weather">
                  {romanian ? "Planificare" : "Planning"}{" "}
                  <span>{romanian ? "locală" : "only"}</span>
                </p>
                <div className="note-metrics">
                  <span>
                    {romanian ? "Fără date în timp real" : "No live data"}
                  </span>
                  <span>{romanian ? "Fără autorizare" : "No clearance"}</span>
                </div>
                <p className="note-meta">
                  {romanian
                    ? "Verifică sursele oficiale înainte de zbor."
                    : "Check official sources before flying."}
                </p>
              </>
            )}
          </section>
          <div className="sidebar-foot">
            {accountEmail && (
              <div className="account-session-indicator" role="status">
                <span className="account-session-dot" aria-hidden="true" />
                <span>
                  <strong>{romanian ? "Cont conectat" : "Signed in"}</strong>
                  <small>{accountEmail}</small>
                </span>
                <button type="button" onClick={() => void signOut()}>
                  {romanian ? "Ieșire" : "Sign out"}
                </button>
              </div>
            )}
            {sessionError && (
              <p className="notice notice-warning" role="alert">
                {sessionError}
              </p>
            )}
            <Link className="profile-link" href="/profile">
              <span className="avatar">
                {pilotName.trim()
                  ? pilotName
                      .trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map((part) => part[0])
                      .join("")
                      .toUpperCase()
                  : "A"}
              </span>
              <span className="profile-text">
                <strong>
                  {pilotName || (romanian ? "Profil pilot" : "Pilot profile")}
                </strong>
                <small>
                  {romanian ? "Dosar local" : "Local operator file"}
                </small>
              </span>
              <span className="profile-chevron" aria-hidden="true">
                ›
              </span>
            </Link>
            <button
              className="theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={
                light ? "Switch to dark theme" : "Switch to white theme"
              }
            >
              <span aria-hidden="true">{light ? "☾" : "☼"}</span>
              {light
                ? romanian
                  ? "Temă închisă"
                  : "Dark theme"
                : romanian
                  ? "Temă albă"
                  : "White theme"}
            </button>
          </div>
        </aside>
        <main className="main-content">
          <header className="topbar">
            <div className="page-head">
              <p className="eyebrow">
                {pathname === "/airspace"
                  ? romanian
                    ? "ROMATSA · DATE DE REFERINȚĂ"
                    : "ROMATSA · REFERENCE DATA"
                  : romanian
                    ? "AERIO · PLANIFICARE LOCALĂ"
                    : "AERIO · LOCAL PLANNING"}
              </p>
              <h1>{romanian ? title.ro : title.en}</h1>
            </div>
            <div className="topbar-actions">
              <span className="clearance-pill">
                <i aria-hidden="true" />
                {romanian
                  ? "Planificare · fără autorizare"
                  : "Planning only · no clearance"}
              </span>
              <button
                className="language-toggle"
                type="button"
                onClick={toggleLanguage}
                aria-label={
                  romanian ? "Switch to English" : "Switch to Romanian"
                }
              >
                {romanian ? "EN" : "RO"}
              </button>
            </div>
          </header>
          <div className="page-content">{children}</div>
        </main>
      </div>
    </LanguageContext.Provider>
  );
}
