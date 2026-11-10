import { guides, GUIDE_CATS } from './data.js';
import { $, $$, esc, param } from './utils.js';
import { guideCard, openModal, favBtn, reveal } from './app.js';

let cat = 'All', q = '';
$('#gChips').innerHTML = ['All', ...GUIDE_CATS].map(c => `<button class="chip" data-c="${c}">${c}</button>`).join('');
function render() {
  $$('#gChips .chip').forEach(c => c.classList.toggle('on', c.dataset.c === cat));
  const a = guides.filter(g => (cat === 'All' || g.category === cat) && (g.title + g.body).toLowerCase().includes(q));
  $('#gGrid').innerHTML = a.map(guideCard).join(''); $('#gEmpty').hidden = a.length > 0; reveal();
}
function read(id) {
  const g = guides.find(x => x.id === id); if (!g) return;
  openModal(`<span class="badge">${esc(g.category)}</span><h2>${esc(g.title)}</h2><p class="small muted">${g.time} min read · ${g.source} · updated ${g.lastUpdated}</p><p>${esc(g.body)}</p>${favBtn('guides', g.id, g.title).replace('class="fav', 'class="fav static')}`, 'sm');
}
$('#gChips').addEventListener('click', e => { const b = e.target.closest('[data-c]'); if (b) { cat = b.dataset.c; render(); } });
$('#gq').addEventListener('input', e => { q = e.target.value.toLowerCase(); render(); });
$('#gGrid').addEventListener('click', e => { const a = e.target.closest('a[href*="open="]'); if (a) { e.preventDefault(); read(new URL(a.href).searchParams.get('open')); } });
render(); if (param('open')) read(param('open'));
