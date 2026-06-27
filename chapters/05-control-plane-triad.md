# Chapter 05 — Gajae · Hermes · OmO control plane

[이전: 구현체별 읽기 지도](04-implementation-atlas.html) · [목차](index.html) · [다음: 평가 프레임워크](06-evaluation-framework.html)

## 세 시스템을 따로 읽는 이유

Gajae-Code, Hermes Agent, LazyCodex/OmO는 단순 editor helper가 아니라 agent workflow를 조직하는 control plane입니다. 이들은 “코드를 한 번 수정하는 agent”보다 긴 시간축을 다룹니다. plan을 만들고, review를 통과시키고, state를 저장하고, worker나 subagent를 호출하고, 실패 후 복구하거나 다음 run으로 이어지는 구조가 핵심입니다.

| 시스템 | State root | 현재 강한 증거 | 남은 증거 |
| --- | --- | --- | --- |
| Gajae-Code | `.gjc/_session-*` | `gjc/0.7.3` smoke + controlled workflow artifact replay | live non-dry-run team, recovery/resume, Hermes bridge |
| Hermes Agent | `~/.hermes/` | local runtime `0.12.0`, source clone `0.17.0` map | version parity, gateway/cron/MCP/delegate trace |
| LazyCodex/OmO | `.omo/` + Codex plugin cache | plugin manifest + `$ultraresearch` artifact journal | non-ultraresearch workflow replay, MCP callability |

## Gajae-Code 최신 판정

Gajae-Code는 이번 프로젝트에서 가장 runtime evidence가 진전된 축입니다. Bun/global package 환경에서 `gjc/0.7.3` version/help/smoke/print smoke가 확인됐고, isolated temp repo에서 `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run` command surface가 artifact를 생성하는 controlled replay도 확인됐습니다.

중요한 점은 이 claim의 범위입니다. 확인된 것은 `.gjc/_session-replay-20260627` 아래 specs, plans, state, ultragoal ledger, team dry-run manifest가 생성된다는 점입니다. 아직 live tmux/worktree worker, heartbeat, orphan cleanup, recovery/resume, Hermes bridge runtime은 증명하지 않았습니다. 따라서 “Gajae가 full autonomous team을 production-ready로 증명했다”라고 쓰면 안 됩니다.

## Hermes Agent 최신 판정

Hermes는 persistent runtime으로 읽어야 합니다. memory, cron, delegation, gateway, messaging identity, MCP bridge 같은 기능은 단일 coding CLI보다 넓은 control plane을 구성합니다. 그러나 현재 public evidence에서는 local installed runtime `0.12.0`과 source clone `0.17.0` 사이 drift를 분리해야 합니다. source clone의 최신 기능을 local runtime에서 실행됐다고 말하면 안 됩니다.

다음 증거는 sanitized trace가 필요합니다. `~/.hermes/` state root, cron/delegate/gateway/MCP call-chain, session DB 또는 logs를 공개 가능한 범위로 요약해야 합니다. credentials, provider config, private chat identity는 절대 public evidence에 남기지 않습니다.

## LazyCodex / OmO 최신 판정

LazyCodex/OmO는 Codex 위 plugin/harness layer로 읽습니다. manifest에는 commands, hooks, MCP servers, subagent 관련 surface가 보일 수 있지만 manifest-declared와 runtime-callable은 다릅니다. 이 프로젝트에서는 `$ultraresearch` artifact journal과 synthesis가 있어 해당 workflow는 artifact-backed로 볼 수 있습니다. 그러나 `$ulw-loop`, `$review-work`, `$init-deep`, `$start-work` 등은 별도 isolated replay가 필요합니다.

## 이 장의 결론

세 시스템은 모두 “agent를 쓰는 방법”이 아니라 “agent 작업을 조직하는 방법”을 보여줍니다. 따라서 feature count보다 state root, durable artifact, replayability, recovery path, public-safe evidence policy가 중요합니다.

## 더 읽기

- [Gajae-Code deep dive](../research/deep-dive-gajae-code.md)
- [GJC workflow replay](../assets/evidence/gajae-code-workflow-replay.md)
- [Hermes Agent deep dive](../research/deep-dive-hermes-agent.md)
- [LazyCodex/OmO deep dive](../research/deep-dive-lazycodex-omo.md)
- [Agent orchestration comparison](../assets/evidence/agent-orchestration-comparison.md)
