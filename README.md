# AI Coding Agent Under-the-Hood Research

GitHub Pages용 정적 HTML 리서치 리포트입니다.

- Site: `index.html`
- Main report: `research/coding-agent-underhood-ultraresearch.md`
- Taxonomy: `research/coding-agent-taxonomy.md`
- Source map: `research/coding-agent-source-map.md`
- Evaluation framework: `research/coding-agent-evaluation-framework.md`
- Open questions: `research/coding-agent-open-questions.md`
- Gajae-Code deep dive: `research/deep-dive-gajae-code.md`
- Hermes Agent deep dive: `research/deep-dive-hermes-agent.md`
- LazyCodex/OmO deep dive: `research/deep-dive-lazycodex-omo.md`
- Agent orchestration comparison: `assets/evidence/agent-orchestration-comparison.md`
- Evidence: `assets/evidence/*.md`
- No framework / no build step required

## Purpose

이 프로젝트의 주 목적은 특정 제품을 단순 비교하는 것이 아니라, **coding agent들이 어떤 종류가 있고, 공통적으로 어떻게 동작하며, 각 구현체가 under the hood에서 어떤 구성요소와 제어 계층을 갖는지 코드·문서·논문·실제 후기 기반으로 깊게 분석하는 것**입니다.

핵심 질문:

1. agent loop는 어디에 있는가 — IDE, CLI, server, runtime, plugin, persistent coordinator?
2. repo context는 어떻게 수집·압축·갱신되는가?
3. plan은 어떻게 만들어지고 수정되는가?
4. tool permissions와 sandbox는 어디서 통제되는가?
5. edits는 어떻게 생성·적용·검증되는가?
6. 실패했을 때 state/evidence는 남는가?
7. multi-agent/subagent는 실제 orchestration인가 prompt convention인가?
8. benchmark 성능과 실제 개발 경험이 어긋나는 지점은 무엇인가?

## Method

- LazyCodex/OmO `$ultraresearch`로 deep research corpus 생성
- Controller가 official docs/source, local evidence, paper IDs, source clones를 교차검증
- Benchmark/evaluation framework를 먼저 세워 runtime trace pilot을 해석 가능한 evidence로 제한
- claim별 confidence를 high/medium/low로 분리
- API key, token, credential, connection string은 커밋하지 않음

## GitHub Pages

이 repo는 branch deploy 기준으로 동작합니다.

- Branch: `main`
- Path: `/`
- `.nojekyll` 포함

## Local verification

```bash
npm test
python3 -m http.server 8124
```

## Evidence policy

- 로컬 관찰과 공개 출처를 분리합니다.
- API key, token, credential, connection string은 커밋하지 않습니다.
- agent output이 public source와 충돌하면 controller cross-check 결과를 우선합니다.
