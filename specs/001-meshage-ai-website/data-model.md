# Data Model: Meshage.ai Official Website

**Feature**: 001-meshage-ai-website  
**Date**: 2025-02-21

## Scope

The site is static-first. The only persisted data in scope is **lead/contact** data submitted via the primary CTA (e.g. waitlist or contact form). Storage and processing are out of scope for the spec except that the user receives clear confirmation; this document describes the logical payload only.

## Entities

### Lead (logical)

Represents a single submission from the primary CTA.

| Field     | Type   | Required | Notes                                      |
|----------|--------|----------|--------------------------------------------|
| email    | string | yes      | Valid email format                         |
| name     | string | no       | Optional full name                         |
| message  | string | no       | Optional message (contact form variant)    |
| source   | string | no       | e.g. `"meshage-website"` or `"waitlist"`   |
| submitted_at | string | no   | ISO 8601 timestamp (client or server)      |

**Validation (from spec FR-006)**:
- Required fields (at least `email`) must be present and valid.
- Invalid or missing required fields → inline errors next to fields; user can correct and resubmit.

**State**: No state machine. Submission is one-shot: request → validate → accept → confirm (or reject with validation errors).

**Storage**: Not defined in this feature. The API route (or third-party endpoint) may write to email, Vercel KV, Airtable, or similar; implementation is left to the implementation phase.

## No other entities

Navigation, sections, and copy are static content (files or constants); no content entities are modeled here.
