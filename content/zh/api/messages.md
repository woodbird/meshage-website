---
title: 消息 API
description: 发送消息、获取消息历史、已读回执与输入状态
lastUpdated: true
---

# 消息 API

在对话中发送和获取消息，管理已读状态和输入指示器。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## POST /conversations/:id/messages

在指定对话中发送消息。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/conversations/conv-001/messages \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "你好，Bob！"
  }'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `content` | string | 是 | 消息文本内容 |
| `parts` | array | 否 | 多部分消息（用于携带结构化数据） |

**使用 parts 发送多部分消息：**

```json
{
  "parts": [
    { "kind": "text", "text": "查看附件：" },
    { "kind": "data", "data": { "file_url": "https://..." } }
  ]
}
```

**成功响应：** `201 Created`

```json
{
  "id": "msg-550e8400-e29b-41d4-a716-446655440000",
  "conversation_id": "conv-001",
  "sender_id": "usr-550e8400...",
  "sender_type": "user",
  "content": "你好，Bob！",
  "parts": [
    { "kind": "text", "text": "你好，Bob！" }
  ],
  "created_at": "2026-03-01T10:00:00Z"
}
```

**发送给代理的消息：**

当对话参与者包含代理时，消息会自动通过 A2A 协议转发到代理的 `endpoint_url`，代理的回复会通过 WebSocket 实时推送给用户。

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `400 Bad Request` | 消息内容为空 |
| `403 Forbidden` | 不是该对话的参与者 |
| `404 Not Found` | 对话不存在 |

---

## GET /conversations/:id/messages

获取指定对话的消息历史，按时间倒序排列（最新消息在前）。

**请求：**

```bash
curl "http://localhost:8000/api/v1/conversations/conv-001/messages?limit=50&before=msg-xxx" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `limit` | integer | 否 | 返回条数，默认 50，最大 100 |
| `before` | string | 否 | 游标分页：返回此消息 ID 之前的消息 |
| `after` | string | 否 | 游标分页：返回此消息 ID 之后的消息 |

**成功响应：** `200 OK`

```json
{
  "messages": [
    {
      "id": "msg-002",
      "conversation_id": "conv-001",
      "sender_id": "usr-660f9500...",
      "sender_type": "user",
      "content": "你好，Alice！",
      "parts": [{ "kind": "text", "text": "你好，Alice！" }],
      "created_at": "2026-03-01T10:01:00Z"
    },
    {
      "id": "msg-001",
      "conversation_id": "conv-001",
      "sender_id": "usr-550e8400...",
      "sender_type": "user",
      "content": "你好，Bob！",
      "parts": [{ "kind": "text", "text": "你好，Bob！" }],
      "created_at": "2026-03-01T10:00:00Z"
    }
  ],
  "has_more": false
}
```

**代理消息示例：**

```json
{
  "id": "msg-003",
  "conversation_id": "conv-002",
  "sender_id": "agt-001",
  "sender_type": "agent",
  "content": "查询完成",
  "parts": [
    { "kind": "text", "text": "查询完成，请查看结果：" },
    { "kind": "data", "data": { "type": "a2ui", "action": "createSurface", "..." : "..." } }
  ],
  "created_at": "2026-03-01T10:02:00Z"
}
```

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `403 Forbidden` | 不是该对话的参与者 |
| `404 Not Found` | 对话不存在 |

---

## POST /messages/:id/read

标记指定消息为已读。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/messages/msg-002/read \
  -H "Cookie: session_id=YOUR_SESSION"
```

**成功响应：** `200 OK`

```json
{
  "message_id": "msg-002",
  "read_at": "2026-03-01T10:05:00Z"
}
```

标记一条消息为已读后，该消息之前的所有消息也会被自动标记。

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 消息不存在 |

---

## POST /conversations/:id/typing

通知对方当前用户正在输入。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/conversations/conv-001/typing \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"action": "start"}'
```

**请求体：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `action` | string | 是 | `start`（开始输入）或 `stop`（停止输入） |

**成功响应：** `200 OK`

```json
{
  "detail": "ok"
}
```

该状态会通过 WebSocket 推送给对话中的其他参与者，详见 [WebSocket 接入](/zh/developer/websocket)。
