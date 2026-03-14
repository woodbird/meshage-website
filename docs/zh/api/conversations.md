---
title: 对话 API
description: 创建对话、获取对话列表、管理对话偏好
lastUpdated: true
---

# 对话 API

管理用户的对话（会话），包括与人类用户和 AI 代理之间的对话。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## POST /conversations

创建新对话。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/conversations \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_ids": ["usr-660f9500..."],
    "type": "direct"
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `participant_ids` | string[] | 是 | 参与者 ID 列表（不含自己） |
| `type` | string | 否 | 对话类型：`direct`（单聊，默认）、`group`（群聊） |
| `name` | string | 否 | 群聊名称（群聊时建议填写） |

**成功响应：** `201 Created`

```json
{
  "id": "conv-550e8400-e29b-41d4-a716-446655440000",
  "type": "direct",
  "participants": [
    { "id": "usr-550e8400...", "display_name": "Alice" },
    { "id": "usr-660f9500...", "display_name": "Bob" }
  ],
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

**与代理创建对话：**

```bash
curl -X POST http://localhost:8000/api/v1/conversations \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "participant_ids": ["agt-001"],
    "type": "direct"
  }'
```

代理 ID（以 `agt-` 开头）也可作为参与者。

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `400 Bad Request` | 参数缺失或不合法 |
| `404 Not Found` | 参与者不存在 |
| `409 Conflict` | 与该用户的单聊已存在 |

---

## GET /conversations

获取当前用户的对话列表，按最近更新时间排序。

**请求：**

```bash
curl "http://localhost:8000/api/v1/conversations?limit=20&offset=0" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | integer | 否 | 返回条数，默认 20 |
| `offset` | integer | 否 | 分页偏移量，默认 0 |

**成功响应：** `200 OK`

```json
[
  {
    "id": "conv-550e8400...",
    "type": "direct",
    "participants": [
      { "id": "usr-660f9500...", "display_name": "Bob" }
    ],
    "last_message": {
      "content": "明天见！",
      "sender_id": "usr-660f9500...",
      "created_at": "2026-03-01T15:00:00Z"
    },
    "unread_count": 2,
    "updated_at": "2026-03-01T15:00:00Z"
  }
]
```

---

## GET /conversations/:id

获取单个对话的详细信息。

**请求：**

```bash
curl http://localhost:8000/api/v1/conversations/conv-550e8400... \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
{
  "id": "conv-550e8400...",
  "type": "direct",
  "name": null,
  "participants": [
    { "id": "usr-550e8400...", "display_name": "Alice", "type": "user" },
    { "id": "usr-660f9500...", "display_name": "Bob", "type": "user" }
  ],
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T15:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `403 Forbidden` | 不是该对话的参与者 |
| `404 Not Found` | 对话不存在 |

---

## PATCH /conversations/:id/preferences

更新对话偏好设置（如置顶、静音）。

**请求：**

```bash
curl -X PATCH http://localhost:8000/api/v1/conversations/conv-550e8400.../preferences \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "pinned": true,
    "muted": false
  }'
```

**请求体（均为可选）：**

| 字段 | 类型 | 说明 |
|------|------|------|
| `pinned` | boolean | 是否置顶 |
| `muted` | boolean | 是否静音通知 |

**成功响应：** `200 OK`

```json
{
  "conversation_id": "conv-550e8400...",
  "pinned": true,
  "muted": false,
  "updated_at": "2026-03-01T16:00:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `403 Forbidden` | 不是该对话的参与者 |
| `404 Not Found` | 对话不存在 |
