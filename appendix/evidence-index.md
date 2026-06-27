# Appendix — Evidence index

[책 목차](../chapters/README.md) · [첫 화면](../index.html)

이 페이지는 본문에서 생략한 상세 근거의 위치를 안내합니다.

## Canonical / controller-reviewed

| 목적 | 파일 |
| --- | --- |
| 전체 source-level map | [source-level-architecture-atlas.md](../assets/evidence/source-level-architecture-atlas.md) |
| agent orchestration comparison | [agent-orchestration-comparison.md](../assets/evidence/agent-orchestration-comparison.md) |
| reconciled facts | [reconciled-facts.md](../assets/evidence/reconciled-facts.md) |
| controller cross-check | [coding-agent-underhood-crosscheck.md](../assets/evidence/coding-agent-underhood-crosscheck.md) |

## Control-plane deep dives

| 시스템 | Narrative | Evidence |
| --- | --- | --- |
| Gajae-Code | [deep-dive-gajae-code.md](../research/deep-dive-gajae-code.md) | [runtime smoke](../assets/evidence/gajae-code-runtime-smoke.md), [workflow replay](../assets/evidence/gajae-code-workflow-replay.md), [crosscheck](../assets/evidence/gajae-code-crosscheck.md) |
| Hermes Agent | [deep-dive-hermes-agent.md](../research/deep-dive-hermes-agent.md) | [version drift](../assets/evidence/hermes-local-version-drift.md), [crosscheck](../assets/evidence/hermes-crosscheck.md) |
| LazyCodex/OmO | [deep-dive-lazycodex-omo.md](../research/deep-dive-lazycodex-omo.md) | [runtime-callable surface](../assets/evidence/lazycodex-runtime-callable-surface.md), [crosscheck](../assets/evidence/lazycodex-crosscheck.md) |

## Research chapters retained as archive

| 목적 | 파일 |
| --- | --- |
| UltraResearch draft/hypothesis | [coding-agent-underhood-ultraresearch.md](../research/coding-agent-underhood-ultraresearch.md) |
| taxonomy details | [coding-agent-taxonomy.md](../research/coding-agent-taxonomy.md) |
| source map | [coding-agent-source-map.md](../research/coding-agent-source-map.md) |
| evaluation framework | [coding-agent-evaluation-framework.md](../research/coding-agent-evaluation-framework.md) |
| open questions | [coding-agent-open-questions.md](../research/coding-agent-open-questions.md) |

## Public evidence policy

- raw agent logs, `.omo/`, `.gjc/`, provider config, credentials, and local private paths are excluded.
- agent outputs are accepted only after controller cross-check.
- runtime claims require command output and, where relevant, durable artifact paths.
