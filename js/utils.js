export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const debounce = (fn, ms = 200) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const param = (k) => new URLSearchParams(location.search).get(k);
export const initials = (n) => n.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();

export function placeholder(name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8B5CF6"/><stop offset="1" stop-color="#38BDF8"/></linearGradient></defs><rect width="400" height="500" fill="#151D30"/><rect width="400" height="500" fill="url(#g)" opacity=".35"/><text x="200" y="285" font-family="Arial" font-size="130" font-weight="700" fill="#fff" text-anchor="middle">${esc(initials(name || '?'))}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export function toast(msg) {
  const box = $('#toasts'); if (!box) return;
  const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; box.appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 300); }, 2200);
}
