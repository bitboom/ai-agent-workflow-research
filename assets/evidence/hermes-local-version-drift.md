# Evidence: Hermes Local Version Drift

## Summary

Hermes Agent evidence must be split into two layers:

1. **Installed local runtime** — what the local managed CLI actually runs.
2. **Inspected source clone** — the source tree used for architecture mapping.

These currently differ.

| Surface | Version / state | Evidence meaning |
| --- | --- | --- |
| Installed local CLI | `Hermes Agent v0.12.0 (2026.4.30)` | runtime-confirmed for local install |
| Managed venv metadata | `hermes-agent==0.12.0`, `openai==2.32.0` | package-level runtime evidence |
| Source clone | `0.17.0` | source architecture target, not local runtime proof |

## Interpretation

- Claims about files in the source clone are source-confirmed for that clone.
- Claims about local behavior are runtime-confirmed only for installed `0.12.0` unless re-run against source `0.17.0`.
- Public docs should display this drift prominently to avoid false equivalence.

## Source architecture anchors

The source clone contains anchors for:

- `run_agent.py` / `agent/conversation_loop.py` — core `AIAgent` loop.
- `model_tools.py`, `tools/registry.py`, `agent/tool_executor.py` — tool registry and dispatch.
- `gateway/run.py` — gateway runner, delivery router, per-session agent cache.
- `tools/delegate_tool.py` — subagent/delegation runtime.
- `cron/scheduler.py` / `cron/jobs.py` — durable scheduled jobs.
- `tools/mcp_tool.py` / `mcp_serve.py` — MCP client/server surfaces.
- `acp_adapter/*` — ACP integration.

## Required next evidence

1. Run a clean source `0.17.0` environment and verify console scripts.
2. Produce installed `0.12.0` runtime traces for non-mutating CLI/tools/MCP/session commands.
3. If gateway/cron/delegation probes are run, use an isolated profile and publish only sanitized summaries.
