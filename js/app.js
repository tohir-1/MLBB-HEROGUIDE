import { $, $$, esc, placeholder, toast } from './utils.js';
import { initTheme, toggleTheme } from './theme.js';
import { isFav, toggleFav, customBuilds } from './storage.js';
import { byId, builds } from './data.js';
import { attachSearch } from './search.js';

initTheme();

/* ---------- Umumiy komponentlar ---------- */
export const favBtn = (type, id, label) => `<button class="fav ${isFav(type, id) ? 'on' : ''}" data-fav="${type}" data-id="${esc(id)}" aria-label="Toggle favorite: ${esc(label)}" aria-pressed="${isFav(type, id)}">♥</button>`;

export const heroCard = h => `<article class="card hero-card reveal">${favBtn('heroes', h.id, h.name)}
  <a class="art" href="hero-details.html?id=${h.id}"><img src="${h.image}" alt="${esc(h.name)} artwork" loading="lazy"></a>
  <div class="cb"><h3>${esc(h.name)}</h3><div class="meta"><span class="badge r-${h.role}">${h.role}</span><span class="badge">${h.lane}</span><span class="badge d-${h.difficulty}">${h.difficulty}</span></div>
  <a class="btn sm" href="hero-details.html?id=${h.id}">View Details</a></div></article>`;

export const itemIcon = n => `<span class="item" title="${esc(n)}">${esc(n.split(/\s+/).map(w => w[0]).join('').slice(0, 2))}</span>`;

export const getBuild = id => builds.find(b => b.id === id) || customBuilds().find(b => b.id === id);

export function buildCard(b, extra = '') {
  const h = byId(b.heroId); if (!h) return '';
  return `<article class="card build-card reveal">${favBtn('builds', b.id, b.name)}
  <div class="bh"><img src="${h.image}" alt="${esc(h.name)}" loading="lazy"><div><h3>${esc(b.name)}</h3><small>${esc(h.name)} · ${h.role} · ${h.lane}</small></div></div>
  <div class="items">${b.items.map(itemIcon).join('')}</div>
  <p class="small">Emblem: <b>${esc(b.emblem)}</b> · Talent: ${esc(b.talents.join(', '))}<br>Battle Spell: <b>${esc(b.spell)}</b></p>
  <p>${esc(b.desc)}</p><div class="meta"><span class="badge">${esc(b.type)}</span><span class="badge ${b.sample ? '' : 'd-Easy'}">${b.sample ? 'Sample' : 'Custom'}</span></div>${extra}</article>`;
}

export const guideCard = g => `<article class="card guide-card reveal">${favBtn('guides', g.id, g.title)}
  <div class="cover cv${g.category.length % 8}"><span>${esc(g.category)}</span></div>
  <div class="cb"><h3>${esc(g.title)}</h3><p>${esc(g.body.slice(0, 90))}…</p><div class="meta"><span class="badge">${g.time} min read</span></div>
  <a class="btn sm" href="guides.html?open=${g.id}">Read More</a></div></article>`;

export function openModal(html, cls = '') {
  closeModal();
  const m = document.createElement('div'); m.className = 'modal'; m.id = 'modal';
  m.innerHTML = `<div class="mbox ${cls}" role="dialog" aria-modal="true"><button class="icon mclose" aria-label="Close">✕</button>${html}</div>`;
  document.body.appendChild(m); document.body.classList.add('noscroll');
  m.addEventListener('click', e => { if (e.target === m || e.target.closest('.mclose')) closeModal(); });
  setTimeout(() => $('input,button:not(.mclose)', m)?.focus(), 50);
  return m;
}
export function closeModal() { $('#modal')?.remove(); document.body.classList.remove('noscroll'); }

/* ---------- Scroll reveal ---------- */
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .08 }) : null;
export function reveal() { $$('.reveal:not(.in)').forEach(el => io ? io.observe(el) : el.classList.add('in')); }

