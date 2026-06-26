# Coding Agent Taxonomy

작성일: 2026-06-26 KST

이 문서는 coding agent를 제품명이 아니라 "agent loop가 어디에 있고, context와 권한이 어디서 통제되는가"로 분류한다. Confidence는 현재 확인한 공개 문서, 논문, 소스, 로컬 관찰의 강도를 뜻한다.

## 1. IDE Embedded Agents

대표: Cursor, Windsurf/Cascade/Devin Desktop, Continue extension, Cline/Roo Code.

핵심 구조:

- Agent loop는 IDE extension, editor sidepane, desktop harness, 또는 extension host 근처에 있다. [confidence: high for Cursor/Cline/Continue/Devin docs]
- Repo context는 열려 있는 파일, explicit `@file`, semantic index, symbol/codemap, grep/search, user rules, workspace config를 섞어 조립한다. [confidence: high for Cursor/Continue/Cline/Devin docs]
- Editing은 editor diff, workspace patch, checkpoint, file-write tool, apply-diff tool 형태로 일어난다. [confidence: medium]
- Terminal 권한은 user approval, allowlist, ask/allow/deny policy, YOLO/auto approve mode로 제어된다. [confidence: high for Cline/Continue/Devin, medium for Cursor]
- 장점은 낮은 마찰과 현재 편집 맥락 접근성이다. 약점은 IDE 내부 hidden state, indexing staleness, approval fatigue, user가 보지 못하는 context selection이다. [confidence: medium]

구성요소 계층:

1. UI: editor sidepane, chat, inline diff, terminal approval modal.
2. Context: active files, workspace index, rules, memory bank, codemaps.
3. Agent loop: planner/reasoner, tool selector, edit applicator.
4. Execution: editor write API, shell, browser, MCP tools.
5. Recovery: checkpoints, undo, session resume, local history.

Sources:

- Cursor Agent Overview: https://cursor.com/docs/agent/overview.md
- Cursor MCP: https://cursor.com/docs/mcp.md
- Cursor Plugins: https://cursor.com/docs/plugins.md
- Continue CLI/TUI docs: https://docs.continue.dev/cli/tui-mode
- Continue permissions: https://docs.continue.dev/cli/tool-permissions
- Cline overview: https://docs.cline.bot/cline-overview
- Cline Plan and Act: https://docs.cline.bot/core-workflows/plan-and-act
- Cline Memory Bank: https://docs.cline.bot/best-practices/memory-bank
- Devin Local: https://docs.devin.ai/desktop/devin-local
- Devin Codemaps: https://docs.devin.ai/desktop/codemaps

## 2. CLI Coding Agents

대표: OpenAI Codex CLI, Claude Code, Aider, Continue CLI, Goose CLI, Devin CLI.

핵심 구조:

- Agent loop는 terminal process 또는 CLI runtime에 있다. [confidence: high]
- Repo context는 filesystem reads, grep/search, git diff, explicit file mentions, repo map, AGENTS/CLAUDE instructions, session transcript로 조립된다. [confidence: high]
- Editing은 patch/diff, file replacement, model-specific edit format, or editor-like write tool로 적용된다. [confidence: high for Aider/Codex-style CLI behavior, medium elsewhere]
- 권한 통제는 sandbox, approval mode, readonly/auto mode, shell allowlist, MCP permission policy로 일어난다. [confidence: high]
- 장점은 repo-local 재현성과 CI/test 실행 친화성이다. 약점은 long-running UX, context rot, hidden shell state, non-interactive approval mismatch다. [confidence: medium]

Sources:

- OpenAI Codex GitHub: https://github.com/openai/codex
- OpenAI Codex security: https://developers.openai.com/codex/security
- Claude Code overview: https://docs.anthropic.com/en/docs/claude-code/overview
- Claude Code permissions: https://code.claude.com/docs/en/permissions
- Aider repo map: https://aider.chat/docs/repomap.html
- Aider edit formats: https://aider.chat/docs/more/edit-formats.html
- Aider lint/test: https://aider.chat/docs/usage/lint-test.html
- Continue CLI: https://docs.continue.dev/cli/quickstart

## 3. Repo-Local Autonomous Agents

대표: SWE-agent, OpenHands local/runtime modes, Agentless workflow, Gajae-Code, Cline autonomous modes.

핵심 구조:

- Agent loop는 repo checkout과 execution environment를 owning하는 local runner나 benchmark harness에 있다. [confidence: high]
- Context는 issue text, repository search, file reads, failing tests, localization steps, prior actions, tool outputs로 축적된다. [confidence: high]
- Editing은 patch generation, file edit commands, apply patch, or benchmark-specific edit API로 수행된다. [confidence: high]
- Verification은 pytest/npm/test command, hidden benchmark tests, lint, manual QA checklist, evidence ledger로 닫힌다. [confidence: high]
- 장점은 실제 repo 변경과 검증을 강하게 묶을 수 있다는 점이다. 약점은 test oracle 의존, sandbox mismatch, flaky environment, benchmark overfitting이다. [confidence: high]

Sources:

