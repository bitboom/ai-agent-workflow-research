# Evidence: Gajae-Code Runtime Smoke Status

## Summary

Current result: **runtime unverified**.

The LazyCodex/OmO UltraResearch controller attempted a local smoke feasibility check for Gajae-Code, but this environment does not expose the required runtime commands on PATH.

```text
bun: not found
gjc: not found
```

## What this proves

- The current environment cannot prove `gjc` runtime behavior.
- Source-level feasibility remains strong because the source checkout includes CLI, package manifests, and smoke-test wiring.

## What this does not prove

- It does not prove that Gajae-Code is broken.
- It does not prove that npm packages are unavailable.
- It does not prove that a Bun-enabled environment cannot run it.

## Source-level smoke anchors

- `packages/gajae-code/package.json` — wrapper package with `bin.gjc -> bin/gjc.js`.
- `packages/coding-agent/package.json` — coding-agent package with `bin.gjc -> src/cli.ts` and Bun engine requirement.
- `packages/coding-agent/src/cli.ts` — command registry and root `--smoke-test` surface.
- root `package.json` — smoke script wiring for `--version`, `--help`, `stats --help`, and `--smoke-test`.

## Required next evidence

Run in a Bun-enabled or installed-package environment:

```bash
command -v bun
command -v gjc || true
bun packages/coding-agent/src/cli.ts --version
bun packages/coding-agent/src/cli.ts --help
bun packages/coding-agent/src/cli.ts --smoke-test
# if installed globally or via npx/bunx:
gjc --version
gjc --help
gjc --smoke-test
```

Record stdout/stderr, exit codes, package versions, and project SHA. Publish only sanitized outputs.
