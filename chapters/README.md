# 목차 — Workflow Control Plane으로 읽는 Coding Agent

[← 첫 화면으로 돌아가기](../index.html)

이 책의 목적은 AI coding agent를 제품 기능표로 나열하는 것이 아니다. 중심 질문은 더 좁고 분명하다. **Coding Agent는 이제 단일 AI Agent loop를 넘어, workflow를 설계하고 통제하고 기록하고 복구하는 Workflow Orchestrator / Workflow Control Plane으로 진화하고 있는가?** 이 질문에 답하기 위해 Gajae-Code, Hermes Agent, LazyCodex/OmO를 본문 중심에 두고, Codex/Aider/SWE-agent/OpenHands/IDE 계열은 배경 비교군으로 둔다.

## 읽는 순서

| 순서 | 장 | 역할 |
| --- | --- | --- |
| 1 | [Coding Agent는 Workflow Orchestrator로 진화하고 있는가](01-research-question.md) | 프로젝트의 목적, 중심 질문, 독자가 얻어야 할 판정 기준을 먼저 고정한다. |
| 2 | [AI Agent / Harness / Workflow Orchestrator 구분](02-agent-taxonomy.md) | 단일 agent loop, benchmark harness, workflow control plane의 차이를 정의한다. |
| 3 | [Gajae-Code Deep Dive](03-common-architecture.md) | `.gjc/_session-*` state root와 `deep-interview → ralplan → ultragoal → team` phase를 분석한다. |
| 4 | [Hermes Agent Deep Dive](04-implementation-atlas.md) | persistent memory, skills, gateway, cron, delegation, MCP/ACP를 meta-orchestrator 관점에서 읽는다. |
| 5 | [LazyCodex / OmO Deep Dive](05-control-plane-triad.md) | Codex runtime 위 hooks, `$...` workflow, MCP declarations, `.omo` artifacts를 control overlay로 분석한다. |
| 6 | [세 Orchestrator 비교와 Coding Agent의 발전 방향](06-evaluation-framework.md) | 세 시스템을 같은 축으로 비교하고 “single agent loop → workflow/state/evidence/recovery orchestration” 진화를 정리한다. |
| 7 | [다음 검증](07-caveats-and-next.md) | 아직 증명되지 않은 claim, runtime replay, live team, recovery, bridge 검증 계획을 남긴다. |
| Appendix | [Evidence Index](../appendix/evidence-index.md) | source-level evidence, runtime/command evidence, artifact/manifest evidence, unverified claim을 분리해 찾을 수 있게 한다. |

## 독자에게 주는 약속

첫째, 본문은 제작 과정이 아니라 판단 기준으로 시작한다. 독자가 처음 확인해야 하는 것은 UltraResearch를 어떻게 돌렸는지가 아니라, 이 프로젝트가 무엇을 판단하려는지와 왜 Gajae-Code/Hermes/LazyCodex가 중심인지다. 제작 과정은 Appendix의 provenance에서 추적할 수 있고, 본문은 thesis → frame → three deep dives → comparison → verification roadmap 순서로 읽힌다.

둘째, claim은 evidence label을 잃지 않는다. 이 책은 `source-confirmed`, `runtime-confirmed`, `artifact-backed`, `manifest-confirmed`, `unverified`를 구분한다. Gajae-Code의 `.gjc/_session-*` replay는 artifact-backed로 승격할 수 있지만 live non-dry-run `team`은 아직 unverified다. Hermes의 persistent runtime 개념은 source/docs와 local status로 강하게 지지되지만 local installed version과 source clone 사이 drift는 caveat로 남는다. LazyCodex/OmO는 manifest와 docs가 hooks/workflow/MCP surface를 보여주지만 모든 `$...` workflow가 non-interactive runtime에서 callable한지는 별도 검증이 필요하다.

셋째, 일반 AI Agent 비교는 배경으로만 쓴다. Codex CLI, Aider, SWE-agent, OpenHands, Cline, Roo, Continue 같은 프로젝트는 단일 agent loop, harness, IDE embedded runtime의 기준선을 제공한다. 그러나 이 책의 주인공은 그 기준선 위에 workflow phase, durable state, artifact ledger, approval gate, recovery, team coordination을 얹는 layer다. 따라서 세 deep dive는 “어느 agent가 더 좋다”가 아니라 “어떤 control-plane 책임을 어디까지 구현했는가”를 묻는다.

## 빠른 판정표

| 시스템 | 이 책의 1차 분류 | 핵심 state/artifact | 현재 강한 근거 | 가장 큰 미검증 영역 |
| --- | --- | --- | --- | --- |
| Gajae-Code | Repo-local Workflow Orchestrator | `.gjc/_session-*` | source anchors, `gjc/0.7.3` smoke, controlled workflow artifact replay | live team, recovery/resume, Hermes bridge |
| Hermes Agent | Persistent Agent Runtime / Meta-Orchestrator | `~/.hermes/`, sessions, memory, trajectories | docs/source architecture, local gateway/runtime observation | version parity, isolated runtime traces per feature |
| LazyCodex / OmO | Codex-embedded Workflow Harness / Control Overlay | `.omo/...`, Codex plugin cache | installed plugin manifest, hooks/MCP declarations, docs for workflow commands | actual callability matrix for all `$...` workflows |

## 용어 유지 규칙

이 문서는 `Workflow Control Plane`과 `Workflow Orchestrator`를 거의 같은 층으로 다루되 약간 다르게 쓴다. Control Plane은 정책, state, approval, routing, recovery 같은 운영 책임을 가리키고, Orchestrator는 그 control plane이 실제 workflow phase와 worker/process coordination을 실행하는 모습을 가리킨다. Gajae-Code는 orchestrator라는 말이 가장 잘 맞고, Hermes는 persistent runtime/meta-orchestrator라는 말이 더 정확하며, LazyCodex/OmO는 Codex-embedded harness/control overlay에서 orchestrator candidate로 이동 중인 것으로 본다.

## Appendix를 읽는 법

근거 부록은 본문보다 길 수 있다. 그러나 부록은 narrative가 아니라 ledger다. 먼저 세 deep dive의 canonical evidence를 보고, 그 다음 비교 evidence와 source atlas를 확인한다. 마지막으로 research draft와 controller cross-check provenance를 보면 “이 문장이 왜 본문에 들어왔는가”를 역추적할 수 있다. public GitHub Pages에는 raw local state, credentials, provider detail, 개인 경로가 아니라 sanitized summary만 남긴다.
