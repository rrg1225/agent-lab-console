# Enterprise Architecture

## Enterprise Positioning

Agent Lab Console is designed as an internal AI-agent governance console, not a toy chatbot. In an enterprise setting it sits between product teams, automation tools, and model providers to make agent behavior observable, permissioned, testable, and safe to review before any external write occurs.

## Architecture Boundaries

- **Frontend**: React console for task entry, tool catalog review, trace inspection, and trace export.
- **API layer**: Express service exposing health, tool catalog, runtime metrics, and agent run APIs.
- **Agent core**: deterministic observe-decide-act-validate loop with policy checks before tool execution.
- **Tool boundary**: tools are described by domain action and permission class (`read`, `write-dry-run`).
- **Trace store**: local JSON traces for audit replay; replaceable with object storage or an event store.

## Production Hardening Added

- Request correlation through `x-request-id`.
- Security headers: `x-content-type-options`, `x-frame-options`, and `referrer-policy`.
- Runtime metrics endpoint at `/api/metrics/runtime`.
- CI gates for unit tests, scenario evals, and production build.

## Enterprise Extension Path

1. Replace deterministic planner with a provider adapter while keeping policy checks deterministic.
2. Persist traces to append-only storage such as S3, GCS, PostgreSQL, or an audit event stream.
3. Add RBAC for who can run agents, review dry-run actions, and approve external writes.
4. Add eval datasets per department and run them in CI before prompt/tool changes ship.
5. Add OpenTelemetry spans around planner decisions, tool calls, policy checks, and validation.

## SLO and Observability

- **Availability target**: 99.9% for internal agent review console.
- **Latency target**: p95 dry-run completion under 2 seconds in deterministic mode.
- **Quality target**: 100% block rate for known destructive prompts in regression scenarios.
- **Core dashboards**: request rate, error rate, blocked-run rate, dry-run write count, trace persistence failures.

## Security Model

- External writes are dry-run by default.
- Dangerous prompts are blocked before tool execution.
- Provider keys belong in environment variables, never in committed files.
- Future production mode should enforce identity, RBAC, approval workflow, and immutable audit logs.

## Interview-Level Design Rationale

The key architecture decision is that safety is enforced in code-level policy gates, not just in prompts. This makes the system easier to test, easier to audit, and safer to evolve when a real model provider is introduced.
