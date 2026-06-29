# Evidence Index — Workflow Orchestrator Claims

[← 목차](../chapters/README.md)

이 Appendix는 본문 claim의 근거를 찾기 위한 ledger다. 본문은 목적, 분류, deep dive, 비교를 먼저 보여주고, 여기서는 어떤 claim이 어떤 source/runtime/artifact/provenance에 기대는지 분리한다. 특히 이 프로젝트는 Gajae-Code, Hermes Agent, LazyCodex/OmO를 일반 AI Agent가 아니라 Workflow Control Plane / Workflow Orchestrator 관점에서 분석하므로, evidence 역시 세 시스템을 먼저 배치한다.

## Public evidence policy

public evidence는 다섯 가지 원칙을 따른다. 첫째, raw credentials, API keys, provider tokens, password, connection string은 기록하지 않는다. 둘째, raw `.gjc`, `.omo`, Hermes logs 전체를 그대로 publish하지 않고 sanitized controller summary와 artifact map만 남긴다. 셋째, local absolute path와 private chat detail은 public report에 필요한 최소 수준으로만 일반화한다. 넷째, UltraResearch나 agent-generated draft는 hypothesis로 취급하고 controller cross-check 없이 canonical claim으로 승격하지 않는다. 다섯째, `source-confirmed`, `runtime-confirmed`, `artifact-backed`, `manifest-confirmed`, `unverified`를 하나의 confidence 숫자로 뭉개지 않는다.

## Canonical orchestrator evidence

| 대상 | Evidence file | 라벨 | 본문에서 쓰는 의미 |
| --- | --- | --- | --- |
| Gajae-Code | [gajae-code-workflow-replay.md](../assets/evidence/gajae-code-workflow-replay.md) | runtime-confirmed, artifact-backed | `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run`이 `.gjc/_session-*` artifacts를 남긴 controlled replay. |
| Gajae-Code | [gajae-code-runtime-smoke.md](../assets/evidence/gajae-code-runtime-smoke.md) | runtime-confirmed | `gjc/0.7.3` basic command/smoke surface 확인. |
| Gajae-Code | [gajae-code-crosscheck.md](../assets/evidence/gajae-code-crosscheck.md) | source-confirmed | public repo/npm/docs, Hermes bridge docs, owner drift caveat. |
| Gajae-Code | [gjc-documentation-review.md](../assets/evidence/gjc-documentation-review.md) | source-confirmed | Gajae docs의 workflow, bridge, runner framing review. |
| Hermes Agent | [hermes-crosscheck.md](../assets/evidence/hermes-crosscheck.md) | source-confirmed, runtime-confirmed | Hermes를 persistent coordinator/runtime으로 해석하는 근거. |
| Hermes Agent | [hermes-local-version-drift.md](../assets/evidence/hermes-local-version-drift.md) | runtime-confirmed, caveat | local runtime과 source/docs 최신 기능을 분리해야 한다는 근거. |
| LazyCodex / OmO | [lazycodex-crosscheck.md](../assets/evidence/lazycodex-crosscheck.md) | source-confirmed, manifest-confirmed, runtime-confirmed | Codex plugin/harness layer, hooks/MCP/workflow declarations, install state. |
| LazyCodex / OmO | [lazycodex-runtime-callable-surface.md](../assets/evidence/lazycodex-runtime-callable-surface.md) | runtime evidence / caveat | `$...` workflow command surface와 callability gap을 추적하기 위한 근거. |
| 세 시스템 비교 | [agent-orchestration-comparison.md](../assets/evidence/agent-orchestration-comparison.md) | synthesized controller evidence | state root, workflow abstraction, proof/missing proof, failure mode 비교. |
| 충돌 정리 | [reconciled-facts.md](../assets/evidence/reconciled-facts.md) | controller adjudication | agent draft와 controller check가 충돌할 때 canonical facts를 정리. |

## Gajae-Code evidence reading guide

Gajae-Code는 현재 세 시스템 중 artifact-backed evidence가 가장 탄탄하다. `gajae-code-workflow-replay.md`는 tiny isolated fixture repo에서 `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run` command surfaces가 runtime-callable하고 `.gjc/_session-*` 아래 state/spec/plan/ledger/team artifacts를 쓰는 것을 정리한다. 이 evidence 때문에 Chapter 03은 Gajae-Code를 repo-local Workflow Orchestrator로 분류한다.

하지만 같은 evidence가 live team을 증명하지는 않는다. `team --dry-run`은 config, manifest, task, event layout을 보여주지만 실제 tmux worker startup, heartbeat, worktree cleanup, orphan recovery를 보여주지 않는다. 따라서 live non-dry-run team, recovery/resume, Hermes bridge는 Chapter 07의 next probes로 남긴다.

## Hermes evidence reading guide

