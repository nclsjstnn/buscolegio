# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**[buscolegio.com](https://buscolegio.com)** — Open source Chilean school directory. Helps families find and compare schools ("colegios") by region, type, and educational level. 16,768 schools from official Mineduc 2025 data. UI is in Spanish, data is localized for Chile (CLP currency, Chilean regions).

GitHub: https://github.com/nclsjstnn/buscolegio

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
npx tsc --noEmit # Type-check without building
```

There are no tests configured yet.

## Importing school data

After starting the dev server, run once to populate MongoDB:

```bash
curl -X POST http://localhost:3000/api/import \
  -H "x-import-secret: dev-secret"
# Returns: { "imported": 16768, "errors": [] }
```

---

## Architecture

This is a **Next.js 16 App Router** project with **React 19**, **TypeScript** (strict mode), and **Tailwind CSS v4**.

```
src/
├── app/
│   ├── layout.tsx      # Root layout — Geist fonts, page metadata
│   ├── page.tsx        # Home page — client component with search/filter UI
│   └── globals.css     # Global styles — Tailwind import + CSS variables
├── components/
│   └── ColegioCard.tsx # Card component for displaying a single school
└── data/
    └── colegios.ts     # TypeScript types + static array of 20 sample schools
```

- Path alias `@/*` maps to `./src/*`.
- Styling uses Tailwind v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`). No `tailwind.config` file — Tailwind v4 is configured via CSS.
- ESLint uses `eslint-config-next` with Core Web Vitals and TypeScript rules (`eslint.config.mjs`).

## Key Details

### Data (`src/data/colegios.ts`)
- Exports `Colegio` interface and union types `TipoColegio`, `NivelColegio`.
- 20 hardcoded sample schools across 3 Chilean regions: Metropolitana, Valparaíso, Biobío.
- School fields: `id`, `nombre`, `tipo`, `nivel`, `region`, `comuna`, `direccion`, `rating`, `mensualidad`, `alumnos`.
- `tipo` values: `"Municipal"` | `"Subvencionado"` | `"Particular"`
- `nivel` values: `"Básica"` | `"Media"` | `"Básica y Media"` | `"Preescolar"`

### Page (`src/app/page.tsx`)
- `'use client'` component using `useState` + `useMemo` for client-side filtering.
- Filters: free-text search (name/commune), region dropdown, tipo dropdown, nivel dropdown.
- Special rule: schools with `nivel === "Básica y Media"` match any nivel filter.
- Color scheme: blue gradient hero (`blue-800` → `blue-900`), white cards.

### ColegioCard (`src/components/ColegioCard.tsx`)
- Accent bar color by tipo: blue (Municipal), emerald (Subvencionado), violet (Particular).
- Displays: type/level badges, 5-star rating, location, student count, monthly tuition (CLP or "Gratuito").
- Helper: `formatPesos()` formats numbers as Chilean peso currency.
- `src/app/` — App Router directory. `layout.tsx` is the root layout (sets up Geist fonts); `page.tsx` is the root (home) page.
- Path alias `@/*` maps to `./src/*`.
- Styling uses Tailwind v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`). No `tailwind.config` file — Tailwind v4 is configured via CSS.
- ESLint uses `eslint-config-next` with Core Web Vitals and TypeScript rules (`eslint.config.mjs`).
- **MongoDB** via Mongoose — connection singleton at `src/lib/mongodb.ts`. URI in `.env.local`.

---

## Key directories and files

```
src/
├── app/
│   ├── page.tsx                        # Home page — search + paginated results (client component)
│   ├── layout.tsx                      # Root layout (Geist font)
│   ├── globals.css                     # Global styles
│   ├── colegios/
│   │   └── [rbd]/page.tsx              # School detail page (server component)
│   ├── sobre-nosotros/
│   │   └── page.tsx                    # Static "About" page — project origin & vibe coding story
│   └── api/
│       ├── import/route.ts             # POST — streams CSV → bulk-upserts into MongoDB
│       ├── colegios/route.ts           # GET  — paginated school list with filters
│       └── colegios/[rbd]/route.ts     # GET  — single school by RBD
├── components/
│   ├── ColegioCard.tsx                 # School card used in home page grid
│   ├── MapComponent.tsx                # react-leaflet map (client, ssr:false)
│   ├── MapWrapper.tsx                  # 'use client' wrapper for MapComponent (required by Next 16)
│   ├── ReviewsSection.tsx              # Client component — localStorage-backed school reviews
│   └── SiteFooter.tsx                  # Shared footer (logo, "Sobre nosotros" link, credits)
├── lib/
│   ├── mongodb.ts                      # Mongoose connection singleton (cached in global)
│   └── codigos.ts                      # Lookup maps for all Chilean Mineduc codes
├── models/
│   └── Establecimiento.ts              # Mongoose model — schools collection
└── data/
    └── colegios.ts                     # Legacy hardcoded data (no longer used by UI)

Directorio-Oficial-EE-2025/
└── 20250926_Directorio_Oficial_EE_2025_20250430_WEB.csv   # Source CSV (16,768 schools)
```

---

## Data model — `Establecimiento`

Fields stored in MongoDB after CSV import:

| Field | Type | Source column |
|---|---|---|
| `rbd` | Number (unique) | `RBD` |
| `nombre` | String | `NOM_RBD` |
| `agno` | Number | `AGNO` |
| `dependenciaCodigo` | Number | `COD_DEPE` |
| `dependencia` | String | decoded via `DEPENDENCIA` map |
| `dependencia2Codigo` | Number | `COD_DEPE2` |
| `dependencia2` | String | decoded via `DEPENDENCIA2` map |
| `regionCodigo` | Number | `COD_REG_RBD` |
| `region` | String | decoded via `REGION` map |
| `provinciaCodigo` | Number | `COD_PRO_RBD` |
| `comunaCodigo` | Number | `COD_COM_RBD` |
| `comuna` | String | `NOM_COM_RBD` |
| `deprovCodigo` | Number | `COD_DEPROV_RBD` |
| `deprov` | String | `NOM_DEPROV_RBD` |
| `rural` | Boolean | `RURAL_RBD` === '1' |
| `latitud` / `longitud` | Number | `LATITUD`/`LONGITUD` (comma→dot) |
| `convenio_pie` | Boolean | `CONVENIO_PIE` === '1' |
| `pace` | Boolean | `PACE` === '1' |
| `nivelesEnsenianza` | String[] | `ENS_01..11` decoded via `ENSEÑANZA` map |
| `mat_parvulario` .. `mat_mediaTPAdultos` | Number | `MAT_ENS_1..8` |
| `mat_total` | Number | `MAT_TOTAL` |
| `tieneMatricula` | Boolean | `MATRICULA` === '1' |
| `estadoCodigo` | Number | `ESTADO_ESTAB` |
| `estado` | String | decoded via `ESTADO` map |
| `orientacionReligiosaCodigo` | Number | `ORI_RELIGIOSA` |
| `orientacionReligiosa` | String | decoded via `ORIENTACION_RELIGIOSA` map |
| `orientacionReligiosaGlosa` | String | `ORI_OTRO_GLOSA` |
| `pagoMatricula` | String | `PAGO_MATRICULA` |
| `pagoMensual` | String | `PAGO_MENSUAL` |
| `especialidades` | String[] | `ESPE_01..11` decoded via `ESPECIALIDAD` map |

MongoDB indexes: `nombre`+`comuna` text, `regionCodigo`, `dependencia2Codigo`, `estadoCodigo`.

---

## API routes

### `GET /api/colegios`

Query params:
- `q` — text search on nombre/comuna (regex, case-insensitive)
- `region` — filter by `regionCodigo` (1–16)
- `tipo` — filter by `dependencia2Codigo` (1–5)
- `page` — page number (default 1)
- `limit` — results per page (default 20, max 50)

Always filters `estadoCodigo: 1` (Funcionando). Returns `{ total, page, limit, colegios[] }`.

### `GET /api/colegios/[rbd]`

Returns full school document by RBD number.

### `POST /api/import`

Requires header `x-import-secret: <IMPORT_SECRET>`. Reads CSV from disk, batch-upserts into MongoDB. Returns `{ imported, errors }`.

---

## Environment variables (`.env.local`)

```
MONGODB_URI=mongodb+srv://...   # MongoDB Atlas or local connection string
IMPORT_SECRET=dev-secret        # Protects the import endpoint
GOOGLE_PLACES_API_KEY=AIza...   # Google Places API key (optional — enriches school detail pages on first visit)
```

---

## Known gotchas

- **`dynamic(..., { ssr: false })` is not allowed in Server Components in Next.js 16.** The workaround is `MapWrapper.tsx` — a `'use client'` component that does the dynamic import, imported by the server page.
- **`FilterQuery` is not a named export of `mongoose`** — use `Record<string, unknown>` for filter objects.
- **Leaflet's default icon URLs break with Webpack** — use CDN URLs (`unpkg.com/leaflet@1.9.4/dist/images/...`) directly in `MapComponent.tsx`.
- **CSV uses comma as decimal separator** for lat/lng — convert with `.replace(',', '.')` before `parseFloat`.
- **CSV has a BOM** — use `{ bom: true }` in `csv-parse` options.
