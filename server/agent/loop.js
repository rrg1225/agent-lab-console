import { decideNextAction } from "./planner.js";
import { runTool } from "./tools.js";

export async function runAgent(task, options = {}) {
  const maxSteps = Number(options.maxSteps || process.env.AGENT_MAX_STEPS || 6);
  const state = {
    runId: `run_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    startedAt: new Date().toISOString(),
    task: String(task || "").trim(),
    mode: options.mode || process.env.AGENT_MODE || "dry-run",
    observations: [],
    trace: [],
    risk: null,
    status: "running"
  };

  if (state.task.length < 4) {
    return finish(state, "blocked", "Task is too short to execute safely.");
  }

  for (let step = 1; step <= maxSteps; step += 1) {
    const decision = decideNextAction(state);
    state.trace.push({ step, phase: "decide", decision });

    if (decision.type === "finish") {
      return finish(state, decision.reason === "blocked_by_policy" ? "blocked" : "completed", decision.reason);
    }

    const startedAt = performance.now();
    try {
      const output = await runTool(decision.tool, decision.input, state);
      const observation = {
        tool: decision.tool,
        input: decision.input,
        output,
        latencyMs: Math.round(performance.now() - startedAt)
      };
      state.observations.push(observation);
      state.trace.push({ step, phase: "act", observation });

      if (decision.tool === "risk_check") state.risk = output;
      state.trace.push({ step, phase: "validate", ok: validateObservation(observation) });
    } catch (error) {
      state.trace.push({ step, phase: "error", error: error.message });
      return finish(state, "failed", error.message);
    }
  }

  return finish(state, "blocked", "Maximum step count reached before completion.");
}

function validateObservation(observation) {
  if (observation.tool === "search_knowledge") return Array.isArray(observation.output);
  if (observation.tool === "risk_check") return Boolean(observation.output?.level);
  if (observation.tool === "draft_execution_plan") return Array.isArray(observation.output?.steps);
  if (observation.tool === "create_ticket") return observation.output?.externalWritePerformed === false;
  return false;
}

function finish(state, status, reason) {
  state.status = status;
  state.completedAt = new Date().toISOString();
  state.durationMs = Math.max(0, Date.parse(state.completedAt) - Date.parse(state.startedAt));
  state.final = {
    status,
    reason,
    summary: summarize(state),
    observations: state.observations.length,
    mode: state.mode,
    quality: assessRunQuality(state)
  };
  return state;
}

function assessRunQuality(state) {
  const usedTools = new Set(state.observations.map((item) => item.tool));
  const validationEvents = state.trace.filter((item) => item.phase === "validate");
  return {
    grounded: usedTools.has("search_knowledge"),
    riskChecked: usedTools.has("risk_check") || Boolean(state.risk),
    dryRunOnly: state.mode === "dry-run",
    validationEvents: validationEvents.length,
    externalWrites: state.observations.filter((item) => item.output?.externalWritePerformed).length
  };
}

function summarize(state) {
  if (state.status === "blocked") {
    return `Blocked safely: ${state.risk?.reason || "the agent could not complete within its limits."}`;
  }

  const plan = state.observations.find((item) => item.tool === "draft_execution_plan")?.output;
  const sources = state.observations.find((item) => item.tool === "search_knowledge")?.output || [];
  return [
    `Completed dry-run plan for: ${state.task}`,
    plan ? `Plan steps: ${plan.steps.length}` : "No plan generated.",
    sources.length ? `Grounded by ${sources.length} knowledge snippets.` : "No matching knowledge snippets found."
  ].join(" ");
}
