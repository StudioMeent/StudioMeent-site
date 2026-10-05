# Changelog

Newest first. Every change to the site gets an entry.

## 2026-10-05 — BASE CHANGE (requested by Kaan): site rebuilt with Astro

- New: `package.json`, `package-lock.json`, `astro.config.mjs` — Astro 7. Preview with `npm run dev`, build with `npm run build` (output in `dist/`).
- New: `src/layouts/Base.astro` (logo, tabs, head), `src/pages/index.astro` (Werk + filter), `src/pages/news/index.astro`, `src/pages/news/[slug].astro` (one page per news item), `src/pages/about.astro`, `src/pages/contact.astro`.
- New: `src/lib/projects.js` — reads and checks the project folders (same checks, warnings and errors as the old `build.js`); `src/lib/site.js` — paths and news page names.
- New: `src/pages/projects/projects.js.js` — makes `/projects/projects.js` at build time for the back button's info box.
- Removed: `index.html`, `base/app.js`, `build.js` (replaced by the files above), `projects/projects.js` (now generated, not committed).
- Moved: `projects/` → `public/projects/`, `news/` → `public/news/`, `base/` → `public/base/`, `base/style.css` → `src/styles/style.css`, `content.js` → `src/content.js` (now `export const SITE`).
- Changed: `src/styles/style.css` — one `[hidden]` rule so hidden tiles and the filter hide properly.
- Changed: `public/base/back-button.js`, `public/projects/_template/index.html` — comments only (`build.js` → Astro build).
- Changed: `README.md`, `CLAUDE.md`, `.gitignore` (`dist/`, `.astro/`).
- Werk, Nieuws, Over ons and Contact are now real pages (`/`, `/news/`, `/about/`, `/contact/`) instead of `#news` etc. Old links (`index.html#news`, `#news-2`, `#about`, `#contact`) redirect to the new pages.
- Without JavaScript all pages still show; only the filter, the copy button and the team photo need it.
- Projects and news folders: not changed (only moved).

## 2026-10-05 — BASE CHANGE: shared reset.css with common utilities

- New file: `base/reset.css` — consolidated common styles from across projects: safe-area insets, box-sizing reset, focus-visible defaults, reduced-motion support, and font-smoothing. Projects can optionally link it with `<link rel="stylesheet" href="../../base/reset.css">`.
- Updated: `projects/_template/index.html` — added optional reset.css link (can be removed if it conflicts with project design).
- Updated: `CLAUDE.md` — documented reset.css in the base files section and project setup guide.

## 2026-10-01 — BASE CHANGE (requested by Kaan): black logo and site, filters behind one button

- Changed: `index.html` — removed the random visit colour; the site is black and white. Versions bumped to `?v=2026-10-01i`.
- Changed: `base/style.css` — accent is black (logo MEENT, active tab, active filter); hovers now invert or underline instead of colouring. New filter style.
- Changed: `base/app.js` — filters folded behind one small "Filter +" button above the grid; click to show the filter words, choose one and it closes again showing "Filter: Stedenbouw ×" (× clears it).
- Changed: `base/back-button.js` — "← MEENT" hover is white with a black frame (no visit colour any more).

## 2026-10-01 — News item OMI keychain: bigger keychain

- Changed: `news/omi-keychain/sleutelhanger.jpg` — cropped to the keychain (less empty background), so it shows bigger on the page; `index.html` there — figure size adjusted.
- Changed: `news/omi-keychain/thumbnail.jpg` — zoomed in on the engraved tag for the News list.

## 2026-10-01 — News item: Geen huis = geen sleutel (OMI keychain)

- New folder: `news/omi-keychain/` — the keychain page (index.html, sleutelhanger.jpg, thumbnail.jpg); its back link now goes to the News page.
- Changed: `content.js` — new news item at the top, linking to that page ("Lees verder →"). Date 01/10/2026 is a guess — check it.
- BASE CHANGE (requested by Kaan): `base/app.js` — a news link can have its own text (`linkLabel`). Versions bumped to `?v=2026-10-01h` in `index.html`.
- Changed: `CLAUDE.md` — explains the `news/` folder.

## 2026-10-01 — Site texts: studio address

- Changed: `content.js` — Contact: address is now Damruststraat 3, 3035 KV Rotterdam, linking to Google Maps.

## 2026-10-01 — Site texts: photo of Sanne van Manen

