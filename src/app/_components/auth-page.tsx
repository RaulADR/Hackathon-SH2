"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useRomanian } from "~/app/_components/language-context";
import { api } from "~/trpc/react";

export function AuthPage({ mode }: { mode: "login" | "signup" }) {
  const romanian = useRomanian();
  const router = useRouter();
  const utils = api.useUtils();
  const [message, setMessage] = useState("");
  const isSignup = mode === "signup";

  async function submitCredentials(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    const formData = new FormData(event.currentTarget);
    if (isSignup) {
      if (formData.get("password") !== formData.get("confirmPassword")) {
        setMessage(
          romanian ? "Parolele nu coincid." : "The passwords do not match.",
        );
        return;
      }
    }
    try {
      const response = await fetch(
        isSignup ? "/api/auth/register" : "/api/auth/login",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
          }),
        },
      );
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        throw new Error(
          romanian
            ? "Autentificarea nu a reușit. Încearcă din nou."
            : "Account access failed. Please try again.",
        );
      }
      if (!response.ok) {
        const errorMessage =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : romanian
              ? "Autentificarea nu a reușit. Încearcă din nou."
              : "Account access failed. Please try again.";
        throw new Error(errorMessage);
      }
      await utils.auth.me.invalidate();
      router.replace("/");
    } catch (error) {
      console.error("Could not authenticate the account.", error);
      setMessage(
        error instanceof Error
          ? error.message
          : romanian
            ? "Autentificarea nu a reușit. Încearcă din nou."
            : "Account access failed. Please try again.",
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
              ? "Profilul, dronele și planurile sunt salvate în cont. Aerio nu oferă autorizare oficială."
              : "Your profile, drones, and flight plans are saved to your account. Aerio does not provide official flight clearance."}
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
                  ? "Autentifică-te pentru a accesa profilul și zborurile salvate."
                  : "Sign in or create an account to manage your flights."}
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

          {message && (
            <p className="notice notice-warning login-message" role="alert">
              {message}
            </p>
          )}

          <p className="login-security-note">
            {romanian
              ? "Parolele sunt stocate sub formă derivată, iar sesiunea este păstrată într-un cookie securizat."
              : "Passwords are stored as derived hashes, and sign-in uses a secure session cookie."}
          </p>
        </section>
      </div>
    </div>
  );
}
