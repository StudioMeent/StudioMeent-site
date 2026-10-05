/* Studio Meent — serves the drag-and-drop folders (BASE: don't change unless asked).

   /projects/<folder>/ and /news/<folder>/ are plain, self-contained pages in any design.
   Astro doesn't touch them:
   - while developing (npm run dev) they are served exactly as they are, and the
     browser reloads when a folder is added, removed or changed;
   - when building (npm run build) they are copied as they are into the finished site.
   A project folder has two parts (see src/lib/projects.js), served at one address:
     /projects/<folder>/…           ← projects/<folder>/pagina/…
     /projects/<folder>/info/…      ← projects/<folder>/info/… (thumbnail, downloads; not INFO.txt)
     /projects/<folder>/info.json   ← made from projects/<folder>/info/INFO.txt, for the info box
   Folders starting with _ or . are not published (e.g. _aanlevering). */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { reportProjects, infoJson } from "../lib/projects.js";

const FOLDERS = ["projects", "news"];

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".geojson": "application/geo+json",
  ".txt": "text/plain; charset=utf-8", ".csv": "text/csv; charset=utf-8", ".xml": "application/xml",
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".avif": "image/avif", ".gif": "image/gif", ".ico": "image/x-icon",
  ".pdf": "application/pdf", ".m4a": "audio/mp4", ".mp3": "audio/mpeg", ".wav": "audio/wav",
  ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime",
  ".woff": "font/woff", ".woff2": "font/woff2", ".ttf": "font/ttf", ".otf": "font/otf",
  ".glb": "model/gltf-binary", ".gltf": "model/gltf+json",
};

// /projects/<folder>/… → { json } for info.json, a file path, or null (not served).
function projectFile(base, rel) {
  const [slug, ...rest] = rel.split("/");
  const sub = rest.join("/");
  if (sub === "info.json") return { json: infoJson(slug, path.join(base, slug)) };
  if (sub === "info/INFO.txt") return null;
  return path.join(base, slug, sub.startsWith("info/") ? "" : "pagina", sub);
}

const noDotFiles = f => !path.basename(f).startsWith(".");

function serveFile(req, res, file) {
  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
  res.setHeader("Content-Type", type);
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Accept-Ranges", "bytes");
  // Range requests, so audio and video can be scrubbed (Safari needs this).
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
  if (m && (m[1] || m[2])) {
    const start = m[1] ? +m[1] : size - +m[2];
    const end = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1;
    if (start >= size || start > end) { res.statusCode = 416; res.setHeader("Content-Range", `bytes */${size}`); return res.end(); }
    res.statusCode = 206;
    res.setHeader("Content-Range", `bytes ${start}-${end}/${size}`);
    res.setHeader("Content-Length", end - start + 1);
    return fs.createReadStream(file, { start, end }).pipe(res);
  }
  res.setHeader("Content-Length", size);
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(file).pipe(res);
}

export default function folders() {
  let root;
  return {
    name: "studio-meent-folders",
    hooks: {
      "astro:config:done": ({ config }) => { root = fileURLToPath(config.root); },

      "astro:server:setup": ({ server, logger }) => {
        reportProjects(logger);

        server.middlewares.use((req, res, next) => {
          let url;
          try { url = decodeURIComponent(req.url.split("?")[0]); } catch { return next(); }
          if (url === "/index.html") { res.statusCode = 302; res.setHeader("Location", "/"); return res.end(); }

          const name = FOLDERS.find(f => url.startsWith(`/${f}/`) && url.length > f.length + 2);
          if (!name) return next();
          const base = path.join(root, name);
          const rel = url.slice(name.length + 2);
          let file = name === "projects" ? projectFile(base, rel) : path.join(base, rel);
          if (file && typeof file === "object") {
            if (!file.json) return next();
            res.setHeader("Content-Type", TYPES[".json"]);
            res.setHeader("Cache-Control", "no-cache");
            return res.end(JSON.stringify(file.json));
          }
          if (!file || !file.startsWith(base + path.sep)) return next();

          let stat;
          try { stat = fs.statSync(file); } catch { return next(); }
          if (stat.isDirectory()) {
            // /projects/x → /projects/x/ so the page's relative links (img/…, ../../base/…) work
            if (!url.endsWith("/")) { res.statusCode = 301; res.setHeader("Location", url + "/"); return res.end(); }
            file = path.join(file, "index.html");
            if (!fs.existsSync(file)) return next();
          }
          serveFile(req, res, file);
        });

        // Reload the browser when a project or news folder is added, removed or changed.
        const dirs = FOLDERS.map(f => path.join(root, f));
        server.watcher.add(dirs);
        let timer;
        server.watcher.on("all", (event, file) => {
          if (!dirs.some(d => file.startsWith(d + path.sep)) || path.basename(file) === ".DS_Store") return;
          clearTimeout(timer);
          timer = setTimeout(() => {
            if (file.startsWith(dirs[0])) reportProjects(logger);
            server.ws.send({ type: "full-reload" });
          }, 250);
        });
      },

      "astro:build:start": ({ logger }) => reportProjects(logger),

      "astro:build:done": ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        for (const name of FOLDERS) {
          const src = path.join(root, name);
          if (!fs.existsSync(src)) continue;
          for (const d of fs.readdirSync(src, { withFileTypes: true })) {
            if (!d.isDirectory() || /^[_.]/.test(d.name)) continue;
            const from = path.join(src, d.name), to = path.join(out, name, d.name);
            if (name !== "projects") { fs.cpSync(from, to, { recursive: true, filter: noDotFiles }); continue; }
            if (!fs.existsSync(path.join(from, "pagina"))) continue;
            fs.cpSync(path.join(from, "pagina"), to, { recursive: true, filter: noDotFiles });
            if (fs.existsSync(path.join(from, "info")))
              fs.cpSync(path.join(from, "info"), path.join(to, "info"), {
                recursive: true,
                filter: f => noDotFiles(f) && f !== path.join(from, "info", "INFO.txt"),
              });
            const info = infoJson(d.name, from);
            if (info) fs.writeFileSync(path.join(to, "info.json"), JSON.stringify(info, null, 2));
          }
          logger.info(`copied /${name}`);
        }
      },
    },
  };
}
