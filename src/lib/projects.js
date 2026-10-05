/* Studio Meent — reads the project folders (BASE: don't change unless asked).

   Every folder in /projects becomes a tile in the Works grid. A project folder has two parts:

     projects/<folder>/
     ├── info/                 what the grid and the info box show
     │   ├── INFO.txt          title, year, client, place, categories, colour, summary, downloads
     │   ├── thumbnail.jpg     square image for the grid (.jpg, .png or .webp)
     │   └── downloads/        files people can download from the info box
     └── pagina/               the web page itself: index.html + everything it uses

   The page is served at /projects/<folder>/, info.json for the info box is made from INFO.txt,
   and info/ is served at /projects/<folder>/info/ (see src/integrations/folders.js).
   Nothing is generated or cached: drop a folder in and it appears, take it out and it's gone.
   Folders starting with _ or . are skipped (e.g. _aanlevering).

   Errors   = the project is left out of the grid until fixed.
   Warnings = the project is shown, but something should be checked. */

import fs from "node:fs";
import path from "node:path";
import SITE from "../../content.js";

export const PROJECTS_DIR = path.resolve("projects");
const BACK_BUTTON = "base/back-button.js";
const MAX_THUMB_KB = 400;
const THUMBS = ["thumbnail.jpg", "thumbnail.jpeg", "thumbnail.png", "thumbnail.webp"];

const isFile = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };
const isDir = p => { try { return fs.statSync(p).isDirectory(); } catch { return false; } };

/* INFO.txt: one "Field: value" per line; lines starting with # are skipped.
   A line without a field name continues the field above it.
   Downloads: one line per file, "file name = text on the button". */
const FIELDS = {
  titel: "title", jaar: "year", opdrachtgever: "client", locatie: "place",
  categorie: "categories", "categorieën": "categories", categorieen: "categories",
  kleur: "color", samenvatting: "summary", downloads: "downloads",
};

export function readInfoTxt(file) {
  const raw = {}, downloads = [];
  let field = null;
  for (let line of fs.readFileSync(file, "utf8").replace(/^﻿/, "").split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    const m = /^([^:]+?)\s*:\s*(.*)$/.exec(line);
    const key = m && FIELDS[m[1].toLowerCase()];
    if (key) { field = key; line = m[2]; if (!line) continue; }
    if (field === "downloads") {
      const [f, ...label] = line.replace(/^[-•*]\s*/, "").split("=");
      if (f.trim()) downloads.push({ file: f.trim(), label: label.join("=").trim() });
    } else if (field) raw[field] = raw[field] ? `${raw[field]} ${line}` : line;
  }
  const year = /^\d{4}$/.test(raw.year || "") ? Number(raw.year) : raw.year;
  const color = raw.color && /^[0-9a-f]{6}$/i.test(raw.color) ? `#${raw.color}` : raw.color;
  return {
    title: raw.title || "",
    year,
    categories: (raw.categories || "").split(",").map(c => c.trim()).filter(Boolean),
    place: raw.place || "",
    client: raw.client || "",
    summary: raw.summary || "",
    color: color || "",
    downloads,
  };
}

const listFiles = dir => isDir(dir)
  ? fs.readdirSync(dir).filter(f => !f.startsWith(".") && isFile(path.join(dir, f))) : [];

/** What the info box reads (served as /projects/<folder>/info.json). Paths are relative to the page. */
export function infoJson(slug, dir = path.join(PROJECTS_DIR, slug)) {
  const file = path.join(dir, "info", "INFO.txt");
  if (!isFile(file)) return null;
  const info = readInfoTxt(file);
  const listed = new Set(info.downloads.map(d => d.file));
  const downloads = [
    ...info.downloads,
    ...listFiles(path.join(dir, "info", "downloads")).filter(f => !listed.has(f)).map(f => ({ file: f, label: f })),
  ].map(d => ({
    label: d.label || d.file,
    file: /^https?:/.test(d.file) ? d.file : `info/downloads/${d.file}`,
  }));
  return { ...info, downloads };
}

