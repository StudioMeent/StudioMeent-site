// Builds /projects/projects.js — the list base/back-button.js reads for the project info box.
import { getProjects } from "../../lib/projects.js";

export function GET() {
  return new Response(
    `/* GENERATED at build time from public/projects/<folder>/info.json — don't edit. */\n` +
    `window.PROJECTS = ${JSON.stringify(getProjects(), null, 2)};\n`,
    { headers: { "Content-Type": "text/javascript; charset=utf-8" } },
  );
}
