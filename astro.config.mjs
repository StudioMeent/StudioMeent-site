// Studio Meent — Astro settings (BASE: don't change unless asked).
import { defineConfig } from "astro/config";
import folders from "./src/integrations/folders.js";

export default defineConfig({
  site: "https://c-and.xyz",   // test domain; change once the real domain is chosen
  trailingSlash: "ignore",
  integrations: [folders()],
});
