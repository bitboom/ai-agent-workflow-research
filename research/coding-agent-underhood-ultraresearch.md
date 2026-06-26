# Coding Agent Under The Hood UltraResearch

작성일: 2026-06-26 KST
범위: coding agent taxonomy, 공통 내부 구성요소, 대표 구현체, 논문/benchmark evidence, 실제 실패 패턴
주의: API key/token/credential/connection string은 기록하지 않았다. 로컬 관찰과 public source는 분리했다.

## Executive Summary

Coding agent를 비교할 때 "어떤 모델을 쓰는가"나 "파일을 수정할 수 있는가"만 보면 거의 모든 도구가 비슷해 보인다. 실제 차이는 agent loop와 control gate가 어디에 놓이는가다. IDE sidepane, terminal CLI, repo-local runner, sandboxed runtime, workflow harness, persistent coordinator는 같은 LLM 호출을 쓰더라도 context assembly, permissions, editing, verification, state persistence가 전혀 다르게 실패한다. [confidence: high]

공통 architecture는 대체로 `model client/router -> prompt/context assembly -> repo search/index -> planning/tool loop -> edit application -> sandbox/approval -> verification -> state/evidence`로 분해된다. IDE agents는 편집 맥락과 code index가 강하지만 hidden state와 stale index가 위험하다. CLI agents는 재현성과 테스트 실행이 강하지만 approval/sandbox와 shell state가 까다롭다. Workflow/orchestrator agents는 planning/evidence discipline을 강화하지만 ceremony와 state drift가 생긴다. Persistent runtime agents는 long-running coordination에 강하지만 privacy, stale memory, version drift가 중요해진다. [confidence: high]

논문/benchmark evidence는 "agentic workflow가 의미 있다"는 쪽을 지지하지만, "SWE-bench 점수가 곧 제품 품질"이라는 주장은 지지하지 않는다. SWE-agent는 interface design이 성능에 큰 영향을 준다는 점을 보여주고, Agentless는 모든 repair task에 full autonomous loop가 필요한 것은 아님을 보여준다. OpenHands는 coding agent가 prompt가 아니라 runtime, sandbox, tool, evaluation infrastructure라는 점을 강조한다. SWE-bench Verified는 benchmark 품질을 개선했지만, incomplete tests, contamination, issue-text mismatch 같은 한계는 남는다. [confidence: high]

## 1. Taxonomy: Loop가 어디에 있는가

### 1.1 IDE embedded agents

Cursor, Cline, Continue extension, Devin Desktop/Windsurf 계열은 agent loop가 editor UI 또는 desktop harness 안쪽에 있다. Cursor docs는 agent가 codebase search, file edits, terminal, checkpoints, MCP/plugins를 다룰 수 있음을 설명한다. Cline docs는 Plan Mode와 Act Mode를 분리하고, Memory Bank와 MCP를 명시한다. Continue는 CLI/TUI와 IDE extension을 연결하며 `ask/allow/exclude` tool permission을 문서화한다. Devin Desktop docs는 Devin Local, DeepWiki, Codemaps, terminal policy, ACP를 설명한다. [confidence: high]

Architecture implication:

- Context source: active editor state, codebase index, explicit mentions, rules, memory bank, codemaps.
- Edit path: editor diff/checkpoint/file write.
- Permission path: modal approval, policy file, allowlist, YOLO/auto mode.
- Failure root: stale semantic index, hidden context selection, over-broad rewrite, approval fatigue, plugin/MCP supply-chain risk. [confidence: medium]

Sources: Cursor Agent Overview https://cursor.com/docs/agent/overview.md, Cursor MCP https://cursor.com/docs/mcp.md, Cline Plan and Act https://docs.cline.bot/core-workflows/plan-and-act, Cline Memory Bank https://docs.cline.bot/best-practices/memory-bank, Continue permissions https://docs.continue.dev/cli/tool-permissions, Devin Local https://docs.devin.ai/desktop/devin-local.

### 1.2 CLI coding agents

OpenAI Codex CLI, Claude Code, Aider, Continue CLI, Goose CLI 등은 loop가 local CLI process에 있다. Codex와 Claude Code는 terminal coding assistant surface와 sandbox/permissions를 핵심으로 문서화한다. Aider는 repository map, edit formats, lint/test integration으로 context와 edit/verification 전략을 드러낸다. [confidence: high]

