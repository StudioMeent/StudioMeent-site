# Changelog

Newest first. Every change to the site gets an entry.
(History before the Astro rebuild is in the CHANGELOG.md of the old `website/` folder.)

## 2026-10-05 — BASE CHANGE (requested by Kaan): publish on GitHub Pages (test)

- New `.github/workflows/deploy.yml`: builds the site and publishes `dist/` on GitHub Pages, only when started by hand (GitHub → Actions → Run workflow). Pushing does not publish.
- New `public/CNAME`: `c-and.xyz` (test domain).
- `astro.config.mjs`: `site` set to `https://c-and.xyz`.
- Test setup: change `public/CNAME` and `site` once the real domain is chosen.

## 2026-10-05 — Instructions: Claude never commits, pushes or pulls

- `CLAUDE.md`: new hard rule 8. Commit, push and pull are always done by the person working on the site. Claude asks permission first, every time.
- Base: not changed

## 2026-10-05 — BASE CHANGE (requested by Kaan): new site, rebuilt from scratch in Astro

- New base: `astro.config.mjs`, `package.json`, `package-lock.json`, `.gitignore`, `src/layouts/Base.astro`, `src/pages/` (index, news, about, contact, 404), `src/styles/site.css`, `src/lib/projects.js`, `src/lib/url.js`, `src/integrations/folders.js`.
- Same look and features as the old site (black and white, logo, tabs, Filter button, black-and-white grid, news blog, team photo, copy email). Pages now have real addresses (`/news/`, `/about/`, `/contact/`); old `index.html#news` links still work.
- Projects are drag-and-drop: a folder in `projects/` is on the site, and it's gone when taken out. No `build.js` and no `projects/projects.js` any more.
- `public/base/back-button.js`: the info box reads the project's own `info.json`; ← MEENT goes to `/`.
- `public/base/reset.css`, `public/base/images/team/`: copied from the old site. The unused placeholder images were left out.
- `content.js`: copied, now an ES module (`export default SITE`); links to projects/news point at the folder (`projects/x/`).
- Projects copied unchanged: beter-benutten-bestaande-rijtjeswoningen, cooperatieve-kansenkaart, ddw-eindhoven, kaart-van-het-woonbeleid, `_template` (only the instructions comment updated), `news/omi-keychain`.
- `projects/goed-wonen-in-de-binnenstad/index.html`: fixed paths that pointed outside the folder (14 images → `img/…`, back button → `../../base/back-button.js`). The duplicate `index-Kaan’s MacBook Pro.html` was not copied.
- Known warning: `beter-benutten-bestaande-rijtjeswoningen` lists the download `beter-benutten-bestaande-rijtjeswoningen.pdf`, which isn't in the folder yet.
