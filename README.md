# AI Coding Agent 구조 해부

GitHub Pages용 한국어 리서치 북입니다.

- Site: https://bitboom.github.io/ai-agent-workflow-research/
- Book contents: `chapters/README.md`
- Evidence index: `appendix/evidence-index.md`
- Canonical source atlas: `assets/evidence/source-level-architecture-atlas.md`

## Purpose

이 프로젝트는 coding agent를 제품 기능표로 비교하지 않고, agent loop, context assembly, tool boundary, sandbox/approval, verification, state, orchestration 구조로 읽는 문서형 연구입니다.

## Reading order

1. `chapters/01-research-question.md`
2. `chapters/02-agent-taxonomy.md`
3. `chapters/03-common-architecture.md`
4. `chapters/04-implementation-atlas.md`
5. `chapters/05-control-plane-triad.md`
6. `chapters/06-evaluation-framework.md`
7. `chapters/07-caveats-and-next.md`
8. `appendix/evidence-index.md`

## Evidence policy

- UltraResearch and agent-generated notes are draft/hypothesis only.
- Canonical claims require source paths, official docs, runtime output, durable artifacts, or controller cross-check.
- Raw `.omo/`, `.gjc/`, local logs, provider config, API keys, tokens, credentials, and connection strings are not published.

## Local verification

```bash
npm test
git diff --check
python3 -m http.server 8124
```
