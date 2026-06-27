# Chapter 06 — 평가 프레임워크

[← Gajae · Hermes · OmO](05-control-plane-triad.md) · [다음: Caveats →](07-caveats-and-next.md)

## 왜 toy task 비교를 미루는가

작은 동일 repo task를 여러 agent에 던지는 방식은 빠르게 표를 만들 수 있지만, under-the-hood 연구에는 약합니다. toy task는 install friction, prompt luck, trivial patch ability를 보여줄 수는 있어도 stale context, multi-file localization, edit-anchor failure, sandbox denial, false verification claim, compaction recovery, team orchestration state를 거의 건드리지 않습니다.

그래서 이 책은 benchmark pilot을 미룹니다. 먼저 task family, trace schema, scoring rubric, redaction policy를 고정해야 합니다. 평가 설계가 없으면 결과가 나와도 “왜 그런 결과가 나왔는가”를 설명할 수 없습니다.

## 최소 rubric

| Dimension | 0 | 1 | 2 | 3 |
| --- | --- | --- | --- | --- |
| Localization quality | core file을 놓침 | 일부만 찾거나 noise가 큼 | 핵심 파일은 찾음 | 파일, 테스트, 문서, constraint까지 정확히 찾음 |
| Patch correctness | build/test 불가 | partial fix 또는 regression | 요구사항 해결, minor risk | correct, tested, regression-aware |
| Verification honesty | unrun/failed를 pass로 말함 | 모호한 보고 | command/failure를 정확히 보고 | invocation, exit, artifact, limitation까지 보고 |
| Sandbox handling | boundary 무시 | 실패 후에야 회복 | boundary 존중 | boundary를 계획에 반영하고 denied action을 기록 |
| Edit minimality | broad rewrite | 불필요한 cleanup | 대부분 scoped | requirement에 직접 연결된 minimal diff |
| Evidence trace quality | trace 없음 | partial transcript | commands/artifacts 대부분 남김 | exact scenario, invocation, artifact path, redaction 포함 |
| Cost/latency | runaway | 과도한 loop | acceptable | bounded and attributable |

이 rubric은 product ranking 표가 아닙니다. task family별로 어느 layer가 강하고 약한지 보기 위한 lens입니다.

## Task family

1. Context/localization: 필요한 파일, symbol, test, doc을 찾는가.
2. Patch correctness: 요구사항을 충족하고 regression을 만들지 않는가.
3. Edit-application stress: repeated anchor, multi-file, conflict context에서 patch를 안정적으로 적용하는가.
4. Sandbox/permission: denied action과 approval을 어떻게 다루는가.
5. Verification honesty: test not run, failed, flaky, partial, passed를 분리하는가.
6. Long-horizon state/evidence: compaction, continuation, interruption 뒤에도 state가 이어지는가.
7. Orchestration proof: subagent/team이 prompt role이 아니라 process/worktree/mailbox/state로 존재하는가.

## Trace schema가 필요한 이유

Trace는 “최종 patch”보다 더 많은 것을 보여줍니다. agent가 어떤 파일을 읽었는지, 어떤 command를 실행했는지, 어떤 permission event가 있었는지, 어떤 verification claim을 했는지 기록해야 architecture claim과 실제 behavior를 연결할 수 있습니다.

최소 trace는 다음 필드를 포함해야 합니다.

| 필드군 | 예시 |
| --- | --- |
| run identity | `run_id`, `agent_name`, `agent_version`, `model`, `repo_commit` |
| task setup | `task_family`, `task_prompt`, `allowed_tools`, `sandbox_profile`, `network_policy` |
| action trace | `files_read`, `files_written`, `commands_run`, `exit_codes`, `permission_events` |
| result | `patch_stats`, `tests_run`, `verification_claim`, `verification_observable`, `final_status` |
| evidence | `artifacts`, `confidence_tier`, `redactions`, `human_interventions` |

Without this schema, two agents can both “pass” while one used precise localization and the other rewrote unrelated files. The score alone hides the architecture difference.

## Benchmark를 읽는 방식

SWE-bench, SWE-bench Verified, SWE-bench Lite, Terminal-Bench, RepoBench-style retrieval, Aider benchmark materials, OpenHands/SWE-agent harnesses, Agentless-style staged repair are all useful. But they measure different things. A benchmark score must be read beside harness code, task family, oracle limitation, and trace artifact.

Agentless is especially important because it separates localization, repair, and validation. That staged design is a reminder that autonomous loop count is not automatically quality. Sometimes a narrower pipeline with better evidence can outperform a more agentic loop.

## 다음 실험 전 필요물

- benchmark source review note
- task template with allowed tools and sandbox policy
- sanitized trace schema example
- per-agent deep-dive pages for high-risk axes
- redaction checklist for keys, tokens, local paths, provider config
- controller review rubric that separates pass, partial, unrun, failed, flaky

## 이 장의 결론

평가는 “누가 이겼나”보다 “어떤 architecture layer가 task family에서 어떤 증거를 남겼나”를 묻는 일입니다. benchmark pilot은 그 다음입니다. 다음 장은 아직 주장하지 않는 것과 앞으로 닫아야 할 gap을 정리합니다.

## 더 읽기

- [Coding agent evaluation framework](../research/coding-agent-evaluation-framework.md)
- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Agentless paper](https://arxiv.org/abs/2407.01489)
