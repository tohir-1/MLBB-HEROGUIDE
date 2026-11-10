import { heroes, builds, guides, ROLES } from './data.js';
import { debounce, esc } from './utils.js';

export function searchAll(q) {
  q = q.trim().toLowerCase(); if (!q) return [];
  const out = [];
  heroes.forEach(h => { if ((h.name + ' ' + h.role + ' ' + h.lane).toLowerCase().includes(q)) out.push({ t: 'Hero', label: h.name, sub: `${h.role} · ${h.lane}`, href: `hero-details.html?id=${h.id}` }); });
  ROLES.forEach(r => { if (r.toLowerCase().includes(q)) out.push({ t: 'Role', label: r, sub: 'Browse heroes', href: `heroes.html?role=${r}` }); });
  builds.forEach(b => { if (b.name.toLowerCase().includes(q) || b.type.toLowerCase().includes(q)) out.push({ t: 'Build', label: b.name, sub: b.type, href: `hero-details.html?id=${b.heroId}` }); });
  guides.forEach(g => { if ((g.title + ' ' + g.category).toLowerCase().includes(q)) out.push({ t: 'Guide', label: g.title, sub: g.category, href: `guides.html?open=${g.id}` }); });
  return out.slice(0, 8);
}

// input + suggestion box: instant search, debounce, keyboard navigation
export function attachSearch(input, box) {
  let items = [], idx = -1;
  const render = () => {
    if (!input.value.trim()) { box.innerHTML = ''; box.classList.remove('open'); return; }
    box.classList.add('open');
    box.innerHTML = items.length
      ? items.map((r, i) => `<a role="option" class="sg ${i === idx ? 'act' : ''}" href="${r.href}"><span class="badge">${r.t}</span><b>${esc(r.label)}</b><small>${esc(r.sub)}</small></a>`).join('')
      : '<div class="sg none">No results found. Try another keyword.</div>';
  };
  input.addEventListener('input', debounce(() => { items = searchAll(input.value); idx = -1; render(); }, 120));
  input.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); idx = Math.min(idx + 1, items.length - 1); render(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); idx = Math.max(idx - 1, 0); render(); }
    else if (e.key === 'Enter') { const r = items[idx >= 0 ? idx : 0]; if (r) location.href = r.href; }
    else if (e.key === 'Escape') { input.value = ''; render(); }
  });
}
