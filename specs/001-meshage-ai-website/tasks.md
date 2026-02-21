# Tasks: Meshage.ai Official Website

**Input**: Design documents from `/specs/001-meshage-ai-website/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Not requested in the feature specification; no test tasks included.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- Next.js App Router: `src/app/`, `src/components/`, `src/lib/` at repository root
- Static assets: `public/`
- See plan.md for full structure

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per plan: `src/app/`, `src/components/layout/`, `src/components/sections/`, `src/components/ui/`, `src/lib/`, `public/images/`, `tests/e2e/`, `tests/unit/`
- [x] T002 Initialize Next.js 14+ (App Router) with TypeScript and React 18 in repository root; add Tailwind CSS per research.md
- [x] T003 [P] Configure ESLint and Prettier (or Next.js defaults) for `src/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core layout and styles that all user stories build on. Must complete before any story work.

- [x] T004 Implement root layout in `src/app/layout.tsx`: semantic structure (`<main>`, lang, viewport), skip link to main content, document structure per Web Interface Guidelines
- [x] T005 Add global styles in `src/app/globals.css`: Tailwind base, focus-visible baseline, `prefers-reduced-motion` support, no `outline: none` without replacement
- [x] T006 [P] Add copy constants and placeholders in `src/lib/constants.ts`: product name (Meshage), tagline, value propositions, feature list (agent registry, A2UI, orchestration, human-in-the-loop, security) for consumption by sections

**Checkpoint**: Foundation ready — user story implementation can begin

---

## Phase 3: User Story 1 – Understand What Meshage Is (Priority: P1) — MVP

**Goal**: Visitor sees product name, tagline, and at least one value proposition above the fold; can distinguish Meshage from “just another chat app.”

**Independent Test**: Open homepage; confirm hero and first section show Meshage, tagline, and one concrete value proposition; no login/form required.

### Implementation for User Story 1

- [x] T007 [P] [US1] Implement Hero section in `src/components/sections/Hero.tsx`: product name, tagline, one value proposition; semantic headings; consume copy from `src/lib/constants.ts`
- [x] T008 [US1] Compose homepage in `src/app/page.tsx`: render Hero and one value-proposition section below fold so content is clear without scrolling far
- [x] T009 [US1] Reserve space for hero imagery in `src/components/sections/Hero.tsx` (explicit width/height or aspect-ratio) to avoid CLS per FR-007

**Checkpoint**: User Story 1 is independently testable; MVP deliverable

---

## Phase 4: User Story 2 – Find Key Information (Priority: P2)

**Goal**: Visitor can find product capabilities (features) and a visible path to get in touch or join (CTA) via navigation or scroll.

**Independent Test**: Use nav or scroll to reach a dedicated features area and at least one visible CTA (e.g. “Join waitlist” or “Contact”) without deep scrolling on typical viewports.

### Implementation for User Story 2

- [x] T010 [P] [US2] Implement Header in `src/components/layout/Header.tsx`: site title/logo, navigation links to #features and #cta (or section ids); semantic `<header>`, `<nav>`; accessible label for nav
- [x] T011 [P] [US2] Implement Features section in `src/components/sections/Features.tsx`: core capabilities (agent registry, A2UI messages, human-in-the-loop, security) using copy from `src/lib/constants.ts`; semantic headings and list/structure
- [x] T012 [US2] Add Features section and CtaSection placeholder to `src/app/page.tsx`; ensure sections have ids (e.g. `id="features"`, `id="cta"`) for anchor navigation
- [x] T013 [P] [US2] Implement Footer in `src/components/layout/Footer.tsx`: minimal footer (e.g. copyright, optional links)
- [x] T014 [US2] Implement CtaSection in `src/components/sections/CtaSection.tsx`: visible CTA (button or link) that scrolls to or reveals the waitlist form area; clear label (e.g. “Join waitlist” or “Get in touch”)

**Checkpoint**: User Stories 1 and 2 are independently testable

---

## Phase 5: User Story 3 – Use the Site Comfortably on Any Device (Priority: P2)

**Goal**: Content reflows on mobile/desktop; no horizontal scroll for body; primary navigation usable; keyboard and assistive-tech friendly per Web Interface Guidelines.

**Independent Test**: Resize to mobile and desktop widths; confirm readable content, usable nav (e.g. mobile menu); tab through interactive elements with visible focus and logical order.

### Implementation for User Story 3

- [x] T015 [US3] Make layout responsive in `src/components/layout/Header.tsx` and section components: breakpoints so nav is usable on small viewports (e.g. collapse to menu); sections stack; no horizontal scroll (e.g. `overflow-x-hidden` on container, `min-w-0` on flex children where text truncates)
- [x] T016 [US3] Apply focus and a11y: visible focus (`focus-visible:ring-*` or equivalent) on all interactive elements in `src/components/`; ensure skip link in `src/app/layout.tsx` works; add `aria-label` to icon-only buttons; semantic HTML throughout
- [x] T017 [US3] Add touch and safe-area handling per guidelines: `touch-action: manipulation` where appropriate; `overscroll-behavior: contain` in modals/sheets if any; intentional `-webkit-tap-highlight-color` in `src/app/globals.css`

**Checkpoint**: Site is usable on common mobile and desktop viewports with keyboard/AT

---

## Phase 6: User Story 4 – Take a Primary Action (Priority: P3)

