# Chapter 03 — 공통 아키텍처

[이전: Agent 분류](02-agent-taxonomy.md) · [목차](README.md) · [다음: 구현체별 읽기 지도](04-implementation-atlas.md)

## 여덟 개 층

1. **Model client / router** — provider, model, streaming, retry, token budget.
2. **Prompt / context assembly** — instructions, repo file, search result, memory, failing test log.
3. **Repo index / code graph** — RepoMap, LSP, lexical/vector search, AST/symbol graph.
4. **Planning / tool loop** — plan, act, observe, revise, stop condition.
5. **Edit / execution** — patch, search/replace, whole-file rewrite, shell, MCP/browser tools.
6. **Sandbox / approval** — filesystem, network, shell, policy, human approval.
7. **Verification / evidence** — tests, lint, build, benchmark, reviewer, evidence ledger.
8. **Memory / state** — transcript, checkpoint, workflow artifact, long-term project memory.

## 읽는 요령

어떤 agent가 실패했을 때 모델만 탓하기 전에 다음을 본다.

- context가 stale하지 않았는가?
- patch anchor가 정확했는가?
- tool call이 approval boundary를 지켰는가?
- 실패 로그가 다음 turn에 들어갔는가?
- 최종 보고가 실제 실행 증거와 맞는가?

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Source map](../research/coding-agent-source-map.md)