Architecture implication:

- Context source: filesystem, git diff, grep/search, repo map, project instructions, shell output.
- Edit path: patch, diff, model-specific edit format, file write.
- Permission path: sandbox profile, approval mode, shell command confirmation, readonly/auto flag.
- Failure root: shell environment mismatch, approval-mode mismatch between interactive and headless runs, context rot over long terminal sessions. [confidence: medium]

Sources: OpenAI Codex GitHub https://github.com/openai/codex, Codex security https://developers.openai.com/codex/security, Claude Code overview https://docs.anthropic.com/en/docs/claude-code/overview, Claude permissions https://code.claude.com/docs/en/permissions, Aider repo map https://aider.chat/docs/repomap.html, Aider edit formats https://aider.chat/docs/more/edit-formats.html.

### 1.3 Repo-local autonomous agents and benchmark harnesses

SWE-agent, OpenHands, Agentless-style workflows, Gajae-Code, and some Cline/Roo autonomous modes own a repository checkout and execution environment. They look less like chat and more like a runner: localize bug, inspect files, edit, run tests, update state, retry. [confidence: high]

SWE-agent is especially important because its paper frames the "Agent-Computer Interface" as a first-class performance factor. Agentless is important because it demonstrates that a targeted localization/repair/validation workflow can compete without a fully general autonomous loop. OpenHands is important because it treats coding agents as platform infrastructure with runtime, sandboxing, browser/shell/code tools, multi-agent hooks, and benchmark integration. [confidence: high]

Sources: SWE-agent paper https://arxiv.org/abs/2405.15793, SWE-agent repo https://github.com/SWE-agent/SWE-agent, Agentless paper https://arxiv.org/abs/2407.01489, OpenHands paper https://arxiv.org/abs/2407.16741, OpenHands repo https://github.com/All-Hands-AI/OpenHands.

### 1.4 Workflow/orchestrator agents

LazyCodex/OmO, Gajae-Code, Hermes delegation, and some OpenHands/Devin orchestration surfaces should be analyzed as control layers. Their primary value is not "can call an LLM" but "can force planning, approval, evidence, review, continuation, team lanes, or persistent state." [confidence: high]

Local OmO evidence shows a Codex plugin/harness with lifecycle hooks, skills, MCP declarations, LSP/codegraph/git-bash helpers, ultrawork/ulw-loop/start-work/teammode state paths, and evidence-driven workflow instructions. This is not a standalone coding agent runtime in this local setup; it rides on Codex. [confidence: high for local observation]

Gajae-Code local notes indicate a runner/control surface with interview, plan, execution, tmux/worktree/team and evidence orientation, but local `gjc` execution was not verified in this repo. [confidence: medium]

Hermes local notes frame it as a persistent coordinator/runtime with gateway, memory, skills, cron, delegation, and MCP. It is better understood as a long-running coordinator that can call coding surfaces, not just a repo-local code editor. [confidence: high for local observation]

Sources: `assets/evidence/lazycodex-crosscheck.md`, `assets/evidence/reconciled-facts.md`, `assets/evidence/gajae-code-crosscheck.md`, `assets/evidence/hermes-crosscheck.md`, local OmO manifest `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json`.

### 1.5 Multi-agent/team agents

Multi-agent coding systems can be real orchestration or just prompt convention. Real orchestration has durable queues/state, owned worktrees, tmux sessions, mailbox/task state, agent IDs, artifact ledgers, and failure recovery. Prompt convention only says "act as reviewer" inside one transcript. Both can help, but they fail differently. [confidence: high]

The literature supports role separation, reflection, planning, and verification as useful patterns, but does not prove that more agents are universally better. Coordination overhead, inconsistent assumptions, and fragmented context can erase gains. [confidence: high]

Sources: OpenHands paper https://arxiv.org/abs/2407.16741, ReAct https://arxiv.org/abs/2210.03629, Reflexion https://arxiv.org/abs/2303.11366, Plan-and-Solve https://arxiv.org/abs/2305.04091, OmO teammode local skill path listed in `research/coding-agent-source-map.md`.

## 2. Common Under-Hood Components

### 2.1 Model client / router

Every agent needs a model client that chooses provider/model, builds request payloads, handles streaming, retries, token budgets, and sometimes routes by task. Product docs often expose only settings; the router internals are usually closed. CLI/open-source projects expose more implementation detail. [confidence: medium]

