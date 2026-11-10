# MLBB HeroGuide
Fan-made Mobile Legends: Bang Bang guide — **faqat HTML + CSS + Vanilla JS (ES Modules)**, backend yo'q.

## Ishga tushirish (MUHIM)
ES Modules `file://` orqali ishlamaydi. Lokal server kerak:
- VS Code → **Live Server** kengaytmasi → `index.html` → *Go Live*, yoki
- `python -m http.server 8000` → http://localhost:8000

## Struktura
- `js/data.js` — barcha ma'lumotlar (30 hero, buildlar, guidelar). **Yangi hero**: `RAW` ga bitta qator qo'shing.
- `js/app.js` — header/footer, kartochkalar, modal, theme, favorite (hamma sahifada).
- `js/search.js`, `storage.js`, `theme.js`, `utils.js` — qidiruv, LocalStorage, theme, yordamchilar.
- Har sahifaning o'z JS fayli: `home, heroes, hero-details, builds, counter, compare, favorites, guides`.
- `css/` — `style.css` (tizim/header/footer), `components.css`, `animations.css`, `responsive.css`.

## Rasmlar
`assets/images/heroes/<id>.webp` (masalan `gusion.webp`) nomi bilan qo'ying. Rasm bo'lmasa avtomatik gradient placeholder chiqadi.
Faqat o'zingizda huquq bor rasmlardan foydalaning.

## Ma'lumot haqida
Stats, counter, build, emblem va tips — **sample** (namunaviy). Skill tavsiflari bo'sh (`skills: []`) — rasmiy ma'lumotni o'zingiz to'ldiring.
Har hero/guide da `source` va `lastUpdated` maydonlari bor.
