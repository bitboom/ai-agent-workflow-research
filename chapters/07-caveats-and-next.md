# 다음 검증 — Orchestrator claim을 어떻게 증명할 것인가

[← 목차](README.md)

이 책은 Workflow Orchestrator 중심으로 전면 개편되었지만, 모든 claim이 같은 수준으로 증명된 것은 아니다. 오히려 이 장의 목적은 아직 부족한 부분을 명확히 드러내는 것이다. Control Plane claim은 기능 소개보다 더 높은 증거 기준을 요구한다. source에 command가 있는 것, manifest에 hook이 선언된 것, local install이 성공한 것, artifact가 남은 것은 서로 다른 근거다. 이 차이를 유지해야 다음 검증이 의미 있다.

## 현재 증거 수준 요약

| 시스템 | 강한 근거 | 약한 근거 / 미검증 |
| --- | --- | --- |
| Gajae-Code | `gjc/0.7.3` basic smoke, controlled workflow artifact replay, `.gjc/_session-*` artifact map | live non-dry-run `team`, recovery/resume, corruption handling, Hermes bridge runtime, package/repo owner drift |
| Hermes Agent | persistent runtime/docs/source architecture, local gateway running, memory/skills/tools/cron/delegation/MCP surface | installed/source version parity, feature별 isolated replay, long-running cron/delegation failure recovery |
| LazyCodex / OmO | install/version/plugin manifest, hooks/MCP/workflow declarations, docs for `$ulw-*` flow | all `$...` workflow callability, `codex exec` vs TUI/App parity, hook fire proof, stale `.omo` recovery |

이 표는 결론을 약화시키기 위한 것이 아니다. 오히려 좋은 리서치 북은 무엇을 아는지와 무엇을 아직 모르는지를 동시에 보여줘야 한다. 특히 Workflow Orchestrator는 운영 시스템이므로 “한 번 성공했다”보다 “실패했을 때 무엇이 남고 어디서 다시 시작하는가”가 더 중요하다.

## Gajae-Code next probes

첫 번째 probe는 live team replay다. 현재 `team --dry-run`은 state layout과 command callability를 보여준다. 그러나 live worker orchestration claim을 세우려면 실제 tmux/worktree worker가 시작되고, task를 가져가고, event/mailbox/heartbeat를 남기고, 완료 또는 실패 시 cleanup 되는지 확인해야 한다. 이 probe는 tiny fixture repo에서 시작해야 한다. 중요한 것은 code quality가 아니라 worker lifecycle evidence다.

두 번째 probe는 recovery/resume replay다. `.gjc/_session-*` state를 가진다는 사실만으로 recovery가 증명되지는 않는다. 중간에 process를 끊고, pending approval 상태에서 재개하고, blocked goal을 수정하고, corrupted/missing artifact를 만났을 때 어떤 error와 repair path가 있는지 확인해야 한다. 이 결과는 raw `.gjc` 전체가 아니라 sanitized artifact map과 command transcript로 public report에 남긴다.

세 번째 probe는 Hermes bridge runtime이다. Gajae docs에는 Hermes-compatible MCP config와 coordinator bridge surface가 있다. 그러나 bridge claim은 source/docs만으로 충분하지 않다. `gjc mcp-serve coordinator --check`와 실제 delegate plan/execute/team 호출이 fail-closed root allowlist와 mutation opt-in 아래에서 어떻게 동작하는지 확인해야 한다.

## Hermes next probes

Hermes는 broad runtime이므로 probe를 좁혀야 한다. 첫 번째는 installed/source/docs version matrix다. local `hermes --version`, source clone HEAD, docs feature를 표로 나누고, public claim이 어느 layer에서 온 것인지 표시한다. 이 작업은 version drift로 인한 overclaim을 줄인다.

두 번째는 runtime surface별 isolated replay다. cron job은 fresh session에서 self-contained prompt를 실행하고 output을 origin/local target으로 전달하는지 확인한다. delegation은 subagent self-report를 parent가 어떻게 검증해야 하는지 확인한다. MCP/ACP는 tool discovery와 mutation boundary를 확인한다. gateway는 session reset/resume, platform delivery, document/media handling 같은 operational behavior를 확인한다.

