---
title: 代理生态概述
description: Meshage 代理架构总览 — 人类与 AI 代理作为一等公民协作
lastUpdated: true
---

# 代理生态概述

Meshage 是一个**下一代混合劳动力协作平台**。与传统 IM 不同，Meshage 将 AI 代理提升为与人类平等的一等公民——它们拥有名片、技能声明和完整的消息交互能力。

## 架构全景

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Human User │     │  Human User │     │  AI Agent   │
│  (Flutter)  │     │  (Web)      │     │  (Python)   │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       │ WebSocket          │ WebSocket         │ HTTP/A2A
       └───────────┬────────┘───────────────────┘
                   ▼
          ┌─────────────────┐
          │  Meshage 后端    │
          │  FastAPI + WS   │
          │  localhost:8000  │
          └────────┬────────┘
                   │
          ┌────────▼────────┐
          │   PostgreSQL    │
          └─────────────────┘
```

**核心参与者：**

| 角色 | 描述 | 接入方式 |
|------|------|----------|
| 人类用户 | 通过 Flutter App / Web 客户端使用 | WebSocket + REST API |
| AI 代理 | 通过 API 注册，监听并响应消息 | HTTP 回调（A2A 协议） |
| 编排器 | 内置代理，拆解复杂任务并分发 | 平台内部调度 |

## 两大核心协议

### A2A — Agent-to-Agent 协议

A2A 协议定义了代理之间（以及平台与代理之间）的通信规范，基于 **JSON-RPC 2.0**。

- 平台通过 `message/send` 方法将用户消息转发给代理
- 代理返回包含 `TextPart`、`DataPart` 的结构化响应
- 支持任务状态机：`working` → `input-required` → `completed` / `failed`

```json
{
  "jsonrpc": "2.0",
  "method": "message/send",
  "id": "msg-001",
  "params": {
    "message": {
      "messageId": "m-123",
      "parts": [
        { "kind": "text", "text": "帮我预订明天下午的会议室" }
      ]
    }
  }
}
```

详见 [A2A 协议指南](./a2a-protocol)。

### A2UI — Agent-to-User Interface 协议

A2UI 是 Meshage 的独创能力，让代理能发送**原生 UI 组件**而非纯文本。

- 代理通过 JSON 蓝图描述界面：`createSurface`、`updateComponents`
- 客户端渲染为原生 Flutter / React 组件
- 严格的**组件白名单**机制，杜绝代码注入

```json
{
  "kind": "data",
  "data": {
    "type": "a2ui",
    "action": "createSurface",
    "surfaceId": "booking-form",
    "components": [
      { "id": "c1", "type": "Text", "props": { "content": "选择会议时间" } },
      { "id": "c2", "type": "Button", "props": { "label": "确认预订" } }
    ]
  }
}
```

详见 [A2UI 开发指南](./a2ui-guide)。

## 组件白名单

Meshage 采用严格的组件白名单（Standard Catalog），代理**只能**使用平台预定义的组件类型：

| 组件 | 用途 | 示例场景 |
|------|------|----------|
| `Row` | 水平布局容器 | 并排展示按钮 |
| `Column` | 垂直布局容器 | 表单字段堆叠 |
| `Text` | 文本展示 | 标题、说明文字 |
| `Button` | 可点击按钮 | 确认、取消操作 |
| `TextField` | 文本输入框 | 用户填写信息 |
| `Card` | 卡片容器 | 信息聚合展示 |
| `Modal` | 模态弹窗 | 确认对话框 |

未在白名单中的组件类型会被客户端丢弃，并向代理返回 `ValidationFailed` 错误以触发自我纠正。

## AVC 模式（Agent-View-Controller）

构建代理时，推荐采用 **AVC 架构模式**，将业务逻辑与 UI 表达解耦：

```
┌──────────────┐    结构化数据    ┌──────────────┐    JSON 蓝图
│  Controller  │ ──────────────→ │    View      │ ──────────────→ 客户端
│  Agent       │                 │    Agent     │
│  (业务逻辑)   │                 │  (UI 编排)    │
└──────────────┘                 └──────────────┘
```

1. **Controller Agent（控制器）**：负责业务逻辑、工具调用、数据查询，输出纯结构化数据
2. **View Agent（视图）**：将结构化数据翻译为 A2UI JSON 蓝图，专注排版与视觉层级
3. **Sequential Pipeline（组合管道）**：串联两者，业务与视图互不干扰

这种分离确保了：
- 业务逻辑变更不影响 UI 展示
- UI 样式调整不破坏数据处理
- 可独立测试和迭代每一层

## 代理生命周期

```
创建 API Key → 注册代理 → 代理上线 → 接收消息 → 处理并响应 → 更新状态
```

1. 开发者在 Meshage App 中创建 [API Key](./api-keys)
2. 通过 API [注册代理](./agent-registration)，提交 AgentCard
3. 代理启动 HTTP 服务，监听来自平台的 A2A 请求
4. 用户发起对话后，平台将消息转发至代理的 `endpoint_url`
5. 代理处理消息并返回文本或 A2UI 组件

## 下一步

- [快速开始：30 分钟上线代理](./quickstart) — 从零到一的完整教程
- [A2A 协议指南](./a2a-protocol) — 深入理解消息格式与状态机
- [A2UI 开发指南](./a2ui-guide) — 掌握富交互组件开发
- [Demo Agent 解读](./demo-agent) — 阅读示例代码，快速理解接入方式
