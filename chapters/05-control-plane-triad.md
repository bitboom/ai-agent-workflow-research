# LazyCodex / OmO Deep Dive — Codex-embedded Workflow Overlay

[← 목차](README.md)

LazyCodex/OmO는 이 책에서 **Codex-embedded Workflow Harness / Control Overlay**로 분류한다. 여기서 먼저 선을 긋는다. LazyCodex/OmO는 Codex를 완전히 대체하는 독립 orchestrator로 확인된 상태가 아니다. 현재 evidence로는 Codex runtime 위에 hooks, `$...` skills, MCP declarations, project memory, `.omo` artifacts를 얹어 workflow discipline을 강화하는 layer로 읽는 것이 가장 안전하다.

## Working definition

| 항목 | 판정 |
| --- | --- |
| 1차 분류 | Codex-embedded Workflow Harness / Control Overlay |
| 2차 분류 | Plugin-based orchestrator candidate |
| 핵심 substrate | OpenAI Codex CLI/App runtime |
| 핵심 surface | Codex hooks, `$...` workflow commands, MCP declarations, `.omo` ledgers/artifacts |
| 현재 강한 근거 | local install/version/plugin manifest, docs for workflow modes, selected artifact observations |
| 주요 caveat | 모든 `$...` workflow의 runtime-callable parity가 증명된 것은 아님 |

LazyCodex/OmO를 읽을 때 가장 큰 위험은 manifest와 runtime을 혼동하는 것이다. plugin manifest가 hooks, MCP tools, workflow capability를 선언한다고 해서 모든 workflow가 모든 실행 표면에서 callable하다는 뜻은 아니다. 특히 Codex composer/TUI/App 표면과 non-interactive `codex exec` 표면은 다를 수 있다. 따라서 이 장은 LazyCodex/OmO를 “Codex 안쪽 control overlay”로 정의하고, standalone orchestrator claim은 검증이 끝날 때까지 보류한다.

## Codex substrate와 overlay

Codex CLI/App는 기본 agentic coding runtime이다. model call, tool call, edit, shell, approval, context handling의 기본 loop가 Codex 쪽에 있다. LazyCodex/OmO는 이 substrate 위에서 project memory, planning, execution discipline, evidence ledger, hooks, MCP helper를 제공한다. 이 구조는 Gajae-Code와 다르다. Gajae-Code가 자체 CLI workflow와 `.gjc` state root를 중심으로 움직인다면, LazyCodex/OmO는 Codex session lifecycle에 붙어 workflow를 강화한다.

이 차이를 이해해야 분류가 정확해진다. LazyCodex/OmO는 “agent”라기보다 Codex agent를 통제하는 harness/overlay다. 동시에 단순 benchmark harness도 아니다. benchmark score를 산출하는 외부 runner가 아니라, 실제 Codex 사용 중 planning/execution/verification을 구조화하려는 workflow layer이기 때문이다. 그래서 “plugin-based orchestrator candidate”라는 2차 분류를 둔다.

## Hooks와 MCP declarations

local cross-check에서는 OmO plugin manifest가 session-start, user-prompt-submit, pre/post-tool-use, post-compact, stop/subagent-stop 계열 hooks를 선언하는 것으로 정리됐다. capabilities에는 Hooks, MCP Tools, Code Intelligence, Workflow, Context Injection 같은 surface가 포함된다. 또한 `.mcp.json`을 통해 `grep_app`, `context7`, `codegraph`, `git_bash`, `lsp` 계열 MCP server 구성이 관찰됐다.

그러나 이 evidence는 주로 `manifest-confirmed`다. hook이 선언되어 있다는 것과 hook이 특정 Codex session에서 기대한 순간에 fire한다는 것은 다르다. MCP server가 설정 파일에 있다는 것과 실제 startup approval을 통과해 도구로 활성화됐다는 것도 다르다. 따라서 본문에서는 LazyCodex/OmO의 hook/MCP 구조를 control overlay의 강한 신호로 보되, runtime-callable matrix를 별도 next probe로 남긴다.

## `$...` workflow commands와 `.omo` artifacts

