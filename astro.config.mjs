// Studio Meent — Astro settings (BASE: don't change unless asked).
import { defineConfig } from "astro/config";
import folders from "./src/integrations/folders.js";

export default defineConfig({
  // site: "https://studiomeent.nl",   // fill in once the domain is live
  trailingSlash: "ignore",
  integrations: [folders()],
});
