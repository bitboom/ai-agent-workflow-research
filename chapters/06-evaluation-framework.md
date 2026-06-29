# 세 Orchestrator 비교와 Coding Agent의 발전 방향

[← 목차](README.md)

Gajae-Code, Hermes Agent, LazyCodex/OmO는 모두 “coding agent가 workflow control plane으로 진화한다”는 명제를 보여주지만, 같은 형태는 아니다. 이 장의 목적은 세 시스템을 같은 축으로 비교해 차이를 분명히 하는 것이다. 비교 기준은 기능표가 아니라 phase model, state root, artifact ledger, approval/gate, worker orchestration, recovery/resume, evidence boundary다.

## 한눈에 보는 분류

| 시스템 | 1차 분류 | 2차 분류 | 핵심 state/artifact | 가장 강한 신호 |
| --- | --- | --- | --- | --- |
| Gajae-Code | Repo-local Workflow Orchestrator | Standalone coding-agent control plane | `.gjc/_session-*` | workflow phase와 artifact-backed replay |
| Hermes Agent | Persistent Agent Runtime / Meta-Orchestrator | Multi-platform coordinator/control plane | `~/.hermes/`, sessions, memory, skills, logs | session 밖 runtime과 tool/workflow coordination |
| LazyCodex / OmO | Codex-embedded Workflow Harness / Control Overlay | Plugin-based orchestrator candidate | `.omo/...`, Codex plugin cache | hooks/workflow/MCP manifest와 Codex workflow discipline |

이 표에서 보듯 세 시스템은 모두 “agent보다 위”에 있지만 위치가 다르다. Gajae-Code는 repo 안에서 workflow를 세운다. Hermes는 platform과 session을 넘어 runtime을 유지한다. LazyCodex/OmO는 Codex 안쪽에 workflow discipline을 주입한다. 이 차이를 유지해야 실제 도입 판단도 가능하다.

## 비교 축 1 — Workflow phase

Gajae-Code는 phase가 가장 선명하다. `deep-interview → ralplan → ultragoal → team`은 요구사항 수렴, 계획, 목표 실행, 팀 작업을 분리한다. LazyCodex/OmO도 `$ulw-plan → $start-work → $ulw-loop` 같은 phase를 docs와 command surface로 제안한다. Hermes는 특정 coding phase를 강제하기보다 skills, cron, delegation, tools, gateway를 조합해 사용자가 다양한 workflow를 만들 수 있는 runtime이다. 따라서 phase strictness는 Gajae-Code가 강하고, runtime flexibility는 Hermes가 강하다.

## 비교 축 2 — Durable state

Gajae-Code의 `.gjc/_session-*`는 repo-local state root로 명확하다. LazyCodex/OmO의 `.omo` artifacts는 Codex project context에 붙는다. Hermes의 `~/.hermes/`는 user/runtime-wide state root다. 이 차이는 중요하다. repo-local state는 code review와 artifact replay에 유리하고, user/runtime-wide state는 여러 repo와 platform을 넘나드는 장기 작업에 유리하다. Codex-embedded state는 adoption friction이 낮지만 Codex lifecycle과 결합된다.

## 비교 축 3 — Artifact ledger와 evidence

Gajae-Code의 현재 가장 강한 evidence는 controlled workflow artifact replay다. deep-interview spec, ralplan plan, ultragoal ledger, team dry-run state가 artifact-backed로 정리됐다. Hermes는 session history, tool outputs, skills, memory, cron output, logs를 runtime artifact로 남기지만, 각 feature별 public replay는 더 보강해야 한다. LazyCodex/OmO는 `.omo` ledger와 plugin artifacts를 지향하지만, manifest-declared surface와 실제 callability를 분리해야 한다.

## 비교 축 4 — Approval, gate, recovery

Approval/gate는 workflow control plane의 핵심이다. Gajae-Code는 pending approval과 review blocker를 artifact로 표현하는 방향을 보여준다. Hermes는 tool approval, gateway command approval, scheduled delivery, MCP mutation opt-in 같은 운영 gate를 갖는다. LazyCodex/OmO는 Codex plugin hook approval과 workflow command discipline에 의존한다. recovery는 세 시스템 모두 다음 검증이 필요하지만, state root가 명확할수록 검증 가능한 recovery scenario를 만들기 쉽다.