- New: `base/images/team/sanne-van-manen.jpg` (600 px wide, from Kaan's photo) — shows when pointing at her name in the Team row.

## 2026-10-01 — BASE CHANGE (requested by Kaan): team photo only in the Team row

- Changed: `base/app.js` — the floating photo now only works on the names in the "Team" row on the About page (not in the text or the Opgericht row). Versions bumped to `?v=2026-10-01g` in `index.html`.
- Changed: `content.js` — removed the About sentence "De studio is in 2024 opgericht door Sanne van Manen. Daarnaast zijn …" (the same information is in the rows below).

## 2026-10-01 — BASE CHANGE (requested by Kaan): floating team photo on the About page

- Changed: `base/app.js` — names listed in `content.js` → `team` are underlined on the About page (text and the Opgericht / Team rows); pointing at one shows that person's photo floating next to the cursor (tap on touch screens, also on keyboard focus).
- Changed: `base/style.css` — style for the names and the floating photo. Versions bumped to `?v=2026-10-01f` in `index.html`.
- Changed: `content.js` — new `team` list: Sanne van Manen → `base/images/team/sanne-van-manen.jpg` (photo still to be added; until then nothing appears).

## 2026-10-01 — Site texts: filter words Architectuur and Stedenbouw

- Changed: `content.js` — two new filter words, first in the row: Architectuur, Stedenbouw.
- Changed: `info.json` (categories only) of Beter benutten (+ Architectuur, Stedenbouw), Coöperatieve Kansenkaart (+ Stedenbouw), Goed Wonen in de Binnenstad (+ Stedenbouw), DDW Eindhoven (+ Architectuur).
- Regenerated: `projects/projects.js`
- Base: not changed

## 2026-10-01 — BASE CHANGE (requested by Kaan): black-and-white grid, Work Sans back button, project info box, news as blog

- Changed: `base/style.css` — project pictures in the Werk grid are black and white; colour appears under the cursor (on touch screens they stay in colour). News page styled as a blog. Versions bumped to `?v=2026-10-01e` in `index.html`.
- Changed: `base/back-button.js` — "← MEENT" now in Work Sans (black), like the logo. New: floating info box on every project page (title, Jaar, Opdrachtgever, Locatie, Categorie, download buttons), white with text and frame in the project's colour; can be closed to a small "Info" button (starts closed on phones). Corner via `data-info` / `data-info-phone`.
- Changed: `base/app.js` — News shows every item in full (date, title, text, picture, link to the project).
- Changed: `build.js` — `projects.js` now also carries `client`, `color` and `downloads`; warns when a download file is missing.
- Changed: `content.js` — new news items in Dutch about the projects (dates marked "controleer" are guesses).
- Changed: `info.json` of every project and `_template` — added `color` and `downloads` (Beter benutten: the full PDF, still to be added to its folder).
- Changed: `projects/kaart-van-het-woonbeleid/index.html` — info box bottom-right (top-left on phones) so it doesn't cover the language and zoom buttons.
- Changed: `CLAUDE.md` — explains the info box and the new `info.json` fields.
- Regenerated: `projects/projects.js`

## 2026-10-01 — BASE CHANGE (requested by Kaan): full width and Dutch labels

- Changed: `index.html` — tab labels in Dutch: Werk, Nieuws, Over ons, Contact (links stay `#works`, `#news`, `#about`, `#contact`). Versions bumped to `?v=2026-10-01d`.
- Changed: `base/style.css` — News, About and Contact text use the full width of the four tabs (no narrower column); the filter row is spread across the same width (on phones it stays left-aligned).
- Changed: `content.js` — filter words in Dutch: Onderzoek, Gebouwd, Tentoonstelling, Publicatie, Installatie.
- Changed: `info.json` of every project and `projects/_template/` — categories renamed to the Dutch filter words (Research → Onderzoek, Built → Gebouwd, Exhibition → Tentoonstelling, Publication → Publicatie, Installation → Installatie). Nothing else in the project folders changed.
- Regenerated: `projects/projects.js`

## 2026-10-01 — Added project: De toekomst is al gebouwd! (DDW Eindhoven)

- New folder: `projects/ddw-eindhoven/` — intro text, then the street section (`section.svg`) that moves sideways while you scroll. From `Downloads/ddw-eindhoven`.
- Page's own header link replaced by the site's back button (top-left); footer link now goes to the Works page; thumbnail added.
- Regenerated: `projects/projects.js`
- Base: not changed

## 2026-10-01 — Added projects: Beter benutten bestaande rijtjeswoningen, Coöperatieve Kansenkaart, Kaart van het Woonbeleid

- New folder: `projects/beter-benutten-bestaande-rijtjeswoningen/` — flipbook (17 pages in `img/`). The full PDF is not included yet: put `beter-benutten-bestaande-rijtjeswoningen.pdf` in this folder for the download buttons to work.
- New folder: `projects/cooperatieve-kansenkaart/` — map window with four wijk maps (`tiles.js`), illustrations in `img/`. Leaflet loads from cdnjs.
- New folder: `projects/kaart-van-het-woonbeleid/` — zoomable map (`tiles.js`) with NL/EN guided tour; voice-overs in `audio/`.
- All three made from the Claude artifacts: images, tiles and audio moved out of the HTML into files; each page's own "back" link replaced by the site's back button (top-left); thumbnails added.
- Regenerated: `projects/projects.js`
- Base: not changed

## 2026-10-01 — BASE CHANGE (requested by Kaan): new accent colour on every visit

- Changed: `index.html` — small script in the <head> picks one of 7 palette colours at random on each visit (never the same twice in a row): #d03c56, #356cb3, #5d4191, #23a095, #f39216, #ee785c, #64b65a. Versions bumped to `?v=2026-10-01c`.
- Changed: `base/style.css` — colour variable `--red` renamed `--accent`; used for the logo, active tab, filters and hovers.
- Changed: `base/back-button.js` — hover colour follows the visit's accent colour (was the old red #dc1846). Font unchanged.

## 2026-10-01 — BASE CHANGE (requested by Kaan): always load the newest files

- Changed: `index.html` — `base/style.css` and `base/app.js` get a version (`?v=2026-10-01b`); `content.js` and `projects/projects.js` are always loaded fresh. Stops browsers (Safari) from showing an old saved version.
- When the base changes: update the `?v=` date in `index.html`.

## 2026-10-01 — BASE CHANGE (requested by Kaan): no borders around project images

- Changed: `base/style.css` — removed the outline around the tiles in the Works grid and the red frame on hover. Hover now only zooms the image slightly and turns the title red.

## 2026-10-01 — BASE CHANGE (requested by Kaan): new main page design

- Changed: `index.html` — new masthead: logo (small STUDIO + red MEENT) and four tabs in a row; font Work Sans.
- Changed: `base/style.css` — rewritten for the new layout: red #d03c56 (palette red), outlined tabs and square project tiles in a 4-column grid (3 on tablet, 2 on phone).
- Changed: `base/app.js` — Works is now the home page (no slideshow); filters only show categories that are in use; Dutch interface words.
- Changed: `content.js` — About text replaced with the studio text (Dutch); `featured` removed (no home slideshow any more).
- Added project: `projects/goed-wonen-in-de-binnenstad/` (copied from `new projects/`), with a new thumbnail: the axonometry from `img/p4-bottom.jpg`.
- Regenerated: `projects/projects.js`
- Backup of the previous version: `../website-backup-2026-10-01/`.

## 2026-09-30 — BASE CHANGE (requested by Kaan): logo font Work Sans

- Changed: `index.html` — Google Fonts link now also loads Work Sans Black (900).
- Changed: `base/style.css` — `.logo` uses Work Sans 900 instead of Archivo Expanded Black.
- Changed: `base/style.css` — `.logo` stretched horizontally to 125% (`transform: scaleX(1.25)`).

## 2026-09-29 — BASE CHANGE (requested by Kaan): restructure for project folders

- Projects are no longer listed in `content.js`; each project is now its own folder in `projects/` with an `info.json`.
- New: `build.js` — reads the project folders, checks them and writes `projects/projects.js`.
- New: `base/back-button.js` — floating "← MEENT" button every project page loads.
- New: `projects/_template/` — starting folder for new projects (the red slideshow page).
- Moved: `css/style.css` → `base/style.css`, `js/app.js` → `base/app.js`, `images/` → `base/images/`, `js/content.js` → `content.js`.
- Changed: `index.html` (script and style paths), `base/app.js` (grid and home slideshow read `projects/projects.js`; tiles open the project's own page), `content.js` (example projects removed; `homeProject` replaced by `featured`).
- New: `CLAUDE.md`, `README.md`, `CHANGELOG.md`, `.gitignore`.
- The design of the landing page, Works, News, About and Contact is unchanged.
- Backup of the previous version: `../website-backup-2026-09-29/`.
