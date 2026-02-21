# Research: Meshage.ai Official Website

**Feature**: 001-meshage-ai-website  
**Date**: 2025-02-21

## 1. Framework and deployment

**Decision**: Next.js 14+ (App Router) deployed on Vercel.

**Rationale**:
- User requirement: deploy on Vercel; Next.js is the standard choice for Vercel, with first-class static export and serverless support.
- App Router supports static generation (no server for initial scope), API routes if we add a form handler later, and good DX (components, layouts, metadata).
- Aligns with README mention of Next.js/React for the broader Meshage project.

**Alternatives considered**:
- **Remix / Astro**: Both can deploy to Vercel; Next.js chosen for ecosystem and team familiarity.
- **Plain React (Vite) + static host**: Would work but adds separate config for serverless if we need a form API; Next.js keeps one stack.

---

## 2. Form submission (primary CTA)

**Decision**: Prefer a single serverless API route (`/api/waitlist` or `/api/contact`) on Vercel that accepts POST, validates, and forwards to email or a simple store (e.g. Vercel KV / Airtable). If the team prefers zero backend, use a third-party form endpoint (e.g. Formspree, Basin) with client-side POST; no contract in repo for that option.

**Rationale**:
- Spec requires “clear success state” and optional capture of lead/contact; no requirement to run a persistent backend.
- Serverless keeps the “no application server” constraint while allowing full control and no external form vendor if desired.
- Third-party option keeps implementation minimal and avoids writing any backend contract.

**Alternatives considered**:
- **Formspree / similar**: Minimal code, no API contract in repo; acceptable if product prefers no custom backend.
- **Vercel serverless only**: One small route, one contract in `contracts/`, easy to wire to email or KV.

---

## 3. UI and design compliance

**Decision**: Implement and review UI against the [Vercel Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines) (accessibility, focus states, forms, typography, animation, safe areas, etc.). Use semantic HTML, visible focus, labeled controls, and `prefers-reduced-motion`; no anti-patterns (e.g. `outline: none` without replacement, missing `aria-label` on icon buttons).

**Rationale**:
- User requirement: “ui使用 web-design-guidelines 来进行设计”.
- Guidelines are concrete and testable; they support SC-002 (accessibility baseline) and FR-005.

**Alternatives considered**:
- WCAG only: Guidelines extend WCAG with framework-friendly, implementation-level rules (e.g. Tailwind focus classes, React patterns), so we use both: guidelines as primary checklist, WCAG as reference.

---

## 4. Styling and layout

**Decision**: Tailwind CSS for layout and components; utility-first supports responsive (FR-004) and focus/state classes (guidelines). Use CSS variables for theme (e.g. light/dark) if needed; `color-scheme` and safe-area handling per guidelines.

**Rationale**:
- Fits Next.js and Vercel defaults; fast iteration and small bundle when purged.
- Guidelines reference `focus-visible:ring-*`, `touch-action`, etc.; Tailwind covers these well.

**Alternatives considered**:
- CSS Modules / vanilla CSS: Viable but more boilerplate for responsive and state variants.
- Component library (e.g. shadcn/ui): Can be added later if we need richer primitives; not required for a focused marketing site.

---

## 5. Content and copy

**Decision**: Copy and structure come from product: hero tagline, value propositions, feature list (agent registry, A2UI, orchestration, human-in-the-loop, security). Use placeholder copy in code and replace with final content; single language for initial scope (structure allows future i18n).

**Rationale**:
- Spec Assumptions: “Product positioning and copy… are available or will be provided; the site presents this content in a structured way.”

**Alternatives considered**:
- CMS (Sanity, Contentful): Out of scope for MVP; can be added later if content changes frequently.
