# Appendix — Evidence index

[책 목차](../chapters/index.html) · [첫 화면](../index.html)

이 페이지는 본문에서 생략한 상세 근거의 위치를 안내합니다. 본문은 독서 흐름을 위해 짧게 유지하고, source path·runtime command·artifact inventory·controller cross-check는 이 부록에서 찾도록 분리했습니다.

## How to use this appendix

1. 먼저 본문에서 claim의 라벨을 확인합니다.
2. 아래 표에서 해당 claim의 evidence file을 엽니다.
3. source-confirmed, runtime-confirmed, artifact-backed가 서로 섞이지 않았는지 확인합니다.
4. raw local state, provider config, private log는 public evidence에 없다는 점을 전제로 읽습니다.

## Canonical / controller-reviewed

| 목적 | 파일 | 역할 |
| --- | --- | --- |
| 전체 source-level map | [source-level-architecture-atlas.md](../assets/evidence/source-level-architecture-atlas.md) | 구현체별 loop/context/edit/sandbox/state anchor |
| agent orchestration comparison | [agent-orchestration-comparison.md](../assets/evidence/agent-orchestration-comparison.md) | Gajae/Hermes/OmO 등 orchestration proof status |
| reconciled facts | [reconciled-facts.md](../assets/evidence/reconciled-facts.md) | agent output과 controller cross-check 차이 정리 |
| controller cross-check | [coding-agent-underhood-crosscheck.md](../assets/evidence/coding-agent-underhood-crosscheck.md) | UltraResearch 수정 및 confidence 조정 |

## Control-plane deep dives

| 시스템 | Narrative | Evidence |
| --- | --- | --- |
| Gajae-Code | [deep-dive-gajae-code.md](../research/deep-dive-gajae-code.md) | [runtime smoke](../assets/evidence/gajae-code-runtime-smoke.md), [workflow replay](../assets/evidence/gajae-code-workflow-replay.md), [crosscheck](../assets/evidence/gajae-code-crosscheck.md) |
| Hermes Agent | [deep-dive-hermes-agent.md](../research/deep-dive-hermes-agent.md) | [version drift](../assets/evidence/hermes-local-version-drift.md), [crosscheck](../assets/evidence/hermes-crosscheck.md) |
| LazyCodex/OmO | [deep-dive-lazycodex-omo.md](../research/deep-dive-lazycodex-omo.md) | [runtime-callable surface](../assets/evidence/lazycodex-runtime-callable-surface.md), [crosscheck](../assets/evidence/lazycodex-crosscheck.md) |

## Research chapters retained as archive

| 목적 | 파일 | 비고 |
| --- | --- | --- |
| UltraResearch draft/hypothesis | [coding-agent-underhood-ultraresearch.md](../research/coding-agent-underhood-ultraresearch.md) | canonical source가 아니라 controller 검토 대상 |
| taxonomy details | [coding-agent-taxonomy.md](../research/coding-agent-taxonomy.md) | agent 계열 분류의 상세 note |
| source map | [coding-agent-source-map.md](../research/coding-agent-source-map.md) | papers, repos, docs, issue sweep anchor |
| evaluation framework | [coding-agent-evaluation-framework.md](../research/coding-agent-evaluation-framework.md) | rubric, trace schema, benchmark plan |
| open questions | [coding-agent-open-questions.md](../research/coding-agent-open-questions.md) | 아직 닫히지 않은 research 질문 |

## Public evidence policy

- raw agent logs, `.omo/`, `.gjc/`, provider config, credentials, and local private paths are excluded.
- agent outputs are accepted only after controller cross-check.
- runtime claims require command output and, where relevant, durable artifact paths.
- public issue/review material is taxonomy evidence, not prevalence proof.
- closed-source internal implementation claims remain low confidence unless official docs state them directly.

## Reader note

Evidence 파일 일부는 intentionally raw Markdown입니다. 그것들은 책 본문이 아니라 source/evidence artifact 역할을 합니다. 읽기용 본문은 `chapters/*.html`과 이 부록 HTML을 기준으로 삼고, 세부 근거를 확인할 때 raw evidence를 엽니다.
