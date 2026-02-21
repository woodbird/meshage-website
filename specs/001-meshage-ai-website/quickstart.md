# Quickstart: Meshage.ai Website

**Feature**: 001-meshage-ai-website  
**Branch**: `001-meshage-ai-website`

## Prerequisites

- Node.js 18+
- npm or pnpm

## Local development

From repository root:

```bash
# Install dependencies (after they are added)
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Edits to `src/` will hot-reload.

## Build and preview

```bash
npm run build
npm run start
```

Use this to verify production build before deploying.

## Deploy to Vercel

1. Push branch to origin and open the repo in Vercel (or link existing project).
2. Vercel will detect Next.js and use default build command (`next build`) and output.
3. Optional: Add environment variables for the waitlist/contact API (e.g. email recipient, API keys) in the Vercel project settings.
4. Deploy; production URL will be assigned (e.g. `meshage-website.vercel.app` or custom domain).

## Project layout (reference)

- `src/app/` — App Router pages and layout; optional `api/` for serverless routes.
- `src/components/` — Reusable UI and sections.
- `src/lib/` — Constants, copy, helpers.
- `public/` — Static assets (images, favicon).

## Key docs

- [Spec](./spec.md) — Requirements and scenarios.
- [Plan](./plan.md) — Technical context and structure.
- [Research](./research.md) — Technology decisions.
- [Data model](./data-model.md) — Lead/contact payload.
- [Contracts](./contracts/waitlist-api.md) — Optional form API contract.
