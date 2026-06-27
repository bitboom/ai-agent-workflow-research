# AI Coding Agent 구조 해부 — 목차

[첫 화면](../index.html) · [Chapter 01](01-research-question.html)

이 저장소는 coding agent 제품 순위표가 아닙니다. 이 책은 Codex, Aider, SWE-agent, OpenHands, Cline/Roo/Continue, Goose, Gajae-Code, Hermes Agent, LazyCodex/OmO를 같은 질문으로 읽기 위한 한국어 리서치 북입니다. 기준은 “어느 모델이 더 똑똑한가”가 아니라 agent loop, context assembly, tool boundary, sandbox/approval, verification, durable state, orchestration이 어디에 있고 어떻게 증명되는가입니다.

## 읽는 순서

1. [연구 질문과 판정 기준](01-research-question.html) — 제품 비교표를 버리고 architecture claim을 판정하는 라벨을 정합니다.
2. [Agent 분류](02-agent-taxonomy.html) — IDE, CLI, repo-local runner, workflow orchestrator, persistent runtime을 loop 위치로 나눕니다.
3. [공통 아키텍처](03-common-architecture.html) — agent를 구성하는 여덟 개 층을 정의합니다.
4. [구현체별 읽기 지도](04-implementation-atlas.html) — 각 프로젝트에서 먼저 확인해야 할 source/runtime anchor를 정리합니다.
5. [Gajae · Hermes · OmO control plane](05-control-plane-triad.html) — 세 orchestration system을 state root와 artifact 관점으로 따로 읽습니다.
6. [평가 프레임워크](06-evaluation-framework.html) — toy demo가 아니라 trace와 rubric으로 비교하는 방법을 고정합니다.
7. [남은 질문과 다음 실험](07-caveats-and-next.html) — 아직 증명하지 않은 claims와 다음 실험 순서를 분리합니다.
8. [Evidence index](../appendix/evidence-index.html) — 본문 claim이 어떤 public evidence 파일에 기대는지 확인합니다.

## 이 책을 읽는 규칙

- UltraResearch와 agent-generated note는 초안 생성기로만 취급합니다.
- canonical claim은 source path, official docs, runtime output, durable artifact, controller cross-check 중 하나 이상에 기대야 합니다.
- `source-confirmed`, `runtime-confirmed`, `artifact-backed`, `manifest-confirmed`, `unverified` 라벨을 섞지 않습니다.
- closed-source 제품의 internal context ranking, model routing, private indexing은 공식 문서 밖이면 low confidence로 둡니다.
- raw `.omo`, `.gjc`, provider config, local private log는 public Pages에 올리지 않습니다.

## 독자에게 주는 약속

이 문서는 “잘 팔리는 agent 목록”이 아니라 “agent가 실제로 어떻게 움직이는지 읽는 방법”을 제공합니다. 홈 화면은 짧은 지도이고, 각 장은 독자가 개념을 따라가도록 다시 서술한 본문입니다. 세부 source map과 runtime evidence는 부록에서 확인하도록 분리했습니다.
