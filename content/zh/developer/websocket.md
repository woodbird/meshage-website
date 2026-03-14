---
title: WebSocket 接入
description: 连接 WebSocket、认证、消息流、事件类型与重连策略
lastUpdated: true
---

# WebSocket 接入

Meshage 通过 WebSocket 实现客户端的实时消息推送。连接建立后，服务端会主动推送新消息、代理响应、A2UI 更新等事件。

## 连接地址

```
ws://localhost:8000/api/v1/ws
```

生产环境建议使用 `wss://`（TLS 加密）。

## 认证

WebSocket 连接需要在握手时携带有效的 Session Cookie：

```javascript
const ws = new WebSocket("ws://localhost:8000/api/v1/ws", {
  headers: {
    Cookie: "session_id=YOUR_SESSION_ID"
  }
});
```

**Python 示例（websockets 库）：**

```python
import websockets
import json

async def connect():
    uri = "ws://localhost:8000/api/v1/ws"
    extra_headers = {"Cookie": "session_id=YOUR_SESSION_ID"}

    async with websockets.connect(uri, extra_headers=extra_headers) as ws:
        async for raw in ws:
            event = json.loads(raw)
            print(f"收到事件: {event['type']}")
```

**Flutter 示例：**

```dart
final channel = WebSocketChannel.connect(
  Uri.parse('ws://localhost:8000/api/v1/ws'),
  // Session cookie 由 HTTP 客户端自动携带
);

channel.stream.listen((message) {
  final event = jsonDecode(message);
  print('收到事件: ${event['type']}');
});
```

认证失败时，服务端会关闭连接并返回 `4001` 状态码。

## 事件类型

连接建立后，服务端推送的事件均为 JSON 格式：

```json
{
  "type": "event_type",
  "data": { ... },
  "timestamp": "2026-03-01T10:00:00Z"
}
```

### 消息事件

#### `message.new` — 新消息

```json
{
  "type": "message.new",
  "data": {
    "conversation_id": "conv-001",
    "message": {
      "id": "msg-001",
      "sender_id": "usr-002",
      "sender_type": "user",
      "content": "你好！",
      "parts": [{ "kind": "text", "text": "你好！" }],
      "created_at": "2026-03-01T10:01:00Z"
    }
  }
}
```

#### `message.read` — 消息已读

```json
{
  "type": "message.read",
  "data": {
    "conversation_id": "conv-001",
    "message_id": "msg-001",
    "reader_id": "usr-003"
  }
}
```

### 输入状态事件

#### `typing.start` / `typing.stop` — 对方正在输入

```json
{
  "type": "typing.start",
  "data": {
    "conversation_id": "conv-001",
    "user_id": "usr-002"
  }
}
```

### 代理事件

#### `agent.response` — 代理回复

```json
{
  "type": "agent.response",
  "data": {
    "conversation_id": "conv-001",
    "agent_id": "agt-001",
    "message": {
      "parts": [
        { "kind": "text", "text": "查询完成" },
        { "kind": "data", "data": { "type": "a2ui", "action": "createSurface", "..." : "..." } }
      ]
    }
  }
}
```

#### `agent.status` — 代理状态变更

```json
{
  "type": "agent.status",
  "data": {
    "conversation_id": "conv-001",
    "agent_id": "agt-001",
    "task_id": "task-001",
    "state": "working",
    "message": "正在处理..."
  }
}
```

### 联系人事件

#### `contact.request` — 新联系人请求

```json
{
  "type": "contact.request",
  "data": {
    "request_id": "creq-001",
    "from_user": { "id": "usr-005", "display_name": "Alice" }
  }
}
```

### 审批事件

#### `approval.pending` — 待审批项

```json
{
  "type": "approval.pending",
  "data": {
    "approval_id": "appr-001",
    "agent_id": "agt-001",
    "description": "代理请求执行数据库变更"
  }
}
```

## 消息流式传输

代理通过 A2A 返回的流式内容会实时通过 WebSocket 推送：

```
agent.response (parts[0]: text "正在查询...")
     ↓ 200ms
agent.response (parts[0]: text "正在查询... 找到3条结果")
     ↓ 300ms
agent.response (parts[1]: data/a2ui createSurface)
```

客户端应增量拼装收到的内容，实现渐进式渲染。

## 客户端发送消息

客户端也可以通过 WebSocket 发送消息（而非 REST API）：

```json
{
  "type": "message.send",
  "data": {
    "conversation_id": "conv-001",
    "content": "你好"
  }
}
```

## 心跳保活

服务端每 30 秒发送一次 `ping` 帧。客户端应：

1. 响应 `pong` 帧（大多数 WebSocket 库自动处理）
2. 如果 60 秒内未收到任何消息，主动发起重连

## 重连策略

网络断开时，建议使用**指数退避**策略重连：

```python
import asyncio
import websockets
import json

async def connect_with_retry():
    base_delay = 1
    max_delay = 30
    delay = base_delay

    while True:
        try:
            async with websockets.connect(
                "ws://localhost:8000/api/v1/ws",
                extra_headers={"Cookie": "session_id=YOUR_SESSION"},
            ) as ws:
                delay = base_delay  # 连接成功，重置延迟
                async for raw in ws:
                    event = json.loads(raw)
                    await handle_event(event)
        except (websockets.ConnectionClosed, OSError):
            print(f"连接断开，{delay}秒后重连...")
            await asyncio.sleep(delay)
            delay = min(delay * 2, max_delay)
```

**建议：**

- 首次重连延迟 1 秒
- 每次失败后延迟翻倍
- 最大延迟不超过 30 秒
- 连接成功后重置延迟
- 重连后拉取离线期间的消息（通过 REST API）

## WebSocket 关闭码

| 关闭码 | 含义 |
|--------|------|
| `1000` | 正常关闭 |
| `1001` | 服务端关闭 |
| `4001` | 认证失败 |
| `4002` | Session 过期 |
| `4003` | 被踢出（在其他设备登录） |

## 下一步

- [A2A 协议指南](./a2a-protocol) — 理解代理消息格式
- [A2UI 开发指南](./a2ui-guide) — 处理 `agent.response` 中的 A2UI 数据
- [消息 API](/zh/api/messages) — 通过 REST API 发送和查询消息
