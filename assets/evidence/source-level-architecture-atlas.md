# Source-Level Coding Agent Architecture Atlas

작성일: 2026-06-27 KST

이 문서는 LazyCodex/OmO UltraResearch 결과를 그대로 인용하지 않고, controller가 로컬 source clone과 installable package source를 읽어 만든 architecture atlas 초안이다. 목적은 제품별 기능표가 아니라 **agent loop / context / edit / sandbox / verification / state / tool surface**가 실제 어느 파일에 구현되어 있는지 추적하는 것이다.

## Evidence policy

- UltraResearch 및 agent-generated note는 hypothesis/draft로만 취급한다.
- High confidence는 로컬 source clone 또는 installable package source에서 직접 확인한 파일 경로에만 부여한다.
- 파일명/search/import만 확인한 항목은 medium confidence로 둔다.
- closed-source 제품의 internal ranking, model routing, hidden indexing은 공식 문서 밖이면 low confidence다.
- LazyCodex/OmO는 manifest-declared MCP/hooks/commands와 runtime-callable surface를 분리한다. 실제 runtime behavior는 in-Codex `$...` 실행, trace/log, `.omo/` artifact가 있어야 한다.
- Gajae-Code는 public repo/source 근거와 local `gjc` command smoke test를 분리한다. 이 문서 기준 local `gjc` smoke test는 아직 미검증이다.

## SHA-pinned source inputs

| Target | Remote | Branch | HEAD | Evidence tier |
| --- | --- | --- | --- | --- |
| OpenAI Codex | `https://github.com/openai/codex.git` | `main` | `a107b84967eb9a3444fd2d4de03f200337acd52b` | repo source |
| Aider | `https://github.com/Aider-AI/aider.git` | `main` | `5dc9490bb35f9729ef2c95d00a19ccd30c26339c` | repo source |
| SWE-agent | `https://github.com/SWE-agent/SWE-agent.git` | `main` | `abd7d69724d1413b30fea43d4724bb5b463906b4` | repo source |
| Goose | `https://github.com/block/goose.git` | `main` | `2fda760641b634ee915a3b219dd083cf77b2ea2a` | repo source |
| Cline | `https://github.com/cline/cline.git` | `main` | `2714f93b45141c3fb40e16cc0f6a161968ee91f5` | repo source |
| Roo-Code | `https://github.com/RooCodeInc/Roo-Code.git` | `main` | `b867ec9145750d0ae1ff7f02d35406e9bf2a0b16` | repo source |
| Continue | `https://github.com/continuedev/continue.git` | `main` | `d0a3c0b626b5bebc3bef4742eec05a0242be0bab` | repo source |
| OpenHands | `https://github.com/All-Hands-AI/OpenHands.git` | `main` | `de4e2eb26541f00b0ab1e08fdea2e337335cdf88` | repo source; GitHub now redirects public view to `OpenHands/OpenHands` |
| Gajae-Code | `https://github.com/Yeachan-Heo/gajae-code.git` | `main` | `569a7696a8d22ffbcddbeab861951f244e1aed12` | repo source |
| Hermes Agent | `https://github.com/NousResearch/hermes-agent.git` | `main` | `dbe734beff0caf5e8ee2acbe4277db7f6cf84a21` | repo source |
| OpenHands SDK packages | PyPI wheels `openhands-sdk==1.29.0`, `openhands-agent-server==1.29.0`, `openhands-tools==1.29.0` | package | version `1.29.0` | installable package source |

OpenHands note: the current repo checkout did not expose the same obvious SDK/runtime file layout as the package import tree, so the SDK/server wheels were extracted and labeled separately as installable package evidence.

## Architecture file map

