# Instructions for Claude — Studio Meent website

Read this whole file, and the latest entries in `CHANGELOG.md`, before changing anything in this folder.

## What this site is

Studio Meent is an architecture research office. The website has a fixed **base** (Works grid with filters, News, About, Contact) and a growing set of **projects**. Every project is its own folder with its own, completely unique design (a map you can zoom, an exhibition you click through, a newspaper layout, …). The base must never need to change when a project is added.

The base is built with **Astro** (static output). Projects are **not** Astro pages: they are plain, self-contained HTML folders that are served and published exactly as they are. Adding a project = dropping a folder into `projects/`. Removing it = taking the folder out. There is no build step to run by hand and no generated list to keep up to date.

## The three zones

| Zone | Files | Rule |
|---|---|---|
| **Base** | `src/` (layouts, pages, styles, lib, integrations), `public/base/` (back-button.js, reset.css, images/), `astro.config.mjs`, `package.json` | **Never change unless Kaan explicitly asks for a base change.** |
| **Site texts** | `content.js` (news, about, contact, filter words, team photos) | Change only when asked to edit those texts. |
| **Projects** | `projects/<folder>/` | Where almost all work happens. One folder per project. |

News items that need their own page live in `news/<folder>/` (self-contained, like a project folder) and are linked from the news item in `content.js` (`link`, `linkLabel`, `image`).

How it works (for orientation; this is base code):
- `src/lib/projects.js` reads and checks every folder in `projects/` each time the Works page renders.
- `src/integrations/folders.js` serves `projects/` and `news/` as-is in `npm run dev`, reloads the browser when they change, and copies them into `dist/` on `npm run build`. Folders starting with `_` or `.` are never published.
- `public/base/back-button.js` adds the ← MEENT button and the info box to project pages. The info box reads the project's own `info.json`.

## Hard rules

1. **Don't touch the base.** If a project seems to need a base change, STOP and ask. Explain what and why. Don't do it "just a little".
2. **Adding or editing a project changes only that project's folder**, plus one entry in `CHANGELOG.md`. Nothing else.
3. **Never change another project's folder** while working on one project.
4. **Always add a `CHANGELOG.md` entry** for every change (format below), newest at the top.
5. **After every task, report** the exact list of files created, changed, moved or deleted, so Kaan can compare it with what GitHub Desktop shows.
6. **Suggest a commit message.** One commit per project. Base changes always in a separate commit.
7. Don't delete files without asking.

## A project folder

```
projects/my-project/          ← lowercase, hyphens, no spaces
├── index.html                ← the page; any design
├── info.json                 ← title, year, categories, place, client, summary, color, downloads, thumbnail
├── thumbnail.jpg             ← square image for the grid, max ~400 KB
└── …                         ← everything else the page uses (images/, scripts, data)
```

- Start from `projects/_template/` (copy it, rename the copy).
- The project must be **self-contained**: every file it uses lives inside its own folder, with relative paths. External fonts/libraries from a CDN are fine. Never reference files outside the folder other than `../../base/`.
- `index.html` **must** load the back button in its `<head>`:
  `<script src="../../base/back-button.js" data-position="bottom-left" defer></script>`
  Choose the corner (`bottom-left`, `bottom-right`, `top-left`, `top-right`) so it doesn't collide with the project's own fixed/sticky elements.
- Optionally link `base/reset.css` for shared utilities: `<link rel="stylesheet" href="../../base/reset.css">`. Provides safe-area insets, box-sizing, and accessibility defaults. Remove if it conflicts with your design.
- The same script shows the floating **info box** (year, client, place, categories, downloads) in `data-info="top-right"` (default; also the other corners, or `none`), and optionally `data-info-phone="…"` for phones. It reads the project's `info.json` directly.
  - `color`: text and frame colour of the info box. Use the project's main colour (e.g. `"#1f9945"`).
  - `downloads`: `[{ "label": "Volledig boek (PDF)", "file": "boek.pdf" }]`, files inside the project folder.
- `info.json` categories must be one of the filter words in `content.js` (`categories`).
- Keep original/high-res source material out of the site; put web-ready images only.

## Adding a project — checklist

1. Folder in `projects/`, valid name, from the template or dropped in by Kaan.
2. `info.json` complete; thumbnail present and small.
3. Back-button line present, corner chosen.
4. Works on phone (~390 px), tablet (~800 px) and desktop (~1280 px+). No hover-only content; tap targets ≥ 44 px; images not oversized.
5. Run `npm run build`. It must finish without errors; resolve or report the project warnings it prints.
6. `npm run dev`, open http://localhost:4321: project shows in the grid, tile opens the page, back button returns to Works.
7. `CHANGELOG.md` entry, file report, commit message.

## Changelog format

```
## YYYY-MM-DD — Added project: Title
- New folder: projects/folder-name/
- Base: not changed
```

For a base change, say so in the title (`## YYYY-MM-DD — BASE CHANGE (requested by Kaan): …`) and list every base file touched.
