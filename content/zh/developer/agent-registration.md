---
title: 代理注册与配置
description: 通过 API 注册代理，配置 AgentCard，管理代理生命周期
lastUpdated: true
---

# 代理注册与配置

代理需要向 Meshage 平台注册后，才能被用户发现和调用。注册过程的核心是提交一份 **AgentCard**——代理的"数字名片"。

## 注册代理

### 请求

```
POST /api/v1/agents
Authorization: Bearer <API_KEY>
Content-Type: application/json
```

### AgentCard 字段

```json
{
  "name": "会议预订助手",
  "description": "帮助用户查询空闲会议室并完成预订",
  "endpoint_url": "http://localhost:8001/",
  "catalog_ids": ["meshage.standard"],
  "avatar_url": "https://example.com/avatar.png",
  "tags": ["会议", "预订", "日程"]
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | 是 | 代理显示名称，最长 64 字符 |
| `description` | string | 是 | 代理能力简介，最长 500 字符 |
| `endpoint_url` | string | 是 | A2A 回调地址，平台将消息 POST 到此 URL |
| `catalog_ids` | string[] | 否 | 支持的 A2UI 组件目录，默认 `["meshage.standard"]` |
| `avatar_url` | string | 否 | 代理头像 URL |
| `tags` | string[] | 否 | 标签，用于搜索和分类 |

### 响应

```json
{
  "id": "agt-550e8400-e29b-41d4-a716-446655440000",
  "name": "会议预订助手",
  "description": "帮助用户查询空闲会议室并完成预订",
  "endpoint_url": "http://localhost:8001/",
  "catalog_ids": ["meshage.standard"],
  "avatar_url": "https://example.com/avatar.png",
  "tags": ["会议", "预订", "日程"],
  "status": "active",
  "owner_id": "usr-xxx",
  "created_at": "2026-03-01T10:00:00Z",
  "updated_at": "2026-03-01T10:00:00Z"
}
```

## endpoint_url 要求

`endpoint_url` 是代理的核心配置——Meshage 平台会将用户消息通过 HTTP POST 转发到该地址。

**要求：**

- 必须是可访问的 HTTP(S) URL
- 必须能处理 JSON-RPC 2.0 格式的 `message/send` 请求
- 建议响应时间 < 30 秒（超时后平台会重试一次）
- 生产环境建议使用 HTTPS

**本地开发时：**

```
http://localhost:8001/          # 后端和代理在同一台机器
http://host.docker.internal:8001/  # 后端在 Docker 中
http://192.168.1.100:8001/      # 使用局域网 IP
```

## catalog_ids 与组件能力协商

`catalog_ids` 声明代理可以使用的 A2UI 组件集合：

- `meshage.standard` — 标准组件库（Row, Column, Text, Button, TextField, Card, Modal）
- 未来支持自定义组件目录

如果代理发送了不在 `catalog_ids` 中的组件类型，平台会返回 `ValidationFailed` 错误。

## 查看代理列表

```bash
curl http://localhost:8000/api/v1/agents \
  -H "Cookie: session_id=YOUR_SESSION"
```

响应：

```json
[
  {
    "id": "agt-550e8400...",
    "name": "会议预订助手",
    "description": "帮助用户查询空闲会议室并完成预订",
    "status": "active",
    "tags": ["会议", "预订", "日程"]
  }
]
```

## 查看代理详情

```bash
curl http://localhost:8000/api/v1/agents/agt-550e8400... \
  -H "Cookie: session_id=YOUR_SESSION"
```

返回完整的 AgentCard 信息。

## 代理生命周期

```
注册 (POST /agents)
  │
  ▼
active ──────────────────→ 接收消息、处理任务
  │                           │
  │  平台检测不可达             │  正常运行
  ▼                           │
inactive ←────────────────────┘
  │
  │  开发者恢复服务
  ▼
active（自动恢复）
```

| 状态 | 说明 |
|------|------|
| `active` | 代理在线，可以接收消息 |
| `inactive` | 代理离线或不可达，平台暂停转发消息 |

平台会定期对代理的 `endpoint_url` 发送健康检查（`GET /health`）。如果连续失败，代理状态会切换为 `inactive`。

## 健康检查端点

建议在代理中实现 `/health` 端点：

```python
@app.get("/health")
def health():
    return {"status": "ok", "agent": "meeting-booking-agent"}
```

## 代理注册的完整示例

```python
import httpx
import os

BASE = os.getenv("MESHAGE_API_BASE", "http://localhost:8000/api/v1")
API_KEY = os.getenv("MESHAGE_API_KEY", "")

def register_agent():
    resp = httpx.post(
        f"{BASE}/agents",
        headers={"Authorization": f"Bearer {API_KEY}"},
        json={
            "name": "我的智能助手",
            "description": "基于大模型的通用问答代理",
            "endpoint_url": "http://localhost:8001/",
            "catalog_ids": ["meshage.standard"],
        },
    )
    resp.raise_for_status()
    agent = resp.json()
    print(f"代理注册成功: {agent['id']}")
    return agent

if __name__ == "__main__":
    register_agent()
```

## 下一步

- [A2A 协议指南](./a2a-protocol) — 理解代理如何接收和响应消息
- [A2UI 开发指南](./a2ui-guide) — 让代理发送富交互组件
- [API Key 管理](./api-keys) — 管理代理的认证凭证
