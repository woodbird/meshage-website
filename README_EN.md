# **Mesh**age

**Next Gen IM with A2A&A2UI**

**Mesh**age is a next-generation messaging and collaboration platform: native **A2A (Agent-to-Agent)** and **A2UI (Agent-to-User Interface)** support turn IM from a chat tool into a **multi-agent operating system**.

This repository hosts the source for [meshage.ai](https://meshage.ai) — the marketing site and documentation center, built with Next.js 14 + Nextra 4.

## Layout

| Path | Purpose |
| --- | --- |
| `src/app/` | App Router pages: home, `/docs/[lang]/...`, `/api/waitlist` route |
| `src/components/` | Hero / Features / CTA, header/footer, doc feedback, language switcher |
| `src/lib/` | Site copy and constants |
| `content/zh/`, `content/en/` | **Canonical docs source** (MDX/MD) rendered by Nextra. `_meta.js` controls sidebar order. |
| `public/` | Static assets and the `_pagefind` search index produced at build |
| `specs/001-meshage-ai-website/` | Spec, plan, tasks and waitlist API contract |

> The single source of truth for documentation is `content/`. The legacy `docs/` folder (a VitePress remnant) has been removed; do not recreate it.

## Local development

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. `/docs` redirects to `/docs/zh`; English lives at `/docs/en`.

## Build

```bash
npm run build        # next build; postbuild emits the pagefind search index
npm run start        # preview production build locally
```

## Waitlist API

`POST /api/waitlist` validates the payload then writes a JSONL line and (optionally) forwards to a webhook.

| Env var | Purpose |
| --- | --- |
| `MESHAGE_WAITLIST_FILE` | Absolute file path (takes priority) |
| `MESHAGE_WAITLIST_DIR` | Directory; file is named `waitlist.jsonl` |
| `MESHAGE_WAITLIST_WEBHOOK` | Optional HTTPS endpoint (Slack, Resend, etc.) |

Defaults: dev writes `./.data/waitlist.jsonl` (gitignored); production writes `/tmp/meshage-waitlist.jsonl`. Pair with a webhook in production so leads are not lost when the runtime is recycled.

Anti-abuse: 5 submissions per IP per minute, 4 KB max body.

## Deploy to Vercel

1. Import the repo, framework auto-detects Next.js.
2. Keep the default build command `next build`.
3. Add env vars under **Project Settings → Environment Variables**:
   - `MESHAGE_WAITLIST_WEBHOOK` to forward submissions externally.
   - `NEXT_PUBLIC_API_BASE` for the docs feedback widget (MeshChat backend).
4. Bind your domain (`meshage.ai`).

## Docs maintenance

- Edit MD/MDX under `content/zh` and `content/en`; update the matching `_meta.js`.
- API reference under `content/<lang>/api/` is generated from the MeshChat backend's OpenAPI:
  ```bash
  python scripts/generate-api-docs.py --url http://localhost:8000 --out-dir ../meshage-website/content
  ```
- The doc feedback button (`DocFeedback`) calls `POST /api/v1/docs/feedback` on the MeshChat backend; configure `NEXT_PUBLIC_API_BASE` accordingly.

## Learn more

- Site: <https://meshage.ai>
- Docs: visit `/docs/zh` or `/docs/en`
- Waitlist & updates: form on the homepage
