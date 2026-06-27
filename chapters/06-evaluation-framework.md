# Chapter 06 — 평가 프레임워크

[이전: Control plane triad](05-control-plane-triad.html) · [목차](index.html) · [다음: 남은 질문](07-caveats-and-next.html)

## 왜 toy task 비교를 미루는가

동일한 작은 repo task를 여러 agent에 던지는 실험은 보기 쉽습니다. 하지만 trace schema와 rubric 없이 실행하면 “느낌 비교”가 됩니다. 어떤 agent가 더 빠르게 보였는지, 어느 로그가 더 그럴듯했는지, 누가 더 긴 답변을 했는지 같은 인상은 source-level architecture 연구의 기준이 되기 어렵습니다.

이 프로젝트는 먼저 평가 기준을 고정합니다. task success는 중요하지만 그것만으로는 부족합니다. agent가 필요한 파일을 찾았는지, 어떤 tool을 호출했는지, 불필요한 rewrite를 피했는지, test failure를 숨기지 않았는지, 결과를 재현할 trace가 남는지 함께 봐야 합니다.

## 최소 rubric

| 축 | 질문 | 관찰 방법 |
| --- | --- | --- |
| Task success | 요구사항을 실제로 만족했는가? | tests, manual acceptance, semantic review |
| Context localization | 필요한 파일과 문서를 찾아 읽었는가? | read/search trajectory, referenced paths |
| Edit minimality | 불필요한 rewrite나 scope creep이 없었는가? | git diff size, touched file set |
| Tool trajectory | shell/tool/approval boundary를 지켰는가? | command log, sandbox/approval trace |
| Verification honesty | 실행한 테스트와 실패를 정직하게 보고했는가? | test output, failure disclosure, caveat |
| Reproducibility | trace와 artifact로 재현 가능한가? | saved logs, state, generated artifacts |

## benchmark를 읽는 방식

SWE-bench, Terminal-Bench, RepoBench, Aider benchmark, OpenHands/SWE-agent harness는 모두 유용하지만, 한 숫자가 제품 전체를 설명하지 않습니다. benchmark는 task format, allowed tools, oracle, contamination risk, environment control, retry policy를 함께 봐야 합니다. 특히 agent control plane 연구에서는 benchmark score보다 trajectory와 recovery behavior가 더 중요할 수 있습니다.

## trace schema가 필요한 이유

agent run을 비교하려면 최소한 다음이 남아야 합니다. task description, repo state, allowed tools, model/provider, context selection, actions, observations, edits, verification commands, final diff, final report, failure/caveat. 이 정보가 없으면 같은 결과를 만들어도 원인을 비교할 수 없습니다.

## 다음 실험 전 필요물

1. benchmark task template
2. trace schema example
3. per-agent run wrapper
4. secret-safe log scrubber
5. controller review rubric

## 이 장의 결론

좋은 benchmark pilot은 agent를 많이 돌리는 것이 아니라, 같은 질문으로 비교 가능한 trace를 남기는 것입니다. 따라서 다음 작업은 더 많은 demo가 아니라 작은 수의 curated task와 강한 evidence discipline입니다.

## 더 읽기

- [Evaluation framework](../research/coding-agent-evaluation-framework.md)
- [Agent orchestration comparison](../assets/evidence/agent-orchestration-comparison.md)
