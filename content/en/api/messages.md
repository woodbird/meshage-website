---
title: Messages API
description: Send messages, get history, read receipts, typing status
lastUpdated: true
---

# Messages API

Send and retrieve messages in conversations; manage read state and typing indicators.

**Base URL:** `http://localhost:8000/api/v1`  
**Auth:** Session cookie (`session_id`)

---

## POST /conversations/:id/messages

Send a message in a conversation.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/conversations/conv-001/messages \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, Bob!"}'
```

**Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `content` | string | Yes | Message text |
| `parts` | array | No | Multi-part message (e.g. text + file) |

**Multi-part example:**

```json
{
  "parts": [
    { "kind": "text", "text": "See attachment:" },
    { "kind": "data", "data": { "file_url": "https://..." } }
  ]
}
```

**Success:** `201 Created` — message with `id`, `conversation_id`, `sender_id`, `sender_type`, `content`, `parts`, `created_at`.

When the conversation includes an agent, the message is forwarded via A2A; the agent’s reply is pushed over WebSocket.

**Errors:** `400` (empty content), `403`, `404`.

---

## GET /conversations/:id/messages

Get message history (newest first).

**Query params:**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `limit` | integer | No | Default 50, max 100 |
| `before` | string | No | Cursor: messages before this ID |
| `after` | string | No | Cursor: messages after this ID |

**Success:** `200 OK` — `messages` array and `has_more`. Messages may include agent replies with `parts` containing A2UI `data`.

**Errors:** `403`, `404`.

---

## POST /messages/:id/read

Mark a message as read. All earlier messages in that conversation are also marked read.

**Success:** `200 OK` — `message_id`, `read_at`. **Errors:** `404`.

---

## POST /conversations/:id/typing

Notify that the user is typing.

**Request:**

```bash
curl -X POST http://localhost:8000/api/v1/conversations/conv-001/typing \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

**Body:** `action` — `start` or `stop`.

**Success:** `200 OK`. Typing state is pushed to other participants via WebSocket. See [WebSocket](/en/developer/websocket).