/* ---------- Header / Footer ---------- */
const NAV = [['index.html', 'Home'], ['heroes.html', 'Heroes'], ['builds.html', 'Builds'], ['counter.html', 'Counter Pick'], ['compare.html', 'Compare'], ['guides.html', 'Guides'], ['favorites.html', 'Favorites']];
const LOGO = '<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs><path d="M16 2l11 4v9c0 7-5 12-11 15C10 27 5 22 5 15V6z" fill="url(#lg)"/><path d="M16 8v14M11 12h10" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>';

function layout() {
  const page = location.pathname.split('/').pop() || 'index.html';
  $('#site-header').innerHTML = `<div class="wrap hd"><a class="logo" href="index.html" aria-label="HeroGuide home">${LOGO}<span>Hero<b>Guide</b></span></a>
  <nav id="nav" aria-label="Main navigation">${NAV.map(([h, t]) => `<a href="${h}" ${h === page ? 'class="active" aria-current="page"' : ''}>${t}</a>`).join('')}</nav>
  <div class="hd-act"><button class="icon" id="sBtn" aria-label="Search">⌕</button><button class="icon" id="tBtn" aria-label="Toggle dark/light mode">◐</button><button class="icon burger" id="mBtn" aria-label="Open menu" aria-expanded="false">☰</button></div></div>`;
  $('#site-footer').innerHTML = `<div class="wrap ft"><div><a class="logo" href="index.html">${LOGO}<span>Hero<b>Guide</b></span></a><p class="muted">Independent fan-made guide platform for Mobile Legends: Bang Bang players.</p></div>
  <div><h4>Navigate</h4>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
  <div><h4>About</h4><p class="muted">Disclaimer: HeroGuide is not affiliated with, endorsed by or sponsored by Moonton or Mobile Legends: Bang Bang. All game names and assets belong to their owners. Data in this version is sample data.</p></div>
  <div><h4>Social</h4><a href="https://github.com" target="_blank" rel="noopener">GitHub</a><a href="https://t.me" target="_blank" rel="noopener">Telegram</a><a href="https://youtube.com" target="_blank" rel="noopener">YouTube</a></div></div>
  <div class="copy">© ${new Date().getFullYear()} MLBB HeroGuide. All rights reserved.</div>`;

  const nav = $('#nav'), mb = $('#mBtn');
  mb.addEventListener('click', () => { const o = nav.classList.toggle('open'); mb.setAttribute('aria-expanded', o); });
  $('#tBtn').addEventListener('click', () => toast(toggleTheme() === 'dark' ? 'Dark mode' : 'Light mode'));
  $('#sBtn').addEventListener('click', () => {
    openModal('<h2>Search</h2><div class="searchbox"><input id="gs" type="search" placeholder="Search heroes, roles, builds..." aria-label="Search" autocomplete="off"><div class="sugg" id="gsb"></div></div>', 'sm');
    attachSearch($('#gs'), $('#gsb'));
  });
  window.addEventListener('scroll', () => $('#site-header').classList.toggle('scrolled', scrollY > 10), { passive: true });
}

/* ---------- Global eventlar (event delegation) ---------- */
document.addEventListener('click', e => {
  const b = e.target.closest('[data-fav]'); if (!b) return;
  const on = toggleFav(b.dataset.fav, b.dataset.id);
  if (on === null) return toast('Storage unavailable — favorites cannot be saved.');
  b.classList.toggle('on', on); b.setAttribute('aria-pressed', on);
  toast(on ? 'Added to favorites' : 'Removed from favorites');
  document.dispatchEvent(new CustomEvent('favchange'));
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { e.preventDefault(); $('#sBtn')?.click(); } });
document.addEventListener('error', e => { const t = e.target; if (t.tagName === 'IMG' && !t.dataset.fb) { t.dataset.fb = 1; t.src = placeholder(t.alt.replace(/ artwork$/, '')); } }, true);

layout(); reveal();
