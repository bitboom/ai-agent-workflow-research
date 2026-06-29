# Gajae-Code Deep Dive — Repo-local Workflow Orchestrator

[← 목차](README.md)

Gajae-Code는 이 책에서 **Repo-local Workflow Orchestrator / standalone coding-agent control plane**으로 분류한다. 핵심은 단일 agent loop가 아니라 repo 안에서 workflow phase를 만들고, 그 phase의 상태와 산출물을 `.gjc/_session-*` 아래에 남기는 점이다. Gajae-Code를 “또 하나의 coding agent CLI”로만 읽으면 중요한 부분을 놓친다. 이 시스템은 interview, plan, goal execution, team coordination을 각각의 phase로 나누고, phase 사이 handoff와 gate를 durable state로 표현하려 한다.

## Working definition

| 항목 | 판정 |
| --- | --- |
| 1차 분류 | Repo-local Workflow Orchestrator |
| 2차 분류 | Standalone coding-agent control plane |
| 핵심 workflow | `deep-interview → ralplan → ultragoal → team` |
| 핵심 state root | `.gjc/_session-*` |
| 현재 강한 근거 | source-confirmed docs/source anchors, runtime-confirmed basic smoke, artifact-backed controlled workflow replay |
| 아직 미검증 | live non-dry-run team, recovery/resume, Hermes bridge runtime, owner/package drift |

이 정의에서 “repo-local”이라는 말이 중요하다. Gajae-Code는 Hermes처럼 여러 플랫폼과 장기 memory를 포괄하는 persistent runtime이라기보다, 특정 repository 안의 coding workflow를 phase와 state로 묶는 쪽에 가깝다. 그러나 단순 harness와도 다르다. benchmark task를 실행하고 점수를 매기는 데 그치지 않고, 작업 자체를 interview, plan, goal, team이라는 운영 절차로 구조화한다.

## Phase model — deep-interview에서 team까지

`deep-interview`는 요구사항을 바로 patch로 바꾸지 않고 spec로 수렴시키는 phase다. 이 phase의 의미는 “agent에게 바로 구현하라고 시키지 않는다”에 있다. 요구사항을 질문과 답변, final spec, handoff 형태로 고정한 다음 planning phase로 넘긴다. 단일 agent loop에서는 이 내용이 transcript 안에만 남을 수 있지만, Gajae-Code는 `.gjc` 아래 spec artifact를 남기는 방향을 택한다.

`ralplan`은 consensus/reviewed planning layer로 읽을 수 있다. plan이 단순 bullet list가 아니라 stage artifact, index, pending approval과 연결된다면 그것은 workflow gate다. plan이 승인되기 전에 execution으로 넘어가지 않게 만들고, 나중에 controller가 어떤 계획을 기준으로 실행했는지 확인할 수 있게 한다.

`ultragoal`은 큰 작업을 goal ledger로 쪼개고 상태를 업데이트하는 phase다. replay evidence에서는 goals, ledger, checkpoint, review blocker가 확인됐다. 이것은 “작업이 어디까지 진행됐는가”를 transcript가 아니라 durable artifact로 보게 만든다. `team`은 worker/process coordination을 지향한다. 현재 evidence는 `team --dry-run` state layout까지이므로 live worker orchestration claim은 아직 보류해야 한다.

## State root와 artifact map

Gajae-Code 분석의 핵심 evidence는 `.gjc/_session-*`다. controlled replay summary는 다음 계열의 artifact를 확인한다.

| 영역 | 대표 artifact | 의미 |
| --- | --- | --- |
| interview | `state/deep-interview-state.json`, `specs/deep-interview-*.md` | 요구사항 수렴과 handoff state |
| planning | `state/ralplan-state.json`, `plans/ralplan/.../stage-*.md`, `pending-approval.md` | staged plan, approval gate, plan index |
| goals | `ultragoal/goals.json`, `ultragoal/ledger.jsonl`, `state/ultragoal-state.json` | goal lifecycle, checkpoint, blocker 기록 |
| team | `state/team/.../config.json`, `manifest.v2.json`, `tasks/*.json`, `events.jsonl` | worker/task/event layout, dry-run team structure |

