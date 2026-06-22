import assert from "node:assert/strict";
import test from "node:test";
import { createApp } from "../server/index.js";

test("exposes runtime metrics and request correlation headers", async () => {
  const server = createApp().listen(0);
  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const health = await fetch(`${baseUrl}/api/health`, {
      headers: { "x-request-id": "test-request-id" }
    });

    assert.equal(health.headers.get("x-request-id"), "test-request-id");
    assert.equal(health.headers.get("x-content-type-options"), "nosniff");

    const metrics = await fetch(`${baseUrl}/api/metrics/runtime`).then((response) => response.json());
    assert.equal(metrics.service, "agent-lab-console");
    assert.ok(metrics.requests >= 2);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("validates agent run requests with structured errors", async () => {
  const server = createApp().listen(0);
  try {
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(`${baseUrl}/api/runs`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-request-id": "invalid-agent-run"
      },
      body: JSON.stringify({ task: "go" })
    });
    const payload = await response.json();

    assert.equal(response.status, 400);
    assert.equal(payload.error.code, "invalid_request");
    assert.equal(payload.error.requestId, "invalid-agent-run");
    assert.equal(payload.service, "agent-lab-console");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
