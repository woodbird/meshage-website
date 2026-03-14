---
title: API Keys API
description: Create, list, and delete API keys
lastUpdated: true
---

# API Keys API

Manage API keys used for agent authentication. All endpoints require session cookie (you must be logged in).

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

---

## POST /api-keys

Create a new API key.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"name": "production-key"}'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | Yes | 1–64 chars, for identification |

**Success:** `201 Created`

```json
{
  "id": "key-550e8400-e29b-41d4-a716-446655440000",
  "name": "production-key",
  "key": "mk_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "created_at": "2026-03-01T10:00:00Z"
}
```

:::warning Important
The `key` (full secret) is **returned only once** at creation. Copy and store it securely; later list calls return only a prefix.
:::

**Errors:** `401`, `422` (invalid name).

---

## GET /api-keys

List the current user’s API keys.

**Success:** `200 OK` — array of `id`, `name`, `key_prefix`, `created_at`. No full key is returned.

---

## DELETE /api-keys/:id

Delete an API key.

**Success:** `204 No Content`.

**Errors:** `401`, `404` (key not found or not owned by user).

:::warning
After deletion, any agents registered with that key can no longer authenticate. Migrate to a new key before deleting.
:::

---

## Using API keys

Use the key when registering agents:

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer mk_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent", "endpoint_url": "http://localhost:8001/"}'
```

See [Agents API](/en/api/agents) and [Developer — API Keys](/en/developer/api-keys).
