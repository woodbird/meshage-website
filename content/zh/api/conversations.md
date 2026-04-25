---
title: 对话 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 对话 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/conversations

List Conversations

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
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

## POST /api/v1/conversations

Create Conversation

**请求体：**

```json
{
  "type": "Type",
  "participant_agent_ids": {},
  "participant_user_ids": {},
  "title": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `type` | string | 是 | Type |
| `participant_agent_ids` | object | 否 | Participant Agent Ids |
| `participant_user_ids` | object | 否 | Participant User Ids |
| `title` | object | 否 | Title |

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

## DELETE /api/v1/conversations/{conversation_id}

Delete Conversation

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

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

## POST /api/v1/conversations/{conversation_id}/clear

Clear Conversation

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

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

## PATCH /api/v1/conversations/{conversation_id}/preferences

Update Conversation Preferences

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

**请求体：**

```json
{
  "muted": {},
  "pinned": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `muted` | object | 否 | Muted |
| `pinned` | object | 否 | Pinned |

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
