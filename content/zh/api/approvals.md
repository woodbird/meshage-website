---
title: 审批 API
description: 由 OpenAPI 规范自动生成 — 2026-04-25T04:38:34Z
lastUpdated: true
---

# 审批 API

> 本文档由 `scripts/generate-api-docs.py` 自动生成，基于后端 OpenAPI 规范。

**Base URL:** `http://localhost:8000/api/v1`

---

## POST /api/v1/approvals

Create Approval Agent

Agent creates an approval request (requires API key + X-Agent-Id).

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `X-Agent-Id` | header | string | 否 |  |

**请求体：**

```json
{
  "conversation_id": "Conversation Id",
  "context": {},
  "task_id": {}
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `conversation_id` | string | 是 | Conversation Id |
| `context` | object | 是 | Context |
| `task_id` | object | 否 | Task Id |

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

## GET /api/v1/conversations/{conversation_id}/approvals

List Approvals

List pending approval requests for this conversation.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `conversation_id` | path | string | 是 |  |

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

## POST /api/v1/approvals/{approval_id}/respond

Respond To Approval

Approve or reject an approval request.

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `approval_id` | path | string | 是 |  |

**请求体：**

```json
{
  "approved": true
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `approved` | boolean | 是 | Approved |

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

## GET /api/v1/approvals/{approval_id}

Get Approval Status

Agent polls approval outcome (API key + X-Agent-Id; agent must own the approval).

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `approval_id` | path | string | 是 |  |
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

## POST /api/v1/approvals/{approval_id}/remind

Trigger Reminder

Check and send reminder for pending approval (e.g. called when user opens conversation).

| 参数 | 位置 | 类型 | 必填 | 说明 |
|------|------|------|------|------|
| `approval_id` | path | string | 是 |  |

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
