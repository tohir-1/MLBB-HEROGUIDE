const P = 'hg_';
export const get = (k, d) => { try { const v = localStorage.getItem(P + k); return v ? JSON.parse(v) : d; } catch { return d; } };
export const set = (k, v) => { try { localStorage.setItem(P + k, JSON.stringify(v)); return true; } catch { return false; } };
export const favs = (t) => get('fav_' + t, []);
export const isFav = (t, id) => favs(t).includes(id);
export function toggleFav(t, id) {            // true (added), false (removed), null (storage error)
  const a = favs(t); const i = a.indexOf(id);
  i < 0 ? a.push(id) : a.splice(i, 1);
  return set('fav_' + t, a) ? i < 0 : null;
}
export const clearFavs = (t) => set('fav_' + t, []);
export const customBuilds = () => get('custom_builds', []);
export const saveCustomBuilds = (a) => set('custom_builds', a);
