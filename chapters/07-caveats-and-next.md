# Chapter 07 — 남은 질문과 다음 실험

[이전: 평가 프레임워크](06-evaluation-framework.html) · [목차](index.html) · [Evidence index](../appendix/evidence-index.html)

## 아직 주장하지 않는 것

이 책은 polished landing page가 아니라 evidence-bound research book이어야 합니다. 따라서 확인하지 않은 내용을 marketing copy로 승격하지 않습니다. 특히 Gajae-Code, Hermes Agent, LazyCodex/OmO는 control plane으로 흥미롭지만, 각자 남은 runtime proof가 다릅니다.

## 남은 P0

1. **Gajae live team replay** — dry-run이 아니라 실제 tmux/worktree worker, orphan cleanup, heartbeat/recovery 확인.
2. **Hermes runtime/source drift** — installed `0.12.0`과 source `0.17.0`의 feature/file-level 차이 정리.
3. **OmO runtime-callable matrix** — `$ulw-loop`, `$review-work`, `$init-deep` 등 non-ultraresearch workflow replay.

이 세 항목은 claim의 강도를 바꿀 수 있기 때문에 우선순위가 높습니다. 특히 live orchestration과 recovery는 control plane의 핵심이므로 source만 읽어서는 충분하지 않습니다.

## 남은 P1

- benchmark source review note
- task template + trace schema
- public issue/review sweep v2
- 5–10개 curated benchmark task pilot

P1의 목적은 agent를 많이 돌리는 것이 아니라 비교 가능한 evidence corpus를 만드는 것입니다. public issue/review sweep도 prevalence claim을 만들기 위한 것이 아니라 failure taxonomy를 풍부하게 하기 위한 것입니다.

## 계속 유지할 caveat

- UltraResearch는 canonical source가 아닙니다.
- closed-source internal routing/indexing은 공식 문서 밖이면 low confidence입니다.
- public issue corpus는 prevalence proof가 아니라 taxonomy evidence입니다.
- raw `.omo`, `.gjc`, provider config, local logs는 public Pages에 올리지 않습니다.
- local runtime observation은 모든 workflow command가 production-ready임을 보장하지 않습니다.

## 다음 개정 방향

다음 개정은 두 갈래입니다. 첫째, 이 책의 UX를 더 책답게 만들기 위해 모든 chapter와 appendix를 HTML book page로 렌더링하고, raw Markdown은 source file로 남깁니다. 둘째, evidence를 더 강하게 만들기 위해 Gajae live team, Hermes trace, OmO workflow replay를 순서대로 추가합니다.

## 닫는 말

agent architecture atlas의 가치는 “모든 agent를 한 번에 정답처럼 설명하는 것”이 아니라, claim의 근거 수준을 계속 업데이트할 수 있는 구조에 있습니다. 이 책은 그 구조를 유지하면서 새 runtime proof가 생길 때마다 판정을 바꾸는 방식으로 발전해야 합니다.
