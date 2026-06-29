#!/usr/bin/env python3
"""Generate static HTML book pages from the public chapter/appendix Markdown.

This project intentionally keeps source/evidence Markdown in the repo, but public
book navigation should land on styled HTML pages rather than raw Markdown served
by GitHub Pages.
"""
from __future__ import annotations

import html
import re
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASE_URL = 'https://bitboom.github.io/ai-agent-workflow-research/'
SCRIPT_VERSION = '20260629-orchestrator'


@dataclass(frozen=True)
class Page:
    source: str
    output: str
    label: str
    short: str


PAGES = [
    Page('chapters/README.md', 'chapters/index.html', 'Contents', '목차'),
    Page('chapters/01-research-question.md', 'chapters/01-research-question.html', 'Chapter 01', '중심 질문'),
    Page('chapters/02-agent-taxonomy.md', 'chapters/02-agent-taxonomy.html', 'Chapter 02', '분석 프레임'),
    Page('chapters/03-common-architecture.md', 'chapters/03-common-architecture.html', 'Chapter 03', 'Gajae-Code'),
    Page('chapters/04-implementation-atlas.md', 'chapters/04-implementation-atlas.html', 'Chapter 04', 'Hermes'),
    Page('chapters/05-control-plane-triad.md', 'chapters/05-control-plane-triad.html', 'Chapter 05', 'LazyCodex/OmO'),
    Page('chapters/06-evaluation-framework.md', 'chapters/06-evaluation-framework.html', 'Chapter 06', '비교'),
    Page('chapters/07-caveats-and-next.md', 'chapters/07-caveats-and-next.html', 'Chapter 07', '다음 검증'),
    Page('appendix/evidence-index.md', 'appendix/evidence-index.html', 'Appendix', 'Evidence index'),
]

OUTPUT_BY_MD = {p.source: p.output for p in PAGES}


def rel_prefix(output: str) -> str:
    depth = len(Path(output).parts) - 1
    return '../' * depth


def slugify(text: str) -> str:
    text = re.sub(r'<[^>]+>', '', text)
    text = text.strip().lower()
    text = re.sub(r'[`*_~\[\]().,/:·—–]+', ' ', text)
    text = re.sub(r'\s+', '-', text).strip('-')
    return text or 'section'


def convert_href(href: str, source_path: Path, output_path: Path) -> str:
    if re.match(r'^(https?:|mailto:|#)', href):
        return href

    path_part, sep, fragment = href.partition('#')
    fragment_suffix = f'#{fragment}' if sep else ''

    if path_part.startswith('../index.html') or path_part == 'index.html':
        return rel_prefix(str(output_path)) + 'index.html' + fragment_suffix

    source_dir = source_path.parent
    try:
        resolved = (ROOT / source_dir / path_part).resolve(strict=False).relative_to(ROOT).as_posix()
    except ValueError:
        resolved = re.sub(r'/+', '/', (source_dir / path_part).as_posix())

    if resolved in OUTPUT_BY_MD:
        return Path(rel_prefix(str(output_path)) + OUTPUT_BY_MD[resolved]).as_posix() + fragment_suffix

    return href


def inline(text: str, source_path: Path, output_path: Path) -> str:
    placeholders: list[str] = []

    def stash(value: str) -> str:
        placeholders.append(value)
        return f'\uFFF0{len(placeholders)-1}\uFFF1'

    def repl_code(m: re.Match[str]) -> str:
        return stash(f'<code>{html.escape(m.group(1))}</code>')

    text = re.sub(r'`([^`]+)`', repl_code, text)
    text = html.escape(text)

    def repl_link(m: re.Match[str]) -> str:
        label = m.group(1)
        href = html.unescape(m.group(2))
        converted = convert_href(href, source_path, output_path)
        return f'<a href="{html.escape(converted, quote=True)}">{label}</a>'

    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', repl_link, text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'\*([^*]+)\*', r'<em>\1</em>', text)

    def unstash(m: re.Match[str]) -> str:
        return placeholders[int(m.group(1))]

    text = re.sub('\uFFF0(\d+)\uFFF1', unstash, text)
    return text


