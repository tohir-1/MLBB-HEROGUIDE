import { heroes, builds, guides, ROLES } from './data.js';
import { $, esc } from './utils.js';
import { heroCard, buildCard, guideCard, reveal } from './app.js';
import { attachSearch } from './search.js';

$('#heroArt').innerHTML = `<img src="${heroes[0].image}" alt="${heroes[0].name} artwork">`;
attachSearch($('#mainSearch'), $('#mainSugg'));
$('#stats').innerHTML = [['Total Heroes', heroes.length], ['Total Roles', ROLES.length], ['Total Builds', builds.length], ['Total Guides', guides.length]]
  .map(([l, n]) => `<div class="card stat reveal"><b>${n}</b><span>${l}</span></div>`).join('');
$('#popular').innerHTML = ['gusion', 'layla', 'tigreal', 'fanny', 'lancelot', 'kagura', 'khufra', 'hayabusa'].map(id => heroCard(heroes.find(h => h.id === id))).join('');
$('#roles').innerHTML = ROLES.map(r => `<a class="card role-card reveal r-${r}" href="heroes.html?role=${r}"><b>${r}</b><span>${heroes.filter(h => h.role === r).length} heroes</span></a>`).join('');
$('#featured').innerHTML = builds.filter(b => ['gusion', 'layla', 'tigreal'].includes(b.heroId)).map(b => buildCard(b)).join('');
$('#latest').innerHTML = guides.slice(0, 3).map(guideCard).join('');
reveal();