Hermes evidence는 범위가 넓지만 feature별 replay는 더 필요하다. `hermes-crosscheck.md`는 Hermes를 persistent coordinator/runtime으로 보는 근거를 요약한다. memory, skills, messaging gateway, cron, delegation, MCP integration 같은 surface는 단일 coding agent loop보다 넓은 runtime 책임을 보여준다. local gateway running과 platform configuration은 runtime observation이다.

다만 Hermes는 version drift를 조심해야 한다. docs나 source clone에서 보이는 기능이 local installed gateway에 그대로 적용되어 있다고 단정하면 안 된다. 그래서 `hermes-local-version-drift.md`는 local observation과 source/docs claim을 분리하기 위한 caveat evidence다. Chapter 04는 Hermes를 완성된 특정 coding workflow orchestrator가 아니라 persistent meta-orchestrator로 분류한다.

## LazyCodex / OmO evidence reading guide

LazyCodex/OmO evidence에서 가장 중요한 구분은 manifest와 runtime이다. `lazycodex-crosscheck.md`는 install/version/plugin manifest, hooks, MCP declarations, docs의 workflow descriptions를 정리한다. 이 근거는 Codex-embedded control overlay라는 분류를 지지한다. 그러나 manifest-declared hook이나 MCP server가 실제 Codex session에서 언제나 callable하다는 뜻은 아니다.

`lazycodex-runtime-callable-surface.md`는 바로 이 gap을 추적한다. `$ultraresearch`, `$ulw-plan`, `$start-work`, `$ulw-loop` 같은 workflow commands는 Codex composer/TUI/App 표면과 non-interactive execution 표면에서 차이가 날 수 있다. 따라서 Chapter 05는 LazyCodex/OmO를 standalone orchestrator라고 강하게 단정하지 않고, Codex-embedded Workflow Harness / Control Overlay 및 plugin-based orchestrator candidate로 둔다.

## Background agent atlas

| Evidence file | 역할 |
| --- | --- |
| [source-level-architecture-atlas.md](../assets/evidence/source-level-architecture-atlas.md) | Codex, Aider, SWE-agent, OpenHands, Hermes 등 source-level architecture map. 본문의 배경 지도로 쓴다. |
| [coding-agent-underhood-crosscheck.md](../assets/evidence/coding-agent-underhood-crosscheck.md) | under-the-hood controller cross-check와 source/path 정리. |
| [codex-baseline.md](../assets/evidence/codex-baseline.md) | Codex CLI baseline observation. |

이 background evidence는 기준선으로 필요하다. 일반 AI Agent와 Harness baseline을 알아야 Workflow Orchestrator가 무엇을 추가하는지 보인다. 그러나 본문 narrative는 Gajae/Hermes/LazyCodex deep dive를 중심으로 유지한다.

## Research notes and provenance

| Research source | 역할 |
| --- | --- |
| [coding-agent-underhood-ultraresearch.md](../research/coding-agent-underhood-ultraresearch.md) | UltraResearch hypothesis note. |
| [coding-agent-taxonomy.md](../research/coding-agent-taxonomy.md) | taxonomy background for Chapter 02. |
| [coding-agent-source-map.md](../research/coding-agent-source-map.md) | source map note, read together with the source atlas. |
| [coding-agent-evaluation-framework.md](../research/coding-agent-evaluation-framework.md) | evaluation rubric background for Chapter 06/07. |
| [coding-agent-open-questions.md](../research/coding-agent-open-questions.md) | open questions note. |
| [deep-dive-gajae-code.md](../research/deep-dive-gajae-code.md) | Gajae deep dive source note. |
| [deep-dive-hermes-agent.md](../research/deep-dive-hermes-agent.md) | Hermes deep dive source note. |
| [deep-dive-lazycodex-omo.md](../research/deep-dive-lazycodex-omo.md) | LazyCodex/OmO deep dive source note. |

## Provenance archive

UltraResearch, controller cross-check, artifact replay는 이 프로젝트의 provenance다. public book의 첫 화면과 본문은 그 과정보다 판단 기준과 결론을 먼저 보여준다. 독자는 본문을 먼저 읽고, claim을 검증하고 싶을 때 이 Appendix에서 source/runtime/artifact/provenance를 역추적하면 된다.

## Evidence label glossary

- `source-confirmed`: repo source, package source, official docs에서 확인했다.
- `runtime-confirmed`: 현재 환경에서 command가 성공했다.
- `artifact-backed`: 실행 후 durable artifact가 남았다.
- `manifest-confirmed`: plugin manifest/docs에 선언되어 있다. runtime callability는 별도다.
- `unverified`: 아직 source/runtime/artifact proof가 부족하다.

## Maintenance rule

새 evidence가 생기면 먼저 이 index의 canonical orchestrator evidence section에 추가한다. 그 다음 해당 chapter의 라벨을 갱신한다. 일반 agent atlas는 background section에 유지한다. provenance가 길어지면 이 Appendix에 넣고, 첫 화면과 본문은 Workflow Control Plane thesis를 유지한다.
