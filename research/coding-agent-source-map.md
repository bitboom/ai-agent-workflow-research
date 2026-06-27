# Coding Agent Source Map

작성일: 2026-06-26 KST

이 파일은 main report의 claim이 어떤 source에 기대는지 추적하기 위한 map이다. First-party docs/source와 local observation, paper, anecdotal review를 분리한다.

## First-Party Docs And Source

| Source | Type | Supports | Confidence |
| --- | --- | --- | --- |
| https://github.com/openai/codex | source/docs | Codex CLI as local coding agent, repo-local runtime, AGENTS-style project instructions, CLI surface | high |
| https://developers.openai.com/codex/security | official docs | Codex security/sandbox/approval framing | high |
| https://docs.anthropic.com/en/docs/claude-code/overview | official docs | Claude Code as terminal coding agent with tool use and codebase workflow | high |
| https://code.claude.com/docs/en/permissions | official docs | Claude Code permission model and approval surfaces | high |
| https://aider.chat/docs/repomap.html | official docs | Aider repo map and context compression approach | high |
| https://aider.chat/docs/more/edit-formats.html | official docs | Aider edit formats and patch strategy | high |
| https://aider.chat/docs/usage/lint-test.html | official docs | Aider lint/test integration | high |
| https://docs.all-hands.dev/ and https://github.com/All-Hands-AI/OpenHands | docs/source | OpenHands as runtime/sandbox/platform for software-development agents | high |
| https://github.com/SWE-agent/SWE-agent | source | SWE-agent agent-computer interface and benchmark harness | high |
| https://cursor.com/docs/agent/overview.md | official docs | Cursor IDE-side agent, codebase search, edits, terminal, checkpoints | high |
| https://cursor.com/docs/mcp.md | official docs | Cursor MCP/tool approval/run-mode surface | high |
| https://cursor.com/docs/plugins.md | official docs | Cursor plugin/skill/MCP packaging | high |
| https://docs.continue.dev/cli/quickstart | official docs | Continue CLI agent usage | high |
| https://docs.continue.dev/cli/tui-mode | official docs | Continue TUI session and tool approval UX | high |
| https://docs.continue.dev/cli/tool-permissions | official docs | Continue ask/allow/exclude permissions and automation caveats | high |
| https://docs.cline.bot/cline-overview | official docs | Cline editor/terminal agent, approval-first posture | high |
| https://docs.cline.bot/core-workflows/plan-and-act | official docs | Cline Plan Mode vs Act Mode split | high |
| https://docs.cline.bot/best-practices/memory-bank | official docs | Cline Memory Bank project-local state | high |
| https://docs.cline.bot/features/auto-approve | official docs | Cline Auto Approve and YOLO caveats | high |
| https://docs.cline.bot/mcp/mcp-overview | official docs | Cline MCP integration | high |
| https://docs.devin.ai/desktop/devin-local | official docs | Devin Local harness, permissions, memory limitations, feature gaps | high |
| https://docs.devin.ai/desktop/deepwiki | official docs | Devin DeepWiki code understanding surface | high |
| https://docs.devin.ai/desktop/codemaps | official docs | Devin Codemaps | high |
| https://docs.devin.ai/desktop/acp | official docs | Devin Agent Client Protocol integration | high |
| https://docs.devin.ai/desktop/terminal | official docs | Devin terminal command policy | high |

## Local Observation Sources

| Source | Supports | Confidence |
| --- | --- | --- |
| `assets/evidence/codex-baseline.md` | Local Codex version and role as baseline runtime in this repo | high for local observation |
| `assets/evidence/lazycodex-crosscheck.md` | Local LazyCodex/OmO install, plugin state, manifest path, MCP declaration caveat | high for local observation |
| `assets/evidence/reconciled-facts.md` | Controller adjudication of Codex/LazyCodex/Gajae/Hermes local and public facts | high for local observation, medium for external claims where routed through notes |
| `assets/evidence/gajae-code-crosscheck.md` | Gajae public/npm/repo and local execution caveat | medium |
| `assets/evidence/hermes-crosscheck.md` | Hermes local version, gateway state, public docs summary, secret redaction caveat | high for local observation, medium for external claims |
| `assets/evidence/source-level-architecture-atlas.md` | SHA-pinned repo/package source atlas for Codex, Aider, SWE-agent, Goose, Cline, Roo, Continue, OpenHands, Gajae-Code, and Hermes plus public failure-pattern corpus | high for directly read source paths, medium for issue corpus |
| `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json` | OmO plugin capabilities, hooks, MCP pointer | high local source |
| `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.mcp.json` | OmO declared MCP servers | high local source, medium runtime claim |
| `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/hooks/*.json` | OmO lifecycle hook wiring | high local source |
| `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/components/teammode/skills/teammode/SKILL.md` | OmO team state path and team workflow docs | high local source, medium runtime proof |

## Source-Level Architecture Atlas Snapshot

The source-level atlas has moved from “next step” to an evidence artifact. See `assets/evidence/source-level-architecture-atlas.md` for:

- SHA-pinned local clone/package inputs for Codex, Aider, SWE-agent, Goose, Cline, Roo, Continue, OpenHands, Gajae-Code, and Hermes.
- Per-agent loop/context/edit/sandbox/verification/state/tool-surface file maps.
- A public GitHub issue corpus grouped by context loss, bad edit application, sandbox/approval friction, test/evaluation caveats, runaway loops, routing/cost/latency, and local environment assumptions.

