import { heroes, builds, ROLES, LANES, BUILD_TYPES, ITEMS, EMBLEMS, TALENTS, SPELLS, byId } from './data.js';
import { $, $$, esc, param, toast } from './utils.js';
import { buildCard, getBuild, reveal } from './app.js';
import { customBuilds, saveCustomBuilds, favs, set } from './storage.js';

const opt = (a, ph) => (ph ? `<option value="">${ph}</option>` : '') + a.map(x => `<option value="${x.v ?? x}">${x.l ?? x}</option>`).join('');
const hOpts = heroes.map(h => ({ v: h.id, l: h.name }));
$('#bHero').innerHTML = opt(hOpts, 'All heroes'); $('#bRole').innerHTML = opt(ROLES, 'All roles');
$('#bLane').innerHTML = opt(LANES, 'All lanes'); $('#bType').innerHTML = opt(BUILD_TYPES, 'All build types');
if (byId(param('hero'))) $('#bHero').value = param('hero');

function render() {
  const f = { hero: $('#bHero').value, role: $('#bRole').value, lane: $('#bLane').value, type: $('#bType').value };
  const a = [...builds, ...customBuilds()].filter(b => { const h = byId(b.heroId); return h && (!f.hero || b.heroId === f.hero) && (!f.role || h.role === f.role) && (!f.lane || h.lane === f.lane) && (!f.type || b.type === f.type); });
  $('#bGrid').innerHTML = a.map(b => buildCard(b)).join('');
  $('#bEmpty').hidden = a.length > 0;
  const mine = customBuilds();
  $('#myBuilds').innerHTML = mine.length ? mine.map(b => buildCard(b, `<div class="row"><button class="btn sm ghost" data-edit="${b.id}">Edit</button><button class="btn sm danger" data-del="${b.id}">Delete</button></div>`)).join('') : '<p class="muted">You have not saved any custom builds yet.</p>';
  reveal();
}
['bHero', 'bRole', 'bLane', 'bType'].forEach(id => $('#' + id).addEventListener('change', render));
$('#bClear').addEventListener('click', () => { ['bHero', 'bRole', 'bLane', 'bType'].forEach(id => $('#' + id).value = ''); render(); });

/* ---- Custom Build Creator ---- */
$('#cHero').innerHTML = opt(hOpts, 'Select hero');
$('#cItems').innerHTML = [1, 2, 3, 4, 5, 6].map(i => `<select class="cItem" aria-label="Item ${i}">${opt(ITEMS, 'Item ' + i)}</select>`).join('');
$('#cEmblem').innerHTML = opt(EMBLEMS, 'Select emblem'); $('#cTalent').innerHTML = opt(TALENTS, 'Select talent');
$('#cSpell').innerHTML = opt(Object.keys(SPELLS), 'Select battle spell');
let editId = null;
const resetForm = () => { editId = null; $('#cForm').reset(); $('#cSave').textContent = 'Save Build'; };

$('#cForm').addEventListener('submit', e => {
  e.preventDefault();
  const items = $$('.cItem').map(s => s.value), v = id => $('#' + id).value.trim();
  if (!v('cName') || !v('cHero') || !v('cEmblem') || !v('cTalent') || !v('cSpell') || items.some(i => !i)) return toast('Please fill in every field and choose 6 items.');
  const hero = byId(v('cHero'));
  const b = { id: editId || 'c-' + Date.now(), heroId: hero.id, name: v('cName'), type: hero.builds[0].type, items, emblem: v('cEmblem'), talents: [v('cTalent')], spell: v('cSpell'), desc: `Custom build for ${hero.name}.`, custom: true };
  const all = customBuilds(), i = all.findIndex(x => x.id === b.id);
  i < 0 ? all.push(b) : all[i] = b;
  if (!saveCustomBuilds(all)) return toast('Storage unavailable — build could not be saved.');
  toast(editId ? 'Build updated' : 'Build saved'); resetForm(); render();
});
$('#cReset').addEventListener('click', resetForm);
$('#myBuilds').addEventListener('click', e => {
  const ed = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
  if (ed) {
    const b = getBuild(ed.dataset.edit); if (!b) return toast('Build not found.');
    editId = b.id; $('#cHero').value = b.heroId; $('#cName').value = b.name; $('#cEmblem').value = b.emblem; $('#cTalent').value = b.talents[0]; $('#cSpell').value = b.spell;
    $$('.cItem').forEach((s, i) => s.value = b.items[i]); $('#cSave').textContent = 'Update Build';
    $('#creator').scrollIntoView({ behavior: 'smooth' });
  }
  if (del && confirm('Delete this build?')) {
    saveCustomBuilds(customBuilds().filter(b => b.id !== del.dataset.del));
    set('fav_builds', favs('builds').filter(id => id !== del.dataset.del)); toast('Build deleted'); render();
  }
});
render();
