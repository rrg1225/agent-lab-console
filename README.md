# Agent Lab Console

[简体中文](#简体中文) | [English](#english)

Agent Lab Console is a portfolio-ready AI agent engineering demo. It shows how to build a tool-using workflow with explicit permissions, deterministic planning, guardrails, trace persistence, runtime observability, and scenario-based evals.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)
> Enterprise architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)

---

## 简体中文

### 项目定位

这是一个“可审计 Agent 控制台”演示项目。它不依赖真实模型 Key，也不会执行真实外部写入；默认使用确定性 planner，让评审者克隆后马上看到 agent 如何观察任务、判断风险、调用工具、验证输出并停止。

### 核心亮点

- **Observe / Decide / Act / Validate loop**：每一步都进入 trace timeline，便于复盘、演示和测试。
- **工具权限模型**：工具被标记为 `read` 或 `write-dry-run`，外部写入默认只生成 dry-run 对象。
- **Guardrails**：阻断危险删除、系统指令绕过、关闭审计等高风险请求。
- **场景化 eval**：`npm run eval` 覆盖成功、阻断和短任务等回归场景。
- **Trace 持久化**：每次运行都会写入 `traces/`，也可以从 UI 下载 JSON trace。
- **工程化 API 层**：统一输入校验、结构化错误、请求 ID、404 和安全响应头。
- **运行时指标**：`/api/metrics/runtime` 展示请求数、状态码分布、错误数和启动时间。

### 快速开始

```bash
npm install
npm run dev
```

打开 `http://localhost:5173`。API 默认运行在 `http://localhost:4320`。

### 常用命令

```bash
npm run dev      # 同时启动 API 和 Vite
npm run build    # 构建前端
npm run start    # 启动 Express 并托管 dist
npm test         # 运行单元测试
npm run eval     # 运行 agent 场景评测
```

### API 一览

| Method | Endpoint | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务健康检查 |
| `GET` | `/api/tools` | 返回工具目录与权限标签 |
| `GET` | `/api/metrics/runtime` | 返回运行时请求指标 |
| `POST` | `/api/runs` | 执行一次 dry-run agent run 并持久化 trace |

### 作品集价值

这个项目展示了 agent 工程里比“调模型”更重要的部分：权限边界、可重复测试、风险分级、trace 可观测性、失败阻断路径，以及外部写入的 dry-run 设计。

---

## English

### What It Is

Agent Lab Console is an auditable agent workflow demo. It does not require model keys and does not perform real external writes. The deterministic planner makes every run repeatable for reviewers and tests.

### Highlights

- **Observe / Decide / Act / Validate loop** with a visible trace timeline.
- **Tool permission model** with `read` and `write-dry-run` capability labels.
- **Guardrails** for destructive operations, instruction overrides, and audit bypass attempts.
- **Scenario evals** via `npm run eval` for regression-friendly agent behavior.
- **Downloadable and persisted traces** for audit replay or later eval pipelines.
- **Hardened API layer** with input validation, structured errors, request IDs, 404s, and security headers.
- **Runtime metrics** via `/api/metrics/runtime`.

### Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4320`.

### Scripts

```bash
npm run dev
npm run build
npm run start
npm test
npm run eval
```

### Repository Topics

`ai-agent`, `tool-calling`, `agentic-workflow`, `guardrails`, `evaluation`, `react`, `express`
