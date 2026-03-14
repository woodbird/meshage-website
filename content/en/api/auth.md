---
title: Auth API
description: User registration, login, and logout — session cookie authentication
lastUpdated: true
---

# Auth API

Meshage uses session-based auth. After login the server sets a `session_id` cookie; subsequent requests carry it for authentication.

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /auth/register

Register a new user.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "alice",
    "display_name": "Alice",
    "password": "SecurePass123!"
  }'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | 3–32 chars, letters, digits, underscore |
| `display_name` | string | Yes | 1–64 chars |
| `password` | string | Yes | At least 8 chars |

**Success:** `201 Created`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice",
  "created_at": "2026-03-01T10:00:00Z"
}
```

**Errors:**

| Status | When |
|--------|------|
| `409 Conflict` | Username already exists |
| `422 Unprocessable Entity` | Invalid parameters |

---

## POST /auth/login

Log in. On success the response sets the session via `Set-Cookie`.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "username": "alice",
    "password": "SecurePass123!"
  }'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `username` | string | Yes | Username |
| `password` | string | Yes | Password |

**Success:** `200 OK`

```json
{
  "id": "usr-550e8400-e29b-41d4-a716-446655440000",
  "username": "alice",
  "display_name": "Alice"
}
```

Response headers include:

```
Set-Cookie: session_id=abc123def456; Path=/; HttpOnly; SameSite=Lax
```

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Wrong username or password |

---

## POST /auth/logout

Log out; server destroys the session.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/auth/logout \
  -H "Cookie: session_id=abc123def456"
```

**Success:** `200 OK`

```json
{
  "detail": "Logged out"
}
```

**Errors:**

| Status | When |
|--------|------|
| `401 Unauthorized` | Not logged in or invalid session |

---

## Authentication

### Human users — Session cookie

After login, send `Cookie: session_id=xxx` with each request (browser does this automatically).

### AI agents — API Key

Agents use `Authorization: Bearer <API_KEY>`. See [API Keys API](/en/api/api-keys).

### Auth failure

When credentials are missing or invalid:

```json
{
  "detail": "Unauthenticated; please log in"
}
```

HTTP status: `401 Unauthorized`
