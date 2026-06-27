# AI Coding Agent 구조 해부 — 목차

[첫 화면](../index.html) · [Evidence index](../appendix/evidence-index.md)

이 책은 coding agent를 제품 기능표로 비교하지 않고, agent loop와 control plane의 구현 책임을 추적합니다. 각 장은 “무엇을 주장하는가”보다 “그 주장을 어떤 근거 등급으로 말할 수 있는가”를 먼저 드러냅니다.

## 읽는 순서

1. [Chapter 01 — 연구 질문과 판정 기준](01-research-question.md)
2. [Chapter 02 — Agent 분류](02-agent-taxonomy.md)
3. [Chapter 03 — 공통 아키텍처](03-common-architecture.md)
4. [Chapter 04 — 구현체별 읽기 지도](04-implementation-atlas.md)
5. [Chapter 05 — Gajae · Hermes · OmO control-plane triad](05-control-plane-triad.md)
6. [Chapter 06 — 평가 프레임워크](06-evaluation-framework.md)
7. [Chapter 07 — Caveats and next experiments](07-caveats-and-next.md)
8. [Appendix — Evidence index](../appendix/evidence-index.md)

이 순서는 의도적으로 “agent 이름”이 아니라 “분석 렌즈”에서 시작합니다. 먼저 어떤 질문을 버릴지 정하고, agent loop가 어디에 있는지 나누고, 공통 아키텍처를 만든 뒤, 각 구현체를 같은 축으로 읽습니다.

## 이 책을 읽는 규칙

- 제품 순위표가 아니라 **source path → runtime proof → artifact/state → failure mode**를 읽습니다.
- UltraResearch와 agent 산출물은 초안 생성기입니다. 공개 claim은 controller cross-check와 evidence appendix를 거쳐야 합니다.
- closed-source internal ranking, hidden context routing, proprietary indexing은 공식 문서 밖이면 low confidence로 둡니다.
- Gajae-Code, Hermes, LazyCodex/OmO는 일반 “코딩 도구”가 아니라 agent workflow를 통제하는 control plane으로 따로 읽습니다.
- benchmark pilot은 trace schema와 rubric이 먼저 고정된 뒤에만 의미가 있습니다.

## 판정 라벨 빠른 참조

| 라벨 | 읽는 법 | 독자가 확인할 것 |
| --- | --- | --- |
| source-confirmed | repo clone, package source, docs에서 구현 경로를 확인했다 | 파일 경로와 claim이 같은 축을 가리키는가 |
| runtime-confirmed | 현재 환경에서 command가 실행됐다 | version, exit code, stdout/stderr, run condition이 있는가 |
| artifact-backed | 실행 뒤 durable artifact가 남았다 | `.gjc`, `.omo`, trajectory, ledger 같은 state가 sanitized summary로 남았는가 |
| manifest-confirmed | 선언은 있지만 callability는 별도다 | plugin/hook/MCP manifest와 실제 workflow 실행을 혼동하지 않는가 |
| unverified | 아직 가설 또는 draft다 | public claim으로 승격하지 않았는가 |

## 독자에게 주는 약속

각 장은 본문만으로 방향을 잡을 수 있게 쓰되, 세부 근거는 [Evidence index](../appendix/evidence-index.md)에 연결합니다. 책 본문은 독서 흐름을 맡고, raw Markdown evidence는 검증 가능한 artifact index 역할을 맡습니다. 그래서 이 사이트의 품질 기준은 “예쁘게 렌더링되는가”에서 끝나지 않습니다. 독자가 claim 하나를 봤을 때 그것이 source-confirmed인지, runtime-confirmed인지, artifact-backed인지 바로 추적할 수 있어야 합니다.

## 현재 한계

이 책은 아직 완성된 제품 백서가 아닙니다. 다만 raw Markdown 링크 모음에서 벗어나, chapter와 appendix가 public HTML book page로 읽히도록 구조화했습니다. 다음 품질 단계는 각 agent별 deep-dive를 line-level source excerpt와 runtime trace로 더 촘촘히 채우는 것입니다.