**Goal**: Visitor can submit the primary CTA (e.g. waitlist/contact); sees validation errors inline and a clear success state on success.

**Independent Test**: Submit valid data → success message; submit invalid/missing required fields → errors next to fields; correct and resubmit.

### Implementation for User Story 4

- [x] T018 [P] [US4] Implement WaitlistForm in `src/components/ui/WaitlistForm.tsx`: fields per data-model (email required; name, message optional); `<label>` or `aria-label` for each control; `autocomplete`, `name`, correct `type`/`inputmode`; no paste blocking; submit disabled until request starts, then loading state
- [x] T019 [US4] Integrate WaitlistForm into `src/components/sections/CtaSection.tsx`: form is the primary CTA content or revealed by CTA; wire submit to `POST /api/waitlist` or third-party endpoint
- [x] T020 [US4] Implement optional serverless handler in `src/app/api/waitlist/route.ts`: accept POST JSON (email, name, message); validate; return 200 with body or 400 with `{ "errors": { "field": "message" } }` per `specs/001-meshage-ai-website/contracts/waitlist-api.md`; do not expose internal errors
- [x] T021 [US4] Add client-side validation and UI in `src/components/ui/WaitlistForm.tsx`: inline errors next to fields on submit; focus first error when validation fails; show clear success state (e.g. thank-you message) after successful submit; handle 429/5xx with generic retry message

**Checkpoint**: Primary conversion path is complete with validation and success feedback

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Performance, assets, and final checks across the site.

- [x] T022 [P] Add critical images with explicit width/height (or aspect-ratio) in `src/components/` and `public/images/`; use `loading="lazy"` for below-fold images and priority/fetchpriority for above-fold hero if applicable
- [x] T023 [P] Validate quickstart: run `npm run build` and `npm run dev` per `specs/001-meshage-ai-website/quickstart.md`; fix any failures
- [x] T024 Set metadata and favicon in `src/app/layout.tsx` (title, description, open graph) and `public/` for LCP and SEO
- [x] T025 Final pass: typography (curly quotes, `…` not `...`), loading copy (e.g. “Submitting…”), and any remaining Web Interface Guidelines items in `src/`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start first
- **Phase 2 (Foundational)**: Depends on Phase 1 — blocks all user stories
- **Phase 3 (US1)**: Depends on Phase 2 — MVP
- **Phase 4 (US2)**: Depends on Phase 2 — can follow US1 or run after Foundational
- **Phase 5 (US3)**: Depends on Phases 3–4 (applies to existing components)
- **Phase 6 (US4)**: Depends on Phase 4 (CtaSection exists to host form)
- **Phase 7 (Polish)**: Depends on completion of desired user stories

### User Story Dependencies

- **US1 (P1)**: After Foundational only — no other story dependency
- **US2 (P2)**: After Foundational only — no other story dependency
- **US3 (P2)**: Applies to US1/US2 deliverables (layout, Header, sections)
- **US4 (P3)**: Builds on US2 (CtaSection); optional API builds on Setup

### Within Each User Story

- US1: T007 [P] then T008, T009 (Hero before page composition, then CLS fix)
- US2: T010, T011, T013 [P] in any order; T012 after T011; T014 after CtaSection placeholder
- US3: T015–T017 can be done in order (layout → focus → touch)
- US4: T018 [P] then T019; T020 optional and parallel to T019 client wiring; T021 with T018/T019

### Parallel Opportunities

- Phase 1: T003 [P] with T001/T002 done
- Phase 2: T006 [P] with T004/T005
- Phase 3: T007 [P] (Hero) can start as soon as Foundational is done
- Phase 4: T010, T011, T013 [P] (Header, Features, Footer) in parallel
- Phase 6: T018 [P] (WaitlistForm) and T020 (API route) can progress in parallel
- Phase 7: T022, T023 [P] in parallel

---

## Parallel Example: User Story 2

```text
# After Phase 2 complete, run in parallel:
T010: Implement Header in src/components/layout/Header.tsx
T011: Implement Features section in src/components/sections/Features.tsx
T013: Implement Footer in src/components/layout/Footer.tsx

# Then:
T012: Add Features and CtaSection to page; add section ids
T014: Implement CtaSection in src/components/sections/CtaSection.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup  
2. Complete Phase 2: Foundational  
3. Complete Phase 3: User Story 1  
4. **STOP and VALIDATE**: Open homepage; confirm product name, tagline, value proposition above the fold  
5. Deploy or demo if ready  

### Incremental Delivery

1. Setup + Foundational → foundation ready  
2. Add US1 → validate independently → deploy (MVP)  
3. Add US2 → validate nav + features + CTA visibility → deploy  
4. Add US3 → validate responsive + a11y → deploy  
5. Add US4 → validate form submit + success/validation → deploy  
6. Polish → performance and quickstart check  

### Parallel Team Strategy

- After Phase 2: One developer can own US1 (Hero, page), another US2 (Header, Features, Footer, CtaSection). US3 can be done by either once layout exists. US4 can start once CtaSection exists (form + optional API).

---

## Notes

- [P] = different files, no dependency on other tasks in same phase  
- [USn] = task belongs to that user story for traceability  
- No test tasks: spec did not request TDD or explicit test tasks  
- Every task includes a file path or explicit scope  
- Commit after each task or logical group; stop at any checkpoint to validate that story independently  
