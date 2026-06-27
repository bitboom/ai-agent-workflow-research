# Hermes Agent Deep Dive

이 문서는 LazyCodex/OmO `$ultraresearch` 저널을 controller가 public-safe 형태로 정리한 Hermes Agent 딥다이브다. 핵심은 “repo editor”가 아니라 **persistent multi-platform agent runtime/coordinator**로 보는 것이다.

## Verdict

| Area | Status | Reason |
| --- | --- | --- |
| Installed local runtime | **runtime-confirmed** | installed CLI reports `Hermes Agent v0.12.0 (2026.4.30)` and managed venv metadata reports `hermes-agent==0.12.0` |
| Source clone architecture | **source-confirmed** | source clone declares version `0.17.0` and exposes loop/tool/gateway/delegation/MCP/ACP/cron anchors |
| Installed vs source parity | **unresolved** | local runtime `0.12.0` and inspected source `0.17.0` differ materially |
| Gateway/cron/MCP/delegation runtime | **not yet replayed** | help/version proof exists, but end-to-end runtime traces are missing |

## Version boundary

| Surface | Observed version | Evidence meaning |
| --- | --- | --- |
| Installed runtime | `Hermes Agent v0.12.0 (2026.4.30)` | What the local managed CLI currently reports |
| Installed package metadata | `hermes-agent==0.12.0`, `openai==2.32.0` | Managed venv package state |
| Inspected source clone | `0.17.0` | Source architecture map target, not proof of local runtime behavior |

Do not claim that source `0.17.0` behavior is present in installed `0.12.0` without a separate runtime probe.

## Source anchors

- `run_agent.py` — `AIAgent` runtime entry and core conversation loop framing.
- `agent/conversation_loop.py` — per-turn loop extraction, turn context, memory/model/guardrail/trajectory dependencies.
- `agent/agent_init.py`, `agent/turn_context.py` — initialization and turn state boundaries.
- `agent/prompt_builder.py`, `agent/memory_manager.py`, `agent/skill_commands.py` — prompt/context/memory/skill injection surface.
- `model_tools.py`, `tools/registry.py`, `agent/tool_executor.py`, `tools/tool_search.py` — tool schema/registry/dispatch/search path.
- `gateway/run.py`, `gateway/session.py`, `gateway/status.py` — gateway runner, session store, delivery router, per-session `AIAgent` cache.
- `tools/delegate_tool.py`, `tools/process_registry.py` — subagent registry, depth/concurrency, pause/interrupt state.
- `cron/scheduler.py`, `cron/jobs.py`, `cron/scheduler_provider.py` — durable scheduled job execution and delivery/session seeding candidates.
- `tools/mcp_tool.py`, `mcp_serve.py`, `acp_adapter/entry.py`, `acp_adapter/session.py`, `acp_adapter/edit_approval.py` — MCP/ACP/external control surfaces.
- `tools/terminal_tool.py`, `tools/code_execution_tool.py`, `agent/file_safety.py`, `agent/secret_scope.py` — execution and safety boundaries.

## Runtime proof status

Confirmed:

- `hermes --version` reports local installed runtime `0.12.0`.
- package metadata in the managed venv reports `hermes-agent==0.12.0`.
- CLI help exposes broad command surface including chat/gateway/cron/skills/plugins/memory/tools/mcp/sessions/dashboard/logs/version/update/acp/profile.

Not confirmed yet:

- live gateway session creation/resume behavior.
- cron job execution and delivery mirroring.
- MCP discovery/runtime callable tool registration.
- delegation child lifecycle/cancellation behavior.
- source clone `0.17.0` execution in a clean venv.

## Next probes

1. Build `assets/evidence/hermes-local-version-drift.md` into a version matrix and keep it separate from source architecture.
2. Run isolated read-only probes for installed `0.12.0`:
   - `hermes --version`
   - `hermes --help`
   - non-mutating `sessions`/`tools`/`mcp` inspection commands where safe.
3. Build a clean source `0.17.0` environment and verify console scripts from `pyproject.toml`.
4. Produce separate runtime traces for delegation, cron, MCP, and gateway; do not publish raw profile logs.

## Caveats

- Hermes evidence can be source-confirmed and runtime-confirmed at the same time but for different versions.
- Raw gateway/MCP/profile logs may include private paths, config, or message content; publish only sanitized summaries.
- Hermes should be compared as a persistent runtime/coordinator, not as a narrow coding CLI.
