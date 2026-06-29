# AI Agent / Harness / Workflow Orchestrator 구분

[← 목차](README.md)

Workflow Control Plane을 말하려면 먼저 세 층을 분리해야 한다. 많은 문서가 “agent”, “runner”, “harness”, “orchestrator”, “workflow”라는 단어를 섞어 쓰지만, 이 책에서는 의도적으로 구분한다. 구분의 목적은 용어 싸움이 아니라 claim을 정확히 평가하기 위해서다. 어떤 시스템이 단일 patch loop만 제공하는데 orchestrator라고 말하면 과장이고, 어떤 시스템이 workflow state와 recovery를 관리하는데 단순 agent라고 부르면 핵심을 놓친다.

## 세 층의 working definition

| 층 | 중심 단위 | 핵심 책임 | 대표 질문 |
| --- | --- | --- | --- |
| AI Agent | `turn`, `message`, `tool call`, `patch`, `test run` | 목표를 받아 context를 만들고 tool/edit/test loop로 결과물을 만든다. | 이 agent는 필요한 파일을 찾고 안전하게 수정하고 검증했는가? |
| Harness | `task`, `environment`, `trajectory`, `score`, `oracle` | agent를 특정 환경에 넣고 실행·관찰·평가한다. | 이 실행은 재현 가능하며 같은 task에서 비교 가능한가? |
| Workflow Orchestrator / Control Plane | `workflow`, `phase`, `state root`, `artifact`, `approval gate`, `worker`, `resume/recovery` | agent/harness를 포함한 작업 흐름을 설계·통제·기록·복구한다. | 이 시스템은 긴 작업을 단계화하고 증거와 복구 지점을 유지하는가? |

이 정의로 보면 Gajae-Code, Hermes, LazyCodex/OmO는 모두 일반 agent 비교표의 마지막 줄에 놓기 어렵다. 세 시스템 모두 어떤 방식으로든 agent 실행의 바깥쪽에 workflow discipline을 얹는다. 다만 같은 orchestrator는 아니다. Gajae-Code는 repo-local phase orchestrator, Hermes는 persistent runtime/meta-orchestrator, LazyCodex/OmO는 Codex-embedded control overlay에 가깝다.

## 분석 축 1 — phase model

Workflow Orchestrator는 작업을 phase로 나눈다. 단일 agent loop는 “요청 → tool call → patch → test → 답변”으로 끝날 수 있다. 반면 orchestrator는 interview, planning, approval, execution, review, checkpoint, handoff 같은 phase를 만든다. Gajae-Code의 `deep-interview → ralplan → ultragoal → team`은 이 축에서 가장 선명하다. LazyCodex/OmO의 `$ulw-plan → $start-work → $ulw-loop` 계열도 phase model을 지향한다. Hermes는 고정된 coding phase보다 slash commands, skills, cron, delegation을 통해 다양한 workflow를 구성하는 runtime에 가깝다.

## 분석 축 2 — state root

Control plane은 state가 어디에 남는지를 명확히 해야 한다. agent transcript만 남으면 긴 작업의 canonical state를 알기 어렵다. Gajae-Code는 `.gjc/_session-*` 아래 specs, plans, ultragoal goals, ledger, team state를 남긴다. LazyCodex/OmO는 `.omo/...` 계열 project memory, workflow ledgers, Codex plugin cache와 연결된다. Hermes는 `~/.hermes/` 아래 sessions, memory, skills, logs, cron state, gateway state를 갖는다. state root가 있다는 사실만으로 orchestrator가 되는 것은 아니지만, state root 없이 workflow orchestration을 주장하기는 어렵다.

## 분석 축 3 — artifact ledger

좋은 orchestrator는 “완료했다”는 말보다 산출물 ledger를 남긴다. Gajae-Code replay에서는 deep-interview spec, ralplan planner/final artifacts, pending approval, ultragoal goals/ledger, team dry-run state가 남았다. LazyCodex/OmO docs는 `.omo/ulw-loop` 아래 brief/goals/ledger 같은 구조를 설명한다. Hermes는 tool results, trajectories, session history, scheduled job output, skills, memory updates가 runtime artifact가 된다. artifact ledger가 있어야 controller나 사람 reviewer가 claim을 검증할 수 있다.

## 분석 축 4 — approval/gate

Workflow Control Plane은 위험한 실행을 gate로 통제한다. 단일 agent도 command approval을 가질 수 있지만 orchestrator의 gate는 phase 전환과 연결된다. 계획이 승인되기 전 실행하지 않는다든지, review artifact가 없으면 다음 goal을 막는다든지, mutation opt-in이 없으면 MCP bridge가 fail-closed하는 방식이다. Gajae-Code의 pending approval과 review blocker는 이 축의 중요한 신호다. Hermes는 tool approval, gateway command approval, cron delivery, MCP mutation opt-in 같은 넓은 운영 gate를 갖는다. LazyCodex/OmO는 Codex hook approval과 plugin capability approval에 묶인다.

## 분석 축 5 — worker/process orchestration

Orchestrator라는 말은 worker coordination을 요구한다. role prompt를 여러 개 만든다고 충분하지 않다. 실제로는 worker identity, worktree/tmux/session, mailbox, task queue, heartbeat, cleanup, conflict policy가 필요하다. Gajae-Code의 `team --dry-run`은 state layout을 보여주지만 live tmux worker orchestration은 아직 다음 검증이다. Hermes의 `delegate_task`, background process, cron job, MCP/ACP bridge는 multi-worker control plane으로 볼 수 있다. LazyCodex/OmO는 Codex subagent/hook lifecycle과 연결되지만 실제 worker parity는 더 확인해야 한다.

## 분석 축 6 — recovery/resume

긴 coding workflow는 실패한다. 따라서 복구 지점이 없으면 demo는 가능해도 운영은 어렵다. recovery는 단순히 이전 transcript를 불러오는 것이 아니라, 현재 phase, pending artifact, blocked goal, worker state, approval state를 재구성하는 능력이다. Gajae-Code는 `.gjc` state가 이 가능성을 열어 주지만 corruption/recovery replay가 아직 필요하다. Hermes는 session resume, memory, background process, cron output, skill persistence를 통해 session 밖 runtime을 유지한다. LazyCodex/OmO는 `.omo` ledger가 근거가 되지만 stale state와 hook non-fire를 검증해야 한다.

## 분석 축 7 — evidence/replay boundary

마지막 축은 claim의 증거 경계다. source-confirmed claim은 “코드에 있다”는 뜻이고, runtime-confirmed claim은 “명령이 지금 성공했다”는 뜻이며, artifact-backed claim은 “실행 후 확인 가능한 durable artifact가 남았다”는 뜻이다. manifest-confirmed claim은 “선언되어 있다”는 뜻이지만 runtime callability를 보장하지 않는다. 이 구분이 없으면 LazyCodex/OmO의 plugin manifest와 실제 `$...` workflow 실행을 혼동하거나, Gajae-Code의 team dry-run과 live team을 혼동하거나, Hermes docs 최신 기능과 local installed runtime을 혼동하게 된다.

## 이 프레임의 결론

이 프레임을 적용하면 이 책의 구조가 자연스럽게 정리된다. Chapter 03은 phase/state/artifact가 가장 명확한 Gajae-Code를 본다. Chapter 04는 repo-local workflow를 넘어 persistent runtime으로 확장된 Hermes를 본다. Chapter 05는 Codex라는 강한 substrate 위에 workflow overlay를 얹는 LazyCodex/OmO를 본다. Chapter 06은 이 셋을 같은 축으로 비교해 coding agent가 어느 방향으로 발전하는지 정리한다.