def plain_text(markdown: str) -> str:
    text = re.sub(r'```[\s\S]*?```', ' ', markdown)
    text = re.sub(r'^#+\s*', '', text, flags=re.MULTILINE)
    text = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    text = re.sub(r'[`*_>|]', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def page_description(markdown: str) -> str:
    for block in re.split(r'\n\s*\n', markdown):
        stripped = block.strip()
        if not stripped or stripped.startswith('#') or stripped.startswith('[') or stripped.startswith('|'):
            continue
        desc = plain_text(stripped)
        if desc:
            return desc[:155]
    return 'Gajae-Code, Hermes Agent, LazyCodex/OmO를 Workflow Control Plane 관점에서 읽는 한국어 리서치 북 챕터입니다.'


def is_table_start(lines: list[str], i: int) -> bool:
    return i + 1 < len(lines) and lines[i].strip().startswith('|') and re.match(r'^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$', lines[i+1])


def parse_table(lines: list[str], i: int, source: Path, output: Path) -> tuple[str, int]:
    rows = []
    while i < len(lines) and lines[i].strip().startswith('|'):
        raw = lines[i].strip().strip('|')
        cells = [c.strip() for c in raw.split('|')]
        rows.append(cells)
        i += 1
    header = rows[0]
    body = rows[2:]
    parts = ['<div class="table-wrap"><table>']
    parts.append('<thead><tr>' + ''.join(f'<th>{inline(c, source, output)}</th>' for c in header) + '</tr></thead>')
    parts.append('<tbody>')
    for row in body:
        while len(row) < len(header):
            row.append('')
        parts.append('<tr>' + ''.join(f'<td>{inline(c, source, output)}</td>' for c in row[:len(header)]) + '</tr>')
    parts.append('</tbody></table></div>')
    return '\n'.join(parts), i


def render_markdown(markdown: str, source_path: Path, output_path: Path) -> tuple[str, str, list[tuple[int, str, str]]]:
    lines = markdown.splitlines()
    title = 'Untitled'
    body_start = 0
    if lines and lines[0].startswith('# '):
        title = lines[0][2:].strip()
        body_start = 1
    while body_start < len(lines) and not lines[body_start].strip():
        body_start += 1
    if body_start < len(lines) and lines[body_start].strip().startswith('['):
        body_start += 1
    lines = lines[body_start:]

    out: list[str] = []
    headings: list[tuple[int, str, str]] = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped.startswith('```'):
            lang = stripped[3:].strip()
            i += 1
            code_lines = []
            while i < len(lines) and not lines[i].strip().startswith('```'):
                code_lines.append(lines[i])
                i += 1
            if i < len(lines):
                i += 1
            cls = f' class="language-{html.escape(lang)}"' if lang else ''
            escaped_code = html.escape('\n'.join(code_lines))
            out.append(f'<pre><code{cls}>{escaped_code}</code></pre>')
            continue
        if is_table_start(lines, i):
            table, i = parse_table(lines, i, source_path, output_path)
            out.append(table)
            continue
        m = re.match(r'^(#{2,6})\s+(.+)$', stripped)
        if m:
            level = len(m.group(1))
            text = m.group(2).strip()
            sid = slugify(text)
            headings.append((level, text, sid))
            out.append(f'<h{level} id="{sid}">{inline(text, source_path, output_path)}</h{level}>')
            i += 1
            continue
        if stripped.startswith('>'):
            parts = []
            while i < len(lines) and lines[i].strip().startswith('>'):
                parts.append(lines[i].strip().lstrip('>').strip())
                i += 1
            out.append('<blockquote>' + inline(' '.join(parts), source_path, output_path) + '</blockquote>')
            continue
        if re.match(r'^[-*]\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                items.append(re.sub(r'^[-*]\s+', '', lines[i].strip()))
                i += 1
            out.append('<ul>' + ''.join(f'<li>{inline(item, source_path, output_path)}</li>' for item in items) + '</ul>')
            continue
        if re.match(r'^\d+\.\s+', stripped):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                items.append(re.sub(r'^\d+\.\s+', '', lines[i].strip()))
                i += 1
            out.append('<ol>' + ''.join(f'<li>{inline(item, source_path, output_path)}</li>' for item in items) + '</ol>')
            continue
        para = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if not nxt or nxt.startswith('#') or nxt.startswith('```') or nxt.startswith('|') or nxt.startswith('>') or re.match(r'^[-*]\s+', nxt) or re.match(r'^\d+\.\s+', nxt):
                break
            para.append(nxt)
            i += 1
        out.append('<p>' + inline(' '.join(para), source_path, output_path) + '</p>')
    return title, '\n'.join(out), headings


def page_nav(current: Page) -> tuple[Page | None, Page | None]:
    idx = PAGES.index(current)
    prevp = PAGES[idx-1] if idx > 0 else None
    nextp = PAGES[idx+1] if idx + 1 < len(PAGES) else None
    return prevp, nextp


def nav_href(target: Page, current: Page) -> str:
    return Path(rel_prefix(current.output) + target.output).as_posix()


def absolute_href(target: Page) -> str:
    return BASE_URL + target.output


def chapter_nav_link(target: Page, current: Page) -> str:
    class_attr = 'active' if target == current else ''
    current_attr = ' aria-current="page"' if target == current else ''
    return (
        f'<a class="{class_attr}"{current_attr} href="{nav_href(target, current)}">'
        f'<span>{html.escape(target.label)}</span>{html.escape(target.short)}</a>'
    )


def template(page: Page, title: str, body: str, headings: list[tuple[int, str, str]], description: str) -> str:
    prefix = rel_prefix(page.output)
    canonical = BASE_URL + page.output
    prevp, nextp = page_nav(page)
    toc_links = '\n'.join(
        f'<a class="level-{level}" href="#{sid}">{html.escape(text)}</a>'
        for level, text, sid in headings if level <= 3
    ) or '<span class="empty-toc">섹션 목차 없음</span>'
    chapter_links = '\n'.join(chapter_nav_link(p, page) for p in PAGES)
    prev_head = f'  <link rel="prev" href="{html.escape(absolute_href(prevp), quote=True)}">\n' if prevp else ''
    next_head = f'  <link rel="next" href="{html.escape(absolute_href(nextp), quote=True)}">\n' if nextp else ''
    prev_html = f'<a class="book-prev" href="{nav_href(prevp, page)}"><span>이전</span>{html.escape(prevp.short)}</a>' if prevp else '<span></span>'
    next_html = f'<a class="book-next" href="{nav_href(nextp, page)}"><span>다음</span>{html.escape(nextp.short)}</a>' if nextp else '<span></span>'
    escaped_title = html.escape(title, quote=True)
    escaped_description = html.escape(description, quote=True)
    return f'''<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{html.escape(title)} — Workflow Control Plane 분석</title>
  <meta name="description" content="{escaped_description}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="{html.escape(canonical, quote=True)}">
{prev_head}{next_head}  <meta property="og:locale" content="ko_KR">
  <meta property="og:site_name" content="AI Agent Workflow Research">
  <meta property="og:type" content="article">
  <meta property="og:title" content="{escaped_title}">
  <meta property="og:description" content="{escaped_description}">
  <meta property="og:url" content="{html.escape(canonical, quote=True)}">
  <meta property="og:image" content="{BASE_URL}assets/og-image.svg">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="{escaped_title}">
  <meta name="twitter:description" content="{escaped_description}">
  <meta name="twitter:image" content="{BASE_URL}assets/og-image.svg">
  <link rel="icon" href="{prefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="{prefix}styles.css">
</head>
<body class="book-page">
  <a class="skip-link" href="#content">본문으로 건너뛰기</a>
  <div class="progress" aria-hidden="true"><span id="reading-progress"></span></div>
  <header class="site-header">
    <a class="brand" href="{prefix}index.html" aria-label="첫 화면으로 이동">
      <span class="brand-mark">CONTROL</span>
      <span>Workflow Book</span>
    </a>
    <nav class="top-nav" aria-label="상단 메뉴">
      <a href="{prefix}index.html#contents">목차</a>
      <a href="{prefix}index.html#taxonomy">분석 프레임</a>
      <a href="{prefix}index.html#control-planes">Orchestrators</a>
      <a href="{prefix}appendix/evidence-index.html">근거</a>
      <a class="button button-small" href="https://github.com/bitboom/ai-agent-workflow-research" target="_blank" rel="noopener">GitHub</a>
    </nav>
    <button class="toc-toggle" type="button" aria-controls="site-toc" aria-expanded="false">목차</button>
  </header>
  <button class="toc-backdrop" type="button" aria-label="목차 닫기" hidden></button>

  <main class="book-shell section-shell">
    <aside class="toc book-sidebar" id="site-toc" aria-label="책 목차">
      <p class="toc-title">Book</p>
      <nav class="chapter-nav">{chapter_links}</nav>
      <p class="toc-title section-toc-title">On this page</p>
      <nav class="page-toc">{toc_links}</nav>
    </aside>
    <article class="book-article" id="content">
      <p class="eyebrow">{html.escape(page.label)}</p>
      <h1>{html.escape(title)}</h1>
      <div class="book-nav top">{prev_html}{next_html}</div>
      <div class="rendered-markdown">
{body}
      </div>
      <div class="book-nav bottom">{prev_html}{next_html}</div>
      <footer class="article-footer">
        <p>본문의 근거와 판정 라벨은 <a href="{prefix}appendix/evidence-index.html">Evidence index</a>에서 함께 추적한다.</p>
      </footer>
    </article>
  </main>
  <script src="{prefix}script.js?v={SCRIPT_VERSION}"></script>
</body>
</html>
'''


def main() -> None:
    for page in PAGES:
        source_path = Path(page.source)
        output_path = Path(page.output)
        markdown = (ROOT / source_path).read_text(encoding='utf-8')
        title, body, headings = render_markdown(markdown, source_path, output_path)
        html_text = template(page, title, body, headings, page_description(markdown))
        target = ROOT / output_path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(html_text, encoding='utf-8')
        print(f'generated {output_path}')


if __name__ == '__main__':
    main()
