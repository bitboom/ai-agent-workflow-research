# Evidence: GJC Documentation Review Pass

## Summary

A Gajae-Code `gjc` pass was used as a project-documentation reviewer after installing the local CLI. The generated review was treated as agent output, not canonical evidence; controller accepted only the findings that matched direct file inspection.

## Runtime preflight

Sanitized local checks before the review:

```text
bun --version -> 1.3.14
@gajae-code/coding-agent -> 0.7.3
gajae-code -> 0.7.3
gjc --version -> gjc/0.7.3
gjc --smoke-test -> smoke-test: ok
gjc -p --model openai-codex/gpt-5.5 ... -> GJC_PRINT_SMOKE_OK
```

## Review command class

The review used non-interactive `gjc -p` with a prompt asking for a documentation/IA review of:

- `README.md`
- `index.html`
- `tests/static.test.mjs`
- `research/*.md`
- `assets/evidence/*.md`

Raw local prompts and temporary outputs are not committed. This file records only public-safe findings and controller dispositions.

## Accepted findings

| Priority | Finding | Controller disposition |
| --- | --- | --- |
| P0 | `research/coding-agent-underhood-ultraresearch.md` still framed `index.html` as product-comparison focused. | Replaced with implemented IA/status section and reading order. |
| P0 | `index.html` collapsed evidence type and confidence into one `Confidence` column. | Renamed to `Evidence status` and used labels such as `source-confirmed`, `runtime-confirmed`, `artifact-backed`, and `workflow replay pending`. |
| P0 | Gajae-Code runtime/provenance status was stale after local install. | Updated deep dive, runtime smoke evidence, cross-check notes, reconciliation facts, source atlas, and comparison table. |
| P1 | Preliminary cross-check clone SHAs needed a supersession note. | Added note pointing readers to the canonical source-level atlas. |
| P1 | Hermes deep dive had a stale next-probe item. | Reworded to maintain the existing version-boundary matrix and extend it only with sanitized traces. |
| P1 | Landing-page CTA should promote canonical evidence before UltraResearch. | Hero buttons now promote the source atlas and evaluation framework before the UltraResearch draft. |

## Rejected or deferred findings

- Splitting the long source atlas into per-agent pages is deferred until evaluation trace schema and benchmark tasks stabilize.
- Full Gajae workflow replay is not claimed from this review pass; it remains a next probe.
- Hermes gateway/cron/delegation runtime traces and non-`$ultraresearch` OmO replay remain future evidence tasks.

## Reporting rule reinforced

Use separate labels for:

- `source-confirmed`
- `docs-confirmed`
- `manifest-confirmed`
- `runtime-confirmed`
- `artifact-backed`
- `unverified` / `workflow replay pending`

Do not collapse these into a single confidence label, and do not treat agent review output as source proof.
