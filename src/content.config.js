import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

// News: one markdown file per item in src/content/news/. The file name is the page address (/news/<file-name>/).
const news = defineCollection({
  loader: glob({ pattern: "*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    image: z.string().optional(),
    link: z.string().optional(),
    linkLabel: z.string().optional(),
  }),
});

export const collections = { news };