### OpenAI Codex / `codex-rs`

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `codex-rs/core/src/session/mod.rs`, `codex-rs/core/src/codex_thread.rs`, `codex-rs/core/src/session/session.rs`, `codex-rs/core/src/session/handlers.rs`, `codex-rs/core/src/session/turn.rs`, `codex-rs/core/src/thread_manager.rs` | `Codex`, `CodexThread`, `Session`, turn handlers, and streaming turn parser form the local CLI/app agent loop. | high |
| Context/history/compaction | `codex-rs/core/src/context_manager/mod.rs`, `codex-rs/core/src/context_manager/history.rs`, `codex-rs/core/src/context/world_state/mod.rs`, `codex-rs/core/src/context/user_instructions.rs`, `codex-rs/core/src/compact.rs`, `codex-rs/core/src/session/context_window.rs`, `codex-rs/core/src/thread_rollout_truncation.rs` | World state, user instructions, history, context-window handling, and rollout truncation are separate context subsystems rather than a single prompt string. | medium-high |
| Edit/apply | `codex-rs/core/src/tools/handlers/apply_patch.rs`, `codex-rs/core/src/apply_patch.rs`, `codex-rs/core/src/tools/runtimes/apply_patch.rs`, `codex-rs/core/src/safety.rs` | Patch handling is routed through tool handler/runtime code with explicit safety assessment. | high |
| Sandbox/approval/tools | `codex-rs/core/src/sandboxing/mod.rs`, `codex-rs/core/src/tools/sandboxing.rs`, `codex-rs/core/src/landlock.rs`, `codex-rs/core/src/exec_policy.rs`, `codex-rs/core/src/tools/router.rs`, `codex-rs/core/src/tools/orchestrator.rs`, `codex-rs/core/src/tools/registry.rs`, `codex-rs/core/src/tools/handlers/shell.rs`, `codex-rs/core/src/tools/runtimes/shell.rs` | Tool dispatch is separated into router/orchestrator/handlers; sandboxing abstracts platform policy including Linux Landlock and shell runtime controls. | high |
| Verification/state | `codex-rs/core/src/state/session.rs`, `codex-rs/core/src/state/turn.rs`, `codex-rs/core/src/rollout.rs`, `codex-rs/core/src/turn_diff_tracker.rs`, `codex-rs/core/src/turn_metadata.rs`, `codex-rs/core/src/guardian/` | Session/turn state, rollout, diff tracking, and guardian review components provide evidence/state surfaces. | medium-high |

### Aider

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `aider/coders/base_coder.py` (`Coder`, `run`, `run_one`, `send_message`, `send`, `apply_updates`, `run_shell_commands`) | `Coder` is the central chat/edit loop. A turn sends messages, receives model output, applies updates, then can run shell/test commands. | high |
| Context/repo map | `aider/repomap.py` (`RepoMap`, `get_repo_map`, `get_ranked_tags`, `get_ranked_tags_map`) | RepoMap is an explicit public code-context compression mechanism, distinct from hidden IDE indexing. | high |
| Edit/apply | `aider/coders/editblock_coder.py`, `aider/coders/wholefile_coder.py`, `aider/coders/udiff_coder.py`, `aider/coders/patch_coder.py` | Edit strategy is implemented as model/edit-format-specific coder classes; SEARCH/REPLACE and whole-file modes have separate apply paths. | high |
| Verification/test | `aider/linter.py`, `aider/main.py`, `aider/coders/base_coder.py` | Lint/test commands are integrated into the coder workflow, but execution depends on configured commands and local repo environment. | high |
| State/safety | git integration through Aider's repo workflow and optional commits | Verification/state is repo-local and git-centered rather than sandbox-centered. | medium |

### SWE-agent

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `sweagent/agent/agents.py` (`step`, `run`, `forward`, `forward_with_handling`, `trajectory`) | The core loop is step/run/forward around a trajectory, optimized for reproducible task runs and benchmark traces. | high |
| Environment/sandbox | `sweagent/environment/swe_env.py` (`SWEEnv`, `reset`, `communicate`, `execute_command`) | SWE-agent drives a controlled environment through a communication/command interface. | high |
| Tools/ACI | `sweagent/tools/tools.py` (`ToolHandler`, `parse_actions`, `should_block_action`, `guard_multiline_input`) | ToolHandler parses model actions and blocks/guards unsupported actions, which makes the ACI explicit and testable. | high |
| Verification/state | `sweagent/agent/agents.py`, `sweagent/types.py`, docs under `docs/usage/trajectories.md` | Trajectory output is a first-class artifact, fitting SWE-bench style evaluation. | high |

### Goose

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `crates/goose/src/agents/agent.rs` (`Agent`, `AgentConfig`, `ReplyContext`, `reply`, `reply_internal`) | Goose centers the loop in the Rust `Agent` with reply/reply_internal and explicit reply context preparation. | high |
| Tool surface/MCP/extensions | `crates/goose/src/agents/agent.rs`, `crates/goose/src/agents/tool_execution.rs`, `crates/goose/src/agents/extension_manager.rs`, `crates/goose/src/agents/extension.rs` | Extension loading, frontend tools, tool dispatch, and tool-result handling are source-visible. | high |
| Permission/approval | `crates/goose/src/agents/tool_execution.rs`, `crates/goose/src/config/permission.rs`, `crates/goose/src/permission/permission_store.rs`, `crates/goose/src/permission/permission_inspector.rs`, `crates/goose/src/permission/permission_judge.rs` | Permission routing and approval-tool requests are explicit components. | medium-high |
| Context/session state | `crates/goose/src/session_context.rs`, `crates/goose/src/session/session_manager.rs`, `crates/goose/src/session/extension_data.rs` | Session context and extension state persistence are distinct from model loop code. | medium |

