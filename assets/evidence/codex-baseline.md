# Codex Baseline Evidence

검증일: 2026-06-26 KST

## 로컬 관찰

- `codex --version` → `codex-cli 0.142.2`.
- `npm view @openai/codex` 관찰: version `0.142.2`, description `Codex CLI is a coding agent from OpenAI that runs locally on your computer.`, license `Apache-2.0`.

## 해석

Codex CLI는 이 비교의 base runtime이다. 즉, 자체적으로 agentic coding, sandbox/approval, MCP, plugin surface를 제공하고 실제 repo 변경/테스트/검증을 수행하는 계층으로 둔다.

## Caveat

- 공개 docs/release 최신성은 시간이 지나면 변한다.
- Codex 위에서 LazyCodex/OmO 같은 plugin/harness가 동작하므로, “Codex의 기능”과 “plugin이 추가한 discipline”을 분리해서 기록한다.
