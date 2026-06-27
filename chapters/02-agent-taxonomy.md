# Chapter 02 — Agent 분류

[이전: 연구 질문](01-research-question.html) · [목차](index.html) · [다음: 공통 아키텍처](03-common-architecture.html)

## 분류 기준

coding agent는 feature list보다 **loop가 어디서 돌고 state가 어디에 남는지**로 나누는 편이 정확합니다. “IDE에서 보이는 assistant”와 “CLI에서 repo를 수정하는 agent”와 “tmux/worktree worker를 관리하는 orchestrator”는 모두 코드를 바꿀 수 있지만, failure mode와 evidence가 완전히 다릅니다.

## 여섯 계열

| 계열 | 예시 | 핵심 관찰 지점 |
| --- | --- | --- |
| IDE embedded | Cline, Roo, Continue, Cursor | editor state, index freshness, diff UX, approval UX |
| CLI coding agent | OpenAI Codex CLI, Aider, Goose, Claude Code | shell/test loop, patch strategy, sandbox profile |
| Repo-local runner | SWE-agent, OpenHands, Agentless | issue-to-patch trajectory, benchmark harness, container/runtime |
| Workflow orchestrator | Gajae-Code, LazyCodex/OmO | plan/review/state/artifact workflow |
| Persistent runtime | Hermes Agent | memory, cron, delegation, gateway, messaging identity |
| Team/multi-agent | Gajae team, Hermes delegation | durable queue, worktree/tmux, mailbox, recovery |

## 왜 loop 위치가 중요한가

IDE embedded agent는 사용자가 보고 있는 editor state와 selection, diagnostics, workspace index를 자연스럽게 활용합니다. 대신 hidden context가 언제 stale해졌는지 독자가 알기 어렵습니다. CLI coding agent는 shell/test loop를 재현하기 쉽고 patch가 git diff로 남습니다. 대신 approval policy나 sandbox profile이 실제 tool capability와 맞지 않으면 실패가 생깁니다.

Repo-local runner는 issue-to-patch trajectory를 연구하기 좋습니다. SWE-agent나 OpenHands 같은 계열은 benchmark harness와 runtime이 분명해 trace를 남기기 좋지만, benchmark task의 oracle과 실제 제품 사용 경험을 혼동하면 안 됩니다. Workflow orchestrator와 persistent runtime은 더 긴 시간축을 다룹니다. 여기서는 “한 번의 patch”보다 durable state, plan handoff, worker recovery, message gateway, cron job이 중요합니다.

## 중요한 구분

- multi-agent role prompt는 orchestration proof가 아닙니다.
- public source는 runtime proof가 아닙니다.
- manifest-declared MCP/hook은 runtime-callable proof가 아닙니다.
- benchmark score는 UX, recovery, privacy, cost, maintainability를 모두 설명하지 않습니다.

## 이 장의 결론

agent를 비교할 때 첫 질문은 “어떤 모델을 쓰는가”가 아니라 “어디에 loop가 있고, 어디에 state가 남고, 어떤 evidence를 남기는가”입니다. 이 분류가 있어야 다음 장의 공통 아키텍처를 제품별 UI와 독립적으로 읽을 수 있습니다.

## 더 읽기

- [Taxonomy research note](../research/coding-agent-taxonomy.md)
- [Agent orchestration comparison](../assets/evidence/agent-orchestration-comparison.md)
