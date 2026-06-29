# Hermes Agent Deep Dive — Persistent Runtime / Meta-Orchestrator

[← 목차](README.md)

Hermes Agent는 이 책에서 **Persistent Agent Runtime / Meta-Orchestrator**로 분류한다. Gajae-Code가 특정 repository 안의 workflow phase와 `.gjc` artifact를 중심으로 움직인다면, Hermes는 더 넓은 runtime boundary를 갖는다. memory, skills, tools, gateway, cron, delegation, background process, MCP/ACP, messaging platform identity가 결합되어 하나의 turn이나 하나의 repo patch를 넘어서는 agent 운영층을 만든다.

## Working definition

| 항목 | 판정 |
| --- | --- |
| 1차 분류 | Persistent Agent Runtime / Meta-Orchestrator |
| 2차 분류 | Multi-platform coordinator/control plane |
| 핵심 state root | `~/.hermes/`, sessions, memory, skills, logs, scheduled outputs |
| 핵심 surface | tools, skills, gateway, cron, delegation, background process, MCP/ACP |
| 현재 강한 근거 | docs/source architecture, local runtime/gateway status observation |
| 주요 caveat | local installed version과 source/docs 최신 기능 사이 drift, feature별 isolated runtime proof 부족 |

Hermes를 단순 coding agent로 보면 범위를 잘못 잡게 된다. Hermes는 Codex/Aider 같은 단일 coding loop만 제공하는 것이 아니라, 여러 toolset과 platform을 가진 agent runtime을 유지한다. 사용자는 Discord나 Telegram에서 같은 agent identity와 memory를 통해 작업을 이어가고, agent는 terminal/browser/file/search/cron/delegation/MCP 같은 surface를 조합한다. 이 때문에 Hermes는 repo-local orchestrator라기보다 meta-orchestrator라는 표현이 더 정확하다.

## Persistent memory와 skills

Hermes의 control-plane 성격은 memory와 skills에서 먼저 드러난다. memory는 사용자 선호, 환경 사실, 프로젝트 convention을 session 밖에 남긴다. skills는 반복 가능한 절차를 문서화하고, 다음 세션에서 필요한 workflow를 다시 로드하게 한다. 단일 agent loop는 지금 turn의 context에 의존하지만, Hermes는 과거 작업에서 얻은 절차와 교정을 재사용하는 runtime을 제공한다.

이 기능은 workflow orchestration과 직접 연결된다. 긴 작업에서 중요한 것은 “이번 답변을 잘 쓰는가”만이 아니다. 사용자가 선호하는 보고 형식, repo별 테스트 명령, Gajae-Code나 LazyCodex 같은 외부 runner의 pitfall을 기억해야 한다. Hermes의 skill system은 이런 절차적 지식을 agent runtime의 일부로 만든다. 그래서 Hermes deep dive에서는 memory/skills를 단순 편의 기능이 아니라 persistent control-plane state로 읽는다.

## Gateway와 platform identity

Hermes gateway는 Discord, Telegram 같은 messaging platform에서 agent를 지속적으로 운용한다. 이 layer는 일반 CLI agent와 다르다. gateway는 chat/thread/topic context, session id, platform delivery, media/document handling, command approvals, slash commands, restart/resume behavior를 관리한다. 사용자는 CLI를 직접 열지 않아도 agent runtime과 상호작용하고, agent는 같은 user profile과 memory를 통해 일을 이어간다.

이 platform identity는 meta-orchestrator의 조건이다. orchestrator는 worker를 실행하는 것뿐 아니라 사용자가 어디서 승인하고 어디로 evidence를 받는지도 관리해야 한다. Hermes의 gateway는 workflow output을 origin, local, Telegram 같은 delivery target으로 보낼 수 있고, cron job이나 background process 결과도 platform으로 전달할 수 있다. 이런 구조는 단일 coding loop가 아니라 운영 runtime에 가깝다.

## Cron, background process, delegation

Workflow Control Plane은 시간을 다룬다. Hermes의 cron은 일정에 따라 fresh session을 만들고, self-contained prompt를 실행하고, 결과를 지정된 target으로 전달한다. background process는 장시간 build/test/server를 agent turn과 분리해 추적한다. delegation은 subagent를 생성해 독립 context에서 research, code review, debugging 같은 workstream을 수행하게 한다.

