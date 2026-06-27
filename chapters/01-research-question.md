# Chapter 01 — 연구 질문과 판정 기준

[← 목차](README.md) · [다음: Agent 분류 →](02-agent-taxonomy.md)

## 한 문장 질문

AI coding agent를 제품 기능표가 아니라 **agent loop, context assembly, tool boundary, verification gate, durable state** 관점에서 어떻게 읽을 것인가?

이 질문은 일부러 제품 순위를 묻지 않습니다. 같은 모델을 쓰더라도 agent가 어떤 파일을 읽는지, 어떤 command를 실행할 수 있는지, 실패한 test를 어떻게 반영하는지, 세션이 끝난 뒤 state를 복구할 수 있는지에 따라 결과는 크게 달라집니다. 따라서 이 책의 단위는 “제품명”이 아니라 **구조적 책임 영역**입니다.

## 이 연구가 버리는 질문

- “어느 제품이 제일 좋은가?”
- “어느 모델이 제일 똑똑한가?”
- “벤치마크 점수 하나로 제품 품질을 말할 수 있는가?”
- “한 번의 toy task 성공으로 실제 업무 품질을 말할 수 있는가?”

이 질문들은 빠른 의사결정에는 유혹적이지만, 원인을 설명하지 못합니다. 어떤 agent가 patch를 잘못 만들었을 때 모델이 약해서인지, repo index가 stale해서인지, edit tool이 whole-file rewrite를 유도해서인지, verification gate가 실패를 숨겨서인지 분리할 수 없기 때문입니다.

## 이 연구가 보는 질문

1. loop는 IDE, CLI, runner, coordinator 중 어디에 있는가?
2. context는 어떤 source에서 오고 어떻게 압축되는가?
3. edits와 shell/tool 실행은 어떤 boundary를 통과하는가?
4. verification은 test result뿐 아니라 trajectory까지 남기는가?
5. state는 session 밖에서도 복구 가능한가?
6. public evidence는 source, runtime, artifact, issue corpus 중 무엇인가?

이 여섯 질문에 답하면 “agent가 똑똑하다”라는 막연한 표현을 더 구체적인 claim으로 바꿀 수 있습니다. 예를 들어 Gajae-Code는 `.gjc/_session-*` artifact를 남기는 workflow surface가 강점이지만 live team/recovery proof는 아직 별도입니다. Hermes는 persistent runtime이라는 장점이 있지만 local runtime과 source clone의 version drift를 분리해야 합니다. OmO는 manifest-declared hooks와 실제 runtime-callable workflow를 따로 확인해야 합니다.

## Claim ladder

| 단계 | 질문 | 공개 문서에서 허용되는 표현 |
| --- | --- | --- |
| Draft | agent가 그렇게 말했는가? | “hypothesis”, “draft”, “needs cross-check” |
| Source | repo/package/docs에서 보이는가? | “source-confirmed at path …” |
| Runtime | 이 환경에서 실제로 실행됐는가? | “runtime-confirmed under conditions …” |
| Artifact | 실행 뒤 state/trace가 남았는가? | “artifact-backed with sanitized map …” |
| Generalization | 다른 repo/task에서도 반복됐는가? | “pilot evidence”, not product-wide ranking |

이 ladder가 없으면 agent research는 빠르게 marketing copy가 됩니다. 특히 closed-source 제품의 context ranking, hidden indexing, model routing은 공식 문서가 없으면 추정일 뿐입니다.

## 판정 라벨

| 라벨 | 뜻 | 예시 |
| --- | --- | --- |
| source-confirmed | repo clone 또는 package source에서 직접 확인한 claim | command file, runtime module, test harness path |
| runtime-confirmed | 현재 환경에서 command가 실행되고 결과를 반환한 claim | version/help/smoke command exit 0 |
| artifact-backed | 실행 후 trace/state/ledger가 남은 claim | `.gjc`, `.omo`, jsonl ledger, generated plan |
| manifest-confirmed | 선언은 있으나 callability는 별도 검증이 필요한 claim | plugin hook, MCP server manifest |
| unverified | 아직 가설 또는 agent draft에만 있는 claim | closed-source internal ranking 추정 |

이 라벨은 문서의 안전장치입니다. 같은 문장 안에서도 “소스에서 보인다”와 “실제로 실행됐다”와 “실행 결과 artifact가 남았다”는 다릅니다. 이 책은 그 차이를 독자에게 숨기지 않습니다.

## 독자가 얻어야 하는 것

이 장을 읽고 나면 이후 장의 claim을 읽을 때 “근거의 종류가 무엇인가”를 먼저 묻게 됩니다. source path가 있는지, runtime command가 있는지, artifact가 있는지, 아니면 아직 manifest나 draft에 머무는지 구분하는 능력이 이 리서치 북의 핵심입니다.

## 핵심 근거

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Controller cross-check notes](../assets/evidence/coding-agent-underhood-crosscheck.md)
- [Reconciled facts](../assets/evidence/reconciled-facts.md)
- [Gajae workflow replay](../assets/evidence/gajae-code-workflow-replay.md)

## 다음 장으로

다음 장은 이 판정 기준을 agent 분류에 적용합니다. IDE extension, CLI, benchmark runner, workflow orchestrator, persistent runtime은 모두 “AI coding agent”라고 불리지만, loop와 state의 위치가 달라서 실패 방식도 다릅니다.
