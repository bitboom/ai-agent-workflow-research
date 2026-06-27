# Chapter 03 — 공통 아키텍처

[← Agent 분류](02-agent-taxonomy.md) · [다음: 구현체별 읽기 지도 →](04-implementation-atlas.md)

## 여덟 개 층

제품 UI는 다르지만 source-level로 내려가면 반복되는 축이 있습니다. 이 책은 coding agent를 다음 여덟 층으로 읽습니다.

| 층 | 책임 | 실패하면 생기는 일 |
| --- | --- | --- |
| Model client / router | provider, streaming, retry, token budget, model selection | routing drift, latency/cost 폭증, 잘못된 capability 선택 |
| Prompt / context assembly | system rule, repo files, memory, tool output, failing test log 선택 | 핵심 파일 누락, stale instruction, context stuffing |
| Repo index / code graph | lexical search, AST/LSP, vector index, repo map | 관련 symbol 미발견, 오래된 index, remote workspace mismatch |
| Planning / tool loop | plan 생성, action 선택, observation 반영, stop condition | 반복 loop, premature final, task decomposition 실패 |
| Edit / execution | patch, search/replace, whole-file rewrite, shell/browser/MCP tool 실행 | malformed diff, broad rewrite, unsafe command |
| Sandbox / approval | filesystem/network/shell 권한, human approval, enterprise policy | approval bypass, denied action recovery 실패, cleanup 누락 |
| Verification / evidence | test/lint/build/benchmark/reviewer/evidence ledger | unrun test를 pass로 주장, flaky/partial 결과 은폐 |
| Memory / durable state | session, checkpoint, skill, long-term memory, workflow artifact | compaction 후 맥락 상실, resume/recovery 실패 |

## 읽는 요령

한 agent가 실패했을 때 바로 모델 탓으로 돌리지 않습니다. 먼저 어느 층에서 실패했는지 분리합니다. 예를 들어 patch가 적용되지 않았다면 model reasoning 문제일 수도 있지만, edit format, anchor selection, handler routing, file protection, approval policy 문제일 수도 있습니다.

Source atlas는 이 분리를 실제 파일 경로로 연결합니다. Codex는 `codex-rs/core/src/tools/router.rs`, `handlers/apply_patch.rs`, `sandboxing` 계열을 분리해서 볼 수 있고, Aider는 `base_coder.py`, `repomap.py`, edit-format coder들이 핵심입니다. SWE-agent는 `agents.py`, `swe_env.py`, `ToolHandler`, trajectory가 evaluation-friendly 구조를 만듭니다. Roo와 Continue는 IDE extension state, context management, tool policy, remote terminal routing을 봐야 합니다.

## UI보다 내부 경로를 먼저 본다

겉으로 같은 “파일 수정”이라도 내부 경로는 다릅니다.

| 사용자 행동 | 내부적으로 확인할 질문 |
| --- | --- |
| “이 버그 고쳐줘” | issue text가 어떤 prompt/context로 변환됐는가 |
| “파일을 수정했다” | patch handler인가, whole-file rewrite인가, editor diff provider인가 |
| “테스트했다” | 정확히 어떤 command, exit code, environment였는가 |
| “팀이 작업했다” | 실제 worker process, worktree, mailbox, ledger가 있는가 |
| “MCP를 지원한다” | manifest 선언인가, 실제 runtime-callable tool인가 |

이 차이를 기록해야 architecture atlas가 됩니다. 단순 기능표는 “테스트 지원 O”라고 적지만, source-level atlas는 test command가 어디서 실행되고, 실패 결과가 다음 turn context에 어떻게 들어가는지 묻습니다.

## Evidence layer와 architecture layer를 섞지 않는다

공통 아키텍처의 각 층은 서로 다른 evidence를 요구합니다. Source path는 구현 존재를 말하고, runtime smoke는 command 실행을 말하고, artifact replay는 state layout과 durable behavior를 말합니다. 세 가지는 모두 중요하지만 서로 대체할 수 없습니다.

Gajae-Code 예시가 이를 잘 보여줍니다. source에는 `ultragoal-runtime.ts`, `ralplan-runtime.ts`, `team-runtime.ts`가 있습니다. runtime smoke는 `gjc/0.7.3` command가 실행됨을 보여줍니다. workflow replay는 `.gjc/_session-*` 아래 specs, plans, ultragoal ledger, team dry-run state가 생성됨을 보여줍니다. 그러나 이 셋을 모두 합쳐도 live team recovery나 Hermes bridge behavior를 자동으로 증명하지는 않습니다.

## 이 장의 결론

좋은 agent 분석은 하나의 box diagram으로 끝나지 않습니다. 각 layer가 어떤 source path에 있고, 어떤 runtime proof가 있으며, 어떤 artifact가 남고, 어떤 failure mode를 갖는지 이어서 읽어야 합니다. 다음 장에서는 이 여덟 층을 각 구현체에 적용하는 읽기 지도를 만듭니다.

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Public failure-pattern corpus draft](../assets/evidence/source-level-architecture-atlas.md#public-failure-pattern-corpus-draft)
- [Evaluation framework](../research/coding-agent-evaluation-framework.md)