Architecture risk: model routing can silently change output style, tool-call reliability, and edit precision. Product claims about "the agent" may actually be claims about a model plus a prompt plus a tool layer. [confidence: high]

### 2.2 Prompt/context assembly

The context layer decides what the model sees: system/developer instructions, project rules, active files, repo map, code search results, failing tests, git diff, issue text, memory, prior tool outputs, and user approvals. This is the core hidden decision point. [confidence: high]

Examples:

- Aider documents a repo map to compress repository structure into context. [confidence: high]
- Cursor documents codebase search and indexed context. [confidence: high]
- Cline documents Memory Bank files for persistent project context. [confidence: high]
- OmO local hooks inject project rules and workflow directives around Codex. [confidence: high local]

Failure root: context rot, stale index, overly broad retrieval, missing file, wrong instruction precedence. [confidence: high]

### 2.3 Repository indexing / code graph / search

Agents combine lexical search, semantic search, AST/symbol graphs, repo maps, and LSP. IDE agents tend to hide indexing behind the product. CLI agents expose grep, ripgrep, repo map, or MCP/LSP tools. [confidence: high]

Failure root: stale index or wrong symbol graph leads to confident edits in the wrong file. This is more architecture than model quality. [confidence: medium]

### 2.4 Planning loop

Planning can be implicit in the model's chain of reasoning, explicit as a plan step, or enforced by a workflow layer. Cline Plan Mode, OmO ultrawork/ulw-plan, Gajae-Code plan-before-mutation, and plan-and-execute papers all represent this family. [confidence: high]

Failure root: over-planning can create stale commitments; under-planning can cause scattered edits. Planning must be revisable when tests and tool outputs contradict the plan. [confidence: high]

### 2.5 Tool execution loop

The loop chooses tools, executes them, summarizes results, and decides whether to continue. Tools include file read/write, search, shell, tests, browser, MCP servers, package managers, issue trackers, and UI automation. [confidence: high]

Failure root: tool-call brittleness, unavailable command, sandbox denial, shell state drift, non-deterministic tests, or tool result truncation. [confidence: high]

### 2.6 File editing strategy

Editing strategies differ:

- Whole-file rewrite: simple but over-edits and destroys user changes. [confidence: high]
- Patch/diff: preserves context but can fail to apply. [confidence: high]
- Search/replace edit format: concise but brittle if context changed. [confidence: high]
- IDE edit API: good UX but hidden implementation. [confidence: medium]
- Benchmark harness patch: measurable but often optimized for dataset. [confidence: high]

Aider's edit-format docs are useful because they make this layer visible. [confidence: high]

### 2.7 Terminal, sandbox, permissions

This is a primary safety/control layer. Codex, Claude Code, Continue, Cline, Devin Local, and OpenHands all expose some form of permission or sandbox policy. [confidence: high]

Architecture questions:

- Who decides a command is safe: user, classifier, allowlist, policy file, enterprise admin?
- Is network allowed?
- Are writes restricted to workspace?
- Is headless mode stricter or looser than interactive mode?
- Can MCP tools bypass normal shell controls?

Failure root: sandbox mismatch between agent and user environment, approval fatigue, dangerous auto-approve/YOLO, or headless automation that cannot ask for required approval. [confidence: high]

### 2.8 Tests/evaluation/verification gate

Verification may be local tests, lint, build, typecheck, hidden benchmark tests, manual QA, reviewer agent, or evidence ledger. It is the difference between "patch was written" and "behavior was observed." [confidence: high]

Benchmark caveat: SWE-bench-style tests are useful but incomplete. Passing benchmark tests is not identical to semantic correctness. [confidence: high]

### 2.9 Memory/state/session persistence

Memory ranges from transient transcript to project markdown memory to persistent user profile to orchestration ledger. Cline Memory Bank and OmO `.omo` ledgers are explicit. Hermes is persistent by design in local evidence. Devin Local docs explicitly document memory limitations. [confidence: high]

Failure root: hidden state drift, stale memory, privacy leak, accidental credential persistence, or inconsistent state after interrupted sessions. [confidence: high]

### 2.10 MCP/tools/plugins/hooks/skills/subagents

MCP and plugin systems move agents from a fixed tool set to an extensible tool plane. Cursor, Cline, Continue, Devin, Codex/OmO, and OpenHands all have extension surfaces in different forms. [confidence: high]