이 artifact map은 Gajae-Code를 단순 agent가 아니라 workflow orchestrator로 읽게 하는 가장 강한 이유다. agent가 어떤 말을 했는가보다 workflow가 어떤 state를 남겼는가가 중요하다. 또한 이 구조는 replay와 recovery의 전제다. state root가 있어야 다음 실행이 어디서 이어질지, 어떤 artifact가 canonical인지, 어떤 goal이 blocked인지 판단할 수 있다.

## Evidence label별 현재 판정

`source-confirmed`: README/docs와 package source에서 Gajae-Code가 focused coding-agent runner, interviews, reviewed plans, tmux-native execution, durable verification을 지향한다는 근거가 있다. source anchors는 `deep-interview`, `ralplan`, `ultragoal`, `team` command/runtime 파일로 연결된다.

`runtime-confirmed`: `gjc/0.7.3` version/help/smoke/print smoke와 controlled temp repo replay에서 각 workflow command surface가 호출 가능한 것으로 정리됐다. 단, local environment observation은 설치 상태와 해당 replay 조건을 말할 뿐 모든 운영 상황을 보장하지 않는다.

`artifact-backed`: isolated fixture repo에서 `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run`이 `.gjc/_session-*` 아래 expected artifact layout을 쓴 것이 확인됐다. 이 라벨이 Gajae-Code deep dive의 핵심이다.

`unverified`: live non-dry-run `team`, tmux worker heartbeat, worktree cleanup, orphan recovery, `.gjc` corruption recovery, long-running resume, Hermes coordinator bridge runtime은 아직 본문에서 강하게 단정하지 않는다.

## Orchestrator로서의 강점

Gajae-Code의 강점은 workflow를 repo 가까이에 둔다는 점이다. state root가 repo 안에 있고, 계획과 goal과 team state가 같은 session root 아래 놓인다. 이는 controller가 산출물을 확인하기 쉽고, public report에서 sanitized summary를 만들기 쉽다. 또한 `deep-interview → ralplan` handoff처럼 phase 간 연결이 명시되면, agent가 중간 결정을 잊거나 계획 없이 실행하는 문제를 줄일 수 있다.

또 다른 강점은 approval과 blocker를 artifact로 표현하려는 방향이다. replay에서 `ultragoal review-start`가 executor QA artifact absence를 blocker로 취급한 것은 “review gate가 단순 문구가 아니라 상태 전이에 영향을 준다”는 신호다. 이런 gate는 coding agent를 SDLC component로 쓰려면 중요하다.

## Caveat와 다음 검증

Gajae-Code를 이미 완성된 enterprise orchestrator라고 말하면 과장이다. 현재 가장 강한 evidence는 controlled artifact replay다. live team execution, recovery/resume, Hermes bridge, package/repo canonical owner drift는 남아 있다. 특히 team dry-run은 state layout과 command callability를 증명하지만 실제 tmux pane startup, worker coordination, heartbeat recovery를 증명하지 않는다. 따라서 다음 검증은 live team을 작은 repo에서 실행하고, 중단/재시작/충돌/cleanup을 관찰한 뒤 artifact ledger와 결과물을 함께 확인하는 방식이어야 한다.

## 이 장의 결론

Gajae-Code는 이 책의 세 대상 중 “Workflow Orchestrator”라는 이름에 가장 직접적으로 맞는다. 이유는 명확하다. workflow phase가 있고, `.gjc/_session-*` state root가 있고, artifact ledger가 있으며, approval/blocker/team state를 표현하려 한다. 아직 live orchestration proof가 남아 있지만, 현재 evidence만으로도 Gajae-Code를 단순 AI Agent나 단순 Harness가 아니라 repo-local workflow control plane으로 분석하는 것이 타당하다.
