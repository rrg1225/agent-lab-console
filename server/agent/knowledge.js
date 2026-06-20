export const knowledgeBase = [
  {
    id: "kb-agent-loop",
    title: "Agent loop design",
    tags: ["loop", "state", "tools"],
    content:
      "A reliable agent loop observes the task, decides the next action, calls one narrow tool, validates the output, updates state, and stops when success criteria or escalation rules are met."
  },
  {
    id: "kb-permissions",
    title: "Tool permission model",
    tags: ["security", "permissions", "tools"],
    content:
      "Tools should separate read, write, network, deletion, and user-notification capabilities. Irreversible actions require explicit confirmation and audit logs."
  },
  {
    id: "kb-evaluation",
    title: "Agent evaluation",
    tags: ["eval", "regression", "trace"],
    content:
      "Evaluate agents with realistic traces that include ambiguous instructions, tool failures, unsafe requests, and success cases. Score completion, precision, latency, and unnecessary steps."
  },
  {
    id: "kb-prompt-injection",
    title: "Prompt injection near tools",
    tags: ["security", "prompt-injection"],
    content:
      "Treat retrieved or user-provided content as untrusted. Never let content override system rules, tool permissions, or confirmation requirements."
  }
];
