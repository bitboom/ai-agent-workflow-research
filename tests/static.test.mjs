import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');

test('static site core files exist', () => {
  assert.ok(existsSync(join(root, 'index.html')));
  assert.ok(existsSync(join(root, '.nojekyll')));
  assert.ok(existsSync(join(root, 'assets/evidence/reconciled-facts.md')));
});

test('index contains required report sections and local-friendly links', () => {
  for (const id of ['summary', 'layers', 'matrix', 'tools', 'workflow', 'recommendation', 'evidence']) {
    assert.match(html, new RegExp(`id="${id}"`));
  }
  assert.match(html, /AI Agent Workflow Research/);
  assert.match(html, /Gajae-Code/);
  assert.match(html, /Hermes Agent/);
  assert.match(html, /LazyCodex/);
  assert.match(html, /OpenAI Codex|Codex CLI/);
});

test('no obvious credential material is committed in public files', () => {
  const files = ['index.html', 'README.md', ...readdirSync(join(root, 'assets/evidence')).filter(f => f.endsWith('.md')).map(f => `assets/evidence/${f}`)];
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

test('theme toggle script is present without external dependencies', () => {
  assert.match(html, /localStorage\.getItem\('theme'\)/);
  assert.doesNotMatch(html, /https:\/\//);
});
