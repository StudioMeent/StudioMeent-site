/* Studio Meent — page logic (BASE: don't change unless asked).
   Site texts come from content.js; the project list comes from projects/projects.js,
   which build.js generates from the project folders. */
(() => {
  const { categories: CATS, news: NEWS } = SITE;
  const PROJECTS = window.PROJECTS || [];
  const attr = s => String(s).replace(/"/g, "&quot;");
  const paras = arr => arr.map(t => `<p>${t}</p>`).join("");
  const view = document.getElementById("view");
  let filter = null, filtersOpen = false;

  const pages = {
    works() {
      const list = PROJECTS.filter(p => !filter || p.categories.includes(filter));
      const used = CATS.filter(c => PROJECTS.some(p => p.categories.includes(c)));
      view.innerHTML = `
        ${used.length > 1 ? `<div class="filters">
          <button type="button" class="toggle" aria-expanded="${filtersOpen}" aria-controls="filter-options">${
            filtersOpen ? "Filter −" : filter ? `Filter: ${filter}` : "Filter +"}</button>
          ${filter && !filtersOpen ? `<button type="button" class="clear" data-cat="" aria-label="Filter wissen">×</button>` : ""}
          <div class="options" id="filter-options" role="group" aria-label="Filter" ${filtersOpen ? "" : "hidden"}>
            <button type="button" aria-pressed="${!filter}" data-cat="">Alles</button>
            ${used.map(c => `<button type="button" aria-pressed="${filter === c}" data-cat="${attr(c)}">${c}</button>`).join("")}
          </div>
        </div>` : ""}
        ${list.length ? `<div class="grid">${list.map(p => `
          <a class="tile" href="${p.url}">
            <span class="frame"><img src="${p.thumbnail}" alt="" loading="lazy"></span>
            <span class="caption"><b>${p.title}</b><br><span>${[p.place, p.year].filter(Boolean).join(", ")}</span></span>
          </a>`).join("")}</div>`
        : `<p class="empty">${PROJECTS.length ? "Nog geen projecten in deze categorie." : "Nog geen projecten."}</p>`}`;
      view.querySelectorAll("[data-cat]").forEach(b => b.addEventListener("click", () => {
        filter = b.dataset.cat || null;
        filtersOpen = false;   // choosing a filter folds the list closed again
        pages.works();
        view.querySelector(".filters .toggle")?.focus();
      }));
      view.querySelector(".filters .toggle")?.addEventListener("click", () => {
        filtersOpen = !filtersOpen;
        pages.works();
        view.querySelector(".filters .toggle")?.focus();
      });
      return "works";
    },

    news() {
      // Blog: every post in full, newest first (the order of content.js).
      view.innerHTML = `<div class="blog">${NEWS.map((n, i) => `
        <article class="post">
          <time>${n.date}</time>
          <div>
            <h2><a href="#news-${i}">${n.title}</a></h2>
            ${paras(n.text)}
            ${n.link ? `<a class="more" href="${attr(n.link)}">${n.linkLabel || "Bekijk het project →"}</a>` : ""}
          </div>
          ${n.image ? `<figure><img src="${attr(n.image)}" alt="" loading="lazy"></figure>` : ""}
        </article>`).join("")}</div>`;
      return "news";
    },

    article(i) {
      const n = NEWS[i]; if (!n) return pages.news();
      view.innerHTML = `<article class="text article">
        <time>${n.date}</time><h1>${n.title}</h1>${paras(n.text)}
        ${n.image ? `<img class="article-img" src="${attr(n.image)}" alt="">` : ""}
        ${n.link ? `<p><a class="more" href="${attr(n.link)}">${n.linkLabel || "Bekijk het project →"}</a></p>` : ""}
        <a class="back" href="#news">← Alle nieuws</a>
      </article>`;
      return "news";
    },

    about() {
      const a = SITE.about;
      view.innerHTML = `<div class="text">
        <h1>${a.heading}</h1>${paras(a.text)}
        <dl class="rows">${a.facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${k === "Team" ? teamNames(v) : v}</dd></div>`).join("")}</dl>
      </div>`;
      return "about";
    },

    contact() {
      const c = SITE.contact;
      view.innerHTML = `<div class="text">
        <dl class="rows">
          <div><dt>Email</dt><dd><span id="mail">${c.email}</span><button class="copy" id="copy" type="button">Kopieer</button></dd></div>
          ${c.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}
        </dl>
      </div>`;
      const btn = document.getElementById("copy");
      btn.addEventListener("click", () => {
        const mail = document.getElementById("mail");
        const done = () => { btn.textContent = "Gekopieerd"; setTimeout(() => btn.textContent = "Kopieer", 1500); };
        const select = () => { const r = document.createRange(); r.selectNodeContents(mail); const s = getSelection(); s.removeAllRanges(); s.addRange(r); };
        try { navigator.clipboard.writeText(mail.textContent).then(done, select); } catch { select(); }
      });
      return "contact";
    },
  };

  // Team photos: in the "Team" row on About, names listed in SITE.team get a photo that floats next to the cursor
  // (on touch screens: tap the name to show / hide it).
  const TEAM = SITE.team || {};
  function teamNames(html) {
    return Object.keys(TEAM).reduce((h, name) =>
      h.split(name).join(`<span class="person" data-photo="${attr(TEAM[name])}" tabindex="0">${name}</span>`), html);
  }
  const float = document.createElement("img");
  float.className = "person-photo"; float.alt = ""; float.hidden = true;
  document.body.appendChild(float);
  const broken = new Set();
  function showPhoto(el, x, y) {
    const src = el.dataset.photo;
    if (broken.has(src)) return;
    if (float.getAttribute("src") !== src) {
      float.onerror = () => { broken.add(src); float.hidden = true; };
      float.src = src;
    }
    float.hidden = false; movePhoto(x, y);
  }
  function movePhoto(x, y) {
    const w = float.offsetWidth || 240, h = float.offsetHeight || 300;
    const left = x + 24 + w > innerWidth ? x - 24 - w : x + 24;
    float.style.left = Math.max(8, left) + "px";
    float.style.top = Math.min(innerHeight - h - 8, Math.max(8, y - h / 2)) + "px";
  }
  const hidePhoto = () => { float.hidden = true; };
  view.addEventListener("pointerover", e => { const p = e.target.closest(".person"); if (p && e.pointerType === "mouse") showPhoto(p, e.clientX, e.clientY); });
  view.addEventListener("pointermove", e => { if (!float.hidden && e.pointerType === "mouse" && e.target.closest(".person")) movePhoto(e.clientX, e.clientY); });
  view.addEventListener("pointerout", e => { if (e.pointerType === "mouse" && e.target.closest(".person") && !e.relatedTarget?.closest?.(".person")) hidePhoto(); });
  view.addEventListener("click", e => {
    const p = e.target.closest(".person");
    if (!p) return hidePhoto();
    if (float.hidden) { const r = p.getBoundingClientRect(); showPhoto(p, r.left, r.top + r.height / 2); } else hidePhoto();
  });
  view.addEventListener("focusin", e => { const p = e.target.closest(".person"); if (p) { const r = p.getBoundingClientRect(); showPhoto(p, r.right, r.top + r.height / 2); } });
  view.addEventListener("focusout", hidePhoto);
  addEventListener("scroll", hidePhoto, { passive: true });
  addEventListener("hashchange", hidePhoto);

  // Routing: #works (also the home page), #news, #news-1, #about, #contact.
  // Projects are separate pages (projects/<folder>/index.html), not routes.
  let current = location.hash.slice(1) || "works";
  function route() {
    let m, tab;
    if ((m = current.match(/^news-(\d+)$/))) tab = pages.article(+m[1]);
    else tab = (pages[current] || pages.works)();
    document.querySelectorAll(".tab").forEach(a => {
      const on = a.dataset.tab === tab;
      a.classList.toggle("is-active", on);
      on ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current");
    });
  }
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    e.preventDefault();
    current = a.getAttribute("href").slice(1) || "works";
    hidePhoto();
    try { history.pushState(null, "", "#" + current); } catch (err) {}
    route();
  });
  window.addEventListener("popstate", () => { current = location.hash.slice(1) || "works"; route(); });
  route();
})();
