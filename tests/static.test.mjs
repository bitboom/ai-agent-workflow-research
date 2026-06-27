import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');

const publicMarkdown = [
  ...readdirSync(join(root, 'assets/evidence')).filter(f => f.endsWith('.md')).map(f => `assets/evidence/${f}`),
  'research/coding-agent-underhood-ultraresearch.md',
  'research/coding-agent-taxonomy.md',
  'research/coding-agent-source-map.md',
  'research/coding-agent-evaluation-framework.md',
  'research/coding-agent-open-questions.md',
  'research/deep-dive-gajae-code.md',
  'research/deep-dive-hermes-agent.md',
  'research/deep-dive-lazycodex-omo.md'
];

test('static site core files exist', () => {
  assert.ok(existsSync(join(root, 'index.html')));
  assert.ok(existsSync(join(root, '.nojekyll')));
  assert.ok(existsSync(join(root, 'assets/evidence/reconciled-facts.md')));
  assert.ok(existsSync(join(root, 'assets/evidence/coding-agent-underhood-crosscheck.md')));
  for (const file of publicMarkdown) assert.ok(existsSync(join(root, file)), file);
});

test('index reflects under-the-hood research scope', () => {
  for (const id of ['summary', 'taxonomy', 'architecture', 'control-map', 'implementations', 'papers', 'evidence', 'next']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /AI Coding Agent Under-the-Hood Research/);
  assert.match(html, /Coding agent를 “제품 비교”가 아니라 “내부 구조”로 해부한다/);
  assert.match(html, /LazyCodex\/OmO UltraResearch/);
  assert.match(html, /model router/i);
  assert.match(html, /context assembly/i);
  assert.match(html, /verification gate/i);
  assert.match(html, /coding-agent-evaluation-framework\.md/);
  assert.match(html, /벤치마크\/평가 프레임워크/);
  assert.match(html, /실행 기록 파일럿/);
  assert.match(html, /deep-dive-gajae-code\.md/);
  assert.match(html, /deep-dive-hermes-agent\.md/);
  assert.match(html, /deep-dive-lazycodex-omo\.md/);
  assert.match(html, /agent-orchestration-comparison\.md/);
  assert.match(html, /Evidence status/);
  assert.match(html, /source-confirmed/);
  assert.match(html, /basic runtime-confirmed/);
  assert.match(html, /UltraResearch draft/);
  for (const name of ['OpenAI Codex', 'Claude Code', 'Aider', 'OpenHands', 'SWE-agent', 'LazyCodex', 'Gajae-Code', 'Hermes']) {
    assert.match(html, new RegExp(name));
  }
});

test('research markdown contains expected source-backed concepts', () => {
  const main = readFileSync(join(root, 'research/coding-agent-underhood-ultraresearch.md'), 'utf8');
  const sourceMap = readFileSync(join(root, 'research/coding-agent-source-map.md'), 'utf8');
  const framework = readFileSync(join(root, 'research/coding-agent-evaluation-framework.md'), 'utf8');
  assert.match(main, /Coding Agent Under The Hood UltraResearch/);
  assert.match(main, /SWE-bench/);
  assert.match(main, /Agentless/);
  assert.match(main, /Failure pattern/);
  assert.doesNotMatch(main, /현재 `index\.html`은 네 제품 비교 중심/);
  assert.match(main, /GitHub Pages IA Status/);
  assert.match(sourceMap, /https:\/\/arxiv\.org\/abs\/2407\.01489/);
  assert.doesNotMatch(sourceMap, /2407\.01494/);
  assert.match(framework, /Context\/localization/);
  assert.match(framework, /Verification honesty/);
  assert.match(framework, /Trace Schema/);
  assert.match(framework, /Terminal-Bench/);
  assert.match(framework, /Agentless-style staged repair/);
  const gajae = readFileSync(join(root, 'research/deep-dive-gajae-code.md'), 'utf8');
  const hermes = readFileSync(join(root, 'research/deep-dive-hermes-agent.md'), 'utf8');
  const omo = readFileSync(join(root, 'research/deep-dive-lazycodex-omo.md'), 'utf8');
  assert.match(gajae, /basic runtime-confirmed/i);
  assert.match(gajae, /gjc\/0\.7\.3/);
  assert.match(gajae, /workflow replay pending/i);
  assert.doesNotMatch(gajae, /bun: not found/);
  assert.match(hermes, /0\.12\.0/);
  assert.match(hermes, /0\.17\.0/);
  assert.match(omo, /runtime-callable/i);
  assert.match(omo, /manifest-declared/i);
  const gjcReview = readFileSync(join(root, 'assets/evidence/gjc-documentation-review.md'), 'utf8');
  const gjcSmoke = readFileSync(join(root, 'assets/evidence/gajae-code-runtime-smoke.md'), 'utf8');
  assert.match(gjcReview, /GJC Documentation Review Pass/);
  assert.match(gjcSmoke, /smoke-test: ok/);
  assert.match(gjcSmoke, /GJC_PRINT_SMOKE_OK/);
});

test('no obvious credential material is committed in public files', () => {
  const files = ['index.html', 'README.md', ...publicMarkdown];
  const joined = files.map(f => readFileSync(join(root, f), 'utf8')).join('\n');
  const forbidden = [
    /sk-[A-Za-z0-9_-]{20,}/,
    /ghp_[A-Za-z0-9_]{20,}/,
    /github_pat_[A-Za-z0-9_]{20,}/,
    /AIza[0-9A-Za-z_-]{20,}/,
    /(api[_-]?key|secret|token|password)\s*[:=]\s*['\"]?[A-Za-z0-9_\-.]{16,}/i
  ];
  for (const re of forbidden) assert.doesNotMatch(joined, re);
});

test('theme toggle script is present without external dependencies in html', () => {
  assert.match(html, /localStorage\.getItem\('theme'\)/);
  assert.doesNotMatch(html, /https:\/\//);
});