function check(slug) {
  const dir = path.join(PROJECTS_DIR, slug);
  const has = f => isFile(path.join(dir, f));
  const errors = [], warnings = [];

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    errors.push(`folder name "${slug}" should be lowercase letters, numbers and hyphens only (e.g. "my-project")`);
  if (!isDir(path.join(dir, "pagina")) && (has("index.html") || has("info.json")))
    errors.push("this folder has the old layout; put the page in pagina/ and the info in info/ (see projects/_aanlevering)");
  if (!has("pagina/index.html")) errors.push("pagina/index.html is missing");

  let info = null;
  if (!has("info/INFO.txt")) errors.push("info/INFO.txt is missing");
  else {
    try { info = readInfoTxt(path.join(dir, "info", "INFO.txt")); }
    catch (e) { errors.push(`info/INFO.txt can't be read (${e.message})`); }
  }

  const thumb = THUMBS.find(t => has(`info/${t}`));
  if (!thumb) errors.push("info/thumbnail.jpg is missing (or .png / .webp)");
  else {
    const kb = fs.statSync(path.join(dir, "info", thumb)).size / 1024;
    if (kb > MAX_THUMB_KB) warnings.push(`thumbnail is ${Math.round(kb)} KB; keep it under ${MAX_THUMB_KB} KB so the grid loads fast`);
  }

  if (info) {
    const cats = SITE.categories;
    if (!info.title) errors.push('INFO.txt: "Titel" is empty');
    if (!Number.isInteger(info.year)) errors.push('INFO.txt: "Jaar" should be a year, e.g. 2025');
    if (!info.categories.length) errors.push(`INFO.txt: "Categorie" is empty (choose from: ${cats.join(", ")})`);
    else {
      const unknown = info.categories.filter(c => !cats.includes(c));
      if (unknown.length)
        warnings.push(`category ${unknown.map(c => `"${c}"`).join(", ")} is not one of the filter words in content.js (${cats.join(", ")})`);
    }
    if (!info.place) warnings.push('INFO.txt: "Locatie" is empty');
    if (info.color && !/^#[0-9a-fA-F]{6}$/.test(info.color)) warnings.push('INFO.txt: "Kleur" should look like #1f9945');
    const files = listFiles(path.join(dir, "info", "downloads"));
    for (const d of info.downloads)
      if (!/^https?:/.test(d.file) && !files.includes(d.file)) warnings.push(`download "${d.file}" is not in info/downloads/ yet`);
    for (const f of files)
      if (!info.downloads.some(d => d.file === f)) warnings.push(`info/downloads/${f} is not listed in INFO.txt; the button shows the file name`);
  }

  if (has("pagina/index.html") && !fs.readFileSync(path.join(dir, "pagina", "index.html"), "utf8").includes(`../../${BACK_BUTTON}`))
    warnings.push(`pagina/index.html doesn't load the back button (add: <script src="../../${BACK_BUTTON}" defer></script>)`);
  if (has("pagina/info.json") || isDir(path.join(dir, "pagina", "info")))
    warnings.push("pagina/ has its own info.json or info/ folder; those addresses are used by the info box, so rename them");

  const project = errors.length ? null : {
    slug,
    title: info.title,
    year: info.year,
    categories: info.categories,
    place: info.place,
    url: `/projects/${slug}/`,
    thumbnail: `/projects/${slug}/info/${thumb}`,
  };
  return { slug, project, errors, warnings };
}

/** All project folders, checked. */
export function scanProjects() {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !/^[_.]/.test(d.name))
    .map(d => check(d.name));
}

/** The projects shown in the Works grid: newest first, then alphabetical. */
export function getProjects() {
  return scanProjects().map(r => r.project).filter(Boolean)
    .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

/** Print the check results to the terminal (dev server and build). */
export function reportProjects(log = console) {
  const results = scanProjects();
  let shown = 0;
  for (const r of results) {
    for (const w of r.warnings) log.warn(`warning  ${r.slug}: ${w}`);
    for (const e of r.errors) log.error(`ERROR    ${r.slug}: ${e}`);
    if (r.errors.length) log.error(`→ "${r.slug}" is left out of the grid until fixed.`);
    else shown++;
  }
  log.info(`${shown} project${shown === 1 ? "" : "s"} in the Works grid.`);
}
