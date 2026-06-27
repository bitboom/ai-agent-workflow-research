# AI Coding Agent 구조 해부 — 목차

이 저장소는 제품 순위표가 아니라 coding agent의 내부 구조를 읽는 리서치 북입니다.

## 읽는 순서

1. [연구 질문과 판정 기준](01-research-question.md)
2. [Agent 분류](02-agent-taxonomy.md)
3. [공통 아키텍처](03-common-architecture.md)
4. [구현체별 읽기 지도](04-implementation-atlas.md)
5. [Gajae · Hermes · OmO control plane](05-control-plane-triad.md)
6. [평가 프레임워크](06-evaluation-framework.md)
7. [남은 질문과 다음 실험](07-caveats-and-next.md)
8. [Evidence index](../appendix/evidence-index.md)

## 원칙

- UltraResearch는 초안 생성기로만 사용한다.
- canonical claim은 source path, official docs, runtime trace, durable artifact, controller cross-check에만 둔다.
- `source-confirmed`, `runtime-confirmed`, `artifact-backed`, `manifest-confirmed`, `unverified`를 섞지 않는다.
