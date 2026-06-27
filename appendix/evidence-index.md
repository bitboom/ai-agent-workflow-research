# Appendix — Evidence index

[← Chapter 07](../chapters/07-caveats-and-next.md)

이 페이지는 본문에서 생략한 상세 근거의 위치를 안내합니다. 본문은 독서 흐름을 위해 짧게 유지하고, source path·runtime command·artifact inventory·controller cross-check는 이 부록에서 찾도록 분리했습니다.

## How to use this appendix

1. 먼저 본문에서 claim의 라벨을 확인합니다.
2. 아래 표에서 해당 claim의 evidence file을 엽니다.
3. source-confirmed, runtime-confirmed, artifact-backed가 서로 섞이지 않았는지 확인합니다.
4. raw local state, provider config, private log는 public evidence에 없다는 점을 전제로 읽습니다.
5. public issue corpus는 failure taxonomy로만 읽고 prevalence로 읽지 않습니다.

## Evidence ladder

| Tier | 이 부록에서의 의미 | Public claim 사용법 |
| --- | --- | --- |
| Source path | repo/package/docs에서 구현 경로 확인 | architecture axis 설명 가능 |
| Runtime smoke | version/help/basic command 실행 확인 | tool exists/callable 범위만 말함 |
| Workflow artifact | 실행 뒤 sanitized state/ledger/map 확인 | durable behavior 일부 설명 가능 |
| Live task trace | 실제 non-toy task run + verification | task-family evidence로 사용 가능 |
| General claim | 여러 task/환경 반복 proof | 아직 이 문서에서는 제한적으로만 사용 |

## Canonical / controller-reviewed

| 목적 | 파일 | 역할 |
| --- | --- | --- |
| 전체 source-level map | [source-level-architecture-atlas.md](../assets/evidence/source-level-architecture-atlas.md) | 구현체별 loop/context/edit/sandbox/state anchor |
| agent orchestration comparison | [agent-orchestration-comparison.md](../assets/evidence/agent-orchestration-comparison.md) | Gajae/Hermes/OmO 등 orchestration proof status |
| reconciled facts | [reconciled-facts.md](../assets/evidence/reconciled-facts.md) | agent output과 controller cross-check 차이 정리 |
| controller cross-check | [coding-agent-underhood-crosscheck.md](../assets/evidence/coding-agent-underhood-crosscheck.md) | UltraResearch 수정 및 confidence 조정 |
| public issue/failure patterns | [source-level-architecture-atlas.md](../assets/evidence/source-level-architecture-atlas.md#public-failure-pattern-corpus-draft) | diagnostic taxonomy, not prevalence |

## Control-plane deep dives

| 시스템 | Narrative | Evidence |
| --- | --- | --- |
| Gajae-Code | [deep-dive-gajae-code.md](../research/deep-dive-gajae-code.md) | [runtime smoke](../assets/evidence/gajae-code-runtime-smoke.md), [workflow replay](../assets/evidence/gajae-code-workflow-replay.md), [crosscheck](../assets/evidence/gajae-code-crosscheck.md) |
| Hermes Agent | [deep-dive-hermes-agent.md](../research/deep-dive-hermes-agent.md) | [version drift](../assets/evidence/hermes-local-version-drift.md), [crosscheck](../assets/evidence/hermes-crosscheck.md) |
| LazyCodex/OmO | [deep-dive-lazycodex-omo.md](../research/deep-dive-lazycodex-omo.md) | [runtime-callable surface](../assets/evidence/lazycodex-runtime-callable-surface.md), [crosscheck](../assets/evidence/lazycodex-crosscheck.md), [codex baseline](../assets/evidence/codex-baseline.md) |

## Research chapters retained as archive

| 목적 | 파일 | 비고 |
| --- | --- | --- |
| UltraResearch draft/hypothesis | [coding-agent-underhood-ultraresearch.md](../research/coding-agent-underhood-ultraresearch.md) | canonical source가 아니라 controller 검토 대상 |
| taxonomy details | [coding-agent-taxonomy.md](../research/coding-agent-taxonomy.md) | agent 계열 분류의 상세 note |
| source map | [coding-agent-source-map.md](../research/coding-agent-source-map.md) | papers, repos, docs, issue sweep anchor |
| evaluation framework | [coding-agent-evaluation-framework.md](../research/coding-agent-evaluation-framework.md) | rubric, trace schema, benchmark plan |
| open questions | [coding-agent-open-questions.md](../research/coding-agent-open-questions.md) | 아직 닫히지 않은 research 질문 |

## Claim-to-evidence map

| 본문 claim | 가장 가까운 evidence | Caveat |
| --- | --- | --- |
| Codex/Aider/SWE-agent/OpenHands/IDE 계열은 source-level path로 읽을 수 있다 | source-level architecture atlas | line-level excerpt는 다음 deep-dive에서 보강 필요 |
| Gajae workflow surfaces are runtime-callable | Gajae workflow replay | live team/recovery/Hermes bridge는 미증명 |
| Hermes는 persistent runtime이다 | Hermes source paths + local version drift note | local runtime과 source clone version 차이를 혼동하지 말 것 |
| OmO는 plugin/harness layer다 | LazyCodex/OmO crosscheck + runtime-callable surface note | manifest와 actual `$...` command proof 분리 필요 |
| benchmark pilot은 아직 이르다 | evaluation framework | rubric/task template/trace schema가 먼저 필요 |

## Public evidence policy

- Raw `.gjc/`, `.omo`, provider config, private plugin cache, full local logs는 커밋하지 않습니다.
- API key, token, password, connection string, private endpoint는 `[REDACTED]` 처리하거나 기록하지 않습니다.
- 로컬 절대경로는 public-safe summary에서 제거합니다.
- Controller가 직접 확인한 source/runtime/artifact만 canonical claim으로 승격합니다.
- Agent-generated research note는 draft/hypothesis로 남깁니다.
- Public issue corpus는 failure category evidence일 뿐 제품별 빈도·품질 순위 근거가 아닙니다.

## Reader note

Evidence 파일 일부는 intentionally raw Markdown입니다. 그것들은 책 본문이 아니라 source/evidence artifact 역할을 합니다. 읽기용 본문은 `chapters/*.html`과 이 부록 HTML을 기준으로 삼고, 세부 근거를 확인할 때 raw evidence를 엽니다. 이 분리는 독서 경험과 검증 가능성을 동시에 유지하기 위한 의도적 구조입니다.