Key distinction: plugins/hooks can control lifecycle and policy, while MCP mainly exposes tools. Skills are usually prompt/procedure packages. Subagents may be actual processes/threads or just prompting conventions. [confidence: high]

### 2.11 Human approval UX

Approval is a control system, not a checkbox. Modal prompts, checkpoints, policy files, allowlists, ask/allow/deny, and YOLO modes create different risk profiles. [confidence: high]

Failure root: approval fatigue creates careless approvals; too much denial prevents useful automation; auto-approve creates destructive risk. [confidence: high]

### 2.12 Telemetry/logging/evidence ledger

Debuggable agents leave traces: action logs, tool outputs, diffs, plans, test evidence, and state ledgers. Production products may also log telemetry. The useful question is whether the evidence supports postmortem and rollback without leaking secrets. [confidence: high]

## 3. Representative Implementations

### 3.1 OpenAI Codex CLI / Codex ecosystem

Codex CLI is best treated as a local agentic coding runtime: it runs in the user's repo, reads/writes files, executes shell commands under sandbox/approval policy, supports project instructions, and can be extended by plugins/MCP in this environment. [confidence: high]

Under the hood lens:

- Loop location: local CLI/App runtime. [confidence: high]
- Context: repo files, instructions, conversation, tool outputs, local search. [confidence: high]
- Permissions: sandbox and approval profile. [confidence: high]
- Extension: MCP/plugins in this environment; OmO adds hooks/skills. [confidence: high local]
- Caveat: Codex docs/source and local plugin behavior must be separated from OmO behavior. [confidence: high]

Sources: OpenAI Codex GitHub https://github.com/openai/codex, Codex security https://developers.openai.com/codex/security, local `assets/evidence/codex-baseline.md`.

### 3.2 Anthropic Claude Code

Claude Code is a terminal coding agent with documented permissions and MCP/tooling. It resembles Codex in being a local coding surface rather than an IDE-only sidepane. [confidence: high]

Under the hood lens:

- Loop location: terminal CLI. [confidence: high]
- Context: repo and user-provided instructions; exact internal context ranking is not fully public. [confidence: medium]
- Permissions: documented permission controls. [confidence: high]
- Caveat: internal indexing/router behavior is less publicly auditable than open-source tools. [confidence: medium]

Sources: Claude Code overview https://docs.anthropic.com/en/docs/claude-code/overview, permissions https://code.claude.com/docs/en/permissions.

### 3.3 Aider

Aider is one of the clearest open CLI agents for studying context and edit mechanics because it documents repo maps, edit formats, git integration, lint/test loops, and model-specific strategies. [confidence: high]

Under the hood lens:

- Loop location: CLI chat over a git repo. [confidence: high]
- Context: explicit files plus repo map. [confidence: high]
- Edit strategy: model-specific edit formats and patches. [confidence: high]
- Verification: lint/test command integration. [confidence: high]
- Caveat: repo map helps compression but is still a lossy representation. [confidence: medium]

Sources: Aider repo map https://aider.chat/docs/repomap.html, edit formats https://aider.chat/docs/more/edit-formats.html, lint/test https://aider.chat/docs/usage/lint-test.html.

### 3.4 OpenHands / OpenDevin

OpenHands is a platform approach. It is valuable for this research because it makes runtime/sandbox/tooling/orchestration explicit rather than treating the model as the whole agent. [confidence: high]

Under the hood lens:

- Loop location: OpenHands app/runtime. [confidence: high]
- Context: files, shell, browser, task history, runtime state. [confidence: high]
- Execution: sandboxed runtime/container family. [confidence: high]
- Evaluation: benchmark harnesses and local tasks. [confidence: high]
- Caveat: platform breadth does not isolate which component caused benchmark gains. [confidence: high]

Sources: OpenHands paper https://arxiv.org/abs/2407.16741, repo https://github.com/All-Hands-AI/OpenHands, docs https://docs.all-hands.dev/.

### 3.5 SWE-agent

SWE-agent's central claim is that the agent-computer interface matters. That means command set, observation format, file editing, and testing affordances are causal infrastructure, not peripheral UX. [confidence: high]

Under the hood lens:

- Loop location: benchmark/local runner around a repository. [confidence: high]
- Context: issue text, repo exploration, shell outputs, tests. [confidence: high]
- Edit strategy: tool-mediated file edits. [confidence: high]
- Verification: iterative test execution and SWE-bench scoring. [confidence: high]
- Caveat: benchmark environment is cleaner than many real development workflows. [confidence: high]

Sources: SWE-agent paper https://arxiv.org/abs/2405.15793, repo https://github.com/SWE-agent/SWE-agent.

### 3.6 Agentless

Agentless matters because it pushes back on the assumption that an open-ended agent loop is always required. For many SWE-bench-style repair tasks, staged localization, patch generation, and validation can be competitive. [confidence: high for paper-level claim]

Under the hood lens:

- Loop location: workflow pipeline, not general autonomous loop. [confidence: high]
- Context: targeted localization and repair context. [confidence: high]
- Verification: benchmark validation. [confidence: high]
- Caveat: strong repair benchmark performance does not imply long-horizon autonomy. [confidence: high]

Source: Agentless paper https://arxiv.org/abs/2407.01489.

### 3.7 Cursor / Windsurf / Continue / Cline / Roo / Goose IDE-style family

IDE-style agents differ by how much context selection and control they expose. Cursor emphasizes indexed codebase/IDE agent UX and plugin/MCP surfaces. Continue exposes CLI/TUI permissions and open-source extension behavior. Cline exposes Plan/Act, Memory Bank, MCP, plugins, and explicit Auto Approve/YOLO risks. Devin/Windsurf docs now route many local-agent concepts through Devin Desktop/Local, DeepWiki, Codemaps, Terminal, and ACP. Roo Code and Goose deserve deeper follow-up in source-level research. [confidence: high for Cursor/Continue/Cline/Devin docs, low-to-medium for Windsurf/Roo/Goose coverage in this pass]

### 3.8 LazyCodex / OmO

Local evidence shows LazyCodex/OmO as a Codex plugin/harness. The manifest declares hooks, MCP tools, code intelligence, workflow, and context injection. Hook files wire session start, prompt submit, pre/post tool use, post compact, stop, and subagent-stop behavior. Skills and components define ultrawork, ulw-loop, start-work continuation, rules, LSP, codegraph, git-bash, telemetry, and teammode. [confidence: high local]

Architecture implication:

- Loop location: Codex remains the coding runtime; OmO wraps lifecycle and discipline. [confidence: high]
- Context: injected rules/skills/directives plus Codex context. [confidence: high local]
- State: `.omo/*`, `~/.codex/agents`, local plugin cache. [confidence: high local]
- Caveat: declared MCP servers may not all be enabled at runtime. [confidence: high local]

Sources: local OmO manifest and `.mcp.json`, `assets/evidence/lazycodex-crosscheck.md`, `assets/evidence/reconciled-facts.md`.

### 3.9 Gajae-Code

The local evidence set reconciles an earlier agent-run mismatch: public/npm/repo evidence exists, but local PATH execution was not verified. The intended architecture appears to be a focused runner/control surface with interview, reviewed plan, execution, tmux/worktree/team, and evidence orientation. [confidence: medium]

Architecture implication:

- Loop location: independent runner/control surface. [confidence: medium]
- State/control: plan, execution, evidence, tmux/worktree lanes. [confidence: medium]
- Caveat: canonical source drift and local execution gap remain open. [confidence: high caveat]

Sources: `assets/evidence/gajae-code-crosscheck.md`, `assets/evidence/reconciled-facts.md`.

### 3.10 Hermes Agent

Hermes local evidence describes a persistent coordinator/runtime: user channels, memory, skills, gateway, cron, delegation/subagents, and MCP. This puts Hermes in a different category from repo-local coding agents. [confidence: high local]

Architecture implication:

- Loop location: persistent coordinator/gateway runtime. [confidence: high local]
- Context: long-term memory, skills, messaging identity, scheduled jobs. [confidence: high local]
- Execution: delegates to tools/runtimes including coding surfaces. [confidence: medium]
- Caveat: local version and public docs may drift; provider/API details must not be reported. [confidence: high caveat]

Sources: `assets/evidence/hermes-crosscheck.md`, `assets/evidence/reconciled-facts.md`.

## 4. Research Papers, Benchmarks, And Empirical Evidence

### 4.1 SWE-bench and SWE-bench Verified

