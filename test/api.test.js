import test from "node:test";
import assert from "node:assert/strict";
import { createApp } from "../server/index.js";

async function startServer() {
  const app = createApp();
  const server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  const { port } = server.address();
  return { server, baseUrl: `http://127.0.0.1:${port}` };
}

test("exposes health, tools, and deterministic run APIs", async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => server.close());

  const health = await fetch(`${baseUrl}/api/health`);
  assert.equal(health.status, 200);
  assert.equal(health.headers.get("x-frame-options"), "DENY");
  assert.match(health.headers.get("content-security-policy"), /frame-ancestors 'none'/);
  assert.equal((await health.json()).service, "agent-lab-console");

  const tools = await fetch(`${baseUrl}/api/tools`);
  assert.equal(tools.status, 200);
  assert.ok(Array.isArray(await tools.json()));

  const run = await fetch(`${baseUrl}/api/runs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ task: "Draft a safe onboarding plan for a new agent workflow" })
  });
  assert.equal(run.status, 200);
  const body = await run.json();
  assert.equal(body.status, "completed");
  assert.equal(body.final.quality.dryRunOnly, true);
});

test("clamps oversized agent step requests", async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => server.close());

  const run = await fetch(`${baseUrl}/api/runs`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      task: "Create a handoff ticket for the onboarding workflow",
      maxSteps: 1000
    })
  });
  assert.equal(run.status, 200);
  const body = await run.json();
  assert.ok(body.trace.length <= 36);
});

test("exposes an operational scorecard", async (t) => {
  const { server, baseUrl } = await startServer();
  t.after(() => server.close());

  const response = await fetch(`${baseUrl}/api/metrics/scorecard`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.grade, "A");
  assert.ok(body.checks.some((check) => check.id === "request_correlation"));
});