### Cline

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `sdk/packages/agents/src/agent-runtime.ts` (`AgentRuntime`, `run`, `execute`, `maxIterations` loop) | SDK-side loop calls the model, accumulates assistant messages, extracts tool calls, executes tools, and stops on final response or max iterations. | high |
| Runtime orchestration | `sdk/packages/core/src/runtime/orchestration/session-runtime-orchestrator.ts`, `sdk/packages/core/src/runtime/orchestration/session-runtime.ts`, `sdk/packages/core/src/runtime/config/agent-runtime-config-builder.ts` | Core runtime orchestrates sessions and builds runtime config separately from the agent loop. | high |
| Context/messages | `sdk/packages/core/src/session/services/message-builder.ts` | Message building is factored into session services. | medium-high |
| Tool policy/approval | `sdk/packages/agents/src/agent-runtime.ts`, `sdk/packages/core/src/runtime/tools/tool-approval.ts` | `toolPolicies`, `resolveToolPolicy`, and `requestToolApproval` separate model tool calls from permission decisions. | high |

### Roo-Code

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `src/core/task/Task.ts` (`Task`, `startTask`, `resumeTaskFromHistory`, `recursivelyMakeClineRequests`, `attemptApiRequest`) | Roo's task object is the main agent loop and streaming API request owner. | high |
| Context/condense | `src/core/task/Task.ts`, `src/core/context-management`, `src/core/condense`, `src/core/context-tracking/FileContextTracker.ts` | Context management, context-window retries, condense, and file context tracking are explicit subsystems. | high |
| Tool surface/MCP | `src/core/task/build-tools.ts`, `src/services/mcp/McpHub`, `src/services/mcp/McpServerManager` | Native tools and MCP tools are combined and filtered by mode/restriction. | high |
| Edit/apply | `src/core/tools/ApplyDiffTool.ts`, `src/core/diff/strategies/multi-search-replace`, `src/integrations/editor/DiffViewProvider` | `apply_diff` validates params/access, checks file existence, applies diff strategy, and reports diff stats. | high |
| Sandbox/approval/checkpoints | `src/core/auto-approval`, `src/core/ignore/RooIgnoreController`, `src/core/protect/RooProtectedController`, `src/core/checkpoints` | Access control, write protection, auto approval, and checkpoint save/restore/diff are first-class task dependencies. | high |

### Continue

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `gui/src/redux/thunks/streamResponse.ts`, `gui/src/redux/thunks/streamNormalInput.ts`, `gui/src/redux/thunks/streamResponseAfterToolCall.ts`, `gui/src/redux/thunks/callToolById.ts` | Continue's visible loop is Redux-thunk based: resolve editor content, construct messages, stream model output, evaluate tool policies, call tools, then continue after tool results. | high |
| Context/indexing | `gui/src/redux/thunks/streamResponse.ts`, `gui/src/redux/util/constructMessages.ts`, `core/indexing/CodebaseIndexer.ts`, `core/indexing/FullTextSearchCodebaseIndex.ts`, `core/indexing/ChunkCodebaseIndex.ts`, `core/indexing/LanceDbIndex.ts` | Context comes from editor content, rules/history, and a background indexer combining FTS/snippet/chunk/vector indexes. | high |
| Tool policy | `gui/src/redux/thunks/evaluateToolPolicies.ts`, `gui/src/redux/thunks/preprocessToolCallArgs.ts`, `gui/src/redux/thunks/streamNormalInput.ts` | Tool calls are preprocessed and policy-evaluated before execution. | high |
| Execution/local env | `core/tools/implementations/runTerminalCommand.ts` | Local commands spawn through the extension host; remote workspaces route through IDE terminal, which is a key local-env caveat. | high |

### OpenHands

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/package source | PyPI extracted `openhands/sdk/agent/agent.py` (`Agent`, `step`) | Current installable SDK exposes an `Agent.step` based loop. | high for package source |
| Tool dispatch | PyPI extracted `openhands/sdk/agent/parallel_executor.py`, `openhands/sdk/agent/response_dispatch.py` | Parallel tool executor and response dispatch mixin separate model responses from tool execution. | high for package source |
| Conversation/state | PyPI extracted `openhands/sdk/conversation/impl/local_conversation.py`, `openhands/sdk/conversation/state.py`, `openhands/sdk/conversation/event_store.py` | Local conversation, conversation state, event store, blocking, and unmatched action handling are package-level runtime evidence. | high for package source |
| Server/runtime surface | PyPI extracted `openhands/agent_server/*_router.py`, `bash_service.py`, `conversation_service.py`, `event_service.py`, `mcp_router.py`, `tool_router.py`, `workspace_router.py` | Agent server exposes conversation, bash, file/git, event, MCP, tool, and workspace routes. | medium-high for package source |
| Repo checkout caveat | repo `pyproject.toml`, `README.md`, `config.template.toml` | Repo-level docs/config confirm runtime/sandbox framing, but package source is clearer for SDK internals in this snapshot. | medium |

