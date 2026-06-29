# Coding Agent는 Workflow Orchestrator로 진화하고 있는가

[← 목차](README.md)

이 프로젝트의 중심 질문은 단순한 제품 비교가 아니다. “Codex가 좋은가, Aider가 좋은가, OpenHands가 좋은가”라는 질문은 여전히 유용하지만, 지금 이 책에서 보려는 현상은 그보다 한 층 위에 있다. 최신 coding agent 생태계에서 중요한 변화는 더 똑똑한 단일 agent loop만이 아니다. 실제 작업을 안전하게 끝내기 위해서는 계획, 승인, 실행, 검증, 산출물 기록, 실패 복구, 병렬 worker 조율이 필요하고, 이 책임은 점점 **Workflow Control Plane / Workflow Orchestrator**라는 별도 층으로 모이고 있다.

따라서 이 책의 질문은 다음과 같다.

> Coding Agent는 이제 단일 AI Agent가 아니라, workflow를 설계·통제·기록·복구하는 Workflow Orchestrator로 진화하고 있는가? Gajae-Code, Hermes Agent, LazyCodex/OmO는 그 진화를 각각 어떤 방식으로 구현하고 있는가?

## 읽기 순서와 판단 기준

이 책은 조사 일지가 아니라 판단 프레임이다. 독자가 먼저 알아야 할 것은 “어떤 도구를 조사했는가”보다 “무엇을 Workflow Orchestrator라고 부를 수 있는가”다. 그래서 본문은 목적, 분류, 세 시스템의 deep dive, 비교, 남은 검증 순서로 읽히게 구성했다. UltraResearch, controller cross-check, artifact replay 같은 제작 과정은 Appendix에서 provenance로 추적할 수 있지만, 본문의 출발점은 항상 thesis와 evidence label이다.

1장은 중심 질문을 고정한다. 2장은 AI Agent, Harness, Workflow Orchestrator를 구분한다. 3장부터 5장은 Gajae-Code, Hermes Agent, LazyCodex/OmO를 각각 다른 종류의 control-plane 시도로 읽는다. 6장은 세 시스템을 같은 축으로 비교하고, 7장은 아직 증명되지 않은 claim을 다음 실험으로 남긴다. 이 순서를 따르면 독자는 “멋진 기능 목록”이 아니라 “어떤 책임이 어디까지 증명됐는가”를 기준으로 읽게 된다.

## 이 책에서 AI Agent는 무엇인가

**AI Agent**는 하나의 목표를 받아 context를 구성하고, reasoning/tool call/edit/test loop를 돌려 결과물을 만드는 실행 주체다. 중심 단위는 `turn`, `message`, `tool call`, `patch`, `test run`이다. Codex CLI, Aider, Claude Code류의 단일 coding loop가 여기에 가까운 기준선이다. 이 layer에서 중요한 평가는 localization, patch correctness, tool-use discipline, verification honesty다.

그러나 agent loop만으로는 긴 작업을 안정적으로 운영하기 어렵다. agent는 어느 파일을 읽고 어떤 도구를 호출할 수 있지만, 여러 phase를 강제하거나 승인 gate를 유지하거나 session 밖의 durable artifact ledger를 일관되게 관리하는 책임은 별도 구조가 필요하다. agent가 실패했을 때 어디서 resume할지, 어떤 산출물이 canonical인지, 여러 worker가 같은 repo에서 충돌하지 않게 하려면 무엇을 잠가야 하는지도 agent loop 바깥 문제다.

## Harness와 Orchestrator는 어떻게 다른가

**Harness**는 agent를 특정 task/environment/benchmark에 넣고 실행·관찰·평가하는 외부 실행 프레임이다. 중심 단위는 `task`, `environment`, `trajectory`, `score`, `oracle`이다. SWE-agent/OpenHands benchmark runner, Agentless-style repair/evaluation pipeline은 harness 관점에서 읽을 수 있다. harness는 재현 가능한 평가와 trajectory capture에 강하지만, 조직의 실제 workflow를 설계하고 운영하는 control plane과 동일하지는 않다.

**Workflow Orchestrator / Workflow Control Plane**은 agent나 harness를 worker 또는 substrate로 삼되, 실제 핵심 가치를 workflow 운영 책임에 둔다. 중심 단위는 `workflow`, `phase`, `state root`, `artifact`, `approval gate`, `worker`, `resume/recovery`다. 즉 “한 번 코드를 고쳤는가”보다 “작업이 어떤 절차와 증거를 따라 진행됐는가”, “실패했을 때 어디서 재개할 수 있는가”, “여러 agent가 어떤 state root 아래 조율되는가”를 본다.

## 왜 Gajae-Code, Hermes, LazyCodex/OmO인가

이 세 시스템은 같은 답을 내지 않는다. 그 차이가 분석 대상이다. Gajae-Code는 repo-local workflow orchestrator에 가장 가깝다. `deep-interview → ralplan → ultragoal → team`이라는 phase 흐름과 `.gjc/_session-*` state root가 중심이다. Hermes는 하나의 repo workflow보다 넓다. memory, skills, gateway, cron, delegation, MCP/ACP, messaging identity를 통해 session 밖에서도 agent runtime을 유지하는 persistent meta-orchestrator다. LazyCodex/OmO는 Codex 자체를 대체하기보다 Codex 위에 hooks, `$...` skills, MCP declarations, `.omo` artifacts를 얹는 embedded workflow harness/control overlay다.

이 차이는 coding agent의 발전 방향을 보여준다. 하나의 agent가 더 많은 tool을 부르는 방향만 있는 것이 아니라, agent를 더 큰 workflow 안에 배치하고 그 workflow의 상태와 증거를 관리하는 방향이 있다. 이 책은 바로 그 방향을 중심으로 재구성한다.

## 본문 claim의 근거 라벨

이 책은 confidence를 하나의 숫자로 뭉개지 않는다. `source-confirmed`는 repo source, package source, official docs에서 확인한 주장이다. `runtime-confirmed`는 현재 환경에서 command가 성공한 주장이다. `artifact-backed`는 실행 후 durable artifact가 남은 주장이다. `manifest-confirmed`는 plugin manifest나 docs 선언으로 확인했지만 실제 runtime callability는 별도 검증이 필요한 주장이다. `unverified`는 아직 source/runtime/artifact가 부족한 주장이다.

이 라벨은 세 deep dive의 안전장치다. Gajae-Code의 controlled replay는 artifact-backed지만 live team은 아직 아니다. Hermes의 local gateway running은 runtime-confirmed지만 docs 최신 기능과 installed version parity는 별도 검증이 필요하다. LazyCodex/OmO의 plugin hooks는 manifest-confirmed지만 모든 `$...` workflow가 같은 방식으로 호출 가능한지는 unverified에 남긴다.

## 독자가 얻어야 하는 결론

이 책을 끝까지 읽으면 독자는 세 가지를 판단할 수 있어야 한다. 첫째, 어떤 시스템이 AI Agent이고 어떤 시스템이 Harness이며 어떤 시스템이 Workflow Orchestrator인지 구분할 수 있어야 한다. 둘째, Gajae-Code/Hermes/LazyCodex가 각각 어떤 방식으로 control-plane 책임을 구현하거나 시도하는지 이해해야 한다. 셋째, 현재 coding agent의 발전 방향이 “single agent loop → workflow phase → durable state → artifact ledger → approval/recovery → team orchestration → persistent runtime”으로 이동하고 있음을 evidence label과 함께 판단할 수 있어야 한다.
