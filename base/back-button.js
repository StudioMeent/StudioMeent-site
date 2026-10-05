/* Studio Meent — floating "back to Werk" button + project info box
   (BASE: don't change unless asked).

   Every project page loads this with ONE line in its <head>:

     <script src="../../base/back-button.js" defer></script>

   Options on that same line:
     data-position="bottom-left"   corner of the ← MEENT button (default bottom-left;
                                    also bottom-right, top-left, top-right)
     data-info="top-right"         corner of the info box (default top-right;
                                    also bottom-right, bottom-left, top-left, or "none")
     data-info-phone="top-left"    other corner on phones (≤ 640 px), if the normal one is in the way

   The info box shows the project's year, client, place, categories and downloads.
   It reads them from projects/projects.js (made by build.js from the project's info.json):
     "client", "place", "year", "categories", "color" (text + frame colour of the box),
     "downloads": [{ "label": "Volledig boek (PDF)", "file": "boek.pdf" }]
   On wide screens the box starts open; on phones it starts as a small "Info" button.

   Button and box live in their own shadow DOM, so a project's CSS can't change
   how they look, and they can't change the project's CSS either. */
(() => {
  const script = document.currentScript;
  if (!script) return;

  // The website root is one folder up from /base/, wherever the site is hosted.
  const root = new URL("../", script.src);
  const href = new URL("index.html#works", root).href;
  const slug = decodeURIComponent(location.pathname.replace(/\/(index\.html)?$/, "").split("/").pop() || "");

  // Font: Work Sans, like the main site (loaded once, if the page doesn't have it yet).
  if (![...document.querySelectorAll('link[href*="fonts.googleapis.com"]')].some(l => /Work\+Sans[^"]*900/.test(l.href))) {
    const f = document.createElement("link");
    f.rel = "stylesheet";
    f.href = "https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;900&display=swap";
    document.head.appendChild(f);
  }
  const FONT = '"Work Sans", "Helvetica Neue", Arial, sans-serif';

  // Black and white, like the main site.
  const accent = "#161616";

  const place = (pos, fallback) => {
    const c = (pos || fallback).split("-");
    return { v: c[0] === "top" ? "top" : "bottom", h: c[1] === "right" ? "right" : "left" };
  };
  const btn = place(script.dataset.position, "bottom-left");
  const infoPos = script.dataset.info || "top-right";
  const box = place(infoPos, "top-right");
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const edge = (p, extra = 0) =>
    `${p.v}: calc(${16 + extra}px + env(safe-area-inset-${p.v}, 0px)); ${p.h}: calc(16px + env(safe-area-inset-${p.h}, 0px));`;

  function mountButton() {
    const host = document.createElement("div");
    host.setAttribute("data-meent-back", "");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        a {
          position: fixed; z-index: 2147483000; ${edge(btn)}
          display: inline-flex; align-items: center; gap: .4em;
          height: 38px; padding: 0 14px 0 11px;
          background: #161616; color: #ffffff;
          font: 900 17px/1 ${FONT}; letter-spacing: .01em; text-decoration: none;
          box-shadow: 0 1px 0 rgba(0,0,0,.08), 0 4px 14px rgba(0,0,0,.18);
          transition: background .15s, transform .15s;
        }
        a:hover { background: #ffffff; color: #161616; box-shadow: inset 0 0 0 2px #161616, 0 4px 14px rgba(0,0,0,.18); transform: translateX(${btn.h === "left" ? "-" : ""}2px); }
        a:focus-visible { outline: 3px solid ${accent}; outline-offset: 2px; }
        .arrow { font-weight: 500; }
        @media print { a { display: none; } }
        @media (prefers-reduced-motion: reduce) { a { transition: none; } }
      </style>
      <a href="${href}" aria-label="Terug naar alle projecten, Studio Meent"><span class="arrow" aria-hidden="true">←</span>MEENT</a>`;
    document.body.appendChild(host);
  }

  function mountInfo(p) {
    const col = p.color || "#161616";
    const rows = [
      ["Jaar", p.year],
      ["Opdrachtgever", p.client],
      ["Locatie", p.place],
      ["Categorie", (p.categories || []).join(", ")],
    ].filter(r => r[1]);
    const dls = (p.downloads || []).filter(d => d && d.file);
    // never on top of the back button: same corner → move it below/above the button
    const at = c => edge(c, c.v === btn.v && c.h === btn.h ? 50 : 0);
    const pos = at(box);
    const phone = script.dataset.infoPhone ? place(script.dataset.infoPhone, infoPos) : null;
    let open = innerWidth >= 900;
    try { const s = sessionStorage.getItem("meent-info"); if (s) open = s === "open"; } catch (e) {}

    const host = document.createElement("div");
    host.setAttribute("data-meent-info", "");
    const shadow = host.attachShadow({ mode: "open" });
    shadow.innerHTML = `
      <style>
        :host { all: initial; }
        .wrap { position: fixed; z-index: 2147482999; ${pos} font: 400 14px/1.4 ${FONT}; color: ${col}; }
        ${phone ? `@media (max-width: 640px) { .wrap { top: auto; bottom: auto; left: auto; right: auto; ${at(phone)} } }` : ""}
        .box {
          width: min(300px, calc(100vw - 32px)); max-height: calc(100vh - 120px); overflow: auto;
          background: #fff; border: 2px solid ${col}; padding: 14px 16px 16px;
          box-shadow: 0 4px 18px rgba(0,0,0,.10);
        }
        .head { display: flex; align-items: flex-start; gap: 12px; margin: 0 0 10px; }
        h2 { margin: 0; font: 900 17px/1.15 ${FONT}; letter-spacing: -.005em; flex: 1; }
        button { font: inherit; color: inherit; cursor: pointer; }
        .x { border: 0; background: none; width: 28px; height: 28px; margin: -4px -6px 0 0; font-size: 22px; line-height: 1; }
        dl { margin: 0; border-top: 1.5px solid ${col}; }
        dl div { padding: 7px 0 8px; border-bottom: 1.5px solid ${col}; }
        dt { font-size: 11px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 1px; }
        dd { margin: 0; font-weight: 500; }
        .dl { display: flex; flex-direction: column; gap: 8px; margin-top: 14px; }
        .dl a {
          display: flex; justify-content: space-between; align-items: center; gap: 10px;
          min-height: 40px; padding: 8px 12px; border: 2px solid ${col}; color: ${col};
          font-weight: 600; text-decoration: none;
        }
        .dl a:hover, .dl a:focus-visible { background: ${col}; color: #fff; outline: none; }
        .pill {
          display: inline-flex; align-items: center; gap: .45em; height: 38px; padding: 0 14px;
          background: #fff; border: 2px solid ${col}; font: 900 15px/1 ${FONT}; text-transform: uppercase; letter-spacing: .06em;
          box-shadow: 0 1px 0 rgba(0,0,0,.06), 0 4px 14px rgba(0,0,0,.14);
        }
        .pill:hover { background: ${col}; color: #fff; }
        .pill i { font-style: normal; font-weight: 600; }
        :focus-visible { outline: 3px solid ${col}; outline-offset: 2px; }
        [hidden] { display: none !important; }
        @media print { .wrap { display: none; } }
      </style>
      <div class="wrap">
        <button type="button" class="pill" aria-expanded="false" aria-controls="box"><i aria-hidden="true">i</i>Info</button>
        <section class="box" id="box" aria-label="Projectinformatie">
          <div class="head"><h2>${esc(p.title)}</h2><button type="button" class="x" aria-label="Sluit informatie">×</button></div>
          <dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
          ${dls.length ? `<div class="dl">${dls.map(d => `<a href="${esc(new URL(d.file, root).href)}" download>${esc(d.label || "Download")}<span aria-hidden="true">↓</span></a>`).join("")}</div>` : ""}
        </section>
      </div>`;
    const pill = shadow.querySelector(".pill"), panel = shadow.querySelector(".box");
    const set = o => {
      open = o; panel.hidden = !o; pill.hidden = o; pill.setAttribute("aria-expanded", String(o));
      try { sessionStorage.setItem("meent-info", o ? "open" : "closed"); } catch (e) {}
    };
    pill.addEventListener("click", () => { set(true); shadow.querySelector(".x").focus(); });
    shadow.querySelector(".x").addEventListener("click", () => { set(false); pill.focus(); });
    panel.hidden = !open; pill.hidden = open;
    document.body.appendChild(host);
  }

  function loadInfo() {
    if (infoPos === "none") return;
    const find = () => (window.PROJECTS || []).find(p => p.slug === slug);
    if (find()) return mountInfo(find());
    // projects.js is a plain script, so this also works when the page is opened as a file.
    const s = document.createElement("script");
    s.src = new URL("projects/projects.js?t=" + Date.now(), root).href;
    s.onload = () => { const p = find(); if (p) mountInfo(p); };
    document.head.appendChild(s);
  }

  function start() { mountButton(); loadInfo(); }
  if (document.body) start();
  else document.addEventListener("DOMContentLoaded", start);
})();
