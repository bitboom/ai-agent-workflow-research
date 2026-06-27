# Gajae-Code Deep Dive

이 문서는 LazyCodex/OmO `$ultraresearch` 저널과 이후 GJC 기반 문서 리뷰를 controller가 public-safe 형태로 정리한 Gajae-Code 딥다이브다. 원본 raw `.omo` 저널과 로컬 로그는 공개하지 않고, publish 가능한 source/runtime/evidence claim만 남겼다.

## Verdict

| Area | Status | Reason |
| --- | --- | --- |
| Source architecture | **source-confirmed** | local source checkout에서 package manifests, CLI registry, `.gjc` session layout, state writer, workflow command refs가 확인됨 |
| Basic local `gjc` runtime | **basic runtime-confirmed** | Bun `1.3.14`, `@gajae-code/coding-agent 0.7.3`, `gajae-code 0.7.3` 설치 후 `gjc --version`, `gjc --help`, `gjc --smoke-test`, non-interactive print smoke가 exit 0 |
| Controlled workflow artifact replay | **artifact-backed runtime-confirmed** | isolated temp repo에서 `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run`이 exit 0이고 `.gjc/_session-replay-20260627` specs/plans/state/team/ledger artifacts를 생성 |
| Full recovery/live-team runtime | **not yet replayed** | live non-dry-run tmux/team execution, `.gjc` corruption recovery, long-running resume, Hermes bridge trace는 아직 별도 검증 필요 |
| Public package/repo provenance | **partially confirmed** | npm packages and source manifests point to `gajae-ai/gajae-code`; inspected public repo evidence also includes `Yeachan-Heo/gajae-code`, so canonical owner drift remains unresolved |
| Hermes/GJC bridge | **source lead** | bridge docs/setup anchors는 있으나 bridge runtime trace는 없음 |

## Source anchors

UltraResearch/controller pass가 확인한 핵심 경로:

- `packages/gajae-code/package.json` — wrapper package `gajae-code`, version `0.7.3`, `bin.gjc -> bin/gjc.js`, repo/bugs target `gajae-ai/gajae-code`.
- `packages/coding-agent/package.json` — `@gajae-code/coding-agent`, version `0.7.3`, `bin.gjc -> src/cli.ts`.
- `packages/coding-agent/src/cli.ts` — `state`, `team`, `ultragoal`, `ralplan`, `deep-interview`, MCP/coordinator 계열 command dispatch와 root `--smoke-test` surface.
- `packages/coding-agent/src/gjc-runtime/session-layout.ts` — `.gjc/_session-*` layout와 state/specs/plans/ultragoal/audit/log/runtime/team/workflow-gate path resolvers.
- `packages/coding-agent/src/gjc-runtime/session-resolution.ts` — write에는 explicit session id 요구, read에는 latest active session auto-detect와 ambiguity guard.
- `packages/coding-agent/src/gjc-runtime/state-writer.ts` — `.gjc/**` sanctioned writer boundary와 project `.gjc/**` containment guard.
- `packages/coding-agent/src/commands/deep-interview.ts`, `ralplan.ts`, `ultragoal.ts`, `team.ts` — four workflow command handlers.
- `packages/coding-agent/src/gjc-runtime/workflow-command-ref.ts` — canonical workflow skill handoff/state-write command references.
- `packages/coding-agent/src/gjc-runtime/launch-worktree.ts`, `launch-tmux.ts`, `tmux-sessions.ts`, `team-runtime.ts` — team/tmux/worktree orchestration candidates.

## Runtime proof status

Current label: **basic runtime-confirmed plus controlled workflow artifact replay confirmed**.

Sanitized local capture:

```text
bun --version -> 1.3.14
@gajae-code/coding-agent -> 0.7.3, bin.gjc -> src/cli.ts
gajae-code -> 0.7.3, bin.gjc -> bin/gjc.js
gjc --version -> gjc/0.7.3
gjc --help -> exit 0, command surface rendered
gjc --smoke-test -> smoke-test: ok
gjc -p --model openai-codex/gpt-5.5 ... -> GJC_PRINT_SMOKE_OK
```

이 증거는 local CLI가 callable이고 basic model-backed non-interactive run이 가능한 것을 보여준다. 후속 temp-repo replay에서는 `deep-interview`, `ralplan`, `ultragoal`, `team --dry-run`의 `.gjc/_session-*` artifact creation도 확인했다. 다만 live non-dry-run team execution, recovery/resume, Hermes coordinator bridge는 아직 검증하지 않았다.

## Missing proof / next probes

1. Live non-dry-run `gjc team`을 tmux/worktree orphan cleanup 기준이 준비된 뒤 별도 replay한다.
2. `.gjc` recovery/resume/failure-mode replay를 수행한다: corrupt state guard, ambiguous session guard, long-running resume, cleanup.
3. Resolve canonical owner drift between npm metadata (`gajae-ai/gajae-code`) and the inspected public repo (`Yeachan-Heo/gajae-code`). Do not treat this as runtime proof.
4. Hermes/GJC bridge source를 line-anchor로 고정하고, allowlisted temp root에서 bridge runtime trace를 별도로 캡처한다.
   - `packages/coding-agent/src/modes/bridge/bridge-mode.ts`
   - `packages/coding-agent/src/coordinator-mcp/server.ts`
   - `packages/coding-agent/src/coordinator/contract.ts`
5. `.gjc` write/recovery failure mode를 tests와 state writer code로 검증한다.

## Caveats

- source proof, basic CLI smoke, controlled workflow artifact replay, live orchestration proof를 섞으면 안 된다.
- Gajae-Code는 Hermes/LazyCodex와 달리 standalone TypeScript/Bun CLI/control plane이므로 비교 축을 `.gjc` state, workflow command, worktree/tmux/team orchestration 중심으로 잡아야 한다.
- model-backed print smoke는 provider routing이 가능한지만 보여주며, 장기 coding workflow 품질이나 artifact integrity를 증명하지 않는다.
