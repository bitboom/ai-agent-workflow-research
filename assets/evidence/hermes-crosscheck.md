# Hermes Agent Cross-check

검증일: 2026-06-26 KST

## 로컬 관찰

- `hermes --version`: `Hermes Agent v0.12.0 (2026.4.30)`.
- Project: `~/.hermes/hermes-agent`.
- Provider: OpenAI Codex / model `gpt-5.5`로 표시됨.
- Gateway service: running.
- Messaging platforms: Telegram, Discord configured.
- API key/provider detail은 public report에 기록하지 않는다.

## 공개 출처/문서 기반 기능

Hermes Agent README와 docs는 다음 표면을 설명한다.

- Persistent memory and user profile.
- Skills system with progressive disclosure and `~/.hermes/skills/` source of truth.
- Messaging gateway: Telegram, Discord, Slack, WhatsApp 등 platform adapter.
- Cron scheduling with origin/platform/local delivery.
- Delegation/subagents and toolsets.
- MCP integration.

## Control-layer 해석

Hermes는 Codex wrapper라기보다 **persistent coordinator/runtime**으로 보는 것이 정확하다.

- 사용자와 대화하는 채널을 유지한다.
- 장기 기억과 skill을 누적한다.
- cron/background/delegation으로 장기 작업을 오케스트레이션한다.
- 필요하면 Codex, Gajae-Code, browser, terminal 등 실행 표면을 조율한다.

## Caveat

- 로컬 Hermes는 `hermes update` 가능 상태였다. 즉, docs 최신 기능과 local installed version 사이에 차이가 있을 수 있다.
- provider/API key 상태는 민감정보가 섞일 수 있어 근거 파일에 세부값을 남기지 않는다.
