# Evidence: Gajae-Code Runtime Smoke Status

## Summary

Current result: **basic runtime-confirmed plus controlled workflow artifact replay confirmed**.

A local Bun/GJC installation was added after the earlier UltraResearch pass. The initial historical state was `bun: not found` / `gjc: not found`; that is now superseded by the sanitized smoke capture below.

## Sanitized capture

```text
capture time: 2026-06-27T09:49:09Z
bun --version -> 1.3.14
@gajae-code/coding-agent -> 0.7.3, bin.gjc -> src/cli.ts
gajae-code -> 0.7.3, bin.gjc -> bin/gjc.js
gjc --version -> gjc/0.7.3
gjc --help -> exit 0, command surface rendered
gjc --smoke-test -> smoke-test: ok
gjc -p --model openai-codex/gpt-5.5 --thinking low --no-session --no-title --no-lsp ... -> GJC_PRINT_SMOKE_OK
```

The global `gjc` command resolves through Bun to the scoped `@gajae-code/coding-agent` CLI entry. The public wrapper package `gajae-code` is also installed and records the same package version and repository metadata.

## What this proves

- The local machine can execute `gjc` after a Bun/global package install.
- The installed CLI reports `gjc/0.7.3` and exposes a help surface.
- The built-in smoke test exits successfully.
- Non-interactive model-backed print mode can return a controlled response.

## What this does not prove

- It does not prove that `deep-interview`, `ralplan`, `ultragoal`, or `team` autonomously complete a real coding task.
- It does not prove `.gjc/_session-*` recovery, corruption handling, live non-dry-run team/tmux execution, workflow-gate completeness, or cleanup behavior.
- It does not resolve package/repo owner drift between npm metadata and inspected GitHub repo evidence.
- It does not prove Hermes coordinator bridge behavior.

## Source-level smoke anchors

- `packages/gajae-code/package.json` — wrapper package with `bin.gjc -> bin/gjc.js`.
- `packages/coding-agent/package.json` — coding-agent package with `bin.gjc -> src/cli.ts` and Bun engine requirement.
- `packages/coding-agent/src/cli.ts` — command registry and root `--smoke-test` surface.
- root `package.json` — smoke script wiring for `--version`, `--help`, `stats --help`, and `--smoke-test`.

## Follow-up workflow replay

A later controller pass completed a controlled temp-repo replay of `deep-interview`, `ralplan`, `ultragoal`, and `team --dry-run`. See [`gajae-code-workflow-replay.md`](gajae-code-workflow-replay.md).

Remaining evidence gaps are live non-dry-run `team` execution, `.gjc` recovery/corruption behavior, long-running workflow resume semantics, Hermes coordinator bridge runtime, and package/repo owner drift. Do not publish raw provider config, API keys, local private paths, or message logs.