SWE-bench is a repository-level benchmark from real GitHub issues and PRs. It is valuable because it forces agents to inspect code, edit across files, and pass tests. SWE-bench Verified improves task quality through human validation. [confidence: high]

But neither should be treated as a direct product-quality ranking. Incomplete tests can accept wrong patches; issue descriptions are cleaner than many real user requests; static datasets can become contaminated; product agents must also handle clarification, UX, permissions, long-running state, and ambiguous requirements. [confidence: high]

Sources: SWE-bench https://arxiv.org/abs/2310.06770, official site https://www.swe-bench.com/, repo https://github.com/princeton-nlp/SWE-bench, Verified announcement https://openai.com/index/introducing-swe-bench-verified/, benchmark critiques https://arxiv.org/abs/2503.15223 and https://arxiv.org/abs/2506.09289.

### 4.2 SWE-agent, Agentless, OpenHands

These three are complementary:

- SWE-agent: interface design and iterative tool use can improve repo repair. [confidence: high]
- Agentless: staged workflow can compete without open-ended autonomy. [confidence: high]
- OpenHands: production-like agents require runtime, sandbox, tools, browser/shell/code execution, and orchestration infrastructure. [confidence: high]

Together they imply that "agent architecture" is not one thing. It is a set of design choices: action space, context compression, verifier, environment, permissions, state, and user gate. [confidence: high]

### 4.3 ReAct, Reflexion, Toolformer, planning

These are mechanism papers, not product audits:

- ReAct: interleaving reasoning and actions helps tool-using tasks. [confidence: high]
- Reflexion: self-critique and episodic memory can improve repeated attempts. [confidence: high]
- Toolformer: models can learn tool-use behavior from self-supervised data. [confidence: high]
- Plan-and-Solve/plan-execute: explicit planning can help multi-step tasks but can go stale. [confidence: high]

Product implication: these patterns explain why modern agents combine reasoning, action, memory, and planning. They do not prove that any specific product implements them correctly. [confidence: high]

Sources: ReAct https://arxiv.org/abs/2210.03629, Reflexion https://arxiv.org/abs/2303.11366, Toolformer https://arxiv.org/abs/2302.04761, Plan-and-Solve https://arxiv.org/abs/2305.04091.

## 5. Failure Patterns And Architecture Causes

| Failure pattern | Architecture cause | Affected types | Confidence |
| --- | --- | --- | --- |
| Context rot | Long transcript, stale summaries, hidden memory, old tool outputs | CLI, IDE, persistent runtime | high |
| Over-editing | Whole-file rewrite, weak diff constraints, broad instruction scope | CLI, IDE | high |
| Flaky tests | Verification gate depends on unstable local/CI environment | repo-local runners, benchmark agents | high |
| Sandbox mismatch | Agent runs in different FS/network/shell permissions than user or CI | CLI, OpenHands, Codex, Claude Code | high |
| Tool-call brittleness | Tool schema mismatch, command unavailable, truncated outputs | all tool agents | high |
| Hidden state drift | Memory/session/checkpoints/ledgers diverge from repo state | IDE, orchestrator, persistent runtime | high |
| Approval fatigue | Too many prompts make users approve without review | IDE, CLI | high |
| Repo indexing staleness | Semantic index or code graph not updated after edits | IDE, codegraph agents | medium |
| Benchmark overfitting | Static dataset, hidden tests as target, issue text leakage | SWE-bench agents | high |
| Multi-agent fragmentation | Workers duplicate or contradict each other without durable state | team agents | medium |

Docs-backed caveats include Continue headless approval constraints, Cline YOLO risk, Devin Local feature/memory limitations, and Codex/Claude/IDE permission boundaries. Paper-backed caveats include benchmark incompleteness and semantic-correctness gaps. Public-review anecdotes were not collected deeply enough in this pass to assign high confidence to product-specific pain claims beyond documented caveats. [confidence: high for caveat categories, low-to-medium for product-specific anecdote prevalence]

### 5.1 Public review and empirical signals

The strongest "real-world" evidence in this pass is not random social media commentary but repeated caveats from product docs and empirical papers:

