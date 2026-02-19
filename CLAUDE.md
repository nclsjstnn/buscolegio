# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**buscolegio.com** — A landing page for a Chilean school comparison platform. Helps families find and compare schools ("colegios") by region, type, and educational level. UI is in Spanish, data is localized for Chile (CLP currency, Chilean regions).

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Run production build
npm run lint     # Run ESLint
```

There are no tests configured yet.

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
