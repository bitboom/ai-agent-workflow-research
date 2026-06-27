# Gajae-Code Deep Dive

이 문서는 LazyCodex/OmO `$ultraresearch` 저널을 controller가 public-safe 형태로 정리한 Gajae-Code 딥다이브다. 원본 raw `.omo` 저널과 로컬 로그는 공개하지 않고, publish 가능한 source/runtime/evidence claim만 남겼다.

## Verdict

| Area | Status | Reason |
| --- | --- | --- |
| Source architecture | **source-confirmed** | local source checkout에서 package manifests, CLI registry, `.gjc` session layout, state writer, workflow command refs가 확인됨 |
| Local `gjc` runtime | **unverified** | 현재 환경에서 `bun`과 `gjc`가 PATH에 없어 `gjc --version/help/smoke-test`를 실행하지 못함 |
| Public package/repo provenance | **partially confirmed** | source manifests는 `gajae-ai/gajae-code`와 package version `0.7.3`을 가리키지만 npm/GitHub registry cross-check는 별도 필요 |
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

Current label: **runtime unverified**. 현재 조사에서 runtime smoke는 **실행 실패/미검증**으로 남긴다.

```text
bun: not found
gjc: not found
```

따라서 “source CLI path와 smoke script가 존재한다”는 source-level feasibility일 뿐, `gjc`가 이 환경에서 실제로 동작한다는 runtime proof는 아니다.

## Missing proof / next probes

1. Bun-enabled clean environment에서 source CLI와 installed CLI를 모두 확인한다.
   - `bun packages/coding-agent/src/cli.ts --version`
   - `bun packages/coding-agent/src/cli.ts --help`
   - `bun packages/coding-agent/src/cli.ts --smoke-test`
   - installed package가 있으면 `gjc --version`, `gjc --help`, `gjc --smoke-test`
2. npm/GitHub provenance를 controller가 직접 조회한다.
   - `https://registry.npmjs.org/gajae-code`
   - `https://registry.npmjs.org/gjc`
   - `https://registry.npmjs.org/@gajae-code%2Fcoding-agent`
   - `gh repo view gajae-ai/gajae-code`
3. Hermes/GJC bridge source를 line-anchor로 고정한다.
   - `packages/coding-agent/src/modes/bridge/bridge-mode.ts`
   - `packages/coding-agent/src/coordinator-mcp/server.ts`
   - `packages/coding-agent/src/coordinator/contract.ts`
4. `.gjc` write/recovery failure mode를 tests와 state writer code로 검증한다.

## Caveats

- public search 실패나 worker-visible negative result는 “존재하지 않음”의 증거가 아니다.
- source proof와 runtime proof를 섞으면 안 된다.
- Gajae-Code는 Hermes/LazyCodex와 달리 standalone TypeScript/Bun CLI/control plane이므로 비교 축을 `.gjc` state, workflow command, worktree/tmux/team orchestration 중심으로 잡아야 한다.
