"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useRomanian } from "~/app/_components/language-context";

const demoSession = {
  mode: "demo",
  email: "demo@aerio.app",
  name: "Demo Pilot",
};

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const romanian = useRomanian();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";

  function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSignup) {
      const formData = new FormData(event.currentTarget);
      if (formData.get("password") !== formData.get("confirmPassword")) {
        setMessage(
          romanian ? "Parolele nu coincid." : "The passwords do not match.",
        );
        return;
      }
    }
    setMessage(
      romanian
        ? isSignup
          ? "Crearea contului nu este configurată încă. Datele introduse nu au fost trimise sau salvate."
          : "Autentificarea reală nu este configurată încă. Datele introduse nu au fost trimise sau salvate."
        : isSignup
          ? "Account creation is not configured yet. The details you entered were not sent or saved."
          : "Real sign-in is not configured yet. The details you entered were not sent or saved.",
    );
  }

  function continueAsDemo() {
    try {
      localStorage.setItem("aerio.session", JSON.stringify(demoSession));
      localStorage.setItem("aerio.demoAccess", "true");
      window.dispatchEvent(new Event("aerio:session-updated"));
      router.push("/");
    } catch (error) {
      console.error("Could not start the local demo session.", error);
      setMessage(
        romanian
          ? "Sesiunea demo nu a putut fi pornită în acest browser."
          : "The demo session could not be started in this browser.",
      );
    }
  }

  return (
    <div className="login-page">
      <div className="login-layout">
        <section className="login-welcome">
          <div className="login-brand">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 3.2 14 9l5.8 2-5.8 2-2 5.8-2-5.8L4.2 11 10 9l-2-5.8Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div>
              <span className="eyebrow">AERIO · FLIGHT DESK</span>
              <h2>
                {romanian
                  ? "Planifică zborul cu încredere"
                  : "Plan your flight with confidence"}
              </h2>
            </div>
          </div>
          <p className="login-intro">
            {romanian
              ? "Instrumente simple pentru planificarea zborurilor cu drona în România."
              : "Simple tools for planning drone flights in Romania."}
          </p>
          <ul className="login-feature-list">
            <li>
              <span aria-hidden="true">01</span>
              {romanian
                ? "Consultă zonele ROMATSA pe hartă"
                : "Explore ROMATSA reference zones"}
            </li>
            <li>
              <span aria-hidden="true">02</span>
              {romanian
                ? "Desenează și previzualizează zona de zbor"
                : "Draw and preview a proposed flight area"}
            </li>
            <li>
              <span aria-hidden="true">03</span>
              {romanian
                ? "Pregătește detaliile și documentele de planificare"
                : "Prepare planning details and documents"}
            </li>
          </ul>
          <p className="login-local-note">
            {romanian
              ? "Datele demo sunt salvate doar în browserul tău. Aerio nu oferă autorizare oficială."
              : "Demo data stays in your browser. Aerio does not provide official flight clearance."}
          </p>
        </section>

        <section
          className="content-card login-card"
          aria-labelledby="login-title"
        >
          <div className="login-card-heading">
            <span className="eyebrow">
              {romanian ? "ACCES PILOT" : "PILOT ACCESS"}
            </span>
            <h2 id="login-title">
              {isSignup
                ? romanian
                  ? "Creează un cont"
                  : "Create your account"
                : romanian
                  ? "Bine ai venit"
                  : "Welcome"}
            </h2>
            <p className="muted">
              {isSignup
                ? romanian
                  ? "Creează un profil pentru a-ți pregăti zborurile."
                  : "Create a profile to prepare your flights."
                : romanian
                  ? "Autentifică-te sau explorează aplicația cu un cont demo."
                  : "Sign in or explore the app with a demo account."}
            </p>
          </div>

          <nav
            className="auth-switch"
            aria-label={romanian ? "Autentificare" : "Account access"}
          >
            <Link
              href="/login"
              aria-current={!isSignup ? "page" : undefined}
              className={!isSignup ? "active" : ""}
            >
              {romanian ? "Autentificare" : "Sign in"}
            </Link>
            <Link
              href="/signup"
              aria-current={isSignup ? "page" : undefined}
              className={isSignup ? "active" : ""}
            >
              {romanian ? "Creează cont" : "Sign up"}
            </Link>
          </nav>

          <form className="login-form" onSubmit={submitCredentials}>
            {isSignup && (
              <label className="field">
                <span>{romanian ? "Numele complet" : "Full name"}</span>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  placeholder={romanian ? "Numele tău" : "Your name"}
                  maxLength={100}
                  required
                />
              </label>
            )}
            <label className="field">
              <span>{romanian ? "Adresă de email" : "Email address"}</span>
              <input
                type="email"
                name="email"
                autoComplete="email"
                placeholder="name@example.com"
                maxLength={254}
                required
              />
            </label>
            <label className="field">
              <span>{romanian ? "Parolă Aerio" : "Aerio password"}</span>
              <input
                type="password"
                name="password"
                autoComplete={isSignup ? "new-password" : "current-password"}
                minLength={8}
                maxLength={128}
                required
              />
            </label>
            {isSignup && (
              <label className="field">
                <span>{romanian ? "Confirmă parola" : "Confirm password"}</span>
                <input
                  type="password"
                  name="confirmPassword"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                />
              </label>
            )}
            <button
              className="button button-primary login-submit"
              type="submit"
            >
              {isSignup
                ? romanian
                  ? "Creează cont"
                  : "Create account"
                : romanian
                  ? "Autentificare"
                  : "Sign in"}
            </button>
          </form>

          <div className="login-divider">
            <span>{romanian ? "sau" : "or"}</span>
          </div>

          <button
            className="button button-success demo-login-button"
            type="button"
            onClick={continueAsDemo}
          >
            <span aria-hidden="true">✦</span>
            {romanian
              ? "Continuă cu contul demo"
              : "Continue with demo account"}
          </button>
          <p className="small-note login-demo-note">
            {romanian
              ? "Intrarea demo se memorează pe acest dispozitiv, ca să nu mai vezi acest ecran la următoarea vizită."
              : "Demo access is remembered on this device, so you won’t see this screen next time."}
          </p>

          {message && (
            <p className="notice notice-warning login-message" role="alert">
              {message}
            </p>
          )}

          <p className="login-security-note">
            {romanian
              ? "Conturile prin email/parolă nu sunt active încă. Datele introduse nu sunt trimise sau salvate."
              : "Email/password accounts are not enabled yet. Details entered here are not sent or saved."}
          </p>
        </section>
      </div>
    </div>
  );
}
