# Chapter 07 — Caveats and next experiments

[← 평가 프레임워크](06-evaluation-framework.md) · [Evidence index →](../appendix/evidence-index.md)

## 아직 주장하지 않는 것

이 책은 다음을 아직 주장하지 않습니다.

- “어느 coding agent가 최고다.”
- “Gajae live team execution이 production-ready다.”
- “Hermes bridge runtime이 모든 GJC workflow를 안정적으로 수행한다.”
- “OmO manifest의 모든 hook/command가 실제 Codex runtime에서 callable이다.”
- “public issue corpus가 failure prevalence를 대표한다.”
- “benchmark score 하나가 실제 개발 품질을 대표한다.”

이 부정문은 방어적 문장이 아니라 품질 기준입니다. 아직 증명하지 않은 것을 말하지 않는 것이 source-level atlas의 신뢰도를 만듭니다.

## 남은 P0

| Gap | 왜 중요한가 | 필요한 evidence |
| --- | --- | --- |
| Gajae live team/tmux/worktree execution | `team --dry-run`은 state layout만 증명한다 | live worker process, tmux target, worktree path, task event, cleanup/recovery trace |
| Gajae recovery/session resume | durable state claim의 핵심이다 | interrupted run, resume command, ledger continuity, stale state handling |
| Hermes bridge runtime | persistent coordinator와 GJC control plane 연결 claim을 검증한다 | MCP/coordinator tool invocation, mutation boundary, artifact references |
| OmO runtime-callable surface | manifest와 실제 `$...` command를 분리한다 | per-command in-Codex replay, `.omo` trace/log, generated artifact |

## 남은 P1

| Gap | 필요한 산출물 |
| --- | --- |
| per-agent deep dive | Codex, Aider, SWE-agent, OpenHands, IDE 계열별 line-level source excerpt |
| benchmark source review | SWE-bench/Verified, Terminal-Bench, RepoBench-style retrieval, Aider/OpenHands/SWE-agent harness 정리 |
| task template | prompt, allowed tools, sandbox, expected verification, redaction rule |
| trace schema sample | sanitized JSONL/Markdown example |
| public issue/review sweep | failure taxonomy 확장; prevalence claim 금지 |

## 계속 유지할 caveat

Closed-source 제품의 internal context ranking, model routing, indexing은 공식 docs 밖이면 low confidence입니다. Local runtime observation은 local 환경에서의 관찰일 뿐 전체 제품 capability가 아닙니다. Agent-generated UltraResearch output은 초안이지 canonical source가 아닙니다. Public docs에는 API key, token, password, connection string, private local path, raw provider config를 넣지 않습니다.

## 다음 개정 방향

다음 품질 단계는 세 갈래입니다.

1. **Line-level source excerpt**: 현재 atlas는 source path map 중심입니다. 다음에는 high-risk paths에 대해 짧은 excerpt와 “왜 이 파일이 해당 axis를 증명하는가”를 추가해야 합니다.
2. **Runtime proof matrix**: Gajae, Hermes, OmO는 source와 runtime을 따로 표기해야 합니다. smoke, dry-run, live-run, recovery-run, bridge-run을 한 표에 놓고 evidence tier를 붙입니다.
3. **Evaluation kit**: benchmark pilot 전에 task template, trace schema, scoring sheet, redaction checker를 준비합니다.

## Publication quality checklist

| 항목 | 현재 상태 |
| --- | --- |
| 하위 chapter raw Markdown 노출 | 해결됨: generated HTML book pages |
| home → chapter link | `.html` book page로 연결 |
| evidence raw artifact 분리 | 유지: appendix에서 안내 |
| source-level claim label | 적용 중 |
| chapter density | 개선됨; per-agent deep dive는 다음 단계 |
| public-safe evidence | secret-like scan과 local path redaction 유지 |
| public deployment verification | Pages build + cache-busted fetch로 확인 |

## Stop conditions

다음 단계에서도 자동으로 앞으로만 가면 안 됩니다. live team 실행에서 artifact가 없거나, bridge mutation boundary가 불명확하거나, OmO command가 manifest에는 있지만 runtime trace를 남기지 못하면 그 단계는 실패로 기록하고 멈춰야 합니다. speculative patch로 claim을 맞추는 대신, 어떤 증거가 부족했는지 문서화하는 편이 이 atlas에는 더 가치 있습니다. 특히 user-facing report는 “실패했지만 왜 실패했는지 알 수 있음”과 “성공했다고 보이지만 증거가 없음”을 엄격히 구분해야 합니다.

## 닫는 말

이 문서는 “AI coding agent 비교표”가 아니라 “agent architecture atlas”입니다. 좋은 atlas는 모든 지명을 예쁘게 칠하는 것보다, 확인된 길과 아직 미답사인 길을 다르게 표시하는 데서 가치가 생깁니다. 다음 업데이트는 미답사 구간을 줄이되, 증명하지 않은 길을 이미 간 것처럼 표시하지 않는 방향으로 진행해야 합니다.
