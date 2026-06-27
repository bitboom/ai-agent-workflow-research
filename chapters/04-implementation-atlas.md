# Chapter 04 — 구현체별 읽기 지도

[이전: 공통 아키텍처](03-common-architecture.html) · [목차](index.html) · [다음: Control plane triad](05-control-plane-triad.html)

## 이 장의 역할

이 장은 모든 source path를 복사해 넣는 장이 아닙니다. 상세 파일 경로는 atlas와 evidence 문서에 두고, 여기서는 각 구현체를 읽을 때 어떤 순서로 source/runtime evidence를 확인해야 하는지 안내합니다. 독자는 이 장을 “지도”처럼 사용하고, claim의 원문 근거는 부록에서 확인하면 됩니다.

## Agent별 초점

| 구현체 | 먼저 볼 것 | 이유 |
| --- | --- | --- |
| OpenAI Codex CLI | session/turn/tool/sandbox source | local CLI agent loop와 approval boundary가 핵심 |
| Aider | RepoMap, edit format, git/test loop | context compression과 patch strategy가 공개적으로 읽기 좋음 |
| SWE-agent | trajectory, environment, ToolHandler | benchmark runner의 action/observation 구조가 명확함 |
| OpenHands | agent step, event store, runtime/server | platform runtime과 tool dispatch를 함께 봐야 함 |
| Cline/Roo/Continue | IDE state, indexing, approval, diff | hidden context와 editor integration risk가 핵심 |
| Goose | MCP/extension/tool execution | extension 중심 CLI agent architecture를 보여줌 |
| Agentless | localization/repair pipeline | autonomous loop 없이도 issue repair를 시도하는 반례 |

## 계열별 읽기 전략

CLI 계열은 shell/test 재현성과 sandbox가 강점이자 위험입니다. 따라서 prompt text보다 command execution boundary, patch granularity, git diff handling, verification reporting을 먼저 봅니다. Aider처럼 RepoMap과 edit format이 명시된 구현은 context compression과 patch protocol을 공부하기 좋습니다.

IDE 계열은 context UX가 좋지만 hidden index가 문제를 만들 수 있습니다. 사용자는 “현재 파일을 보고 있다”고 느끼지만 agent가 실제로 어떤 workspace snapshot과 diagnostics를 받았는지는 별도입니다. 따라서 source-level로는 extension state, file watcher, index refresh, approval UI, diff application path를 확인해야 합니다.

Benchmark runner 계열은 trajectory를 연구하기 좋습니다. SWE-agent와 OpenHands 계열은 issue statement, environment, observation, action, test result가 비교적 명확합니다. 다만 benchmark task는 실제 제품 사용과 다르며, public issue corpus도 prevalence proof가 아니라 failure taxonomy evidence로만 써야 합니다.

## confidence를 섞지 않는다

source path를 읽은 claim은 source-confirmed입니다. local command가 실행된 claim은 runtime-confirmed입니다. 실행 후 durable artifact가 남으면 artifact-backed입니다. 이 셋은 비슷해 보이지만 연구 문서에서는 분리해야 합니다. 예를 들어 Gajae-Code는 package source와 local `gjc/0.7.3` smoke, controlled workflow replay가 각각 다른 confidence를 가집니다.

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Coding agent source map](../research/coding-agent-source-map.md)
- [Failure-pattern corpus draft](../assets/evidence/source-level-architecture-atlas.md#public-failure-pattern-corpus-draft)
