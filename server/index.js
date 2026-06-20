import express from "express";
import cors from "cors";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { runAgent } from "./agent/loop.js";
import { toolCatalog } from "./agent/tools.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

export function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json({ limit: "256kb" }));

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "agent-lab-console", mode: process.env.AGENT_MODE || "dry-run" });
  });

  app.get("/api/tools", (_req, res) => {
    res.json(toolCatalog);
  });

  app.post("/api/runs", async (req, res, next) => {
    try {
      const run = await runAgent(req.body.task, {
        mode: req.body.mode || "dry-run",
        maxSteps: req.body.maxSteps
      });
      await persistTrace(run);
      res.status(run.status === "failed" ? 500 : 200).json(run);
    } catch (error) {
      next(error);
    }
  });

  app.use(express.static(join(rootDir, "dist")));
  app.get("*", (_req, res) => {
    res.sendFile(join(rootDir, "dist", "index.html"));
  });

  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: error.message || "unexpected server error" });
  });

  return app;
}

async function persistTrace(run) {
  const traceDir = join(rootDir, "traces");
  await mkdir(traceDir, { recursive: true });
  await writeFile(join(traceDir, `${run.runId}.json`), JSON.stringify(run, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4320);
  createApp().listen(port, () => {
    console.log(`Agent Lab Console running on http://localhost:${port}`);
  });
}
