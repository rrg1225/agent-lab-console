export function decideNextAction(state) {
  if (state.risk?.level === "blocked") {
    return { type: "finish", reason: "blocked_by_policy" };
  }

  if (!state.observations.some((item) => item.tool === "risk_check")) {
    return {
      type: "tool",
      tool: "risk_check",
      input: { task: state.task, action: state.task }
    };
  }

  if (!state.observations.some((item) => item.tool === "search_knowledge")) {
    return {
      type: "tool",
      tool: "search_knowledge",
      input: { query: state.task }
    };
  }

  if (!state.observations.some((item) => item.tool === "draft_execution_plan")) {
    return {
      type: "tool",
      tool: "draft_execution_plan",
      input: {}
    };
  }

  if (/ticket|handoff|issue/i.test(state.task) && !state.observations.some((item) => item.tool === "create_ticket")) {
    return {
      type: "tool",
      tool: "create_ticket",
      input: {
        title: `Follow-up for: ${state.task.slice(0, 60)}`
      }
    };
  }

  return { type: "finish", reason: "success_criteria_met" };
}
