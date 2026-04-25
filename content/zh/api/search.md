---
title: 搜索 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 搜索 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/search/messages

Search Messages

Return messages where user is participant and body_text matches (ILIKE).

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `q` | query | string | 是 |  |
| `conversation_id` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |

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