Caveats preserved there: OpenHands repo source is separated from PyPI package source; Gajae-Code public source evidence is not treated as local `gjc` smoke-test evidence; OmO manifest declarations are not treated as runtime-callable proof.

## Papers And Benchmarks

| Source | Supports | Confidence |
| --- | --- | --- |
| SWE-bench paper: https://arxiv.org/abs/2310.06770 | Real GitHub issue benchmark, repo-level patch evaluation | high |
| SWE-bench official site: https://www.swe-bench.com/ | Benchmark framing and current public benchmark surface | high |
| SWE-bench repo: https://github.com/princeton-nlp/SWE-bench | Dataset/harness source | high |
| SWE-bench Verified announcement: https://openai.com/index/introducing-swe-bench-verified/ | Human-validated subset and curation motivation | high for announcement |
| SWE-agent paper: https://arxiv.org/abs/2405.15793 | Agent-computer interface and interface design as performance lever | high |
| Agentless paper: https://arxiv.org/abs/2407.01489 | Workflow-style repair without a full autonomous loop | high for paper claim |
| OpenHands paper: https://arxiv.org/abs/2407.16741 | Platform/runtime/sandbox/orchestration framing | high |
| ReAct: https://arxiv.org/abs/2210.03629 | Reasoning plus action loop pattern | high |
| Reflexion: https://arxiv.org/abs/2303.11366 | Reflection and episodic memory pattern | high |
| Toolformer: https://arxiv.org/abs/2302.04761 | Learned tool-use policy concept | high |
| Plan-and-Solve prompting: https://arxiv.org/abs/2305.04091 | Explicit planning as a control pattern | high |
| UTBoost: https://arxiv.org/abs/2506.09289 | SWE-bench test-quality critique | medium, paper-level |
| Are "Solved Issues" in SWE-bench Really Solved Correctly?: https://arxiv.org/abs/2503.15223 | Semantic correctness critique of benchmark-passing patches | medium, paper-level |
| Comment Traps: https://arxiv.org/abs/2512.20334 | Defective commented-out code can degrade AI coding assistant output | medium, paper-level |
| Beyond Functional Correctness: https://arxiv.org/abs/2604.06373 | AI IDE generated projects can be functionally plausible while accumulating design issues | medium, paper-level |
| Developer-provided context study: https://arxiv.org/abs/2512.18925 | Project rules/context files are an emerging context-control mechanism | medium, paper-level |

## Public Reviews, Issues, And Caveat Sources

These sources are useful for failure-pattern hypotheses, but claims should be lower confidence unless repeated across independent sources or supported by first-party docs.

| Source | Supports | Confidence |
| --- | --- | --- |
| Product docs caveats for Continue headless permissions: https://docs.continue.dev/cli/tool-permissions | Approval model can break or constrain automation | high |
| Cline YOLO warning: https://docs.cline.bot/features/auto-approve | Auto-approval can create destructive risk | high |
| Devin Local limitations: https://docs.devin.ai/desktop/devin-local | Memory and feature gaps in local harness | high |
| SWE-bench critique papers | Benchmark overfitting, incomplete tests, contamination concerns | medium to high depending on paper |
| Public HN/Reddit/blog commentary not deeply collected in this pass | Pricing/support/UX pain, context rot anecdotes | low until expanded |
| Cursor public summary: https://en.wikipedia.org/wiki/Cursor_%28code_editor%29 | Publicly summarized support/pricing incidents and product history, useful only as a pointer to underlying reports | low to medium |
| TechRadar AI tools roundup: https://www.techradar.com/best/best-ai-tools | Hands-on public review signal for broad tool positioning, not architecture proof | low |

## Claim-To-Source Index

| Claim | Primary source(s) | Confidence |
| --- | --- | --- |
| Coding agents differ mainly by where the loop and control gates live. | Taxonomy synthesis across Codex, Claude Code, Aider, Cursor, Cline, Continue, OpenHands, SWE-agent, OmO local files | high |
| Repo context is assembled from active files, search/index, instructions, history, memory, and tool outputs. | Cursor, Continue, Cline, Aider, Codex, SWE-agent/OpenHands papers | high |
| Sandbox/approval is a core architectural layer, not UX decoration. | Codex security, Claude permissions, Continue permissions, Cline auto approve, Devin Local, OpenHands/SWE-agent | high |
| Benchmark results should not be read as direct product-quality rankings. | SWE-bench, SWE-bench Verified, SWE-agent, Agentless, critique papers | high |
| LazyCodex/OmO is a Codex plugin/harness layer in this environment. | local manifest, `lazycodex-crosscheck.md`, `reconciled-facts.md` | high for local |
| Gajae-Code is a plan/execute/evidence-oriented runner, but local PATH execution was not verified. | `gajae-code-crosscheck.md`, `reconciled-facts.md` | medium |
| Hermes is a persistent coordinator/runtime in local evidence, not merely a repo-local code editor. | `hermes-crosscheck.md`, `reconciled-facts.md` | high for local |
| Multi-agent setups are not automatically superior. | ReAct/Reflexion/planning/OpenHands synthesis, survey-style evidence, practical orchestration caveats | medium to high |
