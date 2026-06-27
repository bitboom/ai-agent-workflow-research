# Chapter 06 — 평가 프레임워크

[이전: Control plane triad](05-control-plane-triad.md) · [목차](README.md) · [다음: 남은 질문](07-caveats-and-next.md)

## 왜 toy task 비교를 미루는가

동일한 작은 repo task를 여러 agent에 던지는 실험은 보기 쉽지만, trace schema와 rubric 없이 하면 “느낌 비교”가 됩니다. 이 프로젝트는 먼저 평가 기준을 고정합니다.

## 최소 rubric

| 축 | 질문 |
| --- | --- |
| Task success | 요구사항을 실제로 만족했는가? |
| Context localization | 필요한 파일과 문서를 찾아 읽었는가? |
| Edit minimality | 불필요한 rewrite나 scope creep이 없었는가? |
| Tool trajectory | shell/tool/approval boundary를 지켰는가? |
| Verification honesty | 실행한 테스트와 실패를 정직하게 보고했는가? |
| Reproducibility | trace와 artifact로 재현 가능한가? |

## 다음 실험 전 필요물

1. benchmark task template
2. trace schema example
3. scoring rubric
4. failure taxonomy
5. public-safe artifact policy

## 더 읽기

- [Evaluation framework](../research/coding-agent-evaluation-framework.md)
- [Open questions](../research/coding-agent-open-questions.md)
