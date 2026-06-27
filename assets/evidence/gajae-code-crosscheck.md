# Gajae-Code / gjc Cross-check

검증일: 2026-06-26 KST

## 로컬/공개 검증 사실

- 2026-06-26 기준 로컬 PATH에서는 `gjc` command가 확인되지 않았다. 2026-06-27 후속 pass에서 Bun/global package install 후 `gjc --version`, `gjc --help`, `gjc --smoke-test`, non-interactive print smoke가 exit 0으로 통과했다. 단, Hermes MCP 도구 표면에는 기존 `gjc_coordinator_*` 세션 도구가 노출되어 있었고, 과거 Atock용 GJC coordinator session이 존재했다.
- npm `gajae-code`: version `0.7.3`, description `One-line npm install wrapper for the Gajae-Code gjc CLI`, repository `gajae-ai/gajae-code`, license `MIT`.
- GitHub `Yeachan-Heo/gajae-code`: public, MIT, default branch `main`, README와 docs 확인.
- clone HEAD: `569a7696a8d22ffbcddbeab861951f244e1aed12`.

## 공개 README 기준 핵심 설명

`README.md`는 Gajae-Code를 다음처럼 설명한다.

- “A focused coding-agent runner for interviews, reviewed plans, tmux-native execution, and durable verification.”
- experimental/beta-stage라 중요한 작업에는 output 검증이 필요하다고 명시.
- 외부 coding-agent harness이며, Codex/Claude/OpenCode의 hidden plugin이 아니라 선택한 repo/worktree에서 별도로 실행한다.
- public workflow surface:
  - `deep-interview -> ralplan -> ultragoal`
  - parallel tmux workers가 유용할 때 optional `team`
- 설치: `bun install -g gajae-code`
- quick start:
  - `gjc`
  - `gjc --tmux`
  - `gjc --tmux --worktree my-task-branch`
- workflow skills:
  - `deep-interview`: 요구사항 ambiguity를 줄임
  - `ralplan`: mutation 전 계획/비평/승인
  - `ultragoal`: goals/revisions/checks/evidence 추적
  - `team`: tmux-backed workers 병렬 조율
- bundled role agents:
  - `executor`, `architect`, `planner`, `critic`

## Coordinator MCP bridge 근거

`docs/hermes-mcp-bridge.md` 확인 내용:

- outward MCP bridge command: `gjc mcp-serve coordinator`
- `gjc mcp-serve hermes`는 compatibility alias.
- bridge는 terminal scrollback scraping 없이 외부 coordinator가 session/list/start/queue/read tail/artifacts/questions/reports를 다루도록 설계.
- `gjc setup hermes`는 Hermes-compatible MCP config를 render/install한다.
- safety model:
  - read-only and fail-closed by default
  - `GJC_COORDINATOR_MCP_WORKDIR_ROOTS` root allowlist 필요
  - mutations는 startup opt-in `GJC_COORDINATOR_MCP_MUTATIONS`와 per-call `allow_mutation: true` 모두 필요
- tool surface:
  - read tools: `list_sessions`, `read_status`, `read_tail`, `list_questions`, `read_artifact`, `read_turn`, `await_turn`, `watch_events` 등
  - mutating tools: `start_session`, `send_prompt`, `submit_question_answer`, `report_status`, `gjc_delegate_plan`, `gjc_delegate_execute`, `gjc_delegate_team`
- `gjc_delegate_*`는 `/skill:ralplan`, `/skill:ultragoal`, `/skill:team` 전체 workflow delegation용 high-level tool.

## Control-layer 해석

Gajae-Code는 **독립 runner/control surface**로 보는 것이 맞다.

- Codex/Claude/OpenCode 안쪽 plugin이 아니라, repo/worktree에서 별도로 agent runtime을 띄운다.
- 강점은 planning/interview/execution/evidence를 GJC workflow로 강제하고 tmux/worktree/team으로 장기/병렬 작업을 관리하는 것.
- Hermes와 결합하면 Hermes는 coordinator, GJC는 coding workflow executor 역할로 분리할 수 있다.

## 강점

- workflow가 작고 명확하다: `deep-interview`, `ralplan`, `ultragoal`, `team`.
- tmux/worktree 기반이라 장기 작업과 병렬 작업을 눈으로 추적하기 좋다.
- Coordinator MCP bridge가 외부 controller integration을 정식 표면으로 제공한다.
- read-only/fail-closed/mutation double opt-in 등 안전 설계가 명시되어 있다.

## 약점 / Caveat

- README가 beta/experimental 상태를 명시한다. 중요한 작업은 반드시 독립 검증 필요.
- 후속 pass에서 `gjc` basic smoke는 통과했고, isolated temp repo에서 `deep-interview`/`ralplan`/`ultragoal`/`team --dry-run` controlled workflow artifact replay도 통과했다. 다만 live non-dry-run team, `.gjc` recovery/resume/corruption trace, Hermes bridge runtime은 아직 별도 검증이 필요하다.
- MCP coordinator는 설정된 root allowlist와 mutation env가 없으면 fail-closed한다.
- 장기 세션은 tmux/read_tail/turn 상태 polling 운영 discipline이 필요하다.

## Confidence

- README/docs 기반 workflow/bridge 설명: High
- 로컬 GJC basic 실행 가능성: Medium/High, `gjc/0.7.3` version/help/smoke/print smoke는 통과했지만 workflow replay는 남음
- Hermes-MCP 결합 가능성: Medium/High, 현재 MCP 도구 표면과 docs는 확인됐지만 새 repo root에 대한 GJC session actuation은 별도 설정 필요
