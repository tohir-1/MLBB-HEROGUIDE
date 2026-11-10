import { get, set } from './storage.js';
export function initTheme() { document.documentElement.dataset.theme = get('theme', 'dark'); }
export function toggleTheme() {
  const n = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = n; set('theme', n); return n;
}
