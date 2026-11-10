import { byId, guides } from './data.js';
import { $, $$ } from './utils.js';
import { heroCard, buildCard, guideCard, getBuild, reveal } from './app.js';
import { favs, clearFavs } from './storage.js';

let tab = 'heroes';
const R = { heroes: id => byId(id), builds: id => getBuild(id), guides: id => guides.find(g => g.id === id) };
const C = { heroes: heroCard, builds: buildCard, guides: guideCard };
const label = { heroes: (x) => x.name, builds: (x) => x.name, guides: (x) => x.title };

function render() {
  $$('.tab').forEach(t => { t.classList.toggle('on', t.dataset.tab === tab); const n = favs(t.dataset.tab).length; t.querySelector('i').textContent = n; });
  const q = $('#fq').value.toLowerCase();
  const list = favs(tab).map(R[tab]).filter(Boolean).filter(x => label[tab](x).toLowerCase().includes(q));
  $('#fGrid').innerHTML = list.map(x => C[tab](x)).join('');
  const total = favs(tab).length;
  $('#fEmpty').hidden = list.length > 0;
  $('#fEmpty p').textContent = total ? 'No favorites match your filter.' : `You have no favorite ${tab} yet. Tap the ♥ icon on any card to save it here.`;
  $('#fClear').hidden = !total; reveal();
}
$('.tabs').addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) { tab = t.dataset.tab; render(); } });
$('#fq').addEventListener('input', render);
$('#fClear').addEventListener('click', () => { if (confirm(`Remove all favorite ${tab}?`)) { clearFavs(tab); render(); } });
document.addEventListener('favchange', () => setTimeout(render, 250));
render();
