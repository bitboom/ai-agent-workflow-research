# LazyCodex / OmO Cross-check

검증일: 2026-06-26 KST

## 로컬 검증 사실

- `codex --version`: `codex-cli 0.142.2`.
- `npx -y lazycodex-ai@latest --version`: `lazycodex-ai 4.13.0`.
- `npx -y lazycodex-ai@latest install --no-tui --codex-autonomous` 실행 완료.
- `codex plugin list` 기준 `omo@sisyphuslabs`가 `installed, enabled`, version `4.13.0`으로 표시됨.
- 로컬 플러그인 manifest: `~/.codex/plugins/cache/sisyphuslabs/omo/4.13.0/.codex-plugin/plugin.json`
  - name: `omo`
  - version: `4.13.0`
  - capabilities: `Hooks`, `MCP Tools`, `Code Intelligence`, `Workflow`, `Context Injection`
  - hooks: session-start, user-prompt-submit, pre/post-tool-use, post-compact, stop/subagent-stop 계열 다수
  - mcpServers: `./.mcp.json`
- 로컬 `.mcp.json`에는 `grep_app`, `context7`, `codegraph`, `git_bash`, `lsp` MCP 서버 구성이 있음. 이 중 Codex 설정에서 일부 서버는 disabled일 수 있으므로 실제 활성 도구 표면은 Codex 설정과 startup approval 상태에 의존한다.

## 공개 소스/패키지 사실

- npm `lazycodex-ai`: version `4.13.0`, repository `code-yeongyu/oh-my-openagent`, license `SUL-1.0`.
- npm `oh-my-openagent`: version `4.13.0`, repository `code-yeongyu/oh-my-openagent`, license `SUL-1.0`.
- GitHub `code-yeongyu/lazycodex`: description은 “Project memory, planning, execution, and verified completion inside Codex” 성격의 Codex 안쪽 harness로 설명됨.
- LazyCodex docs `packages/web/content/docs/installation.md`:
  - LazyCodex는 Codex 안에서 실행된다.
  - 설치는 `npx lazycodex-ai install` 또는 autonomous mode `npx lazycodex-ai install --no-tui --codex-autonomous`.
  - `npm install -g` 또는 `bun add -g`가 아니라 `npx` 사용을 권장.
  - 설치 후 Codex startup review에서 `omo` hooks 승인이 필요할 수 있음.
- LazyCodex docs `packages/web/content/docs/ultrawork.md`:
  - `ultrawork`/`ulw`는 evidence-driven orchestration mode.
  - `$ulw-loop`는 `.omo/ulw-loop` 아래에 brief/goals/ledger를 저장하는 command form.
  - 일반 흐름은 `$ulw-plan` → `$start-work` → `$ulw-loop`.

## Control-layer 해석

LazyCodex/OmO는 “독립 CLI”라기보다 **Codex 위에 얹히는 plugin/harness layer**로 보는 것이 정확하다.

- Codex CLI/App: 기본 agentic coding runtime
- LazyCodex/OmO: Codex의 prompt/command/hook/MCP/verification workflow를 강화하는 harness
- 산출 evidence: `.omo/` 계열 ledger/state, Codex plugin hooks, MCP helper, local project memory

## 강점

- Codex 안에서 바로 workflow discipline을 강화한다.
- `$ulw-plan`, `$start-work`, `$ulw-loop` 식으로 planning/execution/verification을 구분한다.
- Hook 기반이라 Codex 세션 시작/프롬프트 제출/도구 사용/완료 시점에 개입 가능하다.
- “done” 선언보다 evidence ledger를 중시하는 설계가 명확하다.

## 약점 / Caveat

- `$...` command는 Codex composer/TUI/App 표면에 강하게 묶여 있다. `codex exec`에서 동일하게 동작하는지는 별도 검증이 필요하다.
- 설치 후 hook approval이 필요할 수 있어, 자동화 환경에서는 startup approval 상태가 실제 readiness를 좌우한다.
- `omo` plugin은 로컬에 설치되어 있어도 일부 MCP 서버가 disabled일 수 있다.
- npm package license와 GitHub repo license가 다르게 보일 수 있으므로 재배포/상용 사용 판단은 package별 license를 따로 확인해야 한다.

## Confidence

- 로컬 설치/버전/manifest: High
- 설치/워크플로우 명령 설명: High, LazyCodex docs와 로컬 manifest 근거
- `codex exec`에서 `$ultraresearch` 직접 호출 가능성: Low/Unknown, 별도 agent run 결과 확인 필요
