---
title: Users API
description: Get and update user info, search users
lastUpdated: true
---

# Users API

Manage the current user’s profile and search for other users.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

---

## GET /users/me

Get the current user’s profile.

**Request:**

```bash
curl http://localhost:8000/api/v1/users/me \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Success:** `200 OK`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice",
  "avatar_url": "https://example.com/avatar.png",
  "bio": "Meshage user",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T12:00:00Z"
}
```

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Not logged in |

---

## PATCH /users/me

Update the current user’s profile. Send only fields you want to change.

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/users/me \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "display_name": "Alice W.",
    "bio": "Meshage developer",
    "avatar_url": "https://example.com/new-avatar.png"
  }'
```

**Body (all optional):**

| Field | Type | Description |
|-------|------|-------------|
| `display_name` | string | 1–64 chars |
| `bio` | string | Max 200 chars |
| `avatar_url` | string | Avatar URL |

**Success:** `200 OK` — returns updated user object.

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Not logged in |
| `422 Unprocessable Entity` | Invalid parameters |

---

## GET /users/search

Search users by keyword.

**Request:**

```bash
curl "http://localhost:8000/api/v1/users/search?q=alice&limit=10" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `q` | string | Yes | Keyword (username or display name) |
| `limit` | integer | No | Default 20, max 50 |
| `offset` | integer | No | Pagination offset, default 0 |

**Success:** `200 OK` — array of user objects (id, username, display_name, avatar_url).

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Not logged in |
| `422 Unprocessable Entity` | Missing `q` |