세 번째는 long-running failure recovery다. Hermes가 persistent runtime이라면 background process, cron, gateway restart, session compression, active process hold 같은 상황에서 state를 어떻게 유지하는지 보여줘야 한다. 이 evidence는 public report에서 매우 가치가 높다. 단, provider/API key detail, raw tokens, private chat content는 남기지 않는다.

## LazyCodex / OmO next probes

LazyCodex/OmO의 핵심 과제는 manifest와 runtime을 분리하는 것이다. 첫 번째 probe는 `$...` workflow callability matrix다. `$ultraresearch`, `$ulw-plan`, `$start-work`, `$ulw-loop` 등 docs/manifest에서 확인한 workflow를 temp repo에서 각각 호출하고, Codex TUI/App surface와 non-interactive `codex exec` surface를 분리해 기록한다. 성공/실패 모두 evidence다.

두 번째 probe는 hook fire proof다. session-start, user-prompt-submit, pre/post-tool-use, post-compact, stop/subagent-stop hook이 언제 실행되는지, 어떤 artifact/log를 남기는지 확인한다. hook이 선언되어 있지만 approval이 필요하거나 disabled MCP 때문에 기대대로 동작하지 않는다면 그 상태도 report에 남긴다.

세 번째 probe는 `.omo` stale state recovery다. workflow ledger가 있을 때 중단 후 재개가 가능한지, old artifact가 새 task에 오염되지 않는지, hook non-fire나 timeout 후 cleanup이 되는지 확인한다. 이것이 확인되어야 plugin-based orchestrator candidate에서 더 강한 orchestrator claim으로 이동할 수 있다.

## Public evidence policy

public evidence에는 다섯 가지 원칙을 적용한다. 첫째, raw credentials와 provider detail을 절대 남기지 않는다. 둘째, local absolute path는 필요한 경우 sanitized path로 바꾼다. 셋째, raw `.gjc`, `.omo`, Hermes logs 전체를 그대로 publish하지 않고, artifact map과 controller summary를 남긴다. 넷째, agent-generated draft는 hypothesis로 표시하고 controller cross-check 없이 canonical claim으로 올리지 않는다. 다섯째, evidence label을 유지한다.

## Book maintenance checklist

이 책을 업데이트할 때는 먼저 thesis와 분류를 흔들지 않는다. 새 evidence가 생기면 각 deep dive의 evidence label을 갱신하고, Appendix evidence index의 canonical section에 추가한다. 일반 agent source atlas는 배경으로 유지하되, Gajae/Hermes/LazyCodex deep dive보다 앞에 오지 않게 한다. 제작 과정 설명이 길어지면 Appendix provenance로 옮긴다. 첫 화면은 항상 Workflow Orchestrator / Control Plane 중심이어야 한다.

## 다음 실행 순서

1. Gajae-Code live team/recovery/Hermes bridge replay를 작은 repo에서 실행한다.
2. Hermes runtime surface별 isolated replay를 만든다.
3. LazyCodex/OmO `$...` callability matrix와 hook fire proof를 만든다.
4. 세 시스템의 evidence label을 업데이트한다.
5. comparison chapter에 “증명된 것”과 “아직 후보인 것”을 반영한다.
6. public GitHub Pages에서 raw process log가 아니라 독자가 판단하기 쉬운 evidence ledger를 유지한다.

## 이 장의 결론

Workflow Orchestrator claim은 한 번의 demo로 끝나지 않는다. phase, state, artifact, gate, worker, recovery가 모두 연결될 때 강한 claim이 된다. 현재 Gajae-Code는 artifact-backed replay가 가장 앞서 있고, Hermes는 persistent runtime breadth가 가장 넓으며, LazyCodex/OmO는 Codex-embedded workflow overlay로서 adoption path가 강하다. 다음 검증은 이 세 방향을 같은 evidence discipline으로 끌어올리는 일이다.
