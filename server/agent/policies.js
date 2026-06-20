const unsafePatterns = [
  /delete\s+(all|production|database|repo)/i,
  /disable\s+(auth|audit|logging)/i,
  /send\s+secret/i,
  /ignore\s+(previous|system)\s+instructions/i
];

export function evaluateRisk(task, proposedAction) {
  const combined = `${task} ${proposedAction || ""}`;
  const hits = unsafePatterns.filter((pattern) => pattern.test(combined)).length;

  if (hits > 0) {
    return {
      level: "blocked",
      reason: "The request resembles an unsafe or irreversible action and needs human approval."
    };
  }

  if (/deploy|email|notify|write|create ticket/i.test(combined)) {
    return {
      level: "review",
      reason: "The action changes external state; dry-run mode will produce a plan instead of executing."
    };
  }

  return {
    level: "low",
    reason: "No high-risk action detected."
  };
}