### Gajae-Code

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent/session loop | `packages/coding-agent/src/session/agent-session.ts`, `packages/coding-agent/src/session/session-manager.ts`, `packages/coding-agent/src/session/messages.ts`, `packages/coding-agent/src/modes/interactive-mode.ts`, `packages/coding-agent/src/modes/acp/acp-agent.ts` | Source exposes session, messages, interactive mode, and ACP agent surfaces. | medium-high |
| Workflow/runtime | `packages/coding-agent/src/gjc-runtime/ultragoal-runtime.ts`, `packages/coding-agent/src/gjc-runtime/ralplan-runtime.ts`, `packages/coding-agent/src/gjc-runtime/team-runtime.ts`, `packages/coding-agent/src/gjc-runtime/state-runtime.ts`, `packages/coding-agent/src/gjc-runtime/launch-tmux.ts`, `packages/coding-agent/src/gjc-runtime/launch-worktree.ts` | Gajae-Code has explicit ultragoal/ralplan/team/state runtime files plus tmux/worktree launchers. | high |
| Commands | `packages/coding-agent/src/commands/ultragoal.ts`, `commands/ralplan.ts`, `commands/team.ts`, `commands/coordinator.ts`, `commands/harness.ts` | Public command classes map to the workflow runtime. | high |
| Tools/MCP/extensions | `packages/coding-agent/src/tools/*`, `runtime-mcp/*`, `capability/mcp.ts`, `extensibility/hooks/*`, `extensibility/custom-tools/*`, `extensibility/extensions/*` | Tool, MCP, hook, custom tool, and extension surfaces are source-visible. | medium-high |
| Edit/exec | `packages/coding-agent/src/edit/index.ts`, `edit/modes/patch.ts`, `edit/modes/replace.ts`, `exec/bash-executor.ts`, `tools/bash.ts`, `tools/write.ts`, `tools/read.ts`, `tools/search.ts` | Edit modes and shell/read/write/search tools are separate implementation paths. | medium-high |
| Caveat | local `gjc` smoke test | Public repo/npm/source evidence does not prove the local CLI works in this environment. | unverified runtime |

### Hermes Agent

| Axis | Source paths | Source-backed reading | Confidence |
| --- | --- | --- | --- |
| Agent loop/session | `agent/conversation_loop.py` (`run_conversation`), `run_agent.py`, `agent/oneshot.py`, `agent/codex_runtime.py` | Hermes centers conversation execution in a Python loop with provider/runtime adapters. | high |
| Tool execution | `agent/tool_executor.py` (`execute_tool_calls_concurrent`, `execute_tool_calls_sequential`), `agent/tool_dispatch_helpers.py`, `agent/tool_guardrails.py`, `model_tools.py`, `toolsets.py` | Tool execution is explicit and supports concurrent/sequential modes plus guardrails and toolset restriction. | high |
| Context/memory/compression | `agent/context_engine.py`, `agent/context_compressor.py`, `agent/context_references.py`, `agent/memory_manager.py`, `agent/memory_provider.py`, `agent/skill_preprocessing.py` | Context engines, compression, references, persistent memory, and skill preprocessing are first-class components. | high |
| State/trajectory/background | `agent/trajectory.py`, `hermes_state.py`, `batch_runner.py`, `agent/background_review.py`, `agent/iteration_budget.py` | Session/trajectory state and background review/batch execution are runtime surfaces. | medium-high |
| Gateway/delegation/MCP | `mcp_serve.py`, `agent/copilot_acp_client.py`, `acp_adapter/*`, `agent/auxiliary_client.py`, tool implementations exposed through Hermes tools | Hermes is a persistent coordinator with MCP/ACP/delegation rather than only a repo editor. | medium-high |

## Public failure-pattern corpus draft

This sweep uses GitHub public issue search as anecdotal/diagnostic evidence only. It is useful for failure taxonomy, not for claiming prevalence.

