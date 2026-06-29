# AI Agent Workflow Research

GitHub Pages용 한국어 리서치 북.

- Site: https://bitboom.github.io/ai-agent-workflow-research/
- Book contents: `chapters/index.html` generated from `chapters/README.md`
- Evidence index: `appendix/evidence-index.html` generated from `appendix/evidence-index.md`
- Canonical comparison evidence: `assets/evidence/agent-orchestration-comparison.md`

## Purpose

이 프로젝트는 일반 AI coding agent 제품 비교가 아니라, **Coding Agent가 Workflow Control Plane / Workflow Orchestrator로 진화하는 방식**을 분석한다.

중심 대상은 다음 세 시스템이다.

| 시스템 | 분류 |
| --- | --- |
| Gajae-Code | Repo-local Workflow Orchestrator / standalone coding-agent control plane |
| Hermes Agent | Persistent Agent Runtime / Meta-Orchestrator |
| LazyCodex / OmO | Codex-embedded Workflow Harness / Control Overlay |

Codex, Aider, SWE-agent, OpenHands, Cline, Roo, Continue 등은 배경 비교군으로 유지한다. 본문은 Gajae-Code, Hermes Agent, LazyCodex/OmO의 deep dive와 세 시스템이 보여주는 coding-agent evolution에 집중한다.

## Reading order

1. `chapters/01-research-question.html` — 중심 질문
2. `chapters/02-agent-taxonomy.html` — AI Agent / Harness / Workflow Orchestrator 구분
3. `chapters/03-common-architecture.html` — Gajae-Code deep dive
4. `chapters/04-implementation-atlas.html` — Hermes Agent deep dive
5. `chapters/05-control-plane-triad.html` — LazyCodex / OmO deep dive
6. `chapters/06-evaluation-framework.html` — 세 orchestrator 비교와 발전 방향
7. `chapters/07-caveats-and-next.html` — 다음 검증
8. `appendix/evidence-index.html` — evidence index

Source Markdown remains next to the generated HTML so the book pages can be regenerated and reviewed in GitHub diffs.

## Evidence policy

- UltraResearch and agent-generated notes are draft/hypothesis only.
- Canonical claims require source paths, official docs, runtime output, durable artifacts, or controller cross-check.
- Evidence labels are kept separate: `source-confirmed`, `runtime-confirmed`, `artifact-backed`, `manifest-confirmed`, `unverified`.
- Raw `.omo/`, `.gjc/`, local logs, provider config, API keys, tokens, credentials, and connection strings are not published.

## Build generated book pages

```bash
npm run build
```

## Local verification

```bash
npm run build
npm test
git diff --check
python3 -m http.server 8124
```
