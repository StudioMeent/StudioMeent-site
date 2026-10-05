import { getCollection } from "astro:content";

// Paths in content.js, info.json and news files are relative to the site root ("projects/x/index.html").
export const url = p => !p || /^([a-z]+:|#|\/)/i.test(p) ? p : import.meta.env.BASE_URL.replace(/\/?$/, "/") + p;

// Newest first.
export const getNews = async () =>
  (await getCollection("news")).sort((a, b) => b.data.date - a.data.date || a.id.localeCompare(b.id));

// dd/mm/yyyy, like the old content.js dates.
export const formatDate = d => [d.getUTCDate(), d.getUTCMonth() + 1].map(n => String(n).padStart(2, "0")).join("/") + "/" + d.getUTCFullYear();
