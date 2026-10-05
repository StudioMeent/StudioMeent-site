import { SITE } from "../content.js";

// Paths in content.js and info.json are relative to the site root ("projects/x/index.html").
export const url = p => !p || /^([a-z]+:|#|\/)/i.test(p) ? p : import.meta.env.BASE_URL.replace(/\/?$/, "/") + p;

const slugify = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
  .replace(/<[^>]*>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const news = SITE.news.map(n => ({ ...n, slug: slugify(n.title) }));
