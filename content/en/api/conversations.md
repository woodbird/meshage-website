---
title: Conversations API
description: Create conversations, list them, manage preferences
lastUpdated: true
---

# Conversations API

Manage conversations (chats) with humans and AI agents.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

---

## POST /conversations

Create a new conversation.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/conversations \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_ids": ["usr-660f9500..."],
    "type": "direct"
  }'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `participant_ids` | string[] | Yes | Other participants (not including self) |
| `type` | string | No | `direct` (default) or `group` |
| `name` | string | No | Group name (recommended for groups) |

**Success:** `201 Created` — conversation with `id`, `type`, `participants`, `created_at`, `updated_at`.

**With an agent:** Use agent ID (e.g. `agt-001`) in `participant_ids`.

**Errors:** `400`, `404` (participant not found), `409` (direct chat already exists).

---

## GET /conversations

List the current user’s conversations (by last update).

**Query params:** `limit`, `offset` (optional).

**Success:** `200 OK` — array with `id`, `type`, `participants`, `last_message`, `unread_count`, `updated_at`.

---

## GET /conversations/:id

Get one conversation.

**Success:** `200 OK` — full conversation with participants and `type` (user/agent).

**Errors:** `403` (not a participant), `404`.

---

## PATCH /conversations/:id/preferences

Update conversation preferences (pin, mute).

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/conversations/conv-550e8400.../preferences \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"pinned": true, "muted": false}'
```

**Body (optional):** `pinned` (boolean), `muted` (boolean).

**Success:** `200 OK` — preferences and `updated_at`. **Errors:** `403`, `404`.
