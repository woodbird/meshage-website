---
title: Agent 透明层 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# Agent 透明层 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## GET /api/v1/agent/conversations/{conversation_id}/traces

List Traces

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `limit` | query | integer | 否 |  |
| `cursor` | query | string | 否 |  |
| `X-Agent-Id` | header | string | 否 |  |

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

## POST /api/v1/agent/conversations/{conversation_id}/traces

Create Trace

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `X-Agent-Id` | header | string | 否 |  |

**请求体：**

```json
{
  "title": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
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

## POST /api/v1/agent/conversations/{conversation_id}/traces/{trace_id}/steps

Create Step

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `trace_id` | path | string | 是 |  |
| `X-Agent-Id` | header | string | 否 |  |

**请求体：**

```json
{
  "parent_step_id": {},
  "summary": {},
  "is_critical_path": false,
  "actor_type": "Actor Type",
  "actor_id": {},
  "initial_status": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `parent_step_id` | object | 否 | Parent Step Id |
| `summary` | object | 否 | Summary |
| `is_critical_path` | boolean | 否 | Is Critical Path |
| `actor_type` | string | 否 | Actor Type |
| `actor_id` | object | 否 | Actor Id |
| `initial_status` | object | 否 | Optional initial status (queued by default) |

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

## POST /api/v1/agent/conversations/{conversation_id}/traces/{trace_id}/steps/{step_id}/transition

Transition Step

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `trace_id` | path | string | 是 |  |
| `step_id` | path | string | 是 |  |
| `X-Agent-Id` | header | string | 否 |  |

**请求体：**

```json
{
  "status": "Status",
  "summary": {},
  "error_code": {},
  "error_message": {},
  "viewer_scope": "Viewer Scope",
  "payload": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `status` | string | 是 | Target step status (e.g. running, waiting_human, done, failed) |
| `summary` | object | 否 | Summary |
| `error_code` | object | 否 | Error Code |
| `error_message` | object | 否 | Error Message |
| `viewer_scope` | string | 否 | Viewer Scope |
| `payload` | object | 否 | Payload |

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

## POST /api/v1/agent/conversations/{conversation_id}/traces/{trace_id}/steps/{step_id}/events

Append Custom Event

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `trace_id` | path | string | 是 |  |
| `step_id` | path | string | 是 |  |
| `X-Agent-Id` | header | string | 否 |  |

**请求体：**

```json
{
  "event_type": "Event Type",
  "status": "Status",
  "summary": "Summary",
  "viewer_scope": "Viewer Scope",
  "payload": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `event_type` | string | 是 | Event Type |
| `status` | string | 是 | Status |
| `summary` | string | 是 | Summary |
| `viewer_scope` | string | 否 | Viewer Scope |
| `payload` | object | 否 | Payload |

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

## GET /api/v1/agent/conversations/{conversation_id}/traces/{trace_id}

Get Trace Detail

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `trace_id` | path | string | 是 |  |
| `X-Agent-Id` | header | string | 否 |  |

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

## GET /api/v1/agent/conversations/{conversation_id}/traces/{trace_id}/events

List Events

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |
| `trace_id` | path | string | 是 |  |
| `step_id` | query | string | 否 |  |
| `after_ts` | query | string | 否 |  |
| `limit` | query | integer | 否 |  |
| `X-Agent-Id` | header | string | 否 |  |

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
