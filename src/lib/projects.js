/* Studio Meent — reads the project folders (BASE: don't change unless asked).

   Every folder in /projects with an info.json becomes a tile in the Works grid.
   Nothing is generated or cached: drop a folder in and it appears, take it out and it's gone.
   Folders starting with _ or . are skipped (e.g. _template).

   Errors   = the project is left out of the grid until fixed.
   Warnings = the project is shown, but something should be checked. */

import fs from "node:fs";
import path from "node:path";
import SITE from "../../content.js";

export const PROJECTS_DIR = path.resolve("projects");
const BACK_BUTTON = "base/back-button.js";
const MAX_THUMB_KB = 400;

const isFile = p => { try { return fs.statSync(p).isFile(); } catch { return false; } };

function check(slug) {
  const dir = path.join(PROJECTS_DIR, slug);
  const has = f => isFile(path.join(dir, f));
  const errors = [], warnings = [];

  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(slug))
    errors.push(`folder name "${slug}" should be lowercase letters, numbers and hyphens only (e.g. "my-project")`);
  if (!has("index.html")) errors.push("index.html is missing");

  let info = null;
  if (!has("info.json")) errors.push("info.json is missing");
  else {
    try { info = JSON.parse(fs.readFileSync(path.join(dir, "info.json"), "utf8")); }
    catch (e) { errors.push(`info.json is not valid JSON (${e.message})`); }
  }

  if (info) {
    const cats = SITE.categories;
    if (!info.title) errors.push('info.json: "title" is missing');
    if (!Number.isInteger(info.year)) errors.push('info.json: "year" should be a number, e.g. 2025');
    if (!Array.isArray(info.categories) || !info.categories.length)
      errors.push('info.json: "categories" should be a list, e.g. ["Onderzoek"]');
    else {
      const unknown = info.categories.filter(c => !cats.includes(c));
      if (unknown.length)
        warnings.push(`category ${unknown.map(c => `"${c}"`).join(", ")} is not one of the filter words in content.js (${cats.join(", ")})`);
    }
    const thumb = info.thumbnail || "thumbnail.jpg";
    if (!has(thumb)) errors.push(`thumbnail "${thumb}" is missing`);
    else {
      const kb = fs.statSync(path.join(dir, thumb)).size / 1024;
      if (kb > MAX_THUMB_KB) warnings.push(`thumbnail is ${Math.round(kb)} KB; keep it under ${MAX_THUMB_KB} KB so the grid loads fast`);
    }
    if (!info.place) warnings.push('info.json: "place" is empty');
    if (info.downloads !== undefined) {
      if (!Array.isArray(info.downloads)) errors.push('info.json: "downloads" should be a list, e.g. [{"label": "Boek (PDF)", "file": "boek.pdf"}]');
      else for (const d of info.downloads)
        if (!d || !d.file) warnings.push('info.json: a download has no "file"');
        else if (!/^https?:/.test(d.file) && !has(d.file)) warnings.push(`download "${d.file}" is not in the folder yet`);
    }
    if (info.color && !/^#[0-9a-fA-F]{6}$/.test(info.color)) warnings.push('info.json: "color" should look like "#1f9945"');
  }

  if (has("index.html") && !fs.readFileSync(path.join(dir, "index.html"), "utf8").includes(`../../${BACK_BUTTON}`))
    warnings.push(`index.html doesn't load the back button (add: <script src="../../${BACK_BUTTON}" defer></script>)`);

  const project = errors.length ? null : {
    slug,
    title: info.title,
    year: info.year,
    categories: info.categories,
    place: info.place || "",
    url: `/projects/${slug}/`,
    thumbnail: `/projects/${slug}/${info.thumbnail || "thumbnail.jpg"}`,
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
