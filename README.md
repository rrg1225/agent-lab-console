# Agent Lab Console

[![CI](https://github.com/rrg1225/agent-lab-console/actions/workflows/ci.yml/badge.svg)](https://github.com/rrg1225/agent-lab-console/actions/workflows/ci.yml)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Express](https://img.shields.io/badge/Express-API-111827?logo=express)
![Agent](https://img.shields.io/badge/AI-Agent%20Workflow-7C3AED)
![License](https://img.shields.io/badge/License-MIT-green)

Agent Lab Console is a portfolio-grade AI agent engineering console. It demonstrates a deterministic agent loop with tool permissions, guardrails, dry-run external writes, trace persistence, runtime metrics, and a polished React dashboard.

> Resume and interview brief: [PORTFOLIO.md](PORTFOLIO.md)
> Enterprise architecture: [docs/ENTERPRISE_ARCHITECTURE.md](docs/ENTERPRISE_ARCHITECTURE.md)

## Why This Project Matters

Most agent demos stop at a chat box. This project focuses on the engineering layer that makes agents reviewable and safer: explicit tools, policy gates, structured traces, bounded execution, and dry-run write behavior.

## Features

- Deterministic observe -> decide -> act -> validate loop.
- Tool catalog with `read` and `write-dry-run` permission labels.
- Guardrails for destructive operations, instruction override attempts, and audit bypasses.
- JSON trace persistence under `traces/` for replay and audit review.
- Runtime request metrics and operational scorecard APIs.
- Request correlation through `x-request-id` and browser security headers.
- React UI for task entry, trace timeline, risk status, and trace download.

## Architecture

```text
React UI
  -> Express API
  -> Agent planner
  -> Policy checks
  -> Tool runner
  -> Trace persistence
```

Key modules:

| Path | Purpose |
| --- | --- |
| `server/agent/loop.js` | Agent state machine and execution lifecycle |
| `server/agent/planner.js` | Deterministic next-action selection |
| `server/agent/policies.js` | Risk and guardrail rules |
| `server/agent/tools.js` | Tool registry and dry-run implementations |
| `server/http.js` | Shared API errors, async routes, and 404 handling |
| `src/App.jsx` | Agent console UI |

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API defaults to `http://localhost:4320`.

## Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the React app
npm run start    # serve Express and built frontend
npm run eval     # run deterministic scenario evals
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Service health and current mode |
| `GET` | `/api/tools` | Tool catalog and permission classes |
| `GET` | `/api/metrics/runtime` | Runtime request and status metrics |
| `GET` | `/api/metrics/scorecard` | Operational readiness score and checks |
| `POST` | `/api/runs` | Execute a dry-run agent run and persist trace |

## Safety Model

- External writes are represented as dry-run objects.
- Dangerous tasks are blocked before tool execution.
- Request IDs are returned in response headers and structured errors.
- Provider keys are intentionally not required for the deterministic demo.

## GitHub Readiness

The repository includes CI, production build scripts, architecture notes, interview positioning, and a deterministic demo path that works without API keys.

## Quality Gates

- `npm test` runs API smoke coverage and deterministic agent evaluation scenarios.
- `npm run build` validates the production React bundle.
- GitHub Actions runs tests and build on pull requests and `main`.
- Trace JSON files are generated locally and ignored by Git to keep audit data out of commits.

## Roadmap

- Add trace replay diffing for prompt and policy changes.
- Add pluggable model/provider adapters behind the deterministic planner.
- Add role-based tool approval states for reviewer workflows.

## License

MIT

## Enterprise Readiness

This repository now includes contribution guidelines, a security policy, operational runbook notes, PR review gates, and automated readiness checks. See [docs/ENTERPRISE_READINESS.md](docs/ENTERPRISE_READINESS.md) and [docs/OPERATIONS.md](docs/OPERATIONS.md).
