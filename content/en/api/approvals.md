---
title: Approvals API
description: List pending approvals, approve or reject agent action requests
lastUpdated: true
---

# Approvals API

When an AI agent performs a high-risk action (e.g. data change, deployment), Meshage’s human-in-the-loop flow creates an approval request. Users approve or reject via this API.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

---

## GET /approvals

List the current user’s approval requests.

**Request:**

```bash
curl "http://localhost:8000/api/v1/approvals?status=pending&limit=20" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `status` | string | No | `pending`, `approved`, `rejected`; default `pending` |
| `limit` | integer | No | Default 20 |
| `offset` | integer | No | Pagination |

**Success:** `200 OK`

```json
{
  "approvals": [
    {
      "id": "appr-550e8400-e29b-41d4-a716-446655440000",
      "agent": { "id": "agt-001", "name": "DB Admin Assistant" },
      "conversation_id": "conv-001",
      "action": "execute_sql",
      "description": "Agent requests: DELETE FROM temp_records WHERE created_at < '2026-01-01'",
      "context": { "sql": "...", "affected_rows_estimate": 1523 },
      "status": "pending",
      "created_at": "2026-03-01T10:00:00Z"
    }
  ],
  "total": 3,
  "has_more": true
}
```

| Field | Description |
|-------|-------------|
| `action` | Type of requested operation |
| `description` | Human-readable description |
| `context` | Operation-specific details |
| `status` | `pending` / `approved` / `rejected` |

---

## POST /approvals/:id/approve

Approve a request.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/approvals/appr-550e8400.../approve \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"comment": "Confirmed"}'
```

**Body (optional):** `comment` (string).

**Success:** `200 OK` — approval with status `approved`, `approved_by`, `comment`, `updated_at`. The platform notifies the agent to proceed.

**Errors:** `404`, `409` (already handled), `403`.

---

## POST /approvals/:id/reject

Reject a request.

**Body (optional):** `reason` (string).

**Success:** `200 OK` — status `rejected`, `rejected_by`, `reason`, `updated_at`. The agent is notified and should abort the operation.

---

## Flow

```
Agent requests high-risk action
       │
       ▼
Platform creates approval (status: pending)
       │
       ├── WebSocket: approval.pending to user
       ▼
User sees approval card in app
       │
       ├── Approve → POST /approve → agent continues
       └── Reject  → POST /reject  → agent aborts
```

See [WebSocket](/en/developer/websocket) for `approval.pending` events.
