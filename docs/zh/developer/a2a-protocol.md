---
title: A2A 协议指南
description: Agent-to-Agent 通信协议详解 — 消息格式、任务状态机与事件处理
lastUpdated: true
---

# A2A 协议指南

A2A（Agent-to-Agent）协议是 Meshage 平台中代理通信的基础。它基于 **JSON-RPC 2.0** 规范，定义了平台与代理之间的消息传递格式和任务管理模型。

## 协议概览

```
用户发送消息
     │
     ▼
Meshage 后端 ──── JSON-RPC POST ────→ 代理 endpoint_url
     │                                      │
     │              JSON-RPC Response  ←────┘
     ▼
用户收到回复
```

平台通过 HTTP POST 将消息转发到代理的 `endpoint_url`，请求和响应均为 JSON-RPC 2.0 格式。

## 消息格式

### 请求（平台 → 代理）

```json
{
  "jsonrpc": "2.0",
  "method": "message/send",
  "id": "req-uuid-001",
  "params": {
    "message": {
      "messageId": "msg-uuid-001",
      "contextId": "conv-uuid-001",
      "role": "user",
      "parts": [
        { "kind": "text", "text": "帮我查一下明天的天气" }
      ]
    }
  }
}
```

| 字段 | 说明 |
|------|------|
| `method` | 固定为 `message/send` |
| `id` | 请求唯一标识，响应中需原样返回 |
| `params.message.messageId` | 消息 ID |
| `params.message.contextId` | 对话上下文 ID |
| `params.message.role` | 发送者角色：`user` 或 `agent` |
| `params.message.parts` | 消息部分列表（见下文） |

### 消息部分（Parts）

每条消息由一个或多个 Part 组成：

#### TextPart — 文本内容

```json
{
  "kind": "text",
  "text": "这是一段纯文本消息"
}
```

#### DataPart — 结构化数据

```json
{
  "kind": "data",
  "data": {
    "type": "weather",
    "temperature": 22,
    "condition": "晴天"
  }
}
```

DataPart 也用于携带 A2UI 蓝图（`data.type` 为 `"a2ui"`），详见 [A2UI 开发指南](./a2ui-guide)。

### 响应（代理 → 平台）

#### 成功响应

```json
{
  "jsonrpc": "2.0",
  "id": "req-uuid-001",
  "result": {
    "kind": "message",
    "messageId": "reply-uuid-001",
    "contextId": "conv-uuid-001",
    "parts": [
      { "kind": "text", "text": "明天北京天气：晴，22°C" }
    ]
  }
}
```

#### 错误响应

```json
{
  "jsonrpc": "2.0",
  "id": "req-uuid-001",
  "error": {
    "code": -32603,
    "message": "Internal error: weather API unavailable"
  }
}
```

标准 JSON-RPC 错误码：

| 错误码 | 含义 |
|--------|------|
| `-32700` | Parse error — 请求 JSON 解析失败 |
| `-32600` | Invalid request — 请求格式不合规范 |
| `-32601` | Method not found — 方法不存在 |
| `-32602` | Invalid params — 参数无效 |
| `-32603` | Internal error — 代理内部错误 |

## 任务状态机

复杂任务可能需要多轮交互。A2A 协议通过任务状态来管理交互流程：

```
         ┌────────────────────┐
         │                    │
         ▼                    │
    ┌─────────┐         ┌────┴──────┐
    │ working │────────→│ completed │
    └────┬────┘         └───────────┘
         │
         │  需要用户输入
         ▼
  ┌──────────────┐      ┌──────────┐
  │input-required│─────→│  failed  │
  └──────┬───────┘      └──────────┘
         │
         │  用户提供输入
         ▼
    ┌─────────┐
    │ working │ ... (继续处理)
    └─────────┘
```

### 状态说明

| 状态 | 含义 | 代理行为 |
|------|------|----------|
| `working` | 处理中 | 代理正在执行任务，可发送中间进度 |
| `input-required` | 需要用户输入 | 代理暂停，等待用户提供额外信息 |
| `completed` | 已完成 | 任务成功结束 |
| `failed` | 失败 | 任务执行出错 |

### 使用状态的响应示例

代理在处理中时返回 `working` 状态：

```json
{
  "jsonrpc": "2.0",
  "id": "req-002",
  "result": {
    "kind": "status",
    "taskId": "task-001",
    "state": "working",
    "message": {
      "parts": [{ "kind": "text", "text": "正在查询航班信息..." }]
    }
  }
}
```

需要用户补充信息时返回 `input-required`：

```json
{
  "jsonrpc": "2.0",
  "id": "req-003",
  "result": {
    "kind": "status",
    "taskId": "task-001",
    "state": "input-required",
    "message": {
      "parts": [{ "kind": "text", "text": "请提供你的出发城市" }]
    }
  }
}
```

任务完成：

```json
{
  "jsonrpc": "2.0",
  "id": "req-004",
  "result": {
    "kind": "status",
    "taskId": "task-001",
    "state": "completed",
    "message": {
      "parts": [{ "kind": "text", "text": "航班已预订成功！" }]
    }
  }
}
```

## 事件处理

用户在 A2UI 组件上的操作（如点击按钮、提交表单）会生成 **ClientEvent**，平台将其包装为 A2A 消息发送给代理：

```json
{
  "jsonrpc": "2.0",
  "method": "message/send",
  "id": "req-005",
  "params": {
    "message": {
      "messageId": "evt-001",
      "contextId": "conv-uuid-001",
      "role": "user",
      "parts": [
        {
          "kind": "data",
          "data": {
            "type": "client_event",
            "surfaceId": "booking-form",
            "componentId": "btn-confirm",
            "event": "click",
            "payload": {}
          }
        }
      ]
    }
  }
}
```

代理收到事件后继续处理业务逻辑并返回下一步结果。

## 多部分响应

代理可以在一次响应中同时返回文本和 A2UI 组件：

```json
{
  "jsonrpc": "2.0",
  "id": "req-006",
  "result": {
    "kind": "message",
    "messageId": "reply-006",
    "contextId": "",
    "parts": [
      { "kind": "text", "text": "找到以下可用会议室：" },
      {
        "kind": "data",
        "data": {
          "type": "a2ui",
          "action": "createSurface",
          "surfaceId": "room-list",
          "components": [
            { "id": "c1", "type": "Card", "parentId": null, "props": {} },
            { "id": "c2", "type": "Text", "parentId": "c1", "props": { "content": "A101 - 8人间" } },
            { "id": "c3", "type": "Button", "parentId": "c1", "props": { "label": "预订" } }
          ]
        }
      }
    ]
  }
}
```

## 最佳实践

1. **始终返回 `id`**：响应中的 `id` 必须与请求中的 `id` 一致
2. **优雅处理未知方法**：对非 `message/send` 的请求返回 `-32601` 错误
3. **合理使用状态**：耗时任务先返回 `working`，避免超时
4. **提供后备文本**：A2UI 组件应附带 `a2ui_display_text`，兼容纯文本客户端
5. **幂等处理**：同一 `messageId` 的请求可能因重试而多次到达，确保处理逻辑幂等

## 下一步

- [A2UI 开发指南](./a2ui-guide) — 通过 DataPart 发送富交互组件
- [WebSocket 接入](./websocket) — 实时消息推送
- [代理注册与配置](./agent-registration) — 配置代理的回调地址
