# Chapter 04 — 구현체별 읽기 지도

[이전: 공통 아키텍처](03-common-architecture.md) · [목차](README.md) · [다음: Control plane triad](05-control-plane-triad.md)

## Agent별 초점

| 구현체 | 먼저 볼 것 | 이유 |
| --- | --- | --- |
| OpenAI Codex CLI | session/turn/tool/sandbox source | local CLI agent loop와 approval boundary가 핵심 |
| Aider | RepoMap, edit format, git/test loop | context compression과 patch strategy가 공개적으로 읽기 좋음 |
| SWE-agent | trajectory, environment, ToolHandler | benchmark runner의 action/observation 구조가 명확함 |
| OpenHands | agent step, event store, runtime/server | platform runtime과 tool dispatch를 함께 봐야 함 |
| Cline/Roo/Continue | IDE state, indexing, approval, diff | hidden context와 editor integration risk가 핵심 |
| Goose | MCP/extension/tool execution | extension 중심 CLI agent architecture를 보여줌 |

## 압축한 결론

- CLI 계열은 shell/test 재현성과 sandbox가 강점이자 위험이다.
- IDE 계열은 context UX가 좋지만 hidden index와 remote workspace 문제가 생긴다.
- benchmark runner 계열은 trajectory와 oracle을 연구하기 좋지만 제품 품질 순위로 오독하면 안 된다.

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Failure-pattern corpus draft](../assets/evidence/source-level-architecture-atlas.md#public-failure-pattern-corpus-draft)
