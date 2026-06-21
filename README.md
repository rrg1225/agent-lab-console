# Agent Lab Console

[简体中文](#简体中文) | [English](#english)

Agent Lab Console is a portfolio-ready AI agent engineering demo. It shows how to build a tool-using workflow with explicit permissions, deterministic planning, guardrails, trace persistence, and scenario-based evals.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)

---

## 简体中文

### 项目定位

这是一个“可审计 Agent 控制台”演示项目。它不依赖真实模型 Key，也不会执行真实外部写入；默认使用确定性 planner，让评审者克隆后马上看到 agent 如何观察任务、判断风险、调用工具、验证输出并停止。

### 核心亮点

- **Observe / Decide / Act / Validate loop**：每一步都进入 trace timeline，便于复盘和演示。
- **工具权限模型**：工具被标记为 `read` 或 `write-dry-run`，外部写入默认只生成 dry-run 对象。
- **Guardrails**：阻断危险删除、系统指令绕过、关闭审计等高风险请求。
- **场景化 Eval**：`npm run eval` 覆盖成功、阻断和短任务等回归场景。
- **Trace 可下载**：每次运行都能下载 JSON trace，方便接入后续评测流水线。
- **无需 API Key**：确定性 planner 保证 demo 可重复、可测试、可离线展示。
- **Provider-ready 配置**：`.env.example` 预留 OpenAI-compatible、Gemini 和 DashScope 配置位。

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

### Agent Loop

```text
observe task
decide next action
act through one narrow tool
validate tool output
update state
finish, escalate, or continue
```

### API 一览

| Method | Endpoint | 说明 |
| --- | --- | --- |
| `GET` | `/api/health` | 服务健康检查 |
| `GET` | `/api/tools` | 返回工具目录与权限标签 |
| `POST` | `/api/runs` | 执行一次 dry-run agent run 并持久化 trace |

### 为什么适合作品集

这个项目展示了 agent 工程里比“调模型”更重要的部分：权限边界、可重复测试、风险分级、trace 可观测性、失败阻断路径，以及外部写入的 dry-run 设计。

---

## English

### What It Is

Agent Lab Console is an auditable agent workflow demo. It does not require model keys and does not perform real external writes. The default deterministic planner makes every run repeatable for reviewers and tests.

### Highlights

- **Observe / Decide / Act / Validate loop** with a visible trace timeline.
- **Tool permission model** with `read` and `write-dry-run` capability labels.
- **Guardrails** for destructive operations, instruction overrides, and audit bypass attempts.
- **Scenario evals** via `npm run eval` for regression-friendly agent behavior.
- **Downloadable traces** so every run can be audited, replayed, or fed into a later eval pipeline.
- **No API key required** because the built-in planner is deterministic.
- **Provider-ready config** through `.env.example` for OpenAI-compatible, Gemini, and DashScope integrations.

### Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4320`.

### Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the frontend
npm run start    # serve Express and built frontend
npm test         # run unit tests
npm run eval     # run agent scenario evals
```

### API Surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tools` | Tool catalog and permission labels |
| `POST` | `/api/runs` | Execute a dry-run agent run and persist its trace |

## Repository Topics

`ai-agent`, `tool-calling`, `agentic-workflow`, `guardrails`, `evaluation`, `react`, `express`