## 비교 축 5 — Worker orchestration

Gajae-Code는 `team` surface를 통해 worker orchestration을 직접 겨냥한다. 다만 현재 evidence는 `team --dry-run` state layout까지이므로 live worker proof가 필요하다. Hermes는 `delegate_task`, background process, cron, MCP/ACP, external agent spawning을 통해 meta-level worker orchestration을 수행할 수 있다. LazyCodex/OmO는 Codex subagent/hook lifecycle과 결합될 가능성이 있지만, worker identity와 mailbox/recovery parity를 더 확인해야 한다.

## Coding Agent 발전 방향

이 비교에서 보이는 발전 방향은 다음과 같다.

| 이전 중심 | 다음 중심 | 의미 |
| --- | --- | --- |
| Prompt loop | Workflow phase | agent에게 바로 시키지 않고 interview/plan/execute/review를 나눈다. |
| Chat transcript | Durable state | 중요한 상태를 대화창이 아니라 `.gjc`, `.omo`, `~/.hermes` 같은 root에 남긴다. |
| Final answer | Artifact ledger | “끝났다”는 말보다 spec, plan, goal, test, review artifact를 남긴다. |
| Single agent | Worker/process orchestration | subagent, tmux worker, background process, cron job, external runner를 조율한다. |
| Tool use | Governed execution | 승인, sandbox, mutation opt-in, phase gate로 위험한 실행을 통제한다. |
| Benchmark score | Trace/replay/evidence | 점수만 보지 않고 어떤 경로로 결과에 도달했는지 재생 가능하게 만든다. |
| Local CLI | Persistent runtime | 사용자의 platform, memory, schedule, workflow가 session 밖으로 이어진다. |

이 변화는 “AI가 더 똑똑해진다”라는 말보다 구체적이다. 실제 software work는 긴 흐름이고, 긴 흐름은 state와 gate와 recovery를 요구한다. coding agent가 production workflow로 들어가려면 단일 patch loop보다 orchestrator 책임이 커질 수밖에 없다.

## 세 시스템이 서로 보완하는 지점

Gajae-Code는 workflow phase와 artifact root를 보여준다. Hermes는 여러 platform과 tool/runtime을 묶는 지속성을 보여준다. LazyCodex/OmO는 기존 Codex workflow 안에 control overlay를 삽입하는 adoption path를 보여준다. 하나가 다른 하나를 완전히 대체한다고 보기보다, 세 방향이 동시에 발전할 가능성이 높다. 예를 들어 Hermes가 meta-orchestrator로 Gajae-Code coordinator를 호출하고, Codex/LazyCodex workflow evidence를 가져와 비교하고, 결과를 Discord/Telegram에 전달하는 구성이 가능하다.

## 평가 기준

앞으로 새 coding agent나 workflow tool을 볼 때 이 책은 다음 질문을 던진다.

1. workflow phase가 명시되어 있는가, 아니면 prompt loop에만 의존하는가?
2. state root가 어디이며, 사람과 controller가 읽을 수 있는가?
3. artifact ledger가 있는가, 아니면 final answer만 있는가?
4. approval/gate가 phase 전환과 연결되는가?
5. worker/process orchestration이 실제 runtime proof를 갖는가?
6. recovery/resume scenario가 검증되었는가?
7. source, runtime, artifact, manifest, unverified claim이 분리되어 보고되는가?

이 질문에 답할 수 있으면 제품 홍보 문구보다 더 정확한 판단을 할 수 있다.

## 이 장의 결론

세 시스템은 coding agent의 같은 미래를 서로 다른 각도에서 보여준다. Gajae-Code는 repo-local workflow orchestrator, Hermes는 persistent meta-orchestrator, LazyCodex/OmO는 Codex-embedded workflow overlay다. 공통된 방향은 단일 agent loop를 넘어 workflow, state, artifact, approval, recovery, team/process coordination을 관리하는 것이다. 이것이 이 프로젝트가 분석하려는 “Workflow Control Plane”의 핵심이다.
