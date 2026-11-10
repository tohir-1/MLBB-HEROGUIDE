import { heroes, byId, STAT_LABELS } from './data.js';
import { $, esc, param, toast } from './utils.js';
import { reveal } from './app.js';

const o = heroes.map(h => `<option value="${h.id}">${esc(h.name)}</option>`).join('');
['h1', 'h2'].forEach(id => $('#' + id).innerHTML = '<option value="">Select hero</option>' + o);
if (byId(param('a'))) $('#h1').value = param('a');

function radar(a, b) {
  const keys = Object.keys(STAT_LABELS);
  const pt = (v, i) => { const ang = (-90 + 90 * i) * Math.PI / 180, r = 80 * v / 10; return `${(100 + r * Math.cos(ang)).toFixed(1)},${(100 + r * Math.sin(ang)).toFixed(1)}`; };
  const poly = h => keys.map((k, i) => pt(h.stats[k], i)).join(' ');
  const grid = [3, 6, 10].map(v => `<polygon points="${keys.map((k, i) => pt(v, i)).join(' ')}" fill="none" stroke="currentColor" opacity=".2"/>`).join('');
  return `<svg viewBox="-20 -5 240 210" class="radar" role="img" aria-label="Radar chart">${grid}<polygon points="${poly(a)}" fill="#8B5CF6" fill-opacity=".35" stroke="#8B5CF6" stroke-width="2"/><polygon points="${poly(b)}" fill="#38BDF8" fill-opacity=".3" stroke="#38BDF8" stroke-width="2"/>
  <text x="100" y="10" text-anchor="middle" font-size="9" fill="currentColor">Damage</text><text x="198" y="103" text-anchor="end" font-size="9" fill="currentColor">Durability</text><text x="100" y="200" text-anchor="middle" font-size="9" fill="currentColor">Mobility</text><text x="2" y="103" font-size="9" fill="currentColor">Crowd Ctrl</text></svg>`;
}
$('#cmp').addEventListener('click', () => {
  const a = byId($('#h1').value), b = byId($('#h2').value), out = $('#cmpOut');
  if (!a || !b) return toast('Select both heroes.');
  if (a.id === b.id) return toast('Choose two different heroes.');
  const card = h => `<div class="card pad"><img class="thumb" src="${h.image}" alt="${esc(h.name)}"><h3>${esc(h.name)}</h3><div class="meta"><span class="badge r-${h.role}">${h.role}</span><span class="badge">${h.lane}</span><span class="badge d-${h.difficulty}">${h.difficulty}</span></div>
    ${Object.entries(h.stats).map(([k, v]) => `<div class="bar"><span>${STAT_LABELS[k]}</span><i><u style="width:${v * 10}%"></u></i><b>${v}</b></div>`).join('')}<p class="small muted">Skills: ${h.skills.length ? h.skills.length + ' entered' : 'no verified skill data yet'}</p></div>`;
  const notes = Object.keys(STAT_LABELS).map(k => a.stats[k] === b.stats[k] ? `${STAT_LABELS[k]}: similar` : `${STAT_LABELS[k]}: ${a.stats[k] > b.stats[k] ? a.name : b.name} is higher`);
  out.innerHTML = `<div class="grid2">${card(a)}${card(b)}</div><div class="card pad center">${radar(a, b)}<p><span class="dot p"></span>${esc(a.name)} <span class="dot b"></span>${esc(b.name)}</p></div>
  <div class="card pad"><h3>Differences</h3><ul class="list">${notes.map(n => `<li>${esc(n)}</li>`).join('')}</ul><p class="muted">Neither hero is "better" overall — each is useful in different situations, team compositions and playstyles. Stats are sample values (1–10).</p></div>`;
  reveal();
});
