# Coding Agent Under-the-Hood Cross-check Notes

작성일: 2026-06-26 KST

Status note: this is a preliminary controller cross-check from 2026-06-26. For canonical SHA-pinned source inputs, use `assets/evidence/source-level-architecture-atlas.md`. Clone HEADs listed here are historical orientation evidence, not the current source atlas. Later Gajae-Code basic runtime smoke evidence is recorded in `assets/evidence/gajae-code-runtime-smoke.md`.

이 파일은 LazyCodex/OmO UltraResearch 결과를 controller가 별도 확인한 내용만 요약한다. 민감정보 값은 기록하지 않았다.

## LazyCodex / OmO 실행

- `npx -y lazycodex-ai@latest install --no-tui --codex-autonomous` 실행 완료.
- 관찰 버전: `lazycodex-ai 4.13.0`, `codex-cli 0.142.2`.
- OmO plugin wiring은 `~/.codex/config.toml`의 `omo@sisyphuslabs` block과 plugin cache path로 확인했다.
- UltraResearch run은 Codex exec + OmO hooks로 실행되었고 exit code 0으로 종료했다.
- 생성된 요청 산출물:
  - `research/coding-agent-underhood-ultraresearch.md`
  - `research/coding-agent-taxonomy.md`
  - `research/coding-agent-source-map.md`
  - `research/coding-agent-open-questions.md`

## Controller 교차검증

- Agentless arXiv ID를 UltraResearch draft의 잘못된 `2407.01494`에서 실제 Agentless paper `2407.01489`로 수정했다.
- `https://arxiv.org/abs/2407.01489`는 Agentless title로 HTTP 200 확인했다.
- `https://arxiv.org/abs/2407.01494`는 Agentless가 아니라 FoleyCrafter paper임을 확인했다.
- SWE-agent repo reference는 현재 확인한 GitHub owner `SWE-agent/SWE-agent`로 정리했다.
- 다음 paper URLs는 HTTP 200/title 확인으로 존재를 확인했다:
  - `2407.01489` Agentless
  - `2512.20334` Comment Traps
  - `2604.06373` Beyond Functional Correctness
  - `2512.18925` Beyond the Prompt: empirical study of Cursor Rules

## Source clone orientation

Controller는 shallow source clones를 `/tmp/coding-agent-src`에 생성해 top-level structure와 architecture keywords를 빠르게 확인했다.

주요 clones:

- `openai/codex` HEAD observed: `6d2168f06ae275d5e1f73cabf935d2bcc8549998`
- `anthropics/claude-code` HEAD observed: `f0919a1a7277bf0a1d39374a49dfa0065247f72e`
- `Aider-AI/aider` HEAD observed: `5dc9490bb35f9729ef2c95d00a19ccd30c26339c`
- `All-Hands-AI/OpenHands` HEAD observed: `4d9e7af514fd321c1e3ffcdc490f6262ecd52033`
- `SWE-agent/SWE-agent` HEAD observed: `abd7d69724d1413b30fea43d4724bb5b463906b4`
- `cline/cline` HEAD observed: `38134ef9678abc349b17a0d37b14a849635c7708`
- `RooCodeInc/Roo-Code` HEAD observed: `b867ec9145750d0ae1ff7f02d35406e9bf2a0b16`
- `continuedev/continue` HEAD observed: `d0a3c0b626b5bebc3bef4742eec05a0242be0bab`
- `aaif-goose/goose` HEAD observed: `59b28e455f416ca0de484215d15549742e207ccd`
- `code-yeongyu/lazycodex` HEAD observed: `d4c4f05d424451bdd917cfa3416dbab3ff973c95`
- `Yeachan-Heo/gajae-code` HEAD observed: `569a7696a8d22ffbcddbeab861951f244e1aed12`
- `NousResearch/hermes-agent` HEAD observed: `ca82d0accc3689ef7ffc9041acbaaa9d3869ad9d`

## Caveats

- Public review corpus는 이번 pass에서 깊게 수집하지 못했다. 따라서 product별 후기/장단점 prevalence는 낮거나 중간 confidence로 남긴다.
- Closed-source 제품의 internal context ranking/model routing/indexing은 first-party docs로 공개된 surface와 실제 내부 구현을 분리해야 한다.
- OmO manifest declaration은 runtime-callable proof와 다르다. manifest와 실제 Codex tool surface 비교는 다음 단계다.
- Gajae-Code는 public repo/npm/source 근거가 있고, 후속 pass에서 `gjc` basic smoke는 통과했다. 다만 full workflow/session artifact replay는 아직 통과 근거가 없다.
