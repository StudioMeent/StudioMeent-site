/* Reads every project folder in public/projects and checks it (replaces the old build.js).
   Folders starting with _ or . are skipped (e.g. _template).
   Errors = the project is left out of the site until fixed.
   Warnings = the project is included, but something should be checked. */
import fs from "node:fs";
import path from "node:path";
import { SITE } from "../content.js";

const PROJECTS_DIR = path.resolve("public/projects");
const BACK_BUTTON = "base/back-button.js";
const MAX_THUMB_KB = 400;

function readProjects() {
  const categories = SITE.categories || [];
  const projects = [];

  const folders = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map(d => d.name)
    .sort();

  for (const slug of folders) {
    const dir = path.join(PROJECTS_DIR, slug);
    const errors = [], warnings = [];
    const has = f => fs.existsSync(path.join(dir, f));

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
      if (!info.title) errors.push('info.json: "title" is missing');
      if (!Number.isInteger(info.year)) errors.push('info.json: "year" should be a number, e.g. 2025');
      if (!Array.isArray(info.categories) || !info.categories.length)
        errors.push('info.json: "categories" should be a list, e.g. ["Onderzoek"]');
      else {
        const unknown = info.categories.filter(c => !categories.includes(c));
        if (unknown.length)
          warnings.push(`category ${unknown.map(c => `"${c}"`).join(", ")} is not one of the filter words in src/content.js (${categories.join(", ")})`);
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
          else if (!/^https?:/.test(d.file) && !has(d.file)) warnings.push(`download "${d.file}" is not in the folder yet (the button will not work until it is)`);
      }
      if (info.color && !/^#[0-9a-fA-F]{6}$/.test(info.color)) warnings.push('info.json: "color" should look like "#1f9945"');
    }

    if (has("index.html") && !fs.readFileSync(path.join(dir, "index.html"), "utf8").includes(BACK_BUTTON))
      warnings.push(`index.html doesn't load the back button (add: <script src="../../${BACK_BUTTON}" defer></script>)`);

    for (const w of warnings) console.warn(`  warning  ${slug}: ${w}`);
    for (const e of errors) console.error(`  ERROR    ${slug}: ${e}`);
    if (errors.length) { console.error(`  → "${slug}" is left out until fixed.`); continue; }

    projects.push({
      slug,
      title: info.title,
      year: info.year,
      categories: info.categories,
      place: info.place || "",
      client: info.client || "",
      color: info.color || "",
      summary: info.summary || "",
      downloads: (Array.isArray(info.downloads) ? info.downloads : []).filter(d => d && d.file)
        .map(d => ({ label: d.label || "Download", file: /^https?:/.test(d.file) ? d.file : `projects/${slug}/${d.file}` })),
      url: `projects/${slug}/index.html`,
      thumbnail: `projects/${slug}/${info.thumbnail || "thumbnail.jpg"}`,
    });
  }

  // Newest first, then alphabetical.
  return projects.sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
}

// One read per build; in `npm run dev` re-read on every page load so new folders show up.
let cache;
export function getProjects() {
  if (import.meta.env.DEV) return readProjects();
  return (cache ??= readProjects());
}