- Continue documents that headless mode cannot prompt for `ask` tools unless permissions are configured, which connects automation failures to permission architecture rather than model quality. [confidence: high]
- Cline documents Auto Approve and YOLO risk, which connects destructive outcomes to approval policy and user configuration. [confidence: high]
- Devin Local documents memory and feature limitations, which connects user expectation mismatch to persistence/runtime scope. [confidence: high]
- AI IDE design studies report that generated large projects can be functionally plausible while carrying design and maintainability issues. This supports the "benchmark correctness is not architecture quality" caveat. [confidence: medium]
- Comment-context contamination studies report that defective commented-out code can influence AI coding assistant outputs. This supports treating prompt/context assembly as a safety-critical layer. [confidence: medium]
- Public summaries and reviews of Cursor include support/pricing controversy and broad "vibe coding" concerns, but those are not direct architecture proofs. They are useful as low-confidence signals that UX, pricing, support automation, and human review practices shape adoption as much as core editing capability. [confidence: low-to-medium]

Sources: Continue permissions https://docs.continue.dev/cli/tool-permissions, Cline Auto Approve https://docs.cline.bot/features/auto-approve, Devin Local https://docs.devin.ai/desktop/devin-local, AI IDE design study https://arxiv.org/abs/2604.06373, Comment Traps https://arxiv.org/abs/2512.20334, Cursor public summary https://en.wikipedia.org/wiki/Cursor_%28code_editor%29, TechRadar roundup https://www.techradar.com/best/best-ai-tools.

## 6. What To Look For When Evaluating A Coding Agent

Use these questions instead of a feature checklist:

1. Agent loop는 어디에 있는가: IDE, CLI, server, runtime, plugin, or persistent coordinator?
2. Repo context는 어떻게 수집, 압축, 갱신, 무효화되는가?
3. Plan은 explicit artifact인가, hidden reasoning인가, or workflow gate인가?
4. Tool permission은 누가 통제하는가: user, policy, classifier, enterprise admin, or sandbox?
5. Editing은 patch인가, whole-file rewrite인가, IDE API인가, benchmark action인가?
6. Verification은 실제 behavior를 관찰하는가, 아니면 patch 작성만 확인하는가?
7. State/evidence는 남는가: transcript, ledger, diff, test output, checkpoint, telemetry?
8. Multi-agent는 실제 orchestration인가 prompt convention인가?
9. Benchmark score와 실제 개발 UX가 어긋나는 지점은 무엇인가?

## 7. Claim Confidence Summary

High confidence:

- Coding agents share a common loop of context assembly, tool use, editing, permissioning, and verification.
- Agent loop location explains many product differences.
- Sandbox/approval is a first-class architecture layer.
- SWE-bench-style results must not be read as direct product-quality rankings.
- LazyCodex/OmO is a Codex plugin/harness in this local environment.
- Hermes is a persistent coordinator/runtime in local evidence.

Medium confidence:

- Gajae-Code architecture claims, because public/local evidence exists but local `gjc` execution was not verified.
- Windsurf-specific claims, because current docs in this pass route through Devin Desktop.
- Product-specific review pain prevalence, because public review corpus was not exhaustively collected.

Low confidence:

- Any closed-source internal context ranking, model routing, or indexing implementation not exposed in first-party docs/source.
- Marketing claims about "autonomy" or "understands your codebase" without source, issue, or reproducible evidence.

## 8. GitHub Pages 리포트로 반영해야 할 새 목차

현재 `index.html`은 네 제품 비교 중심이다. 새 research scope를 반영하려면 다음 IA가 더 적합하다.

1. Executive Summary: coding agent는 model이 아니라 control layer다
2. Taxonomy: IDE, CLI, repo-local runner, orchestrator, multi-agent, persistent runtime
3. Common Architecture: model router부터 evidence ledger까지
4. Control Surface Map: loop location, context, permissions, editing, verification
5. Implementation Deep Dives
   - Codex CLI / Codex ecosystem
   - Claude Code
   - Aider
   - OpenHands
   - SWE-agent / Agentless
   - Cursor / Continue / Cline / Devin/Windsurf
   - LazyCodex/OmO
   - Gajae-Code
   - Hermes Agent
6. Benchmarks And Papers: SWE-bench, Verified, SWE-agent, Agentless, OpenHands, ReAct, Reflexion, Toolformer
7. Failure Patterns: architecture cause, symptom, mitigation
8. Evidence Map: official docs/source, papers, local observations, review signals
9. Open Questions And Next Experiments
10. Appendix: source list, local evidence policy, redaction policy
