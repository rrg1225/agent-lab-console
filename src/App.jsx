import { useEffect, useState } from "react";

const starterTask = "Design a safe AI agent workflow for triaging customer feedback and creating a handoff ticket.";

export default function App() {
  const [task, setTask] = useState(starterTask);
  const [tools, setTools] = useState([]);
  const [run, setRun] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/tools")
      .then((response) => response.json())
      .then(setTools)
      .catch((err) => setError(err.message));
  }, []);

  async function executeRun(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setRun(null);
    try {
      const response = await fetch("/api/runs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task, mode: "dry-run", maxSteps: 6 })
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || payload.final?.reason || "Agent run failed");
      setRun(payload);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Agent engineering console</p>
          <h1>Agent Lab Console</h1>
          <p>
            Prototype agent loops with explicit tools, permission boundaries, risk checks, trace replay, and repeatable evaluation scenarios.
          </p>
        </div>
        <form onSubmit={executeRun} className="runner">
          <label>
            Task
            <textarea value={task} onChange={(event) => setTask(event.target.value)} />
          </label>
          <button disabled={loading}>{loading ? "Running agent..." : "Run dry-run agent"}</button>
        </form>
      </section>

      {error && <div className="alert">{error}</div>}

      <section className="grid">
        <aside className="panel">
          <h2>Tool Catalog</h2>
          <div className="tool-list">
            {tools.map((tool) => (
              <article key={tool.name}>
                <strong>{tool.name}</strong>
                <span>{tool.permission}</span>
                <p>{tool.description}</p>
              </article>
            ))}
          </div>
        </aside>

        <section className="panel">
          <h2>Run Result</h2>
          {!run ? (
            <p className="muted">Run the default task or write your own agent workflow request.</p>
          ) : (
            <div className="result">
              <div className={`status ${run.status}`}>{run.status}</div>
              <p>{run.final.summary}</p>
              <div className="cards">
                <Metric label="Trace events" value={run.trace.length} />
                <Metric label="Observations" value={run.final.observations} />
                <Metric label="Mode" value={run.final.mode} />
              </div>
            </div>
          )}
        </section>
      </section>

      <section className="panel">
        <h2>Trace Timeline</h2>
        {!run ? (
          <p className="muted">Trace events appear here after a run.</p>
        ) : (
          <div className="timeline">
            {run.trace.map((event, index) => (
              <article key={`${event.step}-${event.phase}-${index}`}>
                <span>Step {event.step} / {event.phase}</span>
                <pre>{JSON.stringify(event.decision || event.observation || event, null, 2)}</pre>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
