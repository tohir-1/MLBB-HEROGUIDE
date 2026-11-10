import { byId, STAT_LABELS, SPELLS } from './data.js';
import { $, esc, param } from './utils.js';
import { favBtn, itemIcon, reveal } from './app.js';

const h = byId(param('id')), root = $('#detail');
const link = id => { const x = byId(id); return x ? `<a class="chip" href="hero-details.html?id=${x.id}">${esc(x.name)}</a>` : ''; };

if (!h) {
  document.title = 'Hero not found — MLBB HeroGuide';
  root.innerHTML = '<div class="state"><h1>404</h1><h2>Hero not found</h2><p class="muted">The hero ID in the URL is missing or incorrect.</p><a class="btn" href="heroes.html">Browse all heroes</a></div>';
} else {
  document.title = `${h.name} — Hero Guide | MLBB HeroGuide`;
  const strong = Object.entries(h.stats).filter(([, v]) => v >= 7).map(([k]) => STAT_LABELS[k]);
  const weak = Object.entries(h.stats).filter(([, v]) => v <= 3).map(([k]) => STAT_LABELS[k]);
  const b = h.builds[0], t = h.tips;
  const slots = ['Passive', 'Skill 1', 'Skill 2', 'Ultimate'];
  const skills = slots.map((s, i) => { const k = h.skills[i]; return k
    ? `<div class="card skill"><span class="item">${esc(s[0])}</span><div><h4>${esc(s)}: ${esc(k.name)}</h4><p>${esc(k.description)}</p><small>Cooldown: ${esc(k.cooldown || '—')}</small></div></div>`
    : `<div class="card skill"><span class="item">${esc(s[0])}</span><div><h4>${s}</h4><p class="muted">No verified skill data yet. Add it to <code>skills</code> in data.js.</p></div></div>`; }).join('');
  root.innerHTML = `
  <section class="detail-head"><div class="art big"><img src="${h.image}" alt="${esc(h.name)} artwork"></div>
   <div><h1>${esc(h.name)}</h1><div class="meta"><span class="badge r-${h.role}">${h.role}</span><span class="badge">Specialty: ${esc(h.role)}</span><span class="badge">${h.lane}</span><span class="badge d-${h.difficulty}">${h.difficulty}</span></div>
   <p>${esc(h.description)}</p><div class="row">${favBtn('heroes', h.id, h.name).replace('class="fav', 'class="fav static')}<a class="btn ghost" href="compare.html?a=${h.id}">Compare</a><a class="btn ghost" href="counter.html?enemy=${h.id}">Counter this hero</a></div>
   <p class="small muted">Data: ${h.source} · updated ${h.lastUpdated}</p></div></section>
  <section class="grid2"><div class="card pad"><h2>Overview</h2><p><b>Strengths:</b> ${strong.join(', ') || 'Balanced'}</p><p><b>Weaknesses:</b> ${weak.join(', ') || 'None noted'}</p><p><b>Recommended role:</b> ${h.role} in ${h.lane}</p></div>
   <div class="card pad"><h2>Stats (sample)</h2>${Object.entries(h.stats).map(([k, v]) => `<div class="bar"><span>${STAT_LABELS[k]}</span><i><u style="width:${v * 10}%"></u></i><b>${v}/10</b></div>`).join('')}</div></section>
  <section><h2>Skills</h2><div class="grid2">${skills}</div></section>
  <section><h2>Recommended Build <span class="badge">Sample</span></h2><div class="card pad"><h3>${esc(b.name)}</h3><div class="items">${b.items.map(itemIcon).join('')}</div>
   <ul class="list">${b.items.map(i => `<li><b>${esc(i)}</b></li>`).join('')}</ul><p>${esc(b.desc)}</p><p class="small muted">Item descriptions and prices are not included because they are not verified. Add them to data.js when available.</p></div></section>
  <section class="grid2"><div class="card pad"><h2>Emblem</h2><p><b>${esc(h.emblem.type)}</b></p><ol>${h.emblem.talents.map((x, i) => `<li>Talent ${i + 1}: ${esc(x)}</li>`).join('')}</ol><p>${esc(h.emblem.explanation)}</p></div>
   <div class="card pad"><h2>Battle Spell</h2>${h.spells.map(s => `<p><b>${s}</b><br><span class="muted">${SPELLS[s] || ''}</span></p>`).join('')}</div></section>
  <section class="grid2"><div class="card pad"><h2>Strong Against</h2><div class="chips">${h.strongAgainst.map(link).join('')}</div></div><div class="card pad"><h2>Weak Against</h2><div class="chips">${h.weakAgainst.map(link).join('')}</div></div></section>
  <section><h2>Pro Tips</h2><div class="grid3">${[['Early Game', t.early], ['Mid Game', t.mid], ['Late Game', t.late], ['Combos', t.combos], ['Team Fight', t.teamfight], ['Positioning', t.positioning]].map(([a, c]) => `<div class="card pad"><h4>${a}</h4><p>${esc(c)}</p></div>`).join('')}</div></section>`;
}
reveal();