이 셋은 Hermes를 meta-orchestrator로 만드는 중요한 surface다. Gajae-Code가 repo 안 workflow phase를 orchestrate한다면, Hermes는 여러 workflow와 agent runner를 시간, platform, toolset, context boundary 기준으로 조율한다. 예를 들어 Hermes는 Gajae-Code MCP coordinator를 호출하거나, Codex/Claude/OpenCode 같은 external agent를 spawn하거나, web/browser/file tools로 evidence를 검증한 뒤 결과를 Discord thread에 보고할 수 있다. 이때 Hermes 자체가 하나의 upper control plane이 된다.

## MCP/ACP와 외부 agent boundary

Hermes의 MCP/ACP integration은 외부 tool과 agent runtime을 연결하는 boundary다. MCP server를 통해 특정 system capability를 tool로 가져오고, ACP를 통해 IDE나 coding agent protocol과 연결될 수 있다. 이 책의 관점에서 중요한 것은 Hermes가 모든 workflow를 직접 구현하지 않아도 된다는 점이다. Meta-orchestrator는 Gajae-Code 같은 repo-local orchestrator, browser automation, terminal process, scheduled job, subagent를 연결하고 그 결과를 검증하면 된다.

따라서 Hermes의 강점은 “하나의 coding workflow를 가장 엄격히 phase화한다”가 아니다. 강점은 여러 workflow substrate를 session 밖에서 지속적으로 연결하는 것이다. 이 점 때문에 Hermes는 Gajae-Code와 같은 범주의 orchestrator가 아니라, persistent runtime / meta-orchestrator로 분류된다.

## Evidence label별 현재 판정

`source-confirmed`: Hermes docs와 source architecture는 persistent memory, skills, gateway, cron, delegation, MCP integration, toolsets 같은 surface를 설명한다. source tree 역시 `run_agent.py`, `gateway/`, `cron/`, `tools/`, `agent/`, `hermes_state.py` 등 runtime 구성 요소를 갖는다.

`runtime-confirmed`: local observation에서는 Hermes gateway가 실행 중이고 Discord/Telegram platform이 configured로 확인됐다. local `hermes --version` observation은 installed runtime 상태를 말한다. 다만 provider/API key detail은 public report에 남기지 않는다.

`artifact-backed`: Hermes는 sessions, logs, scheduled job output, skill files, memory entries 같은 persistent artifacts를 남긴다. 하지만 이 책의 현재 evidence에서는 각 feature별 isolated replay가 모두 완료된 것은 아니다. 예를 들어 cron/delegation/MCP bridge 각각에 대해 동일한 수준의 public sanitized replay가 더 필요하다.

`unverified`: local installed version과 docs/source 최신 기능의 완전한 parity, 모든 platform adapter의 behavior, long-running cron failure recovery, external agent self-report verification 자동화는 아직 별도 검증 대상이다.

## Hermes의 caveat — version drift와 privacy

Hermes 분석에서 가장 조심해야 할 점은 version drift다. local runtime observation은 현재 설치된 Hermes가 무엇을 하고 있는지를 말한다. source clone이나 docs가 더 최신 기능을 설명하더라도, 그 기능이 local gateway에 적용되어 있다는 뜻은 아니다. 따라서 본문은 “Hermes는 persistent runtime으로 설계되어 있다”와 “현재 local runtime에서 특정 기능이 이렇게 동작했다”를 구분해야 한다.

또 다른 caveat는 privacy다. Hermes는 provider, platform token, user profile, memory, logs, sessions를 다룬다. public evidence에는 provider/API key detail, raw platform token, 개인 chat id 전체, 민감한 local path를 남기지 않는다. 이 책은 sanitized summary와 source/runtime label만 남긴다.

## 이 장의 결론

Hermes는 단일 AI Agent도, 단순 benchmark Harness도 아니다. Hermes는 agent가 여러 세션, 플랫폼, 도구, 스케줄, subagent, external runner를 넘나들며 일할 수 있게 해 주는 persistent runtime이다. 그래서 이 책에서는 Hermes를 **Persistent Agent Runtime / Meta-Orchestrator**로 분류한다. Gajae-Code가 repo-local workflow를 엄격하게 phase화하는 방향을 보여준다면, Hermes는 coding agent가 session 밖 운영 시스템으로 확장되는 방향을 보여준다.
