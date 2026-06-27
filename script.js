const progress = document.getElementById('reading-progress');
function updateProgress() {
  if (!progress) return;
  const doc = document.documentElement;
  const scrollTop = doc.scrollTop || document.body.scrollTop;
  const height = doc.scrollHeight - doc.clientHeight;
  const pct = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
}
window.addEventListener('scroll', updateProgress, { passive: true });
window.addEventListener('resize', updateProgress);
updateProgress();

const links = [...document.querySelectorAll('.toc a[href^="#"]')];
const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${visible.target.id}`;
      link.toggleAttribute('aria-current', active);
      link.style.fontWeight = active ? '700' : '500';
    });
  }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .6] });
  sections.forEach(section => observer.observe(section));
}

const tocToggle = document.querySelector('.toc-toggle');
const tocBackdrop = document.querySelector('.toc-backdrop');
const toc = document.getElementById('site-toc');
function setTocOpen(open) {
  if (!tocToggle || !tocBackdrop || !toc) return;
  document.body.classList.toggle('toc-open', open);
  tocToggle.setAttribute('aria-expanded', String(open));
  tocBackdrop.hidden = !open;
  toc.setAttribute('aria-hidden', String(!open && window.matchMedia('(max-width: 900px)').matches));
}
if (tocToggle && tocBackdrop && toc) {
  tocToggle.addEventListener('click', () => setTocOpen(!document.body.classList.contains('toc-open')));
  tocBackdrop.addEventListener('click', () => setTocOpen(false));
  toc.addEventListener('click', event => { if (event.target.closest('a')) setTocOpen(false); });
  window.addEventListener('keydown', event => { if (event.key === 'Escape') setTocOpen(false); });
  window.addEventListener('resize', () => { if (!window.matchMedia('(max-width: 900px)').matches) setTocOpen(false); });
  setTocOpen(false);
}
