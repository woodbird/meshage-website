---
title: 代理 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 代理 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /api/v1/agents/register

Register Agent

**请求体：**

```json
{
  "name": "Name",
  "endpoint_url": "Endpoint Url",
  "description": {},
  "agent_card": {},
  "catalog_ids": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | Name |
| `endpoint_url` | string | 是 | Endpoint Url |
| `description` | object | 否 | Description |
| `agent_card` | object | 否 | Agent Card |
| `catalog_ids` | object | 否 | Catalog Ids |

**201 Successful Response**

```json
{
  "agent_id": "Agent Id"
}
```

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

## GET /api/v1/agents

List Agents

**200 Successful Response**

---
