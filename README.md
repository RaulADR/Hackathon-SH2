# Aerio

**Aerio** este o aplicație web de planificare a zborurilor cu drone în România. Reunește o hartă cu zone de referință, un profil de pilot și flotă salvat în cont, planificarea unui zbor și generarea automată a anexelor necesare pentru zbor.

> **Important:** Aerio este un prototip de planificare, nu o aplicație oficială AACR sau ROMATSA. Datele aeronautice incluse nu sunt live. Aplicația nu rezervă spațiu aerian, nu trimite cereri către autorități și nu acordă aprobări. Verifică întotdeauna informațiile și cerințele actuale din surse oficiale înainte de zbor.

## Cuprins

- [Funcționalități](#funcționalități)
- [Tutorial de utilizare](#tutorial-de-utilizare)
- [Tehnologii și arhitectură](#tehnologii-și-arhitectură)
- [Dependențe](#dependențe)
- [Cerințe de sistem](#cerințe-de-sistem)
- [Instalare și pornire locală](#instalare-și-pornire-locală)
- [Comenzi disponibile](#comenzi-disponibile)
- [Structura proiectului](#structura-proiectului)
- [Date și confidențialitate](#date-și-confidențialitate)
- [Limitări și verificări înainte de zbor](#limitări-și-verificări-înainte-de-zbor)
- [Surse oficiale](#surse-oficiale)

## Funcționalități

### Panou principal

- Oferă acces rapid la hartă, planificarea unui zbor, profil și ghid.
- Afișează zborurile salvate în cont și statusul lor: pregătit, marcat ca trimis sau aprobare înregistrată.
- Bara de sus este transparentă și discretă pe toate paginile aplicației.
- Include acces la pagina separată „Zborurile mele” imediat după „Planifică zbor” în navigare; acolo sunt listate cererile și statusurile lor.
- Prezintă pe scurt pașii de planificare și linkuri către surse oficiale.

### Hartă aeronautică

- Afișează un strat local cu zone ROMATSA pentru drone și permite comutarea între harta stradală OpenStreetMap și imaginile aeriene Esri.
- Permite adăugarea punctelor unui poligon, previzualizarea zonei, anularea ultimului punct, redesenarea și salvarea acesteia pentru cererea de zbor.
- După salvarea poligonului, aplicația revine la pagina de planificare.
- Afișează și poligoanele cererilor marcate local ca aprobate; această afișare nu confirmă o aprobare oficială.
- Oferă acces către serviciul oficial MApN AEROFOTO. Serviciul MApN se deschide separat; nu este integrat ca strat în hartă.

### Profil și flotă

- Păstrează în cont datele operatorului/pilotului, inclusiv numele, datele de contact și ID-ul de operator.
- Permite salvarea mai multor drone, cu poreclă, model, masă, clasă, model de cameră și rezoluție.
- Include modele și configurații de cameră prestabilite, precum și posibilitatea de a gestiona dronele din profil.
- Drona selectată este folosită la pregătirea cererii și la completarea câmpurilor relevante din Anexa 1.

### Planificarea cererii

- Folosește poligonul salvat, data, durata, scopul și drona selectată.
- Afișează intervale candidate între orele 08:00 și 20:00, în pași de 30 de minute, comparând planurile suprapuse salvate în baza de date a instalării curente.
- Identifică turnul TWR doar când contactele ROMATSA ale zonelor care intersectează poligonul indică fără ambiguitate un singur turn cunoscut.
- Colectează automat categoria, modul de operare (VLOS/BVLOS) și altitudinea maximă AGL în ft. Categoria propusă urmează regulile simplificate din interfață: A1 sub 250 g, A3 de la 250 g, iar A2 este disponibilă numai pentru drone C2 din intervalul de masă acceptat de formular.
- Cere o semnătură digitala fiecare cerere.
- Poate genera în browser un proiect PDF Anexa 1, precum și un rezumat al cererii și un fișier GeoJSON al poligonului.
- Poate deschide o ciornă de email către contactele extrase din zonele intersectate.
- Permite salvarea în cont a statusului unei cereri ca trimisă sau a unei aprobări înregistrate. Aceste acțiuni nu trimit emailuri și nu verifică aprobări oficiale.

### Ghid și test de pregătire

- Include informații generale și linkuri utile pentru verificarea regulilor.
- Oferă întrebări de exercițiu pentru categoriile A1, A2 și A3, cu feedback și explicații.
- Testul este doar pentru exersare; nu este examen oficial și nu acordă un certificat.

### Limbă, temă și conturi

- Interfața poate fi afișată în română sau engleză.
- Tema luminoasă/albă și tema întunecată pot fi schimbate din interfață.
- Utilizatorii se pot înregistra și autentifica folosind email și parolă.
- Sesiunile folosesc cookie-uri HttpOnly, iar parolele sunt stocate ca hash-uri scrypt.
- Profilul pilotului, flota, planurile de zbor și metadatele documentelor sunt separate per cont.

## Tutorial de utilizare

1. **Deschide aplicația.** Creează un cont cu email și parolă sau autentifică-te.
2. **Completează profilul.** Introdu numele pilotului și ID-ul operatorului AACR, apoi salvează una sau mai multe drone în flotă. Pentru document, selectează clasa certificată corectă și completează detaliile camerei.
3. **Desenează zona de zbor.** Deschide harta, adaugă cel puțin trei puncte, verifică previzualizarea poligonului și salvează zona.
4. **Verifică zonele intersectate.** Consultă contactele și instrucțiunile afișate, apoi confirmă informațiile pe hărțile și documentele aeronautice oficiale. Pentru imagini, deschide separat MApN AEROFOTO.
5. **Completează planul.** În pagina „Flight request”, selectează drona, data, intervalul candidat și scopul. Verifică turnul TWR identificat automat. Completează categoria, modul VLOS/BVLOS și altitudinea AGL în ft.
6. **Semnează cererea.** Desenează semnătura în zona dedicată. Semnătura este asociată doar cererii respective și va apărea vizual în PDF.
7. **Generează documentele.** Pregătește pachetul local și descarcă PDF-ul Anexa 1 sau fișierele pachetului. Verifică fiecare câmp și atașează documentele necesare manual.
8. **Trimite prin canalele oficiale.** Dacă folosești ciorna de email, verifică destinatarul, atașează documentele și trimite mesajul tu. Actualizarea statusului în Aerio este doar locală.

## Tehnologii și arhitectură

### Frontend

- **Next.js App Router** pentru paginile aplicației și navigare.
- **React 19** pentru componente și interacțiunile interfeței.
- **TypeScript** cu verificare strictă a tipurilor.
- **React Leaflet și Leaflet** pentru hartă, poligoane și straturi geografice.
- **CSS global** pentru interfață, layout, teme și adaptarea la ecrane diferite; proiectul include și integrarea Tailwind CSS/PostCSS.
- **TanStack React Query** prin integrarea tRPC pentru cereri și cache în client.
- **pdf-lib și @pdf-lib/fontkit** pentru completarea locală a PDF-ului și încorporarea fontului pentru caractere românești.

### Backend

- **Next.js** găzduiește aplicația web și endpoint-ul API.
- **tRPC** oferă API tipizat între interfață și server.
- **Zod** validează datele primite de procedurile API.
- **Prisma ORM** accesează baza de date.
- **PostgreSQL** stochează conturile, sesiunile, profilele, dronele, planurile de zbor și metadatele documentelor.

### Bază de date și stocare

- Modelul `User` deține profilul pilotului, dronele, sesiunile și planurile de zbor; `FlightDocument` păstrează numele și tipurile documentelor generate.
- Detaliile zborului, coordonatele poligonului, semnătura, statusul și metadatele documentelor sunt salvate în PostgreSQL și asociate contului.
- PDF-ul, rezumatul text și fișierul GeoJSON sunt generate și descărcate în browser; baza păstrează metadatele, nu conținutul fișierelor.
- Selectarea zonei de zbor, limba interfeței și tema rămân în stocarea browserului.
- `DATABASE_URL` trebuie configurat cu URL-ul serverului PostgreSQL folosit de instalare. Nu pune credențialele în Git.

## Dependențe

Versiunile declarate în `package.json` sunt folosite la instalare; lista de mai jos descrie rolul principal al fiecăreia.

### Dependențe de producție

| Pachet                                              | Rol                                                |
| --------------------------------------------------- | -------------------------------------------------- |
| `next`                                              | Framework web, App Router și API routes            |
| `react`, `react-dom`                                | Interfață și randare React                         |
| `@prisma/client`                                    | Acces la baza de date prin Prisma                  |
| `@t3-oss/env-nextjs`                                | Utilitare pentru variabile de mediu Next.js        |
| `@trpc/client`, `@trpc/react-query`, `@trpc/server` | API tRPC și integrarea cu React Query              |
| `@tanstack/react-query`                             | Cache și gestionarea cererilor asincrone           |
| `zod`                                               | Validarea schemelor de intrare și a datelor        |
| `superjson`                                         | Serializarea datelor folosite de tRPC              |
| `prisma`                                            | Schema, clientul și comenzile pentru baza de date  |
| `leaflet`, `react-leaflet`                          | Hărți și componente geografice                     |
| `pdf-lib`, `@pdf-lib/fontkit`                       | Completare PDF și încorporare fonturi              |
| `server-only`                                       | Protejarea modulelor destinate exclusiv serverului |

### Dependențe de dezvoltare

| Pachet                                                              | Rol                                             |
| ------------------------------------------------------------------- | ----------------------------------------------- |
| `typescript`                                                        | Compilator și verificare TypeScript             |
| `eslint`, `eslint-config-next`, `typescript-eslint`                 | Analiză statică și reguli de cod                |
| `prettier`, `prettier-plugin-tailwindcss`                           | Formatarea fișierelor                           |
| `@types/node`, `@types/react`, `@types/react-dom`, `@types/leaflet` | Definiții TypeScript pentru biblioteci          |
| `@eslint/eslintrc`                                                  | Compatibilitate/configurare ESLint              |
| `tailwindcss`, `@tailwindcss/postcss`, `postcss`                    | Instrumente CSS incluse în setup-ul proiectului |

## Cerințe de sistem

- Node.js **22 LTS** (recomandat) sau Node.js **20.17+**.
- npm (proiectul declară `npm@11.6.2` ca manager de pachete).
- Git pentru clonarea depozitului.
- Acces la internet pentru instalarea pachetelor și încărcarea straturilor de hartă externe.

## Instalare și pornire locală

Comenzile următoare sunt valabile în PowerShell, Command Prompt sau terminalul VS Code.

1. Clonează depozitul și intră în directorul proiectului:

   ```powershell
   git clone https://github.com/RaulADR/Hackathon-SH2.git
   cd Hackathon-SH2
   ```

2. Creează fișierul local de configurare pornind de la exemplu:

   ```powershell
   Copy-Item .env.example .env
   ```

   Înlocuiește valorile `USER`, `PASSWORD`, `HOST` și `DATABASE` din `DATABASE_URL` cu URL-ul serverului PostgreSQL tău. Păstrează credențialele doar în `.env`; nu le publica.

3. Instalează dependențele:

   ```powershell
   npm install
   ```

   Scriptul `postinstall` generează clientul Prisma. Dacă este nevoie, îl poți genera manual:

   ```powershell
   npm run db:generate
   ```

4. Generează clientul Prisma și aplică migrațiile versionate:

   ```powershell
   npm run db:generate
   npm run db:migrate
   ```

5. Pornește serverul de dezvoltare:

   ```powershell
   npm run dev
   ```

6. Deschide adresa afișată de Next.js, implicit [http://localhost:3000](http://localhost:3000). Dacă portul 3000 este ocupat:

   ```powershell
   npm run dev -- --port 3004
   ```

### Build pentru producție

```powershell
npm run build
npm run start
```

Serverul de producție folosește implicit portul 3000; se poate configura portul prin variabila de mediu `PORT`.

## Comenzi disponibile

| Comandă                | Descriere                                                |
| ---------------------- | -------------------------------------------------------- |
| `npm run dev`          | Pornește mediul Next.js de dezvoltare cu Turbopack       |
| `npm run build`        | Creează build-ul optimizat pentru producție              |
| `npm run start`        | Pornește build-ul de producție                           |
| `npm run preview`      | Construiește și pornește aplicația pentru previzualizare |
| `npm run lint`         | Rulează ESLint                                           |
| `npm run typecheck`    | Verifică tipurile TypeScript                             |
| `npm run check`        | Rulează ESLint și TypeScript                             |
| `npm run format:check` | Verifică formatarea fișierelor                           |
| `npm run format:write` | Formatează fișierele acceptate de script                 |
| `npm run db:generate`  | Generează clientul Prisma                                |
| `npm run db:push`      | Aplică schema Prisma în baza de date configurată         |
| `npm run db:migrate`   | Aplică migrațiile Prisma versionate                      |
| `npm run db:studio`    | Deschide interfața Prisma Studio                         |

`npm run db:push` rămâne disponibil pentru prototipare locală; folosește migrațiile versionate pentru instalări persistente.

## Structura proiectului

```text
src/
  app/                    Pagini Next.js, layout-uri și componente client
    _components/           Hartă, semnătură, navigare și componente UI
    airspace/              Pagina hărții
    learn/                 Ghidul și testul de exercițiu
    login/                 Autentificare reală
    profile/               Profilul pilotului și flota de drone
    request/               Planificare și generare documente
  lib/                    Geometrie, drone, contacte TWR și PDF
  server/
    api/                   Routere și proceduri tRPC
    db.ts                  Inițializarea clientului Prisma
  styles/                 Stilurile aplicației și temele
  trpc/                   Integrarea React/server pentru tRPC
prisma/
  schema.prisma           Schema PostgreSQL/Prisma
public/
  anexa1.pdf               Formularul PDF folosit ca șablon
  data/                    Setul ROMATSA inclus
  fonts/                   Font Noto Sans și licența lui
legacy/                    Prototipul static arhivat
```

## Date și confidențialitate

- Datele personale, semnătura și informațiile de zbor sunt păstrate în baza de date a instalării și asociate contului autentificat.
- Sesiunile sunt revocabile la deconectare și expiră după 30 de zile. Cookie-ul de sesiune este HttpOnly și SameSite=Lax.
- Nu există încă verificare email, flux de recuperare/resetare a parolei, limitare persistentă a încercărilor de autentificare sau administrare a retenției. Configurează aceste măsuri înainte de a folosi conturi cu date importante într-un serviciu public.
- Păstrează baza PostgreSQL și copiile de siguranță într-un spațiu cu acces controlat. Nu publica URL-ul de conexiune sau copii ale bazei.
- Documentele generate sunt descărcări locale; doar metadatele numelor/tipurilor documentelor sunt păstrate în baza de date.
- Semnătura desenată este o imagine inserată vizual în PDF; nu este semnătură digitală criptografică și nu verifică identitatea semnatarului.
- Configurează backup-uri, acces limitat și TLS la serverul PostgreSQL. Validează configurația de producție înainte de publicare.

## Limitări și verificări înainte de zbor

- Setul ROMATSA din `public/data/romatsa-uav-zones.json` este o copie locală, nu un serviciu live. Verifică actualitatea și instrucțiunile zonei pe sursele oficiale.
- Datele incluse nu descriu limite CTR oficiale. Identificarea TWR este o mapare a contactelor zonelor care intersectează poligonul; dacă rezultatul este absent sau ambiguu, aplicația nu ghicește turnul și blochează generarea Anexa 1. Confirmă întotdeauna CTR-ul și turnul competent pe hărți și documente oficiale.
- Interogarea intervalelor verifică planurile din baza de date partajată a instalării. Nu reflectă rezervări ale autorităților, NOTAM-uri sau disponibilitate reală.
- Datele de masă, modelele de drone, clasele și camerele prestabilite sunt ajutoare de configurare, nu specificații garantate. Verifică eticheta clasei și documentația aeronavei tale.
- Categoria A1/A2/A3 este o regulă simplificată pentru interfață. Eligibilitatea efectivă depinde de clasa și configurația aeronavei, condițiile operațiunii și reglementările în vigoare.
- Formularul PDF este o ciornă. Revizuiește toate câmpurile, unitățile, destinatarii și documentele înainte de transmiterea manuală. Aerio nu completează automat cerințe care nu sunt disponibile în profil sau în datele zonei.
- Linkurile de email deschid o ciornă în clientul de email al utilizatorului. Aerio nu trimite mesaje, nu rezervă spațiu aerian și nu verifică aprobări.
- Harta Esri/OSM depinde de servicii externe și de disponibilitatea conexiunii la internet.
- Informațiile din ghid și testul de exercițiu nu înlocuiesc legislația, instruirea, certificarea sau recomandările autorităților.

## Surse oficiale

- [Harta UAS ROMATSA](https://flightplan.romatsa.ro/init/drones)
- [MApN AEROFOTO](https://aerofoto.mapn.ro/)
- [Autoritatea Aeronautică Civilă Română (AACR)](https://www.caa.ro/)
- [EASA — Drone](https://www.easa.europa.eu/en/domains/civil-drones)
