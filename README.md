# Studio Meent — website

A static website built with [Astro](https://astro.build). No database, no CMS.
Astro turns the files below into plain HTML in `dist/`, which is what gets hosted.

## How it's organised

```
website/
├── src/                      BASE — the site itself
│   ├── pages/                One file per page: index.astro (Werk), news/, about.astro, contact.astro
│   ├── layouts/Base.astro    Logo, tabs and <head> shared by every page
│   ├── styles/style.css      Look of the site
│   ├── lib/                  Reads and checks the project folders
│   ├── content/news/         News: one markdown file per item
│   ├── content.config.js     BASE — which fields a news file has
│   └── content.js            Site texts: about, contact, team, filter words
├── public/                   Copied to the site as-is
│   ├── base/                 BASE — back-button.js, reset.css, images/
│   ├── projects/             One folder per project — this is what grows
│   │   └── _template/        Starting point for a new project (skipped)
│   └── news/                 News items with their own page
├── astro.config.mjs, package.json   BASE — Astro settings
├── CLAUDE.md                 Working rules for Claude
├── CHANGELOG.md              Log of every change
└── README.md                 This file
```

The **base** stays the same. Adding a project never changes it.

## First time

Install Node.js (free, nodejs.org), then in the website folder run `npm install` once.

## Previewing

`npm run dev` — opens the site at http://localhost:4321 and reloads when you save.
(Double-clicking an HTML file no longer works for the main pages.)

## Adding a project

1. Copy `public/projects/_template` and rename the copy, e.g. `public/projects/my-project`
   (lowercase, hyphens, no spaces) — or drag in a finished project folder.
2. Fill in `info.json` and replace `thumbnail.jpg` (square, under ~400 KB).
3. Build the page in `index.html` — any design. Keep the back-button line in the `<head>`.
4. Run `npm run build`. It checks every project, prints warnings and errors, and makes the site in `dist/`.
5. Check it with `npm run dev`.
6. Add a line to `CHANGELOG.md`, then commit and push.

On Netlify or Cloudflare Pages: build command `npm run build`, output folder `dist`.

## Adding news

Add a file to `src/content/news/`, e.g. `nieuwe-tentoonstelling.md`. The file name becomes the page address
(`/news/nieuwe-tentoonstelling/`), so use lowercase and hyphens. The News page sorts by date, newest first.

```markdown
---
title: "Nieuwe tentoonstelling"
date: 2026-11-20
image: "projects/my-project/thumbnail.jpg"     # optional
link: "projects/my-project/index.html"         # optional
linkLabel: "Bekijk het project →"              # optional
---

First paragraph. Leave an empty line between paragraphs.

Second paragraph, with *italic*, **bold** or a [link](https://example.com).
```

A news item that needs its own designed page goes in `public/news/<folder>/` and is linked with `link`.

## Editing texts

- News: `src/content/news/`
- About, Contact, team, filter words: `src/content.js`
- A project's title, year, categories, place: that project's `info.json`
- A project's page: that project's own folder
