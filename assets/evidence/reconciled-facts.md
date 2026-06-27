# Reconciled Facts

검증일: 2026-06-26 KST  
작성 원칙: agent output, 로컬 명령, 공개 repository/docs가 충돌할 때는 controller가 재확인한 출처를 우선한다. 민감정보는 기록하지 않는다.

## 핵심 판정

1. **Codex CLI**는 기본 agentic coding runtime이다. 로컬 버전은 `codex-cli 0.142.2`로 확인했다.
2. **LazyCodex / OmO**는 Codex 위의 plugin/harness layer다. 로컬 `codex plugin list` 기준 `omo@sisyphuslabs`가 installed/enabled이고 version은 `4.13.0`이다. 다만 `omx doctor` warning과 `$` composer command surface 한계가 있다.
3. **Gajae-Code / gjc**는 agent-run report에서는 public source 미확인으로 Low confidence 처리됐지만, controller cross-check에서 public repo와 npm package 및 README/docs를 확인했다. 후속 pass에서는 Bun/global package install 후 `gjc/0.7.3` basic smoke도 통과했다. 단, full workflow/session replay는 아직 미완료다.
4. **Hermes Agent**는 Nous Research의 persistent coordinator/runtime이다. 로컬 `hermes --version`은 `Hermes Agent v0.12.0 (2026.4.30)`이며 gateway는 실행 중으로 확인했다. API key 상태는 public report에 기록하지 않는다.

## Gajae-Code conflict adjudication

Codex agent run은 Gajae-Code/gjc를 public first-party source 미확인으로 기록했다. 그러나 별도 controller 검증에서 다음을 확인했다.

- `npm view gajae-code`: version `0.7.3`, description `One-line npm install wrapper for the Gajae-Code gjc CLI`, license `MIT`.
- `gh repo view Yeachan-Heo/gajae-code`: public repo, MIT, default branch `main`, updated `2026-06-26T06:59:34Z`.
- shallow clone HEAD: `569a7696a8d22ffbcddbeab861951f244e1aed12`, commit `chore: bump version to 0.7.3`.
- README: Gajae-Code is a focused coding-agent runner for interviews, reviewed plans, tmux-native execution, durable verification.
- README workflow: `deep-interview -> ralplan -> ultragoal`, optional `team`.
- `docs/hermes-mcp-bridge.md`: `gjc mcp-serve coordinator`, fail-closed root allowlist, mutation double opt-in, `gjc_delegate_plan/execute/team` surface.

판정: public project/workflow 근거는 존재한다. 단, npm metadata의 repository는 `gajae-ai/gajae-code`로 보이고 inspected public repo는 `Yeachan-Heo/gajae-code`이므로 canonical owner drift 가능성을 caveat로 남긴다.

## Local versions and states

| Item | Observation | Confidence |
| --- | --- | --- |
| Codex CLI | `codex-cli 0.142.2` | High |
| LazyCodex package | `lazycodex-ai 4.13.0` via `npx -y lazycodex-ai@latest --version` | High |
| Codex plugin | `omo@sisyphuslabs` installed/enabled, version `4.13.0` | High |
| OmO CLI | `omx` reported `oh-my-codex v0.15.0` in agent run | High for observation |
| Gajae-Code | npm `gajae-code 0.7.3` and `@gajae-code/coding-agent 0.7.3`; local `gjc/0.7.3` version/help/smoke/print smoke passed | Medium/High for basic runtime; workflow replay pending |
| Hermes | `Hermes Agent v0.12.0 (2026.4.30)`; gateway running | High |

## Caveats

- 로컬 observation은 설치 상태를 말할 뿐, 모든 workflow command가 정상 동작함을 보장하지 않는다.
- LazyCodex `$...` composer command는 Codex App/TUI surface와 shell/non-interactive surface에서 동작 차이가 있을 수 있다.
- Gajae-Code는 README에서 experimental/beta-stage라고 명시하므로 basic smoke가 통과해도 중요한 작업에는 workflow artifact와 결과를 별도 검증해야 한다.
- Hermes local status에는 provider/API-key 정보가 포함될 수 있어 public report에서는 상태 요약만 사용했다.
