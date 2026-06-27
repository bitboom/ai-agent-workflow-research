# LazyCodex / OmO Deep Dive

이 문서는 LazyCodex/OmO를 “standalone CLI”가 아니라 **Codex plugin/harness layer**로 정리한다. 조사 기준은 manifest-declared surface와 실제 runtime-callable surface를 분리하는 것이다.

## Verdict

| Area | Status | Reason |
| --- | --- | --- |
| Plugin install/version | **source-confirmed** | plugin manifest reports `omo 4.13.0`; install marker reports `lazycodex-ai 4.13.0`; Codex CLI reports `0.142.2` |
| Hooks/skills/MCP declarations | **manifest-confirmed** | manifest lists 21 hooks, skills path, and `.mcp.json` |
| `$ultraresearch` workflow | **artifact-backed** | this investigation produced `.omo/ultraresearch/...` wave artifacts and synthesis |
| Other `$...` workflows | **unverified runtime** | `$init-deep`, `$ulw-plan`, `$start-work`, `$ulw-loop`, `$review-work` were not replayed in isolated temp repos |
| TUI/exec/OMX parity | **unresolved** | observed behavior came from Codex exec/native-hook surface, not a full parity matrix |

## Manifest and install evidence

Public-safe summary of local plugin evidence:

- plugin manifest: `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json`
  - `name: omo`
  - `version: 4.13.0`
  - `skills: ./skills/`
  - `hooks: 21`
  - MCP config points to `.mcp.json`
- install marker: `lazycodex-install.json`
  - `packageName: lazycodex-ai`
  - `version: 4.13.0`
- aggregate package: `@sisyphuslabs/omo-codex-plugin` version `4.13.0`
- Codex CLI: `codex-cli 0.142.2`

## Hook / MCP / skill surface

### Hooks

Manifest/hook inventory includes these lifecycle categories:

- `SessionStart`
- `UserPromptSubmit`
- `PreToolUse`
- `PostToolUse`
- `PostCompact`
- `Stop`
- `SubagentStop`

These are declaration/observed-session evidence, not proof that every hook path completed successfully in every Codex surface.

### MCP declarations

`.mcp.json` declares:

- `grep_app`
- `context7`
- `codegraph`
- `git_bash`
- `lsp`

This is manifest evidence. Runtime callable proof requires an actual Codex tool-list/call trace per MCP.

### Skills

Observed skill inventory includes:

- `init-deep`
- `ulw-plan`
- `start-work`
- `ulw-loop`
- `ultraresearch`
- `review-work`
- `teammode`
- `rules`
- `lsp`
- `programming`
- `debugging`
- `visual-qa`

## `.omo` artifact schema

From skills/source and this run:

| Workflow | Artifact pattern | Proof status |
| --- | --- | --- |
| `ultraresearch` | `.omo/ultraresearch/<session>/wave-*.md`, `expansion-log.md`, `verify-*.md`, `SYNTHESIS.md` | artifact-backed in this project |
| `ulw-plan` | `.omo/drafts/<slug>.md`, `.omo/plans/<slug>.md` | schema-declared, replay pending |
| `start-work` | `.omo/boulder.json`, `.omo/start-work/ledger.jsonl` | schema-declared, replay pending |
| `ulw-loop` | `.omo/ulw-loop/goals.json`, ledger/evidence/checkpoints | schema-declared, replay pending |
| `teammode` | `.omo/teams/{session_id}/team.json`, `guide.md`, `artifacts/` | schema-declared, replay pending |

## Runtime-callable proof status

Confirmed:

- `$ultraresearch` activation produced a session journal and final synthesis.
- Codex session hooks were observed in the command transcript.

Missing:

- isolated temp-repo replay for `$init-deep`, `$ulw-plan`, `$start-work`, `$ulw-loop`, `$review-work`.
- parity between `codex exec`, Codex TUI, and OMX/tmux surfaces.
- MCP discovery/callability proof for every declared MCP.

## Next probes

1. Create a scratch git repo and run minimal non-sensitive prompts for each `$...` workflow.
2. Capture only sanitized `.omo` tree diffs and generated public-safe artifact summaries.
3. Build a runtime-callable matrix with columns: declared / installed / enabled / observed / artifact-backed / blocked.
4. Compare `codex exec`, TUI, and any OMX/tmux surface with the same prompt.

## Caveats

- `command -v lazycodex` not existing is not enough to call the install broken; LazyCodex normally runs inside Codex via OmO plugin `$...` commands.
- Manifest-declared MCP/hooks/skills must not be treated as runtime-callable proof.
- Raw plugin manifests/logs should not be published verbatim.
