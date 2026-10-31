# Aerio

Aerio is a Romanian drone-flight planning prototype built with the T3 Stack: Next.js App Router, TypeScript, tRPC, Prisma/SQLite, Tailwind CSS and React Leaflet.

## Routes

- `/` — overview and official-source links.
- `/airspace` — Romania map with the bundled ROMATSA UAS reference layer, OSM/Esri basemaps and polygon drawing.
- `/request` — candidate-time checks, request package generation, email drafts, and local sent/approval records.
- `/profile` — pilot and drone details stored in this browser.
- `/learn` — planning checklist and official references.

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
- Request packages are planning summaries and GeoJSON, not official forms. Email links open a draft in the user's email client; Aerio does not send the message or contact authorities. User confirmation of sending or approval is local only.
- This prototype has no authentication or rate limiting. Before public deployment, add authorization, abuse controls, data retention rules and appropriate production infrastructure. Do not use its candidate-time results to authorize a flight.
- The prior static prototype is retained under `legacy/` as an archive; the routed Next.js app is the active application.

## Project structure

```text
src/
  app/                 App Router pages and shared UI
  lib/                 Shared geometry helpers
  server/api/          Typed tRPC routers
  styles/              Global theme and layout styles
  trpc/                T3 React/server integration
prisma/                SQLite schema
public/data/           Bundled ROMATSA reference dataset
legacy/                Archived static prototype
```
