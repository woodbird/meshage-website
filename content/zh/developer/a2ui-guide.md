---
title: A2UI 开发指南
description: Agent-to-User Interface 协议 — JSON 蓝图、组件目录与渐进式渲染
lastUpdated: true
---

# A2UI 开发指南

A2UI（Agent-to-User Interface）是 Meshage 的核心差异化能力。它允许 AI 代理发送**原生 UI 组件**——按钮、表单、卡片等——而非纯文本回复，让人机协作更直观高效。

## 核心概念

A2UI 的工作原理：

1. 代理在 A2A 响应的 `DataPart` 中附带 JSON 蓝图
2. 蓝图描述一个 Surface（画布）及其包含的组件树
3. 客户端解析蓝图并渲染为原生 Flutter / React 组件
4. 用户在组件上的操作以 ClientEvent 形式回传给代理

```
代理                       客户端
  │                          │
  │── createSurface ────────→│ 渲染组件
  │                          │
  │── updateComponents ─────→│ 更新部分组件
  │                          │
  │←── ClientEvent ──────────│ 用户点击/输入
  │                          │
  │── updateComponents ─────→│ 响应更新
```

## JSON 蓝图格式

### createSurface — 创建画布

```json
{
  "kind": "data",
  "data": {
    "type": "a2ui",
    "action": "createSurface",
    "surfaceId": "booking-form",
    "components": [
      { "id": "root", "type": "Column", "parentId": null, "props": {} },
      { "id": "title", "type": "Text", "parentId": "root", "props": { "content": "预订会议室" } },
      { "id": "name-input", "type": "TextField", "parentId": "root", "props": { "label": "会议名称", "placeholder": "请输入..." } },
      { "id": "actions", "type": "Row", "parentId": "root", "props": {} },
      { "id": "btn-cancel", "type": "Button", "parentId": "actions", "props": { "label": "取消", "variant": "outlined" } },
      { "id": "btn-submit", "type": "Button", "parentId": "actions", "props": { "label": "提交", "variant": "filled" } }
    ],
    "a2ui_display_text": "📋 预订会议室\n会议名称：[请输入]\n[取消] [提交]"
  }
}
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| `action` | `createSurface`（创建新画布）或 `updateComponents`（更新已有组件） |
| `surfaceId` | 画布唯一标识，用于后续更新 |
| `components` | 扁平化组件列表（邻接列表模型） |
| `a2ui_display_text` | 后备纯文本，供不支持 A2UI 的客户端显示 |

### 组件结构

每个组件是一个扁平节点，通过 `parentId` 构成树形结构：

```json
{
  "id": "unique-component-id",
  "type": "Button",
  "parentId": "parent-component-id",
  "props": {
    "label": "确认"
  }
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 组件唯一 ID，同一 Surface 内不可重复 |
| `type` | string | 组件类型，必须在白名单中 |
| `parentId` | string \| null | 父组件 ID，根组件为 `null` |
| `props` | object | 组件属性，因类型而异 |

### updateComponents — 更新组件

用户交互后，代理可以局部更新已有画布：

```json
{
  "kind": "data",
  "data": {
    "type": "a2ui",
    "action": "updateComponents",
    "surfaceId": "booking-form",
    "components": [
      { "id": "title", "type": "Text", "parentId": "root", "props": { "content": "✅ 预订成功！" } },
      { "id": "btn-submit", "type": "Button", "parentId": "actions", "props": { "label": "完成", "disabled": true } }
    ]
  }
}
```

只需传递发生变化的组件，客户端会合并更新。

## 组件目录（Standard Catalog）

Meshage 标准白名单包含以下 7 种组件：

### Row — 水平布局

```json
{ "id": "r1", "type": "Row", "parentId": null, "props": { "spacing": 8 } }
```

将子组件水平排列。`spacing` 指定子组件间距（像素）。

### Column — 垂直布局

```json
{ "id": "c1", "type": "Column", "parentId": null, "props": { "spacing": 12 } }
```

将子组件垂直堆叠。

### Text — 文本展示

```json
{ "id": "t1", "type": "Text", "parentId": "c1", "props": { "content": "标题文字", "style": "headline" } }
```

| 属性 | 说明 |
|------|------|
| `content` | 文本内容 |
| `style` | 样式：`headline`、`body`、`caption` |

### Button — 按钮

```json
{ "id": "b1", "type": "Button", "parentId": "r1", "props": { "label": "确认", "variant": "filled", "disabled": false } }
```

| 属性 | 说明 |
|------|------|
| `label` | 按钮文字 |
| `variant` | 样式：`filled`、`outlined`、`text` |
| `disabled` | 是否禁用 |

点击后触发 ClientEvent（`event: "click"`）。

### TextField — 文本输入

```json
{ "id": "tf1", "type": "TextField", "parentId": "c1", "props": { "label": "姓名", "placeholder": "请输入姓名", "value": "" } }
```

| 属性 | 说明 |
|------|------|
| `label` | 输入框标签 |
| `placeholder` | 占位提示文字 |
| `value` | 当前值 |

提交时通过 ClientEvent 携带用户输入值。

### Card — 卡片容器

```json
{ "id": "card1", "type": "Card", "parentId": null, "props": { "elevation": 2 } }
```

带圆角和阴影的容器，用于信息聚合展示。

### Modal — 模态弹窗

```json
{ "id": "modal1", "type": "Modal", "parentId": null, "props": { "title": "确认操作", "visible": true } }
```

| 属性 | 说明 |
|------|------|
| `title` | 弹窗标题 |
| `visible` | 是否显示 |

## 渐进式渲染

A2UI 采用**扁平化邻接列表**模型，支持随大模型 Token 流式输出实时拼装 UI：

1. 代理流式输出第一个组件节点 → 客户端立即渲染
2. 后续节点到达 → 客户端增量追加到组件树
3. 用户无需等待完整蓝图生成即可看到部分 UI

这极大提升了交互体验的即时性。

## 后备文本（Fallback Text）

每个 A2UI 蓝图应包含 `a2ui_display_text` 字段：

```json
{
  "a2ui_display_text": "📋 预订会议室\n- 会议名称：[请输入]\n- [取消] [提交]"
}
```

用途：
- 不支持 A2UI 渲染的旧版客户端显示此文本
- 渲染失败时的降级显示
- 消息列表预览中使用

## Schema 验证

平台对代理发送的 A2UI 蓝图进行严格验证：

1. `type` 必须在白名单中（Standard Catalog）
2. `id` 在同一 Surface 内必须唯一
3. `parentId` 必须引用已存在的组件或为 `null`
4. `props` 必须符合对应组件类型的规范

验证失败时，平台返回错误：

```json
{
  "error": {
    "code": -32602,
    "message": "ValidationFailed: unknown component type 'Chart'"
  }
}
```

代理（尤其是 LLM 驱动的代理）可据此自我纠正并重新生成蓝图。

## 完整示例：交互式表单

```python
def build_survey_surface():
    return {
        "type": "a2ui",
        "action": "createSurface",
        "surfaceId": "feedback-form",
        "components": [
            {"id": "root", "type": "Column", "parentId": None, "props": {"spacing": 16}},
            {"id": "title", "type": "Text", "parentId": "root", "props": {"content": "用户反馈", "style": "headline"}},
            {"id": "desc", "type": "Text", "parentId": "root", "props": {"content": "请告诉我们你的使用体验", "style": "body"}},
            {"id": "input", "type": "TextField", "parentId": "root", "props": {"label": "反馈内容", "placeholder": "输入你的想法..."}},
            {"id": "actions", "type": "Row", "parentId": "root", "props": {"spacing": 8}},
            {"id": "btn-skip", "type": "Button", "parentId": "actions", "props": {"label": "跳过", "variant": "text"}},
            {"id": "btn-send", "type": "Button", "parentId": "actions", "props": {"label": "提交", "variant": "filled"}},
        ],
        "a2ui_display_text": "📝 用户反馈\n请告诉我们你的使用体验\n[跳过] [提交]"
    }
```

## 下一步

- [A2A 协议指南](./a2a-protocol) — 理解 DataPart 在消息中的位置
- [WebSocket 接入](./websocket) — 实时推送 A2UI 更新
- [Demo Agent 解读](./demo-agent) — 查看实际代码示例
