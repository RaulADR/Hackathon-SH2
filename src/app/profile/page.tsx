"use client";

import { useEffect, useState } from "react";

import { useRomanian } from "~/app/_components/language-context";

type PilotProfile = {
  name: string;
  email: string;
  phone: string;
  operatorId: string;
  registration: string;
  insuranceUntil: string;
  drones: string[];
};

const emptyProfile: PilotProfile = {
  name: "",
  email: "",
  phone: "",
  operatorId: "",
  registration: "",
  insuranceUntil: "",
  drones: [],
};

export default function ProfilePage() {
  const romanian = useRomanian();
  const [profile, setProfile] = useState(emptyProfile);
  const [droneName, setDroneName] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const savedProfile = localStorage.getItem("aerio.profile");
      if (savedProfile)
        setProfile({
          ...emptyProfile,
          ...(JSON.parse(savedProfile) as Partial<PilotProfile>),
        });
    } catch (error) {
      console.error("Could not load the locally saved pilot profile.", error);
    }
  }, []);

  function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    localStorage.setItem("aerio.profile", JSON.stringify(profile));
    window.dispatchEvent(new Event("aerio:profile-updated"));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function addDrone(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = droneName.trim();
    if (!name || profile.drones.includes(name)) return;
    setProfile((current) => ({
      ...current,
      drones: [...current.drones, name],
    }));
    setDroneName("");
  }

  function removeDrone(drone: string) {
    setProfile((current) => ({
      ...current,
      drones: current.drones.filter((item) => item !== drone),
    }));
  }

  return (
    <>
      <p className="route-description">
        {romanian
          ? "Detaliile tale rămân pe acest dispozitiv și sunt folosite la pregătirea documentelor."
          : "Your details stay on this device and are used to prepare request documents."}
      </p>
      <div className="notice notice-info prominent-notice">
        {romanian
          ? "Acesta este doar un profil local, nu un cont AACR și nu înlocuiește înregistrarea oficială a operatorului sau dronei."
          : "This is a local profile only; it is not an AACR account or a substitute for official drone/operator registration."}
      </div>
      <section className="content-card profile-card">
        <div className="section-heading">
          <span className="eyebrow">
            {romanian ? "DATE OPERATOR" : "OPERATOR DETAILS"}
          </span>
          <h2>{romanian ? "Date de contact" : "Contact details"}</h2>
        </div>
        <form className="profile-form" onSubmit={saveProfile}>
          <div className="form-grid">
            <label className="field">
              <span>{romanian ? "Nume complet" : "Full name"}</span>
              <input
                value={profile.name}
                onChange={(event) =>
                  setProfile({ ...profile, name: event.target.value })
                }
                maxLength={120}
                autoComplete="name"
              />
            </label>
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={profile.email}
                onChange={(event) =>
                  setProfile({ ...profile, email: event.target.value })
                }
                maxLength={254}
                autoComplete="email"
              />
            </label>
            <label className="field">
              <span>{romanian ? "Telefon" : "Phone"}</span>
              <input
                type="tel"
                value={profile.phone}
                onChange={(event) =>
                  setProfile({ ...profile, phone: event.target.value })
                }
                maxLength={40}
                autoComplete="tel"
              />
            </label>
            <label className="field">
              <span>
                {romanian ? "ID operator (AACR)" : "Operator ID (AACR)"}
              </span>
              <input
                value={profile.operatorId}
                onChange={(event) =>
                  setProfile({ ...profile, operatorId: event.target.value })
                }
                maxLength={100}
              />
            </label>
            <label className="field">
              <span>
                {romanian ? "Înregistrarea dronei" : "Drone registration"}
              </span>
              <input
                value={profile.registration}
                onChange={(event) =>
                  setProfile({ ...profile, registration: event.target.value })
                }
                maxLength={100}
              />
            </label>
            <label className="field">
              <span>
                {romanian
                  ? "Asigurare valabilă până la"
                  : "Insurance valid until"}
              </span>
              <input
                type="date"
                value={profile.insuranceUntil}
                onChange={(event) =>
                  setProfile({ ...profile, insuranceUntil: event.target.value })
                }
              />
            </label>
          </div>
          <button className="button button-primary" type="submit">
            {saved
              ? romanian
                ? "Salvat"
                : "Saved"
              : romanian
                ? "Salvează profilul local"
                : "Save local profile"}
          </button>
        </form>
      </section>
      <section className="content-card drone-section">
        <div className="section-heading">
          <span className="eyebrow">{romanian ? "AERONAVE" : "AIRCRAFT"}</span>
          <h2>{romanian ? "Dronele tale" : "Your drones"}</h2>
        </div>
        <form className="add-drone-form" onSubmit={addDrone}>
          <label className="field">
            <span>
              {romanian ? "Numele/modelul dronei" : "Drone name/model"}
            </span>
            <input
              value={droneName}
              onChange={(event) => setDroneName(event.target.value)}
              maxLength={120}
              placeholder={
                romanian ? "de ex. DJI Mini 4 Pro" : "e.g. DJI Mini 4 Pro"
              }
            />
          </label>
          <button
            className="button button-quiet"
            type="submit"
            disabled={!droneName.trim()}
          >
            {romanian ? "Adaugă dronă" : "Add drone"}
          </button>
        </form>
        {profile.drones.length === 0 ? (
          <p className="muted">
            {romanian
              ? "Adaugă o dronă pentru a o selecta la cererea de zbor."
              : "Add a drone to select it in your flight request."}
          </p>
        ) : (
          <ul className="drone-list">
            {profile.drones.map((drone) => (
              <li key={drone}>
                <span>{drone}</span>
                <button
                  className="text-button"
                  type="button"
                  onClick={() => removeDrone(drone)}
                  aria-label={`Remove ${drone}`}
                >
                  {romanian ? "Elimină" : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        )}
        <p className="small-note">
          {romanian
            ? "Datele profilului și ale dronelor sunt păstrate local în acest browser și nu sunt trimise în baza de date Aerio."
            : "Profile and aircraft details are stored in this browser’s local storage and are not sent to Aerio’s database."}
        </p>
      </section>
    </>
  );
}
