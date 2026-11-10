import { heroes, byId, STAT_LABELS } from './data.js';
import { $, esc, param } from './utils.js';
import { openModal, closeModal, reveal } from './app.js';

const enemies = [null, null, null, null, null];
const slots = $('#slots');

function drawSlots() {
  slots.innerHTML = enemies.map((id, i) => { const h = byId(id); return h
    ? `<div class="slot filled"><img src="${h.image}" alt="${esc(h.name)}"><b>${esc(h.name)}</b><button class="btn sm danger" data-rm="${i}" aria-label="Remove ${esc(h.name)}">Remove</button></div>`
    : `<button class="slot" data-pick="${i}" aria-label="Select enemy hero ${i + 1}"><span>＋</span>Enemy ${i + 1}</button>`; }).join('');
}
function pick(i) {
  const m = openModal(`<h2>Select enemy hero</h2><input id="pq" type="search" placeholder="Search hero..." aria-label="Search hero"><div class="pick-grid" id="pg"></div>`, 'wide');
  const draw = () => {
    const q = $('#pq').value.toLowerCase();
    const list = heroes.filter(h => h.name.toLowerCase().includes(q) && !enemies.includes(h.id));
    $('#pg').innerHTML = list.length ? list.map(h => `<button class="pk" data-id="${h.id}"><img src="${h.image}" alt="${esc(h.name)}" loading="lazy"><span>${esc(h.name)}</span></button>`).join('') : '<p class="muted">No heroes found.</p>';
  };
  draw(); $('#pq').addEventListener('input', draw);
  m.addEventListener('click', e => { const b = e.target.closest('.pk'); if (b) { enemies[i] = b.dataset.id; closeModal(); drawSlots(); } });
}
slots.addEventListener('click', e => {
  const p = e.target.closest('[data-pick]'), r = e.target.closest('[data-rm]');
  if (p) pick(+p.dataset.pick); if (r) { enemies[+r.dataset.rm] = null; drawSlots(); }
});

function find() {
  const sel = enemies.filter(Boolean), out = $('#cResults');
  if (!sel.length) { out.innerHTML = '<div class="state"><p>Select at least 1 enemy hero first.</p></div>'; return; }
  const res = heroes.filter(c => !sel.includes(c.id)).map(c => {
    let score = 0; const why = [], risk = [];
    sel.forEach(id => {
      const e = byId(id);
      if (c.strongAgainst.includes(id)) { score += 2; why.push(`Strong against ${e.name}`); }
      if (e.weakAgainst.includes(c.id)) { score += 2; why.push(`${e.name} is weak against ${c.name}`); }
      if (c.weakAgainst.includes(id)) { score -= 2; risk.push(e.name); }
      if (e.strongAgainst.includes(c.id)) { score -= 2; if (!risk.includes(e.name)) risk.push(e.name); }
    });
    return { c, score, why, risk };
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score).slice(0, 8);
  if (!res.length) { out.innerHTML = '<div class="state"><p>No matching counter data found for this selection. Data is sample-based and will not be guessed.</p></div>'; return; }
  const max = res[0].score;
  out.innerHTML = res.map(({ c, score, why, risk }) => {
    const top = Object.entries(c.stats).sort((a, b) => b[1] - a[1])[0];
    return `<article class="card pad cres reveal"><img src="${c.image}" alt="${esc(c.name)}"><div><h3><a href="hero-details.html?id=${c.id}">${esc(c.name)}</a> <span class="badge r-${c.role}">${c.role}</span></h3>
    <div class="bar"><span>Match</span><i><u style="width:${Math.round(score / max * 100)}%"></u></i><b>${score}</b></div>
    <p><b>Recommended role:</b> ${c.role} (${c.lane})</p><p><b>Why:</b> ${why.map(esc).join('; ')}</p>
    <p><b>Strength:</b> ${STAT_LABELS[top[0]]} ${top[1]}/10${risk.length ? ` · <span class="muted">Careful vs ${risk.map(esc).join(', ')}</span>` : ''}</p>
    <a class="btn sm" href="builds.html?hero=${c.id}">Recommended build</a></div></article>`;
  }).join('') + '<p class="small muted">Results are based on sample strongAgainst / weakAgainst data.</p>';
  reveal();
}
$('#find').addEventListener('click', find);
$('#resetC').addEventListener('click', () => { enemies.fill(null); drawSlots(); $('#cResults').innerHTML = ''; });
if (byId(param('enemy'))) enemies[0] = param('enemy');
drawSlots();
