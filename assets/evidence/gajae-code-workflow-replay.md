# Evidence: Gajae-Code Workflow Replay

## Summary

Current result: **controlled workflow artifact replay confirmed** for Gajae-Code `gjc/0.7.3` in a tiny isolated fixture repo.

This pass does not claim that GJC completed a real coding task autonomously. It verifies that the native workflow command surfaces for `deep-interview`, `ralplan`, `ultragoal`, and `team --dry-run` are runtime-callable and write the expected `.gjc/_session-*` state/artifact layout.

## Run conditions

| Item | Observation |
| --- | --- |
| Capture date | 2026-06-27 KST |
| Fixture | isolated public-safe toy git repo with `src/sum.js` and `node --test` baseline |
| Baseline | `npm test` passed before GJC workflow replay |
| Runtime | Bun `1.3.14`; `gjc/0.7.3`; `@gajae-code/coding-agent 0.7.3`; `gajae-code 0.7.3` |
| Session id | `replay-20260627` |
| Publication policy | raw `.gjc/` state and absolute local paths are not committed; this file is a sanitized controller summary |

## Commands replayed

All commands below exited `0`.

| Step | Command shape | Observed runtime artifact/result |
| --- | --- | --- |
| Baseline | `npm test` | fixture test passed |
| Deep-interview seed | `gjc deep-interview --standard --session-id replay-20260627 --json "..."` | wrote `.gjc/_session-replay-20260627/state/deep-interview-state.json` |
| Deep-interview final spec | `gjc deep-interview --write --stage final --slug multiply-helper --session-id replay-20260627 --spec ./gjc-final-spec.md --deliberate --json` | wrote `.gjc/_session-replay-20260627/specs/deep-interview-multiply-helper.md`; handed off to ralplan with `run_id=replay-20260627` |
| RALPLAN seed | `gjc ralplan --deliberate --json --session-id replay-20260627 "..."` | wrote/updated `.gjc/_session-replay-20260627/state/ralplan-state.json` |
| RALPLAN planner artifact | `gjc ralplan --write --stage planner --stage_n 1 --run-id replay-20260627 --session-id replay-20260627 --artifact ./gjc-planner.md --json` | wrote `.gjc/_session-replay-20260627/plans/ralplan/replay-20260627/stage-01-planner.md` and `index.jsonl` |
| RALPLAN final artifact | `gjc ralplan --write --stage final --stage_n 1 --run-id replay-20260627 --session-id replay-20260627 --artifact ./gjc-final-plan.md --json` | wrote `stage-01-final.md` and `pending-approval.md` |
| Ultragoal create | `GJC_SESSION_ID=replay-20260627 gjc ultragoal create-goals --brief-file ./gjc-ultragoal-brief.md --gjc-goal-mode per-story --json` | created two goals `G001`, `G002` under `.gjc/_session-replay-20260627/ultragoal/goals.json` |
| Ultragoal status | `GJC_SESSION_ID=replay-20260627 gjc ultragoal status --json` | returned status `pending`, current goal `G001`, paths for `brief.md`, `goals.json`, and `ledger.jsonl` |
| Ultragoal start next | `GJC_SESSION_ID=replay-20260627 gjc ultragoal complete-goals --json` | marked `G001` active and returned `next_action=execute-goal` |
| Ultragoal checkpoint | `GJC_SESSION_ID=replay-20260627 gjc ultragoal checkpoint --goal-id G001 --status blocked --evidence "..." --json` | changed `G001` to `blocked`, left `G002` pending |
| Ultragoal review-start | `GJC_SESSION_ID=replay-20260627 gjc ultragoal review --spec ./gjc-ultragoal-brief.md --mode review-start --json` | returned `verdict=fail` because `executorQa.artifactRefs` was absent, then added review blocker goal `G003` |
| Team dry-run | `GJC_SESSION_ID=replay-20260627 gjc team 1:executor --dry-run --json "..."` | wrote dry-run team state with `tmux_session=dry-run`, one worker, one pending task |
| Team list | `GJC_SESSION_ID=replay-20260627 gjc team list --json` | listed the dry-run team from `.gjc/_session-replay-20260627/state/team/...` |

## Sanitized artifact map

Representative files created during replay:

