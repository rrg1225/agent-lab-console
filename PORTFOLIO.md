# Portfolio Brief: Agent Lab Console

## Resume Bullets

- Built an auditable AI agent console with deterministic planning, explicit tool permissions, policy guardrails, persisted traces, and scenario-based evals.
- Designed an observe-decide-act-validate loop that blocks unsafe instructions and converts external writes into dry-run artifacts.
- Built deterministic scenario evals for safe planning, destructive requests, ambiguous tasks, and tool-use behavior.

## What This Proves

- Agent workflow design beyond basic chat completion.
- Tool calling boundaries, dry-run safety design, and trace observability.
- Evaluation-driven development for agent behavior.

## Verification

```bash
npm ci
npm run eval
npm run build
```

## Interview Talking Points

- Why deterministic mode is useful for repeatable demos and CI.
- How the policy layer handles unsafe tasks before tool execution.
- How traces can be replayed or connected to a future evaluation pipeline.
