# Aerio

Aerio is a Romanian drone-flight planning prototype built with the T3 Stack: Next.js App Router, TypeScript, tRPC, Prisma/SQLite, Tailwind CSS and React Leaflet.

## Routes

- `/` — overview and official-source links.
- `/airspace` — Romania map with the bundled ROMATSA UAS reference layer, OSM/Esri basemaps, and a live polygon preview while selecting boundary points.
- `/request` — candidate-time checks, request package generation, email drafts, and local sent/approval records.
- `/profile` — operator contact details and a locally saved fleet; add multiple drones from model presets, configure a camera model and required video resolution, then select that aircraft in `/request`.
- `/learn` — planning checklist, official references, and a non-official A1/A2/A3 practice quiz.
- `/login` — first-visit entry screen with an email/password UI placeholder and local demo access. Demo entry is remembered in browser storage, so this screen is skipped on later visits.

## Run locally

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Install packages with `npm install`.
4. Generate the Prisma client and create the local SQLite schema:

   ```sh
   npm run db:generate
   npm run db:push
   ```

5. Start Next.js:

   ```sh
   npm run dev
   ```

Useful checks: `npm run lint`, `npm run typecheck`, and `npm run build`.

## Planning and data limitations

- ROMATSA zones are a bundled snapshot under `public/data/romatsa-uav-zones.json`, not a live feed. Its listed validity starts 30 April 2026. Always check the current ROMATSA map, NOTAMs, AIP and zone instructions.
- The map's aerial imagery is a public Esri layer. The MApN AEROFOTO link opens MApN's separate official service; it is not embedded as an imagery layer.
- Candidate slots compare only against saved flight-planning drafts in this installation's SQLite database. They do not use live or shared authority bookings and are not official availability.
- Pilot profile data, request-package status and locally recorded approvals stay in browser storage. The server stores only area/time/drone/purpose planning drafts. Do not treat a locally recorded status as an authority action.
- `/request` can fill the supplied `public/anexa1.pdf` with a saved plan's profile and flight details in the browser and download a draft. It places only the pilot's name in the operator-name field, the profile's AACR operator ID in the registration field, and maps the selected drone class and weight-based category. The tower is automatically filled only when intersecting ROMATSA zone contacts map unambiguously to one tower; the bundled zone data does not formally classify CTR boundaries, so verify the CTR and tower using current official charts and requirements. The PDF is not sent or approved by Aerio.
- Each request on `/request` requires a signature drawn with a mouse or touch screen. The signature is saved with that request on the current device and placed visually in its Anexa 1 PDF; it is not a certified or cryptographic electronic signature. Altitude is entered in feet and labeled in feet in the PDF. Saving a polygon on `/airspace` returns to `/request`.
- Drone category estimates are informational only. They use entered mass and C-class label as a basic reference and do not determine legal eligibility or replace current AACR/EASA requirements. The practice quiz is not an official exam or certificate.
- Drone model masses and camera/resolution presets are reference values for planning convenience; verify the exact aircraft, camera, firmware, and regional specifications before relying on them. A flight request includes the selected drone, camera model and chosen resolution in its generated planning description.
- Request packages are planning summaries, GeoJSON, and (where offered) a user-supplied Anexa 1 template filled as a draft. Review every field against current official requirements before submitting. Email links open a draft in the user's email client; Aerio does not send the message or contact authorities. User confirmation of sending or approval is local only.
- This prototype has no authentication or rate limiting. Before public deployment, add authorization, abuse controls, data retention rules and appropriate production infrastructure. Do not use its candidate-time results to authorize a flight.
- The sign-in form is UI-only; it does not authenticate or store passwords. The first-visit gate and demo choice are browser-local, not a secure account or access-control boundary. Configure a real authentication provider before collecting credentials or deploying account features.
- The prior static prototype is retained under `legacy/` as an archive; the routed Next.js app is the active application.

## Project structure

```text
src/
  app/                 App Router pages and shared UI
  lib/                 Shared geometry, airspace-contact and PDF helpers
  server/api/          Typed tRPC routers
  styles/              Global theme and layout styles
  trpc/                T3 React/server integration
prisma/                SQLite schema
public/data/           Bundled ROMATSA reference dataset
public/fonts/          Noto Sans font used for Romanian PDF text
legacy/                Archived static prototype
```