```text
.gjc/_session-replay-20260627/.session-activity.json
.gjc/_session-replay-20260627/state/deep-interview-state.json
.gjc/_session-replay-20260627/specs/deep-interview-index.jsonl
.gjc/_session-replay-20260627/specs/deep-interview-multiply-helper.md
.gjc/_session-replay-20260627/state/ralplan-state.json
.gjc/_session-replay-20260627/plans/ralplan/replay-20260627/index.jsonl
.gjc/_session-replay-20260627/plans/ralplan/replay-20260627/stage-01-planner.md
.gjc/_session-replay-20260627/plans/ralplan/replay-20260627/stage-01-final.md
.gjc/_session-replay-20260627/plans/ralplan/replay-20260627/pending-approval.md
.gjc/_session-replay-20260627/ultragoal/brief.md
.gjc/_session-replay-20260627/ultragoal/goals.json
.gjc/_session-replay-20260627/ultragoal/ledger.jsonl
.gjc/_session-replay-20260627/state/ultragoal-state.json
.gjc/_session-replay-20260627/state/team/<team-name>/config.json
.gjc/_session-replay-20260627/state/team/<team-name>/manifest.v2.json
.gjc/_session-replay-20260627/state/team/<team-name>/tasks/task-1.json
.gjc/_session-replay-20260627/state/team/<team-name>/events.jsonl
.gjc/_session-replay-20260627/state/team-state.json
.gjc/_session-replay-20260627/state/skill-active-state.json
```

## Parsed state highlights

- `deep-interview-state.json`: `skill=deep-interview`, `current_phase=handoff`, `session_id=replay-20260627`.
- `ralplan-state.json`: `skill=ralplan`, `mode=deliberate`, `run_id=replay-20260627`, `current_phase=final`.
- `ultragoal/goals.json`: `G001` became `blocked`, `G002` remained `pending`, and review-start added `G003` as a pending review-blocker goal.
- `ultragoal/ledger.jsonl` events: `plan_created`, `goal_started`, `goal_checkpointed`, `review_blockers_recorded`.
- `team/.../config.json`: `dry_run=true`, `worker_count=1`, `tmux_session=dry-run`, `tmux_target=dry-run:0`, `workspace_mode=worktree`.
- `team/.../events.jsonl`: `team_started` with message `Created native gjc team dry-run state without starting tmux workers`.

## Source-level anchors for replayed behavior

Installed package source paths used for controller cross-check:

- `src/commands/deep-interview.ts` and `src/gjc-runtime/deep-interview-runtime.ts` — seed, final spec write, and deliberate handoff to ralplan.
- `src/commands/ralplan.ts` and `src/gjc-runtime/ralplan-runtime.ts` — consensus handoff state, artifact write, `index.jsonl`, and `pending-approval.md` behavior.
- `src/commands/ultragoal.ts` and `src/gjc-runtime/ultragoal-runtime.ts` — goal parsing, state/ledger writes, checkpoint, review-start blocker creation, and state reconciliation.
- `src/commands/team.ts` and `src/gjc-runtime/team-runtime.ts` — `team --dry-run` state creation, config/manifest/task/mailbox/event layout.

## Runtime caveats discovered

- `gjc ultragoal --help` without a session id exited `1` with `SessionResolutionError`; the same help command succeeded when `GJC_SESSION_ID` was set. Source inspection shows `dispatchUltragoalCommand` resolves `currentUltragoalSessionId(cwd)` before rendering help, so help is not fully session-free in `0.7.3`.
- `team --dry-run` proves state layout and command callability only. It does not prove live tmux pane startup, worker heartbeat recovery, worktree cleanup, or integration behavior.
- `ultragoal review-start` correctly treated missing executor QA artifacts as a blocker; this is evidence of gating behavior, not evidence that a real code-review pass succeeded.

## What this proves

- Four GJC workflow surfaces are runtime-callable locally: `deep-interview`, `ralplan`, `ultragoal`, and `team --dry-run`.
- The commands write the expected `.gjc/_session-*` specs/plans/state/team/ultragoal artifacts in a real git repository.
- `deep-interview --write --deliberate` can hand off to native `ralplan` state.
- `ultragoal` creates durable goals, ledger entries, checkpoint state, and review-blocker goals.
- `team --dry-run` creates a structured team state directory without starting tmux panes.

## What this still does not prove

- It does not prove autonomous code editing quality or completion of a non-toy repo task.
- It does not prove live `team` tmux/worktree execution, orphan cleanup, or worker recovery.
- It does not prove `.gjc` corruption recovery or long-running session resume semantics.
- It does not prove Hermes coordinator bridge behavior.
- It does not resolve public package/repo owner drift.
