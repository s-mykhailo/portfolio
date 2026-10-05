# Портфоліо S-Mykhailo

Статичний сайт: HTML + CSS + JS, без збірки, без бекенду, без залежностей.
Мови EN/UA, темна й світла тема, анімовані демо-діалоги ботів.

## Структура

```
index.html          розмітка (тексти беруться з js/content.js)
css/style.css       сайт: кольори, типографіка, сітка
css/chat.css        вікно месенджера (Telegram- і Discord-вигляд)
js/content.js       УСІ ТЕКСТИ сайту EN/UA + CONTACTS (посилання)
js/scenarios.js     діалоги демо-ботів EN/UA
js/demo.js          движок анімованих діалогів
js/main.js          мова, тема, рендер списків, ефекти
fonts/              Unbounded + Onest (OFL, див. fonts/OFL.txt)
assets/favicon.svg
_headers            кеш для Cloudflare Pages
.nojekyll           для GitHub Pages
```

## Що де правити

**Тексти сайту** — `js/content.js`, блок `I18N.en` і `I18N.uk` (ключі однакові).

**Контакти й посилання** — `CONTACTS` на початку `js/content.js`.
Порожній `url` ховає кнопку. Зараз заповнений лише Telegram.
Instagram, BuiltByBit, Discord: впиши `url` і `label`.

**Кнопки «Try in Telegram / Discord»** на демо-картках — `CONTACTS.demos`.
Поки бот не на хостингу, залиш `''`, кнопка прихована. Коли буде готово:
```js
blade: 'https://t.me/sm_blade_booking_bot',
fixit: 'https://t.me/sm_fixit_leads_bot',
vibe:  'https://t.me/sm_vibe_store_bot',
```

**Діалоги демо** — `js/scenarios.js`. Формат описаний у коментарі на початку файлу:
кроки `user`/`bot`, кнопки `btn('текст', {def:true})`, змінні типу `{service}`.
Кнопка з `def:true` — та, яку «натискає» автоплей. `off:true` — кнопка є, але
у прев'ю не працює (показує підказку).

**Discord-сценарії** (`tickets`, `verify`) — приклади з позначкою «Концепт».
Коли зробиш справжніх ботів, заміни кроки й прибери `concept: true` у `content.js`
(`demos.list`).

**Колір акценту** — `--accent` і `--accent-text` на початку `css/style.css`.

## Локальний запуск

```bash
cd portfolio
python3 -m http.server 8000
# відкрити http://localhost:8000
```
(Можна й просто відкрити `index.html`, але через сервер ближче до реальності.)

## Деплой: GitHub Pages (безкоштовно)

1. Створи репозиторій на GitHub, напр. `portfolio` (public).
2. У папці сайту:
   ```bash
   cd portfolio
   git init -b main
   git add .
   git commit -m "Portfolio site"
   git remote add origin https://github.com/<твій-нік>/portfolio.git
   git push -u origin main
   ```
3. На GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   гілка `main`, папка `/ (root)`, Save.
4. Через 1-2 хвилини сайт буде на `https://<твій-нік>.github.io/portfolio/`.
   Назва репозиторію `<твій-нік>.github.io` дасть адресу без `/portfolio/`.

Оновлення: зміни файли, потім `git add . && git commit -m "..." && git push`.

## Деплой: Cloudflare Pages (безкоштовно)

Варіант А, через GitHub (автодеплой при кожному push):
1. Запуш репозиторій на GitHub, як вище.
2. Cloudflare Dashboard → **Workers & Pages → Create → Pages → Connect to Git**.
3. Обери репозиторій. **Build command** лиши порожнім, **Build output directory**: `/` (або `.`).
4. Save and Deploy. Адреса буде `https://<проєкт>.pages.dev`.

Варіант Б, без Git (завантаження з комп'ютера):
```bash
cd portfolio
npx wrangler pages deploy . --project-name s-mykhailo-portfolio
```
(при першому запуску попросить увійти в Cloudflare).

Власний домен: у Cloudflare Pages → Custom domains, або GitHub Pages → Custom domain.

## Нотатки

- Сайт не працює без JavaScript: тексти підставляє `main.js`.
- Мова за замовчуванням: українська, якщо мова браузера `uk`, інакше англійська.
  Вибір зберігається в `localStorage`. Примусово: `?lang=uk` або `?lang=en`.
- Тема за замовчуванням темна, вибір зберігається.
- Для гарного прев'ю посилання в месенджерах додай `og:image` (PNG 1200×630)
  у `<head>` `index.html`.
- Шрифти Unbounded і Onest під ліцензією SIL OFL (текст у `fonts/OFL.txt`).
