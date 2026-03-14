---
title: API Key 管理
description: 创建、查看和删除 API Key，安全最佳实践
lastUpdated: true
---

# API Key 管理

API Key 是代理接入 Meshage 平台的凭证。每个 Key 绑定到创建它的用户账号，一个 Key 可以被多个代理共享使用。

## 创建 API Key

### 通过 App 创建

1. 打开 Meshage App → 「我的」→「API Key 管理」
2. 点击右上角「+」按钮
3. 输入 Key 名称（如 `production-agents`）
4. 点击「创建」，**立即复制显示的 Key 值**

:::warning 重要
API Key 只在创建时完整显示一次。丢失后无法找回，需要重新创建。
:::

### 通过 API 创建

```bash
curl -X POST http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION" \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent-key"}'
```

响应：

```json
{
  "id": "key-uuid-001",
  "name": "my-agent-key",
  "key": "mk_a1b2c3d4e5f6...",
  "created_at": "2026-03-01T10:00:00Z"
}
```

`key` 字段为完整密钥，仅在此次响应中返回。

## 查看 API Key 列表

```bash
curl http://localhost:8000/api/v1/api-keys \
  -H "Cookie: session_id=YOUR_SESSION"
```

响应：

```json
[
  {
    "id": "key-uuid-001",
    "name": "my-agent-key",
    "key_prefix": "mk_a1b2****",
    "created_at": "2026-03-01T10:00:00Z"
  }
]
```

列表接口只返回 Key 前缀（`key_prefix`），不返回完整密钥。

## 删除 API Key

```bash
curl -X DELETE http://localhost:8000/api/v1/api-keys/key-uuid-001 \
  -H "Cookie: session_id=YOUR_SESSION"
```

响应：`204 No Content`

:::danger 注意
删除 Key 后，所有使用该 Key 注册的代理将**立即失去认证能力**，无法再接收来自平台的消息。请确认不再需要该 Key 后再执行删除。
:::

## 一个 Key 管理多个代理

API Key 与代理是**一对多**关系。你可以：

- 用一个 Key 注册多个代理（适合同一项目下的多个服务）
- 为不同项目创建不同的 Key（便于权限隔离和审计）

```
API Key: mk_prod_xxx
  ├── 会议预订代理
  ├── 报表生成代理
  └── 客服问答代理

API Key: mk_test_xxx
  └── 测试代理
```

## 安全最佳实践

### 存储

- **永远不要**将 API Key 硬编码在源代码中
- 使用环境变量存储：`export MESHAGE_API_KEY=mk_xxx`
- 在生产环境中使用密钥管理服务（如 Vault、AWS Secrets Manager）

### 使用

```python
import os

API_KEY = os.getenv("MESHAGE_API_KEY")
if not API_KEY:
    raise RuntimeError("MESHAGE_API_KEY 环境变量未设置")
```

### 轮换

- 定期轮换 Key：创建新 Key → 更新代理配置 → 删除旧 Key
- 发现 Key 泄露时立即删除并重新创建

### 权限隔离

- 生产环境和开发环境使用不同的 Key
- 不同团队或项目使用独立的 Key
- 监控 Key 的使用情况，发现异常及时处理

## API Key 认证方式

代理在调用需要认证的 API 时，通过 `Authorization` 请求头传递 Key：

```
Authorization: Bearer mk_a1b2c3d4e5f6...
```

示例：

```bash
curl -X POST http://localhost:8000/api/v1/agents \
  -H "Authorization: Bearer mk_a1b2c3d4e5f6..." \
  -H "Content-Type: application/json" \
  -d '{"name": "my-agent", "endpoint_url": "http://localhost:8001/"}'
```

## 下一步

- [代理注册与配置](./agent-registration) — 使用 API Key 注册你的第一个代理
- [快速开始](./quickstart) — 完整的代理上线教程
