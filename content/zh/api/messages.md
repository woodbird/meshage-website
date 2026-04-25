---
title: 消息 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 消息 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/conversations/{conversation_id}/messages

List Messages

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `limit` | query | integer | 否 |  |
| `before` | query | string | 否 |  |

**200 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/conversations/{conversation_id}/messages

Send Message

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

**请求体：**

```json
{
  "body_text": {},
  "body_blueprint": {},
  "a2ui_display_text": {},
  "attachment_ids": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `body_text` | object | 否 | Body Text |
| `body_blueprint` | object | 否 | Body Blueprint |
| `a2ui_display_text` | object | 否 | A2Ui Display Text |
| `attachment_ids` | object | 否 | Attachment Ids |

**201 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/conversations/{conversation_id}/user-action

Post User Action

Submit A2UI userAction (ClientEvent) for delivery to agent. Queued if agent offline.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

**请求体：**

```json
{
  "agent_id": "Agent Id",
  "payload": {},
  "message_id": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `agent_id` | string | 是 | Agent Id |
| `payload` | object | 是 | Payload |
| `message_id` | object | 否 | Message Id |

**202 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/conversations/{conversation_id}/messages/{message_id}/read

Mark Read

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `message_id` | path | string | 是 |  |

**204 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/conversations/{conversation_id}/typing

Send Typing

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

**请求体：**

```json
{
  "active": true
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `active` | boolean | 否 | Active |

**204 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---

## POST /api/v1/upload

Upload File

**请求体：**

```json
{}
```

**201 Successful Response**

**422 Validation Error**

```json
{
  "detail": [
    {
      "loc": [
        {}
      ],
      "msg": "Message",
      "type": "Error Type"
    }
  ]
}
```

---
