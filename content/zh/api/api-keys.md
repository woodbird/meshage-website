---
title: API Key API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# API Key API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/api-keys

List Api Keys

List current user's API keys (no raw secret; mask only).

**200 Successful Response**

---

## POST /api/v1/api-keys

Create Api Key

Create API key. Raw key returned only once.

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

## GET /api/v1/api-keys/{key_id}

Get Api Key

Get API key by id. Returns raw key only if stored (keys created after secret storage). Owner only.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `key_id` | path | string | 是 |  |

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

## DELETE /api/v1/api-keys/{key_id}

Delete Api Key

Delete API key. Key is revoked immediately.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `key_id` | path | string | 是 |  |

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
