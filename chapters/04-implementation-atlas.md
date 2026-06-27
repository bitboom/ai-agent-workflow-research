# Chapter 04 — 구현체별 읽기 지도

[← 공통 아키텍처](03-common-architecture.md) · [다음: Gajae · Hermes · OmO →](05-control-plane-triad.md)

## 이 장의 역할

이 장은 전체 atlas의 안내 지도입니다. 세부 source path는 [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)에 두고, 여기서는 각 agent를 어떤 질문으로 읽어야 하는지 정리합니다. 목적은 “모든 agent를 같은 표에 넣어 평점화”가 아니라, agent마다 가장 위험한 layer를 먼저 보는 것입니다.

## Agent별 초점

| Agent | 먼저 읽을 source axis | 좋은 질문 | 현재 confidence |
| --- | --- | --- | --- |
| OpenAI Codex | session/thread, context manager, tool router, sandbox, apply_patch | tool call이 어떤 router/handler/sandbox를 통과하는가 | source-confirmed |
| Aider | `Coder`, `RepoMap`, edit-format coder, linter/test integration | context compression과 edit format이 patch 품질에 어떻게 반영되는가 | source-confirmed |
| SWE-agent | agent `trajectory`, `SWEEnv`, `ToolHandler` | benchmark trace가 action parser와 environment를 충분히 노출하는가 | source-confirmed |
| Goose | Rust `Agent`, extension manager, permission store | MCP/extension tool과 permission routing이 어디서 분리되는가 | source-confirmed |
| Cline/Roo/Continue | IDE runtime, message builder, context/indexing, approval policy | editor state와 remote workspace routing이 hidden failure를 만들 수 있는가 | source-confirmed |
| OpenHands | SDK package `Agent.step`, event store, agent server routes | repo checkout과 package runtime source를 어떻게 구분할 것인가 | package-source-confirmed |
| Gajae-Code | `gjc-runtime`, commands, `.gjc` state | workflow source, command smoke, artifact replay가 어디까지 증명하는가 | source + basic runtime + artifact-backed |
| Hermes | conversation loop, tool executor, memory/context, trajectory, gateway | persistent runtime과 source clone version drift를 어떻게 분리하는가 | source + local runtime observation |
| LazyCodex/OmO | plugin/hook/manifest, Codex execution surface | manifest-declared surface와 `$...` runtime-callable proof가 일치하는가 | mixed; separate proof needed |

## 계열별 읽기 전략

CLI agent를 읽을 때는 shell과 git을 중심에 둡니다. Aider와 Codex는 local repo에서 test/lint/build를 직접 실행할 수 있다는 장점이 있지만, 그만큼 sandbox, approval, dangerous command handling, patch 실패 복구가 중요합니다. “모델이 코드를 이해했나”보다 “필요 파일을 어떻게 찾고, patch를 어떤 format으로 적용했나”를 먼저 봅니다.

IDE 계열은 context/indexing이 핵심입니다. Continue는 codebase indexer와 Redux thunk flow, Roo는 task loop와 context condense/checkpoint, Cline은 SDK/runtime orchestration과 tool approval을 읽어야 합니다. 이 계열의 failure는 종종 사용자가 보는 UI가 아니라 hidden state에서 발생합니다.

Runner 계열은 trace가 장점입니다. SWE-agent와 OpenHands는 benchmark/evaluation으로 읽기 좋지만, container/runtime setup, workspace cleanup, remote sandbox lifecycle 같은 운영 층이 품질을 좌우합니다. Agentless는 자율 loop가 없어도 staged localization/repair가 가능하다는 반례로 읽습니다.

Control-plane 계열은 더 조심해야 합니다. Gajae, Hermes, OmO는 “agent가 patch를 만들었다”보다 workflow, state, delegation, hook, bridge를 봐야 합니다. 여기에 toy task 하나를 던져 product ranking을 만들면 핵심을 놓칩니다.

## Confidence를 섞지 않는다

한 agent 안에서도 axis별 confidence가 다릅니다. Gajae-Code는 source runtime files와 command classes가 source-confirmed이고, `gjc/0.7.3` smoke와 controlled artifact replay가 확인됐습니다. 하지만 live `team` tmux/worktree execution, recovery, Hermes bridge는 pending입니다. Hermes는 source path와 local runtime version을 확인했지만, local runtime `0.12.0`과 source clone `0.17.0` drift를 구분해야 합니다. OmO는 installed/enabled observation이 있어도 `$...` workflows의 runtime-callable proof가 별도입니다.

## Public issue corpus의 역할

Public issue sweep은 prevalence를 말하지 않습니다. 대신 어떤 failure category가 실제 사용자 환경에서 나타나는지 알려줍니다. context retrieval mismatch, bad edit application, sandbox/approval friction, repeated loops, cost/token accounting, remote workspace assumptions는 architecture axis와 연결되는 diagnostic evidence입니다.

## Atlas를 읽을 때의 체크리스트

1. source path가 현재 SHA에 고정되어 있는가?
2. source path가 claim과 같은 responsibility layer를 가리키는가?
3. runtime proof가 source claim을 실제로 exercise했는가?
4. artifact가 public-safe summary로 남아 있는가?
5. caveat가 claim 바로 옆에 있는가?
6. issue corpus를 prevalence처럼 읽고 있지 않은가?

## 더 읽기

- [Source-level architecture atlas](../assets/evidence/source-level-architecture-atlas.md)
- [Reconciled facts](../assets/evidence/reconciled-facts.md)
- [Coding agent source map archive](../research/coding-agent-source-map.md)
