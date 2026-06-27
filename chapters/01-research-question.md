# Chapter 01 — 연구 질문과 판정 기준

[목차](README.md) · [다음: Agent 분류](02-agent-taxonomy.md)

## 한 문장 질문

AI coding agent를 제품 기능표가 아니라 **agent loop, context assembly, tool boundary, verification gate, durable state** 관점에서 어떻게 읽을 것인가?

## 이 연구가 버리는 질문

- “어느 제품이 제일 좋은가?”
- “어느 모델이 제일 똑똑한가?”
- “벤치마크 점수 하나로 제품 품질을 말할 수 있는가?”

## 이 연구가 보는 질문

1. loop는 IDE, CLI, runner, coordinator 중 어디에 있는가?
2. context는 어떤 source에서 오고 어떻게 압축되는가?
3. edits와 shell/tool 실행은 어떤 boundary를 통과하는가?
4. verification은 test result뿐 아니라 trajectory까지 남기는가?
5. state는 session 밖에서도 복구 가능한가?

## 판정 라벨

- `source-confirmed`: 소스나 package source에서 직접 확인.
- `runtime-confirmed`: 현재 환경에서 command가 실행됨.
- `artifact-backed`: 실행 후 trace/state/ledger가 남음.
- `manifest-confirmed`: 선언은 있으나 callability는 별도 검증 필요.
- `unverified`: 아직 가설 또는 초안.

## 핵심 근거

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Controller cross-check notes](../assets/evidence/coding-agent-underhood-crosscheck.md)
- [Reconciled facts](../assets/evidence/reconciled-facts.md)
