# Chapter 05 — Gajae · Hermes · OmO control plane

[이전: 구현체별 읽기 지도](04-implementation-atlas.md) · [목차](README.md) · [다음: 평가 프레임워크](06-evaluation-framework.md)

## 세 시스템을 따로 읽는 이유

Gajae-Code, Hermes Agent, LazyCodex/OmO는 단순 editor helper가 아니라 agent workflow를 조직하는 control plane입니다.

| 시스템 | State root | 현재 강한 증거 | 남은 증거 |
| --- | --- | --- | --- |
| Gajae-Code | `.gjc/_session-*` | `gjc/0.7.3` smoke + controlled workflow artifact replay | live non-dry-run team, recovery/resume, Hermes bridge |
| Hermes Agent | `~/.hermes/` | local runtime `0.12.0`, source clone `0.17.0` map | version parity, gateway/cron/MCP/delegate trace |
| LazyCodex/OmO | `.omo/` + Codex plugin cache | plugin manifest + `$ultraresearch` artifact journal | non-ultraresearch workflow replay, MCP callability |

## Gajae-Code 최신 판정

- `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run` command surface가 runtime-callable.
- `.gjc/_session-replay-20260627` 아래 specs/plans/state/team/ledger artifact 생성 확인.
- live tmux/team과 recovery semantics는 아직 증명하지 않음.

## 더 읽기

- [Gajae-Code deep dive](../research/deep-dive-gajae-code.md)
- [GJC workflow replay](../assets/evidence/gajae-code-workflow-replay.md)
- [Hermes deep dive](../research/deep-dive-hermes-agent.md)
- [LazyCodex/OmO deep dive](../research/deep-dive-lazycodex-omo.md)
