# AI Agent Workflow Research

GitHub Pages용 정적 HTML 리서치 리포트입니다.

- Site: `index.html`
- Evidence: `assets/evidence/*.md`
- No framework / no build step required
- 로컬 검증: `python3 -m http.server 8124` 후 브라우저 확인

## Scope

Gajae-Code, Hermes Agent, LazyCodex/OmO, OpenAI Codex를 “기능 목록”이 아니라 **agent workflow/control layer** 관점에서 비교합니다.

## GitHub Pages

이 repo는 branch deploy 기준으로 동작합니다.

- Branch: `main`
- Path: `/`
- `.nojekyll` 포함

## Evidence policy

- 로컬 관찰과 공개 출처를 분리합니다.
- API key, token, credential, connection string은 커밋하지 않습니다.
- agent output이 public source와 충돌하면 controller cross-check 결과를 우선합니다.
