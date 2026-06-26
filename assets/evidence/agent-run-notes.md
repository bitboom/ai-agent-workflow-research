# Agent Run Notes

검증일: 2026-06-26 KST

## 실행 방식

사용자 요청에 따라 Codex/LazyCodex가 설치된 Codex agent를 별도 background process로 실행해 리서치를 맡겼다.

- Command 형태: `codex -a never exec -C ~/code/ai-agent-workflow-research ... < research-prompt.md`
- LazyCodex/OmO hook이 활성화된 상태에서 실행됨.
- agent는 `research/agent-report.md`, `assets/evidence/source-index.md`, `assets/evidence/lazycodex-local.md`, `.omo/ultraresearch/...` 초안을 생성했다.
- process는 사용자가 보낸 새 메시지 이후 controller가 종료해 exit code `-15`로 끝났다. 종료 전 주요 markdown evidence는 생성되어 있었다.

## 중요한 한계

- Agent output은 self-report이므로 controller가 별도 확인했다.
- Agent report는 Gajae-Code/gjc public source를 찾지 못했다고 기록했지만, controller cross-check에서 public repo/npm/docs를 확인했다. 최종 사이트는 controller reconciliation을 우선한다.
- `.omo/`와 `.omx/` 내부 상태/log는 public GitHub Pages root에 배포하지 않는다.

## 최종 사용 원칙

- Agent가 수집한 LazyCodex local evidence는 참고하되, public report에는 검증된 요약과 별도 cross-check만 반영한다.
- 충돌한 주장은 `assets/evidence/reconciled-facts.md`에 판정 근거를 남긴다.
