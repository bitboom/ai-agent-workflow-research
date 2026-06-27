# Chapter 02 — Agent 분류

[← 연구 질문](01-research-question.md) · [다음: 공통 아키텍처 →](03-common-architecture.md)

## 분류 기준

Agent를 나눌 때 가장 먼저 볼 것은 UI가 아니라 **loop의 위치**입니다. loop가 editor extension 안에서 도는지, CLI process 안에서 도는지, benchmark runner가 container를 몰고 있는지, 별도 coordinator가 worktree와 tmux를 관리하는지에 따라 agent의 장점과 실패 방식이 달라집니다.

이 분류는 제품 브랜드를 영구히 고정하려는 표가 아닙니다. 하나의 프로젝트가 여러 층을 가질 수 있고, version이 바뀌면 위치도 바뀔 수 있습니다. 따라서 분류의 목적은 “어떤 제품이 어느 칸인가”보다 “어떤 evidence를 요구해야 하는가”를 정하는 데 있습니다.

## 여섯 계열

| 계열 | 대표 예 | loop/state 위치 | 먼저 확인할 것 |
| --- | --- | --- | --- |
| IDE embedded | Cline, Roo, Continue | editor extension, IDE state, index cache | active file, index freshness, approval UX, remote workspace routing |
| CLI coding agent | OpenAI Codex CLI, Aider, Goose | local process, shell, git repo | tool loop, patch strategy, sandbox, configured test command |
| Repo-local runner | SWE-agent, OpenHands, Agentless-style workflows | container/runtime/harness, benchmark trajectory | task reset, action parser, environment control, trajectory schema |
| Workflow orchestrator | Gajae-Code, LazyCodex/OmO | command layer, plugin/hook, state root | manifest vs runtime-callability, artifact layout, recovery behavior |
| Persistent runtime | Hermes Agent | long-running agent runtime, memory, gateway, cron/delegation | session persistence, toolsets, bridge identity, version drift |
| Team/multi-agent | GJC team, coordinator-worker designs | queue, worktree/tmux/mailbox/process state | real worker process, mailbox, conflict handling, cleanup |

## 왜 loop 위치가 중요한가

IDE embedded agent는 사용자가 보고 있는 editor state와 강하게 붙어 있습니다. 그래서 UX는 자연스럽지만 hidden context와 stale index가 위험합니다. Continue의 source map은 Redux thunk 기반 stream flow와 codebase indexer를 보여주며, Roo는 task loop, condense, file context tracker, checkpoint가 분리되어 있습니다. 이런 구조에서는 “무슨 모델인가”보다 “어느 파일이 context에 들어갔는가”가 품질을 좌우합니다.

CLI agent는 local repo와 shell에 가까워서 재현성이 좋습니다. Aider의 `RepoMap`은 context compression을 명시적으로 보여주는 좋은 예이고, Codex는 tool router, sandbox, apply patch handler가 분리되어 있습니다. 하지만 CLI 계열도 sandbox/approval profile, shell persistence, patch apply failure를 따로 봐야 합니다.

Runner 계열은 benchmark와 trace에 강합니다. SWE-agent의 trajectory, OpenHands package source의 conversation/event store 같은 구조는 평가에 유리합니다. 반대로 실제 개발 UX와 remote sandbox lifecycle이 별도 문제가 됩니다.

Workflow orchestrator와 persistent runtime은 단순 coding assistant보다 넓습니다. Gajae-Code는 deep-interview, ralplan, ultragoal, team command가 `.gjc` artifact를 만들고, Hermes는 memory, toolsets, gateway, cron, delegation으로 session을 넘어갑니다. 이 계열은 “patch를 잘 만들었나”만으로 평가하면 핵심을 놓칩니다.

## 중요한 구분

| 혼동 | 분리해서 볼 것 |
| --- | --- |
| manifest에 hook이 있다 | 실제 `$...` workflow가 runtime-callable인가 |
| source에 team runtime이 있다 | live tmux/worktree worker가 실제로 돌고 recovery 되는가 |
| benchmark에서 pass했다 | task family와 oracle이 실제 업무 실패를 덮지 않는가 |
| editor UX가 좋다 | hidden index/context failure가 추적 가능한가 |
| smoke test가 통과했다 | non-toy task completion과 artifact replay가 있는가 |

## 실패 패턴으로 다시 읽기

Public issue corpus는 prevalence evidence가 아닙니다. 하지만 failure taxonomy를 만드는 데는 유용합니다. context loss, bad edit application, sandbox friction, repeated loop, remote workspace mismatch는 서로 다른 계열에서 반복됩니다. 이 패턴은 “agent가 틀렸다”보다 “어느 layer가 실패했는가”를 묻도록 도와줍니다.

## 이 장의 결론

분류의 목적은 이름표 붙이기가 아니라 검증 질문을 고르는 것입니다. IDE 계열에는 index와 editor-state evidence를 요구하고, CLI 계열에는 shell/sandbox/edit evidence를 요구하고, runner 계열에는 trajectory를 요구하고, orchestrator 계열에는 durable state와 recovery proof를 요구해야 합니다.

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Agent orchestration comparison](../assets/evidence/agent-orchestration-comparison.md)
- [Coding agent taxonomy archive](../research/coding-agent-taxonomy.md)
