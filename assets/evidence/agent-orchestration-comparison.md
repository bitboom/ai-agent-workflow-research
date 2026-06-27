# Evidence: Control-Plane Orchestration Comparison

This document compares the three control-plane systems from the latest LazyCodex/OmO UltraResearch pass: Gajae-Code, Hermes Agent, and LazyCodex/OmO.

| Axis | Gajae-Code | Hermes Agent | LazyCodex/OmO |
| --- | --- | --- | --- |
| Product type | TypeScript/Bun coding-agent CLI and `.gjc` control plane | Python persistent agent runtime/coordinator | Codex plugin/workflow harness |
| Primary state root | `.gjc/_session-*` | `~/.hermes/` profile/session/memory/log surfaces | `.omo/...` project artifacts and Codex plugin cache |
| Workflow abstraction | `deep-interview`, `ralplan`, `ultragoal`, `team` | CLI/slash commands, tools, gateway sessions, cron, delegation, MCP/ACP | `$...` skills, hooks, MCP declarations, workflow ledgers |
| Orchestration mechanism | worktree/tmux/team runtime candidates, state writer, workflow command refs | shared `AIAgent` wrapped by gateway/cron/delegate/MCP/ACP | Codex lifecycle hooks plus skill-driven artifact workflows |
| Current strong proof | source anchors; `gjc/0.7.3` version/help/smoke/print smoke; controlled temp-repo replay for `deep-interview`, `ralplan`, `ultragoal`, and `team --dry-run` with `.gjc/_session-*` artifacts | local installed version proof plus source architecture map | plugin install/manifest proof plus `$ultraresearch` artifact journal |
| Current missing proof | live non-dry-run `team`; `.gjc` recovery/resume/corruption trace; canonical repo owner drift; Hermes bridge runtime | source/local version parity; gateway/cron/MCP/delegate runtime traces | isolated replay for non-ultraresearch `$...` workflows; MCP callability; TUI/exec parity |
| Failure modes to track | state corruption, session ambiguity, team/worktree orphan, bridge mismatch, package/runtime drift | version drift, hidden gateway/session state, cron runaway, subagent self-report, raw log leakage | manifest/runtime mismatch, stale `.omo` state, hook non-fire, timeout, untracked artifacts |
| Best next probe | live-team/recovery replay after the now-completed controlled `.gjc` artifact replay | installed/source version matrix and isolated read-only runtime probes | runtime-callable matrix with temp-repo workflow replays |

## Reporting rule

Use separate labels for:

- `source-confirmed`
- `manifest-confirmed`
- `runtime-confirmed`
- `artifact-backed`
- `unverified`

Do not collapse all of these into a single confidence label.
