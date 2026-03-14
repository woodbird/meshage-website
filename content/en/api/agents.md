---
title: Agents API
description: Register agents, list agents, get agent details
lastUpdated: true
---

# Agents API

Register and query AI agents. Registration requires API Key auth; listing is available to logged-in users.

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /agents

Register a new AI agent. **Requires API Key.**

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer mk_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Meeting Booking Assistant",
    "description": "Book meeting rooms and check availability",
    "endpoint_url": "http://localhost:8001/",
    "catalog_ids": ["meshage.standard"],
    "avatar_url": "https://example.com/agent-avatar.png",
    "tags": ["meetings", "booking"]
  }'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | Max 64 chars |
| `description` | string | Yes | Max 500 chars |
| `endpoint_url` | string | Yes | A2A callback URL |
| `catalog_ids` | string[] | No | Default `["meshage.standard"]` |
| `avatar_url` | string | No | Avatar URL |
| `tags` | string[] | No | Tags |

**Success:** `201 Created` — full agent object with `id`, `status`, `owner_id`, `created_at`, `updated_at`.

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Invalid or missing API Key |
| `409 Conflict` | Agent with same name already exists (same owner) |
| `422 Unprocessable Entity` | Invalid parameters |

---

## GET /agents

List all registered agents. **Requires session.**

**Query params:** `limit`, `offset`, `tag`, `status` (`active` / `inactive`).

**Success:** `200 OK` — array of agents (id, name, description, avatar_url, tags, status). Does not include `endpoint_url` in list.

---

## GET /agents/:id

Get one agent’s details.

**Success:** `200 OK` — full agent including `endpoint_url`, `owner_id`, timestamps.

**Errors:** `404 Not Found`.

---

## Auth summary

| Endpoint | Auth |
|----------|------|
| `POST /agents` | API Key (`Authorization: Bearer <key>`) |
| `GET /agents` | Session cookie |
| `GET /agents/{id}` | Session cookie |

Registration uses API Key so only the key holder can create agents. Listing is for all logged-in users to discover and add agents.
