# Agent Lab Console

Agent Lab Console is a portfolio-ready AI Agent application for prototyping tool-using workflows. It demonstrates an explicit observe-decide-act-validate loop, narrow tool contracts, permission labels, dry-run writes, risk checks, trace persistence, and evaluation scenarios.

The app runs without any API key. By default it uses a deterministic planner so reviewers can clone the repo and immediately inspect agent behavior. `.env.example` includes optional provider variables for future OpenAI-compatible, Gemini, or DashScope integration.

## Highlights

- Explicit agent state and stop conditions.
- Tool catalog with read and dry-run write permissions.
- Guardrails for destructive, unsafe, or instruction-override requests.
- Full trace timeline in the UI and persisted JSON traces.
- Scenario-based eval command for regression checks.
- React 19 + Vite frontend with Express backend.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:4320`.

## Scripts

```bash
npm run dev      # start API and Vite together
npm run build    # build the frontend
npm run start    # serve the API and built frontend
npm test         # run unit tests
npm run eval     # run agent scenario evals
```

## Agent Loop

```text
observe task
decide next action
act through one narrow tool
validate tool output
update state
continue or stop
```

## Repository Topics

`ai-agent`, `tool-calling`, `agentic-workflow`, `guardrails`, `evaluation`, `react`, `express`
