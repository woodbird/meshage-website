---
title: Contacts API
description: Add contacts, list contacts, handle contact requests
lastUpdated: true
---

# Contacts API

Manage contact relationships: add, remove, and handle contact requests.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

## POST /contacts/by-id

Send a contact request by user ID.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/contacts/by-id \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "usr-660f9500-xxxx",
    "message": "Hi, I am Alice"
  }'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `user_id` | string | Yes | Target user ID |
| `message` | string | No | Optional note |

**Success:** `201 Created`

```json
{
  "request_id": "creq-001",
  "from_user_id": "usr-550e8400...",
  "to_user_id": "usr-660f9500...",
  "status": "pending",
  "message": "Hi, I am Alice",
  "created_at": "2026-03-01T10:00:00Z"
}
```

**Errors:**

| Status | When |
|--------|------|
| `404 Not Found` | User not found |
| `409 Conflict` | Already contacts or request already sent |

## GET /contacts

List the current user’s contacts.

**Request:**

```bash
curl "http://localhost:8000/api/v1/contacts?limit=20&offset=0" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Query params:** `limit`, `offset` (optional).

**Success:** `200 OK` — array of contacts with nested `user` (id, username, display_name, avatar_url) and `created_at`.

## DELETE /contacts/:id {#delete-contact}

Remove a contact.

**Request:**

```bash
curl -X DELETE http://localhost:8000/api/v1/contacts/contact-001 \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Success:** `204 No Content`  
**Errors:** `404 Not Found` if contact doesn’t exist.

---

## GET /contacts/resolve

Resolve user by username (e.g. before adding).

**Request:**

```bash
curl "http://localhost:8000/api/v1/contacts/resolve?username=bob" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Query params:** `username` (required).

**Success:** `200 OK` — user object. **Errors:** `404 Not Found`.

## POST /contacts/requests {#post-contacts-requests}

Send a contact request (generic).

**Request:** Body: `to_user_id`, optional `message`. **Success:** `201 Created` with `request_id`, `status`, `created_at`.

## GET /contacts/requests {#get-contacts-requests}

List incoming contact requests.

**Success:** `200 OK` — array of requests with `from_user`, `message`, `status`, `created_at`.

## PATCH /contacts/requests/:id {#patch-contact-request}

Accept or reject a request.

**Request:**

```bash
curl -X PATCH http://localhost:8000/api/v1/contacts/requests/creq-003 \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"action": "accept"}'
```

**Body:** `action` — `accept` or `reject`.

**Success:** `200 OK`. **Errors:** `404`, `409` if already handled.
