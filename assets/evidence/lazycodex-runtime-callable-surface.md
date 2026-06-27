# Evidence: LazyCodex / OmO Runtime-Callable Surface

## Summary

LazyCodex/OmO evidence should be reported as a matrix, not a single “installed/not installed” answer.

| Surface | Declared | Installed | Observed | Artifact-backed | Status |
| --- | --- | --- | --- | --- | --- |
| Plugin `omo` | yes | `4.13.0` | yes | n/a | source-confirmed |
| `lazycodex-ai` install marker | yes | `4.13.0` | yes | n/a | source-confirmed |
| Hooks | 21 declared | yes | session hooks observed | partial | medium |
| MCP | `grep_app`, `context7`, `codegraph`, `git_bash`, `lsp` declared | yes | not individually called | no | unverified runtime |
| `$ultraresearch` | skill exists | yes | yes | `.omo/ultraresearch/...` | artifact-backed |
| `$init-deep` | skill exists | yes | not replayed | no | unverified runtime |
| `$ulw-plan` | skill exists | yes | not replayed | no | unverified runtime |
| `$start-work` | skill exists | yes | not replayed | no | unverified runtime |
| `$ulw-loop` | skill exists | yes | prior workflow use exists, but not isolated here | partial | needs replay |
| `$review-work` | skill exists | yes | not replayed in this pass | no | unverified runtime |

## Public-safe install evidence

- `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json` reports plugin `omo` version `4.13.0`.
- install marker reports `lazycodex-ai` version `4.13.0`.
- Codex CLI reports `codex-cli 0.142.2`.

## Artifact-backed evidence from this project

This investigation produced an UltraResearch session journal under `.omo/ultraresearch/<session>/`, including wave notes, local smoke notes, controller checks, and a final synthesis.

## Required next evidence

Run isolated temp-repo probes and capture sanitized `.omo` diffs:

- `$init-deep`
- `$ulw-plan`
- `$start-work`
- `$ulw-loop`
- `$review-work`

Also compare command routing across:

- `codex exec`
- Codex TUI
- OMX/tmux surface if used

## Caveat

Manifest-declared hooks, MCP servers, or skills do not automatically mean those features are runtime-callable in every Codex surface.
