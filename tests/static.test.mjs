import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');

const publicMarkdown = [
  ...readdirSync(join(root, 'assets/evidence')).filter(f => f.endsWith('.md')).map(f => `assets/evidence/${f}`),
  ...readdirSync(join(root, 'chapters')).filter(f => f.endsWith('.md')).map(f => `chapters/${f}`),
  ...readdirSync(join(root, 'appendix')).filter(f => f.endsWith('.md')).map(f => `appendix/${f}`),
  'research/coding-agent-underhood-ultraresearch.md',
  'research/coding-agent-taxonomy.md',
  'research/coding-agent-source-map.md',
  'research/coding-agent-evaluation-framework.md',
  'research/coding-agent-open-questions.md',
  'research/deep-dive-gajae-code.md',
  'research/deep-dive-hermes-agent.md',
  'research/deep-dive-lazycodex-omo.md'
];

const bookHtml = [
  'chapters/index.html',
  'chapters/01-research-question.html',
  'chapters/02-agent-taxonomy.html',
  'chapters/03-common-architecture.html',
  'chapters/04-implementation-atlas.html',
  'chapters/05-control-plane-triad.html',
  'chapters/06-evaluation-framework.html',
  'chapters/07-caveats-and-next.html',
  'appendix/evidence-index.html'
];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

test('book-style static site core files exist', () => {
  for (const file of ['index.html', 'styles.css', 'script.js', '.nojekyll', 'assets/favicon.svg', 'README.md', 'scripts/build-book-pages.py']) {
    assert.ok(existsSync(join(root, file)), file);
  }
  for (const file of publicMarkdown) assert.ok(existsSync(join(root, file)), file);
  for (const file of bookHtml) assert.ok(existsSync(join(root, file)), file);
});

test('index uses Vibe SDLC inspired reading-guide UX and links to rendered book pages', () => {
  for (const id of ['summary', 'thesis', 'contents', 'taxonomy', 'architecture', 'implementations', 'control-planes', 'evaluation', 'evidence', 'terms']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /AI Coding Agent 구조 해부/);
  assert.match(html, /한국어 리서치 북/);
  assert.match(html, /site-header/);
  assert.match(html, /reading-progress/);
  assert.match(html, /문서 목차/);
  assert.match(html, /책처럼 읽는 목차/);
  assert.match(html, /chapter-card/);
  assert.match(html, /appendix\/evidence-index\.html/);
  assert.doesNotMatch(html, /href="(?:chapters|appendix)\/[^"]+\.md"/);
  assert.match(html, /GJC workflow artifact replay/);
  assert.match(html, /workflow artifact-backed/);
  assert.match(html, /source-confirmed/);
  assert.match(html, /runtime-confirmed/);
  assert.match(html, /artifact-backed/);
  assert.match(html, /Vibe SDLC/);
  for (const name of ['OpenAI Codex', 'Aider', 'OpenHands', 'SWE-agent', 'LazyCodex', 'Gajae-Code', 'Hermes']) {
    assert.match(html, new RegExp(name));
  }
});

test('chapter source markdown is structured like a book', () => {
  const toc = read('chapters/README.md');
  const ch1 = read('chapters/01-research-question.md');
  const ch3 = read('chapters/03-common-architecture.md');
  const ch5 = read('chapters/05-control-plane-triad.md');
  const appendix = read('appendix/evidence-index.md');
  assert.match(toc, /읽는 순서/);
  assert.match(toc, /독자에게 주는 약속/);
  assert.match(ch1, /agent loop, context assembly, tool boundary/);
  assert.match(ch3, /Model client \/ router/);
  assert.match(ch5, /controlled workflow artifact replay/);
  assert.match(appendix, /Public evidence policy/);
  assert.match(appendix, /gajae-code-workflow-replay\.md/);
});

test('generated chapter and appendix HTML renders markdown semantics', () => {
  for (const file of bookHtml) {
    const page = read(file);
    assert.match(page, /<!doctype html>/i, file);
    assert.match(page, /class="book-page"/, file);
    assert.match(page, /class="book-article"/, file);
    assert.match(page, /class="rendered-markdown"/, file);
    assert.match(page, /<h1>[^#]/, file);
    assert.doesNotMatch(page, /^# /m, file);
    assert.doesNotMatch(page, /\[[^\]]+\]\([^)]+\)/, file);
  }
  const ch1 = read('chapters/01-research-question.html');
  const appendix = read('appendix/evidence-index.html');
  assert.match(ch1, /<table>/);
  assert.match(ch1, /<strong>agent loop/);
  assert.match(appendix, /<table>/);
  assert.match(appendix, /href="\.\.\/assets\/evidence\/gajae-code-workflow-replay\.md"/);
});

test('existing evidence still contains source-backed concepts', () => {
  const sourceMap = read('research/coding-agent-source-map.md');
  const framework = read('research/coding-agent-evaluation-framework.md');
  const gajae = read('research/deep-dive-gajae-code.md');
  const gjcReplay = read('assets/evidence/gajae-code-workflow-replay.md');
  assert.match(sourceMap, /https:\/\/arxiv\.org\/abs\/2407\.01489/);
  assert.doesNotMatch(sourceMap, /2407\.01494/);
  assert.match(framework, /Trace Schema/);
  assert.match(framework, /Verification honesty/);
  assert.match(gajae, /workflow artifact replay confirmed/i);
  assert.match(gjcReplay, /controlled workflow artifact replay confirmed/);
  assert.match(gjcReplay, /team --dry-run/);
  assert.doesNotMatch(gjcReplay, /\/Users\/sangwan/);
});

test('no obvious credential material is committed in public files', () => {
  const files = ['index.html', 'styles.css', 'script.js', 'README.md', 'scripts/build-book-pages.py', ...publicMarkdown, ...bookHtml];
  const joined = files.map(f => read(f)).join('\n');
  const forbidden = [
    /sk-[A-Za-z0-9_-]{20,}/,
    /ghp_[A-Za-z0-9_]{20,}/,
    /github_pat_[A-Za-z0-9_]{20,}/,
    /AIza[0-9A-Za-z_-]{20,}/,
    /(api[_-]?key|secret|token|password)\s*[:=]\s*['"]?[A-Za-z0-9_\-.]{16,}/i,
    /\/Users\/sangwan\/code\/gjc-runtime-replay-20260627/
  ];
  for (const re of forbidden) assert.doesNotMatch(joined, re);
});

test('client script provides reading progress and mobile toc', () => {
  const js = read('script.js');
  assert.match(js, /reading-progress/);
  assert.match(js, /IntersectionObserver/);
  assert.match(js, /toc-open/);
});
