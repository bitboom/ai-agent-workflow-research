# Coding Agent Open Questions

작성일: 2026-06-26 KST

이 파일은 아직 확인이 필요한 질문과 다음 조사 단계를 기록한다. 일부는 private/closed-source product라 공개 근거만으로 닫을 수 없다.

## High Priority

1. Codex CLI 최신 내부 구조
   - 질문: 현재 OpenAI Codex CLI의 exact sandbox/approval implementation, MCP/plugin lifecycle, session persistence는 source tree 어느 모듈에 구현되어 있는가?
   - 다음 단계: `openai/codex` source를 SHA-pinned clone으로 읽고 CLI config, sandbox, tool execution, patch application 모듈을 map한다.
   - 왜 중요한가: Codex ecosystem 주장은 공식 docs와 runtime source를 분리해야 한다.

2. Claude Code closed-source 경계
   - 질문: Claude Code의 internal repo indexing, prompt/context assembly, memory/session persistence는 local file 기준으로 어디까지 공개되어 있는가?
   - 다음 단계: 공식 docs의 settings/hooks/MCP/memory pages를 추가로 확인하고, 공개되지 않은 부분은 low confidence로 남긴다.
   - 왜 중요한가: product behavior와 documented user-facing controls를 혼동하지 않아야 한다.

3. Gajae-Code canonical source drift
   - 질문: npm metadata의 repository owner와 inspected GitHub repo owner가 다르게 보이는 이유는 무엇인가?
   - 다음 단계: npm package metadata, GitHub tags/releases, README install path를 같은 날짜 기준으로 재확인한다.
   - 왜 중요한가: public source provenance가 불명확하면 architecture claim confidence가 낮아진다.

4. Hermes public source and local version drift
   - 질문: 로컬 Hermes v0.12.0과 public docs/current source의 feature set은 얼마나 다른가?
   - 다음 단계: public repo/docs SHA와 local installed version을 맞춰 기능 차이를 표로 분리한다.
   - 왜 중요한가: persistent runtime claim은 version drift 영향을 크게 받는다.

5. Runtime-enabled OmO MCP surface
   - 질문: OmO manifest에 선언된 MCP servers 중 이 Codex session에서 실제 enabled/callable인 것은 무엇인가?
   - 다음 단계: Codex settings/plugin list/runtime tool surface를 capture하고 manifest와 비교한다.
   - 왜 중요한가: manifest declaration은 runtime availability proof가 아니다.

## Medium Priority

6. Windsurf/Cascade current identity
   - 질문: Windsurf-specific docs가 Devin Desktop docs로 redirect되는 현재 상태가 product consolidation인지 documentation migration인지?
   - 다음 단계: official release notes, docs sitemap, archived docs, product announcements를 확인한다.
   - Confidence 현재: medium 이하.

7. Cursor repo indexing internals
   - 질문: Cursor semantic index의 refresh, stale index handling, privacy boundary가 공개 docs로 어디까지 설명되는가?
   - 다음 단계: Cursor docs, privacy/security docs, issue/review evidence를 별도 수집한다.
   - 왜 중요한가: IDE agent failures 중 stale indexing/context selection은 architecture 원인일 수 있다.

8. Aider edit-format empirical comparison
   - 질문: Aider의 edit formats 중 어떤 방식이 어떤 모델/파일 규모에서 실패율이 낮은가?
   - 다음 단계: Aider docs, changelog, issue discussions, benchmark posts를 추가로 수집한다.

9. Public review corpus
   - 질문: context rot, over-editing, approval fatigue, flaky tests, stale indexes가 반복적으로 보고되는 product/type 조합은 무엇인가?
   - 다음 단계: GitHub issues, HN, Reddit, blog posts를 source-quality별로 분리하고 anecdote count를 표로 만든다.
   - 현재 caveat: 이 pass에서는 docs caveat와 paper critique가 강하고, user-review evidence는 얕다.

10. Benchmark contamination and semantic correctness
    - 질문: SWE-bench Verified critique papers의 방법론과 반박은 어느 쪽이 더 강한가?
    - 다음 단계: benchmark audit papers full PDF, official leaderboard notes, issue discussions를 함께 읽는다.

## Low Priority But Useful

11. Goose and Roo Code deeper source dive
    - 질문: Goose/Roo Code의 actual loop, MCP permission, editing tool chain은 Cline/Continue와 어떻게 다른가?
    - 다음 단계: official docs/source repos를 별도 axis로 조사한다.

12. Agent telemetry and evidence ledger taxonomy
    - 질문: telemetry/logging/evidence ledger는 privacy risk와 debugging value를 어떻게 trade off 하는가?
    - 다음 단계: Codex/Claude/Cursor/OpenHands/OmO/Hermes telemetry docs와 local state files를 비교한다.

13. Human approval UX benchmark
    - 질문: ask/allow/deny, YOLO, policy file, checkpoint, diff review가 실제 productivity와 safety에 어떤 영향을 주는가?
    - 다음 단계: user studies나 public issue patterns를 찾는다.

14. Multi-agent orchestration proof
    - 질문: team/subagent가 실제 scheduler/state/worktree orchestration인지, prompt role convention인지 제품별로 어떻게 확인할 수 있는가?
    - 다음 단계: state storage, mailbox, queue, process model, worktree ownership, failure recovery를 기준으로 product별 audit.

## Suggested Next Research Actions

1. SHA-pinned repo deep dive: `openai/codex`, `SWE-agent/SWE-agent`, `All-Hands-AI/OpenHands`, `Aider-AI/aider`, `cline/cline`, `continuedev/continue`, Gajae-Code, Hermes.
2. Public issue sweep: context rot, over-editing, stale index, auto-approval incident, sandbox mismatch, flaky tests.
3. Benchmark critique sweep: SWE-bench Verified contamination, semantic correctness, dynamic benchmark proposals.
4. Runtime reproduction: run a small repo edit through Codex, Aider, OpenHands/SWE-agent where locally installable, and compare action traces.
5. GitHub Pages update: convert this research corpus into a new site IA rather than extending the current four-product comparison table.
