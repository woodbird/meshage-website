---
title: 联系人 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 联系人 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/contacts/resolve

Resolve Contact Id

Resolve a single ID (UUID or account_name) to user or agent. Used for add-contact flow.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `id` | query | string | 是 | User or agent UUID, or user account_name |

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

## GET /api/v1/contacts/list

List Contacts

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `type` | query | string | 否 |  |

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

## POST /api/v1/contacts/by-id

Add Contact By Id

Add contact by ID. Agent: direct add. Human: message (<=50 chars) required; passphrase optional.
If target passphrase matches or target does not require approval: direct add + conversation + 2 messages, 201.
Else: create contact request, 202 pending.

**请求体：**

```json
{
  "id": "Id",
  "message": {},
  "passphrase": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `id` | string | 是 | Id |
| `message` | object | 否 | Message |
| `passphrase` | object | 否 | Passphrase |

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

## GET /api/v1/contacts/requests

List Contact Requests

List pending contact requests (to me).

**200 Successful Response**

---

## POST /api/v1/contacts/requests/{request_id}/accept

Accept Contact Request

Accept a contact request: add contacts both ways, create conversation with request message + acceptance message. Returns conversation_id.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `request_id` | path | string | 是 |  |

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

## POST /api/v1/contacts/requests/{request_id}/reject

Reject Contact Request

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `request_id` | path | string | 是 |  |

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

## POST /api/v1/contacts

Add Contact

**请求体：**

```json
{
  "target_type": "Target Type",
  "target_user_id": {},
  "target_agent_id": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target_type` | string | 是 | Target Type |
| `target_user_id` | object | 否 | Target User Id |
| `target_agent_id` | object | 否 | Target Agent Id |

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
