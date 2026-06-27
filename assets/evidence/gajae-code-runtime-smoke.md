# Evidence: Gajae-Code Runtime Smoke Status

## Summary

Current result: **basic runtime-confirmed; full workflow replay pending**.

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

- It does not prove that `deep-interview`, `ralplan`, `ultragoal`, or `team` produce correct project artifacts in a real repository.
- It does not prove `.gjc/_session-*` recovery, audit, workflow-gate, or cleanup behavior.
- It does not resolve package/repo owner drift between npm metadata and inspected GitHub repo evidence.
- It does not prove Hermes coordinator bridge behavior.

## Source-level smoke anchors

- `packages/gajae-code/package.json` — wrapper package with `bin.gjc -> bin/gjc.js`.
- `packages/coding-agent/package.json` — coding-agent package with `bin.gjc -> src/cli.ts` and Bun engine requirement.
- `packages/coding-agent/src/cli.ts` — command registry and root `--smoke-test` surface.
- root `package.json` — smoke script wiring for `--version`, `--help`, `stats --help`, and `--smoke-test`.

## Required next evidence

Run in an isolated temp repo and publish only sanitized outputs:

```bash
gjc ralplan --help
gjc ultragoal --help
gjc team --help
# then one read-only or minimal mutation-controlled workflow replay
gjc -p --no-session --no-title --no-lsp "Summarize this repo purpose"
```

Record stdout/stderr, exit codes, package versions, generated `.gjc` paths, and cleanup status. Do not publish raw provider config, API keys, local private paths, or message logs.