- SWE-agent paper: https://arxiv.org/abs/2405.15793
- SWE-agent repo: https://github.com/SWE-agent/SWE-agent
- Agentless paper: https://arxiv.org/abs/2407.01489
- OpenHands paper: https://arxiv.org/abs/2407.16741
- OpenHands repo: https://github.com/All-Hands-AI/OpenHands
- Local Gajae evidence: `assets/evidence/gajae-code-crosscheck.md`

## 4. Workflow Orchestrator Agents

대표: LazyCodex/OmO, Gajae-Code, Hermes delegation layer, OpenHands orchestration, Devin command center.

핵심 구조:

- Agent loop 자체보다 "언제 plan, approval, execution, review, evidence를 요구할 것인가"를 통제한다. [confidence: high]
- Control layer는 hook, skill, command, MCP server, tmux session, worktree, state ledger, or background task queue로 구현된다. [confidence: high for OmO/Gajae local evidence, medium elsewhere]
- 이 계층은 model choice보다 state discipline과 verification gate에 집중한다. [confidence: high]
- 장점은 long-running work, auditability, handoff, verification이다. 약점은 ceremony, state drift, hook/tool transport brittleness, UX friction이다. [confidence: medium]

Sources:

- LazyCodex local plugin manifest: `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json`
- LazyCodex local evidence: `assets/evidence/lazycodex-crosscheck.md`
- Gajae local/public reconciliation: `assets/evidence/reconciled-facts.md`
- Hermes local/public evidence: `assets/evidence/hermes-crosscheck.md`

## 5. Multi-Agent / Team Agents

대표: OpenHands multi-agent patterns, Devin subagents, LazyCodex teammode, Gajae team lanes, SWE-agent variants, research systems inspired by ReAct/Reflexion/planning.

핵심 구조:

- 여러 workers가 exploration, implementation, review, QA, or planning slices를 나눈다. [confidence: high]
- 실제 orchestration인지 prompt convention인지 구분해야 한다. Durable queue/state/worktree/tmux/mailbox가 있으면 orchestration에 가깝고, "너는 reviewer" 프롬프트만 있으면 prompt convention에 가깝다. [confidence: high as architectural criterion]
- 장점은 parallel search와 role separation이다. 약점은 duplicate work, inconsistent assumptions, context fragmentation, stale leader state다. [confidence: medium]
- 논문 근거는 multi-agent가 항상 우월하다는 결론을 주지 않는다. decomposition과 verifier 품질이 성패를 좌우한다. [confidence: high]

Sources:

- OpenHands paper: https://arxiv.org/abs/2407.16741
- ReAct: https://arxiv.org/abs/2210.03629
- Reflexion: https://arxiv.org/abs/2303.11366
- Plan-and-Solve: https://arxiv.org/abs/2305.04091
- LazyCodex teammode local skill: `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/components/teammode/skills/teammode/SKILL.md`

## 6. Persistent Runtime Agents

대표: Hermes Agent, Devin cloud/local memory surfaces, long-running orchestrator agents, scheduled background agents.

핵심 구조:

- Agent loop는 단일 repo session을 넘어 gateway, scheduler, memory, delegation runtime에 붙는다. [confidence: high for Hermes local evidence, medium for closed-source products]
- Context는 conversation history, user profile, project memory, skills, cron jobs, messaging platform identity, tool credentials policy로 구성된다. [confidence: high for Hermes docs/evidence]
- 장점은 cross-session continuity, reminders, multi-channel UX, long-running coordination이다. 약점은 privacy/secrets risk, stale memory, hidden state drift, update/version drift다. [confidence: medium]

Sources:

- Hermes evidence: `assets/evidence/hermes-crosscheck.md`
- Reconciled facts: `assets/evidence/reconciled-facts.md`
- Devin Local memory caveat: https://docs.devin.ai/desktop/devin-local

## 공통 구성요소 요약

| 구성요소 | 하는 일 | 주된 위치 |
| --- | --- | --- |
| model client/router | 모델 호출, provider 선택, token budget, retry | CLI runtime, IDE extension, server |
| prompt/context assembly | instructions, repo snippets, history, memory, search results 조립 | client/runtime/context service |
| repo index/code graph/search | semantic index, grep, AST, symbols, repo map | IDE indexer, CLI tool, MCP, local DB |
| planning loop | task decomposition, plan updates, reviewer gate | agent prompt, orchestrator, explicit planning mode |
| tool execution loop | shell/file/search/browser/MCP calls | runtime sandbox, IDE extension host, container |
| edit strategy | patch, diff, write file, edit format | agent tool layer |
| sandbox/permissions | filesystem/network/shell approval | CLI sandbox, IDE policy, container, enterprise config |
| verification gate | tests, lint, build, hidden benchmark, manual QA, evidence ledger | runner/orchestrator/CI |
| memory/state | session transcript, rules, skills, ledger, vector/index state | local files, IDE DB, cloud service |
| plugins/hooks/MCP | tool extension and lifecycle interception | plugin system, MCP registry, hooks |
| human approval UX | ask/allow/deny, checkpoint, review diff | IDE modal, CLI prompt, policy file |
| telemetry/evidence | logs, events, traces, ledgers | local state, cloud backend, report artifacts |
