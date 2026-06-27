# Chapter 02 — Agent 분류

[이전: 연구 질문](01-research-question.md) · [목차](README.md) · [다음: 공통 아키텍처](03-common-architecture.md)

## 분류 기준

coding agent는 feature list보다 **loop가 어디서 돌고 state가 어디에 남는지**로 나누는 편이 정확합니다.

| 계열 | 예시 | 핵심 관찰 지점 |
| --- | --- | --- |
| IDE embedded | Cline, Roo, Continue, Cursor | editor state, index freshness, diff UX, approval UX |
| CLI coding agent | OpenAI Codex CLI, Aider, Goose, Claude Code | shell/test loop, patch strategy, sandbox profile |
| Repo-local runner | SWE-agent, OpenHands, Agentless | issue-to-patch trajectory, benchmark harness, container/runtime |
| Workflow orchestrator | Gajae-Code, LazyCodex/OmO | plan/review/state/artifact workflow |
| Persistent runtime | Hermes Agent | memory, cron, delegation, gateway, messaging identity |
| Team/multi-agent | Gajae team, Hermes delegation | durable queue, worktree/tmux, mailbox, recovery |

## 중요한 구분

- multi-agent role prompt는 orchestration proof가 아니다.
- public source는 runtime proof가 아니다.
- manifest-declared MCP/hook은 runtime-callable proof가 아니다.

## 더 읽기

- [Coding agent taxonomy](../research/coding-agent-taxonomy.md)
- [Control-plane orchestration comparison](../assets/evidence/agent-orchestration-comparison.md)
