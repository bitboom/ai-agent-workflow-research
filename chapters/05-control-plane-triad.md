# Chapter 05 — Gajae · Hermes · OmO control-plane triad

[← 구현체별 읽기 지도](04-implementation-atlas.md) · [다음: 평가 프레임워크 →](06-evaluation-framework.md)

## 세 시스템을 따로 읽는 이유

Gajae-Code, Hermes Agent, LazyCodex/OmO는 단순히 “코드를 고쳐주는 agent”로 묶으면 오해가 생깁니다. 세 시스템은 agent workflow를 통제하거나 확장하는 **control plane**에 가깝습니다. 그래서 평가 기준도 patch quality 하나가 아니라 session state, workflow handoff, tool surface, bridge, recovery, artifact를 포함해야 합니다.

## Gajae-Code 최신 판정

현재 Gajae-Code는 세 층으로 나눠 말할 수 있습니다.

| 층 | 확인 상태 | 근거 |
| --- | --- | --- |
| public source | source-confirmed | `commands/ultragoal.ts`, `ralplan.ts`, `team.ts`, `gjc-runtime/*`, edit/exec/tool paths |
| local command smoke | runtime-confirmed | `gjc/0.7.3`, help/version/basic print smoke |
| controlled workflow replay | artifact-backed | `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run`이 `.gjc/_session-*` state 작성 |

Workflow replay에서 중요한 점은 “실제 코딩 업무를 끝냈다”가 아닙니다. 확인된 것은 native workflow command surfaces가 runtime-callable이고, durable `.gjc` state layout을 만든다는 사실입니다. `deep-interview`는 spec과 handoff state를 남겼고, `ralplan`은 plan artifacts와 pending approval을 남겼고, `ultragoal`은 goals/ledger/checkpoint/review blocker state를 남겼고, `team --dry-run`은 team config/manifest/task/event layout을 만들었습니다.

하지만 live team tmux pane startup, worker heartbeat recovery, worktree cleanup, Hermes coordinator bridge는 아직 증명되지 않았습니다. 이 caveat가 없으면 Gajae 평가가 과장됩니다.

## Hermes Agent 최신 판정

Hermes는 persistent runtime으로 읽어야 합니다. source atlas는 `agent/conversation_loop.py`, `tool_executor.py`, `context_engine.py`, `memory_manager.py`, `trajectory.py`, `mcp_serve.py`, ACP/MCP/delegation 관련 파일을 핵심 path로 둡니다. Hermes의 강점은 한 repo 안에서 patch를 만드는 것보다 session, memory, skills, cron, messaging, delegation, MCP/gateway를 묶는 coordinator 역할입니다.

따라서 Hermes를 평가할 때는 “어떤 LLM을 쓰나”보다 다음을 봐야 합니다.

- toolsets가 어떤 surface를 허용하고 차단하는가
- memory와 skill preprocessing이 context에 어떻게 들어가는가
- background/delegation 작업이 어떤 evidence handle을 남기는가
- source clone version과 local runtime version이 일치하는가
- Gajae bridge 같은 외부 coordinator와 연결될 때 mutation boundary가 fail-closed인가

현재 문서의 Hermes claim은 source path와 local runtime observation을 분리합니다. local `hermes --version` 관찰은 runtime 상태를 말할 뿐, source clone HEAD의 모든 기능이 현 runtime에 있음을 보장하지 않습니다.

## LazyCodex / OmO 최신 판정

LazyCodex/OmO는 Codex 위의 plugin/harness layer입니다. 설치와 plugin observation은 중요하지만, 그 자체가 모든 `$...` workflow가 실제로 동작함을 증명하지 않습니다. OmO는 특히 manifest-declared MCP/hooks/commands와 runtime-callable surface를 분리해야 합니다.

이 문서에서 OmO 관련 claim은 다음 기준으로 읽습니다.

| Claim 종류 | 필요한 proof |
| --- | --- |
| plugin installed/enabled | `codex plugin list`, config/cache observation |
| hook/command manifest exists | manifest/config/source artifact |
| `$ultraresearch` ran | actual Codex/OmO run output, generated files, exit status |
| other `$...` workflow callable | per-command replay, `.omo` trace/log/artifact |
| internal ranking/routing | official docs or source; otherwise low confidence |

이 기준 때문에 UltraResearch 산출물은 초안으로만 남습니다. controller가 Agentless arXiv ID를 `2407.01489`로 수정하고, SWE-agent repo reference를 정리한 것도 같은 원칙입니다.

## 세 control plane 비교

| 축 | Gajae-Code | Hermes Agent | LazyCodex/OmO |
| --- | --- | --- | --- |
| state root | `.gjc/_session-*` | `~/.hermes/`, session/memory/trajectory | `.omo`/plugin artifacts need separation |
| core value | workflow gate, plan/review/team state | persistent coordinator and tool runtime | Codex plugin/harness and research workflow |
| strongest current evidence | controlled workflow artifact replay | source path + local runtime observation | installed plugin + `$ultraresearch` artifact path |
| main caveat | live team/recovery/bridge pending | source/runtime version drift | manifest vs runtime-callability gap |

## 이 장의 결론

세 시스템은 “누가 더 코딩을 잘하나”로 비교하면 품질이 낮아집니다. Gajae는 workflow artifact와 recovery, Hermes는 persistent runtime and bridge boundary, OmO는 plugin manifest와 actual callable surface가 핵심입니다. 다음 장의 evaluation framework는 이 차이를 benchmark 설계로 옮깁니다.

## 더 읽기

- [Gajae-Code workflow replay](../assets/evidence/gajae-code-workflow-replay.md)
- [Gajae-Code runtime smoke](../assets/evidence/gajae-code-runtime-smoke.md)
- [Hermes local version drift](../assets/evidence/hermes-local-version-drift.md)
- [LazyCodex runtime-callable surface](../assets/evidence/lazycodex-runtime-callable-surface.md)
- [Reconciled facts](../assets/evidence/reconciled-facts.md)
