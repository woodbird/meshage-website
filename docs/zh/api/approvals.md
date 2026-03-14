---
title: 审批 API
description: 获取待审批列表、批准和拒绝代理操作请求
lastUpdated: true
---

# 审批 API

当 AI 代理执行高风险操作时（如修改数据、发送部署等），Meshage 的「人在回路」机制会生成审批请求。用户需要通过审批 API 批准或拒绝这些请求。

**Base URL:** `http://localhost:8000/api/v1`
**认证方式:** Session Cookie (`session_id`)

---

## GET /approvals

获取当前用户的待审批列表。

**请求：**

```bash
curl "http://localhost:8000/api/v1/approvals?status=pending&limit=20" \
  -H "Cookie: session_id=YOUR_SESSION"
```

**查询参数：**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `status` | string | 否 | 过滤状态：`pending`、`approved`、`rejected`，默认 `pending` |
| `limit` | integer | 否 | 返回条数，默认 20 |
| `offset` | integer | 否 | 分页偏移量，默认 0 |

**成功响应：** `200 OK`

```json
{
  "approvals": [
    {
      "id": "appr-550e8400-e29b-41d4-a716-446655440000",
      "agent": {
        "id": "agt-001",
        "name": "数据库管理助手"
      },
      "conversation_id": "conv-001",
      "action": "execute_sql",
      "description": "代理请求执行 SQL：DELETE FROM temp_records WHERE created_at < '2026-01-01'",
      "context": {
        "sql": "DELETE FROM temp_records WHERE created_at < '2026-01-01'",
        "affected_rows_estimate": 1523
      },
      "status": "pending",
      "created_at": "2026-03-01T10:00:00Z"
    }
  ],
  "total": 3,
  "has_more": true
}
```

**字段说明：**

| 字段 | 说明 |
|------|------|
| `action` | 代理请求执行的操作类型 |
| `description` | 人类可读的操作描述 |
| `context` | 操作的详细上下文（因操作类型而异） |
| `status` | 审批状态：`pending` / `approved` / `rejected` |

---

## POST /approvals/:id/approve

批准指定的审批请求。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/approvals/appr-550e8400.../approve \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"comment": "确认执行"}'
```

**请求体（可选）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `comment` | string | 否 | 审批备注 |

**成功响应：** `200 OK`

```json
{
  "id": "appr-550e8400...",
  "status": "approved",
  "approved_by": "usr-550e8400...",
  "comment": "确认执行",
  "updated_at": "2026-03-01T10:05:00Z"
}
```

批准后，平台会通知代理继续执行操作。

**错误响应：**

| 状态码 | 场景 |
|--------|------|
| `404 Not Found` | 审批请求不存在 |
| `409 Conflict` | 审批请求已被处理 |
| `403 Forbidden` | 无权审批此请求 |

---

## POST /approvals/:id/reject

拒绝指定的审批请求。

**请求：**

```bash
curl -X POST http://localhost:8000/api/v1/approvals/appr-550e8400.../reject \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"reason": "影响范围太大，需要进一步确认"}'
```

**请求体（可选）：**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `reason` | string | 否 | 拒绝原因 |

**成功响应：** `200 OK`

```json
{
  "id": "appr-550e8400...",
  "status": "rejected",
  "rejected_by": "usr-550e8400...",
  "reason": "影响范围太大，需要进一步确认",
  "updated_at": "2026-03-01T10:05:00Z"
}
```

拒绝后，平台会通知代理操作被拒绝，代理应中止该操作并向用户反馈。

---

## 审批流程

```
代理发起高风险操作
       │
       ▼
平台生成审批请求（status: pending）
       │
       ├─── WebSocket 推送 approval.pending 事件给用户
       │
       ▼
用户在 App 中查看审批卡片
       │
       ├── 批准 → POST /approvals/{id}/approve → 代理继续执行
       │
       └── 拒绝 → POST /approvals/{id}/reject  → 代理中止操作
```

详见 [WebSocket 接入](/zh/developer/websocket) 中的 `approval.pending` 事件。
