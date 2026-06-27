# Chapter 03 — 공통 아키텍처

[이전: Agent 분류](02-agent-taxonomy.html) · [목차](index.html) · [다음: 구현체별 읽기 지도](04-implementation-atlas.html)

## 여덟 개 층

제품의 표면은 다르지만 coding agent를 source-level로 읽으면 반복되는 층이 있습니다. 이 장의 목적은 모든 제품을 하나의 그림으로 강제로 맞추는 것이 아니라, 각 구현체를 읽을 때 빠뜨리기 쉬운 책임 영역을 체크리스트로 만드는 것입니다.

| 층 | 질문 | 실패 패턴 |
| --- | --- | --- |
| Model client / router | provider, streaming, retry, token budget, model choice는 어디서 결정되는가? | 잘못된 model routing, token truncation, retry 폭주 |
| Prompt / context assembly | instructions, repo file, search result, memory, failing test log가 어떻게 합쳐지는가? | stale context, irrelevant file stuffing, missing test log |
| Repo index / code graph | lexical search, AST, LSP, vector index, repo map 중 무엇을 쓰는가? | symbol mismatch, old index, generated file noise |
| Planning / tool loop | plan, act, observe, revise, stop condition은 어디에 있는가? | endless loop, premature stop, plan/action mismatch |
| Edit / execution | patch, search/replace, whole-file rewrite, shell, MCP/browser tool은 어떻게 실행되는가? | broad rewrite, unsafe shell, broken patch anchor |
| Sandbox / approval | filesystem, network, shell, human approval boundary는 무엇인가? | approval bypass, blocked command, environment drift |
| Verification / evidence | tests, lint, build, benchmark, reviewer, evidence ledger가 남는가? | unrun tests, hidden failures, unverifiable success claim |
| Memory / state | transcript, checkpoint, workflow artifact, long-term project memory가 어디에 남는가? | lost context, unrecoverable session, stale memory |

## 읽는 요령

어떤 agent가 실패했을 때 모델만 탓하기 전에 위 층을 따라 내려가야 합니다. context가 stale했는지, patch anchor가 정확했는지, shell command가 실제로 실행됐는지, verification result가 문서화됐는지, session state가 복구 가능한지 확인해야 합니다.

예를 들어 “테스트를 통과했다”는 claim은 verification 층의 claim입니다. 그러나 test command가 실제로 실행됐는지 확인되지 않았다면 runtime-confirmed가 아닙니다. 실행은 됐지만 로그나 artifact가 남지 않았다면 reproducibility가 약합니다. 실행 후 `.gjc` ledger나 `.omo` synthesis가 남는다면 artifact-backed claim으로 승격할 수 있습니다.

## UI보다 내부 경로를 먼저 본다

동일한 UX 문구라도 구현 경로는 다를 수 있습니다. “context-aware”라는 문구는 IDE active editor state, vector index, RepoMap, grep search, LSP graph, long-term memory 중 무엇을 뜻하는지 분해해야 합니다. “safe execution”도 human approval, sandboxed filesystem, network policy, dry-run mode, command allowlist 중 어느 boundary인지 확인해야 합니다.

## 이 장의 결론

좋은 agent 분석은 하나의 demo 영상보다 이 여덟 층이 얼마나 공개·검증·재현 가능한지 확인하는 일입니다. 다음 장에서는 이 체크리스트를 구현체별로 어디에 적용할지 정리합니다.

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Coding agent source map](../research/coding-agent-source-map.md)
