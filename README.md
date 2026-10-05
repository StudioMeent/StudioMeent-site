# Studio Meent — website

Built with [Astro](https://astro.build). The result is a plain static website: no database, no CMS.

## How it's organised

```
website-astro/
├── projects/         One folder per project. Drag a folder in, and it's on the site.
│   └── _aanlevering/ Template for a new project: copy it (not published)
├── news/             News items that need their own page (one folder each)
├── content.js        Site texts: news, about, contact, filter words, team photos
├── public/base/      BASE: back-button.js, reset.css, images/
├── src/              BASE: the Works / News / About / Contact pages and their styles
├── astro.config.mjs  BASE: settings
├── CLAUDE.md         Working rules for Claude
├── CHANGELOG.md      Log of every change
└── README.md         This file
```

The **base** stays the same. Adding a project never changes it.

## First time on this computer

Install Node.js (free, nodejs.org), then in this folder run:

```
npm install
```

## Working on the site

```
npm run dev
```

Open http://localhost:4321. Changes show up right away, and the browser reloads by itself.
Stop with Ctrl+C (or `npx astro dev stop`).

## Adding a project

1. Copy `projects/_aanlevering` and rename the copy (lowercase, hyphens, no spaces, e.g. `my-project`).
   Its `LEESMIJ.txt` explains everything.
2. `info/`: fill in `INFO.txt`, replace `thumbnail.jpg` (square, under ~400 KB), put downloads in `downloads/`.
3. `pagina/`: the page itself, `index.html` plus its files, in any design. Keep the back-button line in the `<head>`.
4. It appears in the Works grid immediately. The terminal running `npm run dev` says if something is missing.
5. Add a line to `CHANGELOG.md`, then commit and push.

**Removing a project:** drag its folder out of `projects/` and it's gone from the grid and the site.

## Editing texts

- News, About, Contact, filter words: `content.js`
- A project's title, year, client, place, categories, colour, downloads: that project's `info/INFO.txt`
- A project's page: that project's `pagina/` folder

## Publishing

`npm run build` makes the finished site in `dist/`. On Netlify or Cloudflare Pages use
build command `npm run build` and output folder `dist`; it then builds on every push.