| Pattern | Public issue examples | Architecture interpretation |
| --- | --- | --- |
| Context loss / retrieval mismatch | OpenAI Codex: [Add native `/context` usage breakdown](https://github.com/openai/codex/issues/27898); Continue: [Codebase Retrieval Not Working After Successful Indexing](https://github.com/continuedev/continue/issues/12583); Roo: [Condense context fails when using Roo Code Router](https://github.com/RooCodeInc/Roo-Code/issues/11743), [Context Condensing Regression](https://github.com/RooCodeInc/Roo-Code/issues/11785) | Context visibility, index freshness, condense model choice, and continuation after compaction are separate failure points. |
| Bad edit application | Aider: [SEARCH/REPLACE block failed to match](https://github.com/Aider-AI/aider/issues/3651); Codex: [apply_patch execution failed](https://github.com/openai/codex/issues/27389), [function-call apply_patch routing](https://github.com/openai/codex/issues/26751); Roo: [apply_diff missing path](https://github.com/RooCodeInc/Roo-Code/issues/12312), [malformed `:start_line`](https://github.com/RooCodeInc/Roo-Code/issues/12199) | Edit correctness depends on parseable edit format, accurate anchors, handler routing, and user-facing error repair. |
| Sandbox / approval friction | Codex: [Windows sandbox setup succeeds but `.sandbox-bin` remains empty](https://github.com/openai/codex/issues/30077), [macOS sandbox build abort](https://github.com/openai/codex/issues/27218); Cline: [MCP tool calls execute without approval](https://github.com/cline/cline/issues/10499), [multi-file edit approval buttons disabled](https://github.com/cline/cline/issues/10035); OpenHands: [archive runtime workspace before deleting remote sandboxes](https://github.com/OpenHands/OpenHands/issues/14878) | Approval/sandbox is part of the control plane, not just safety UI; runtime cleanup and remote sandbox lifecycle matter. |
| Test/evaluation caveats | SWE-agent: [end-of-line sequences](https://github.com/SWE-agent/SWE-agent/issues/702), [Docker image build failure](https://github.com/SWE-agent/SWE-agent/issues/1279); Aider: [startup executes configured test/lint commands](https://github.com/Aider-AI/aider/issues/5254), [helper prompt for fixing lint/test](https://github.com/Aider-AI/aider/issues/4439); OpenHands: [SOHH evaluation integration](https://github.com/OpenHands/OpenHands/issues/14139) | Verification can fail because of environment setup, configured command trust boundaries, or benchmark/test oracle limits. |
| Runaway / repeated loops | Cline: [replace_in_file overcharges by rewriting files](https://github.com/cline/cline/issues/2348); Roo: [Infinite looping](https://github.com/RooCodeInc/Roo-Code/issues/11337), [Repeated Use Limitations](https://github.com/RooCodeInc/Roo-Code/issues/6834) | Iteration limits, repetition detectors, failed-edit repair loops, and cost accounting are loop-control requirements. |
| Routing/cost/latency | Cline: [subagent reads truncated content](https://github.com/cline/cline/issues/11364), [token count unrealistically high](https://github.com/cline/cline/issues/11660); Roo: [token-efficient context serialization](https://github.com/RooCodeInc/Roo-Code/issues/12111), [aggregate subtask costs](https://github.com/RooCodeInc/Roo-Code/issues/5376) | Model/tool routing and token accounting affect both quality and cost; subagent/context serialization can become a bottleneck. |
| Local environment assumptions | Continue: [edit tools fail over Remote SSH](https://github.com/continuedev/continue/issues/12641), [VSCodeIde.runCommand remote terminal](https://github.com/continuedev/continue/issues/10542); Aider: [maintain shell environment between executions](https://github.com/Aider-AI/aider/issues/3455); SWE-agent: [remote environment trajectory hook](https://github.com/SWE-agent/SWE-agent/issues/1310) | Extension-host location, shell persistence, remote workspace routing, Docker/container assumptions, and file path translation must be modeled explicitly. |

## Immediate next research steps

1. Publish the benchmark/evaluation framework first: task families, scoring rubric, evidence tiers, and trace schema.
2. Convert this map into per-agent deeper pages with line-level excerpts for the high-risk axes: context compaction, edit application, approval, verification.
3. For LazyCodex/OmO, collect runtime-callable evidence from actual in-Codex `$...` commands and `.omo/` artifacts instead of relying on plugin manifests.
4. For Gajae-Code, run a minimal `gjc` command smoke test in a clean env and record version/exit/result separately from public source evidence.
5. After the framework and deep dives exist, run trace pilots on real repo tasks through locally installable agents; do not use a single toy identical task as primary evidence.