LazyCodex docs는 `ultrawork`/`ulw`를 evidence-driven orchestration mode로 설명하고, `$ulw-plan → $start-work → $ulw-loop` 같은 흐름을 제시한다. `$ulw-loop`가 `.omo/ulw-loop` 아래 brief/goals/ledger를 저장한다는 설명은 Workflow Orchestrator 관점에서 중요하다. 이 구조는 단순 prompt macro가 아니라 workflow state와 artifact ledger를 지향한다.

또한 related research workflow에서는 `$ultraresearch`가 가설 작성과 artifact journal의 출발점으로 쓰였다. 그러나 이 책은 UltraResearch output을 canonical evidence로 직접 승격하지 않는다. UltraResearch는 hypothesis generator다. public claim은 controller가 source, docs, runtime command, artifact를 cross-check한 뒤에만 본문으로 올라간다. LazyCodex/OmO 자체가 evidence-driven workflow를 지향한다는 점과, 그 workflow output을 다시 검증해야 한다는 점을 동시에 유지해야 한다.

## Evidence label별 현재 판정

`source-confirmed`: npm package, docs, public repository information은 LazyCodex/OmO가 Codex 안에서 project memory, planning, execution, verified completion을 강화하는 layer임을 지지한다. docs의 installation 및 ultrawork/ulw 설명은 workflow mode를 확인하게 해 준다.

`manifest-confirmed`: local Codex plugin manifest에서 hooks, MCP Tools, Code Intelligence, Workflow, Context Injection capabilities와 hook declarations가 확인됐다. 이 라벨은 강하지만 runtime proof와 동일하지 않다.

`runtime-confirmed`: local version/install observation은 `lazycodex-ai`와 `omo` plugin 설치/활성 상태를 보여준다. 다만 installed/enabled는 readiness의 일부일 뿐 모든 workflow callability를 증명하지 않는다.

`artifact-backed`: selected LazyCodex/OmO research workflow에서 `.omo` 계열 artifact/journal이 사용된 정황은 있으나, public book의 canonical claim으로는 sanitized evidence와 callability matrix가 더 필요하다. 모든 `$...` workflow에 대해 isolated replay가 끝난 것은 아니다.

`unverified`: non-ultraresearch `$...` workflows, MCP callability, Codex TUI/App와 `codex exec` parity, hook non-fire recovery, stale `.omo` state handling은 아직 검증 대상이다.

## 강점과 약점

LazyCodex/OmO의 강점은 adoption path다. Codex를 이미 쓰는 사용자는 완전히 다른 orchestrator로 이동하지 않고, Codex 안에서 workflow discipline을 강화할 수 있다. hooks는 session lifecycle의 중요한 순간에 개입할 수 있고, `$...` commands는 planning/execution/verification을 명시적으로 분리하게 만든다. `.omo` artifacts는 “done” 선언보다 evidence ledger를 중시하는 방향을 보여준다.

약점은 substrate coupling이다. Codex runtime의 surface가 바뀌거나 plugin approval 상태가 달라지면 LazyCodex/OmO workflow도 영향을 받는다. 또한 workflow command가 composer/TUI에서 잘 동작하더라도 non-interactive automation에서 동일하게 동작하는지는 별도 문제다. 이 때문에 LazyCodex/OmO는 현재 “standalone workflow orchestrator”가 아니라 “Codex-embedded control overlay”로 부르는 것이 더 정직하다.

## 이 장의 결론

LazyCodex/OmO는 coding agent evolution의 또 다른 방향을 보여준다. Gajae-Code처럼 독립 repo-local orchestrator를 만들 수도 있지만, Codex라는 강한 agent runtime 위에 workflow overlay를 얹을 수도 있다. 이 방식은 빠르게 사용자 workflow에 들어갈 수 있지만, manifest와 runtime callability를 엄격히 분리해야 한다. 따라서 이 책은 LazyCodex/OmO를 **Codex-embedded Workflow Harness / Control Overlay**로 분류하고, plugin-based orchestrator candidate라는 가능성은 다음 검증으로 남긴다.
