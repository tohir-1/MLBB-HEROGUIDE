import { heroes, ROLES, LANES, DIFFS } from './data.js';
import { $, $$, debounce, param } from './utils.js';
import { heroCard, reveal } from './app.js';

const S = { q: param('q') || '', role: ROLES.includes(param('role')) ? param('role') : 'All', lane: '', diff: '', sort: 'az', n: 12 };
const grid = $('#grid');
$('#roleChips').innerHTML = ['All', ...ROLES].map(r => `<button class="chip" data-role="${r}">${r}</button>`).join('');
const opts = (a, ph) => `<option value="">${ph}</option>` + a.map(x => `<option>${x}</option>`).join('');
$('#fLane').innerHTML = opts(LANES, 'All lanes'); $('#fDiff').innerHTML = opts(DIFFS, 'All difficulties');
$('#fQ').value = S.q;

function filtered() {
  const q = S.q.trim().toLowerCase(), d = { Easy: 1, Medium: 2, Hard: 3 };
  const a = heroes.filter(h => (S.role === 'All' || h.role === S.role) && (!S.lane || h.lane === S.lane) && (!S.diff || h.difficulty === S.diff) && (!q || `${h.name} ${h.role} ${h.lane}`.toLowerCase().includes(q)));
  const sorts = { az: (x, y) => x.name.localeCompare(y.name), za: (x, y) => y.name.localeCompare(x.name), diff: (x, y) => d[x.difficulty] - d[y.difficulty], new: (x, y) => y.order - x.order };
  return a.sort(sorts[S.sort]);
}
function render() {
  const a = filtered();
  $$('#roleChips .chip').forEach(c => c.classList.toggle('on', c.dataset.role === S.role));
  $('#count').textContent = `${a.length} hero${a.length === 1 ? '' : 'es'} found`;
  grid.innerHTML = a.slice(0, S.n).map(heroCard).join('');
  $('#empty').hidden = a.length > 0; $('#more').hidden = S.n >= a.length;
  reveal();
}
const reset = () => { S.n = 12; render(); };
grid.innerHTML = Array(8).fill('<div class="card sk"></div>').join('');   // loading state
setTimeout(render, 350);

$('#roleChips').addEventListener('click', e => { const b = e.target.closest('[data-role]'); if (b) { S.role = b.dataset.role; reset(); } });
$('#fQ').addEventListener('input', debounce(e => { S.q = e.target.value; reset(); }, 150));
$('#fLane').addEventListener('change', e => { S.lane = e.target.value; reset(); });
$('#fDiff').addEventListener('change', e => { S.diff = e.target.value; reset(); });
$('#fSort').addEventListener('change', e => { S.sort = e.target.value; reset(); });
$('#more').addEventListener('click', () => { S.n += 12; render(); });
$$('.clear').forEach(b => b.addEventListener('click', () => {
  Object.assign(S, { q: '', role: 'All', lane: '', diff: '', sort: 'az', n: 12 });
  $('#fQ').value = ''; $('#fLane').value = ''; $('#fDiff').value = ''; $('#fSort').value = 'az'; render();
}));
