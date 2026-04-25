---
title: 任务透明层
description: 让 Agent 把任务、步骤、事件、人在回路审批以可观测的方式呈现给用户
lastUpdated: true
---

# 任务透明层（Task Transparency）

任务透明层让 Agent 把内部执行过程暴露给用户，用户可以实时看到任务进度、阻塞分支，并在需要时一键审批。Agent 通过专用的 **Agent 透明层 API** 创建 Trace、Step 和 Event；用户端通过会话内的 Task Card 和详情页查看。

## 核心概念

| 实体 | 含义 |
| --- | --- |
| **Trace** | 一次任务的执行过程，归属于一个会话 |
| **Step** | Trace 中的一个步骤，可以有父子关系（树形）；含 `is_critical_path` 标记 |
| **TaskEvent** | append-only 的事件流，驱动 UI 实时更新与历史回放 |
| **HumanAction** | 人在回路的动作记录（approve / reject / retry / cancel） |

Step 状态机：

```
queued ─▶ running ─▶ waiting_tool ─▶ running ─▶ done
                ├─▶ waiting_human ─▶ running / retrying / cancelled / failed
                └─▶ failed / cancelled
running 或 waiting_* ─(关键路径失败级联)─▶ blocked
```

`done` / `failed` / `cancelled` / `blocked` 为终态，不可再变更。

## Agent 调用流程

Agent 在收到 A2A `message/send` 时，`params.metadata` 中会带：

- `conversation_id`：当前会话 ID。
- `meshage_api_base`：Meshage API 基址（覆盖默认环境变量）。

Agent 使用以下请求头：

```
Authorization: Bearer <Meshage API Key>
X-Agent-Id: <自己的 agent_id>
Content-Type: application/json
```

### 1. 创建 Trace

```http
POST {api_base}/agent/conversations/{conversation_id}/traces
{ "title": "Demo task" }
```

返回 `id`（trace_id）。

### 2. 创建 Step

```http
POST {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}/steps
{
  "summary": "解析意图",
  "is_critical_path": true,
  "initial_status": "running"
}
```

`initial_status` 可选；不传则默认 `queued`。

### 3. 推进步骤

```http
POST {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}/steps/{step_id}/transition
{ "status": "waiting_human", "summary": "请用户确认", "viewer_scope": "public" }
```

只接受合法的状态转移（见上表），否则返回 409 并写入 `STEP_TRANSITION_REJECTED` 事件。

### 4. 追加自定义事件

```http
POST {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}/steps/{step_id}/events
{
  "event_type": "TOOL_OUTPUT",
  "status": "running",
  "summary": "数据库查询返回 12 行",
  "viewer_scope": "scoped",
  "payload": { "rows": 12 }
}
```

`viewer_scope` 控制可见性：

- `public`：所有参与者均可见，且 payload 完整可读。
- `scoped`（默认）：用户参与者完整可读；其他 Agent 看不到 payload，除非自己是事件 actor。
- `restricted`：其他 Agent 看不到事件本身，仅事件作者可见。

### 5. 读取 / 回放（Agent 视角）

```http
GET {api_base}/agent/conversations/{conversation_id}/traces
GET {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}
GET {api_base}/agent/conversations/{conversation_id}/traces/{trace_id}/events?after_ts=...
```

Agent 视角自动应用可见性过滤；用户视角通过 `/conversations/.../traces/...` 一组对应端点读取。

## 用户端体验

- 会话顶部出现 Task 卡片，显示 `completed / total`、`waiting`、`failed`、`blocked` 计数。
- 点击卡片进入任务视图：宽屏左侧树 + 右侧时间线；窄屏单列时间线。
- 任务视图加载后自动选中第一个 `waiting_human` 步骤，让用户最快两次点击就能审批（开会话 → 点卡片）。
- WebSocket 推送 `task_event`，UI 不需要刷新即可更新。

## 关键路径失败级联

当一个 `is_critical_path=true` 的 Step 进入 `failed` / `cancelled`，所有未终态的 Step 会被级联标记为 `blocked`，并各自产生一个 `STEP_BLOCKED` 事件。`get_trace_detail` 的聚合也会包含 `blocked_steps`。

## 完整示例

`demo-agent` 已经实现了一条最小闭环：用户发 `demo`，Agent 创建 Trace + 3 个步骤，第二步等待人类审批，回复包含 `approval_card` 的 A2UI 蓝图。源代码见 [`demo-agent/main.py`](https://github.com/woodbird/MeshChat/blob/main/demo-agent/main.py)。

## 参考

- API 文档：[任务透明层 API](../api/traces) / [Agent 透明层 API](../api/agent-traces)
- 协议规格：[specs/009-collaboration-transparency](https://github.com/woodbird/MeshChat/tree/main/specs/009-collaboration-transparency)
