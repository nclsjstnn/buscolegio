# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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

- `src/app/` — App Router directory. `layout.tsx` is the root layout (sets up Geist fonts); `page.tsx` is the root page.
- Path alias `@/*` maps to `./src/*`.
- Styling uses Tailwind v4 via `@tailwindcss/postcss` (configured in `postcss.config.mjs`). No `tailwind.config` file — Tailwind v4 is configured via CSS.
- ESLint uses `eslint-config-next` with Core Web Vitals and TypeScript rules (`eslint.config.mjs`).
