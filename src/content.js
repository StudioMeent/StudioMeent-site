/* =====================================================================
   STUDIO MEENT — SITE TEXTS
   About, Contact, team and the filter words. Edit, save, refresh.
   Projects live in their own folders in /public/projects (see README.md).

   Tips
   - Keep the quotes "..." and the commas at the end of each line.
   - Text may contain simple HTML: <em>italic</em>, <strong>bold</strong>,
     <a href="https://...">link</a>, <br> for a line break.
   - Images go in /public/base/images; refer to them as "base/images/name.jpg".
   ===================================================================== */

export const SITE = {

  // Filter words at the top of the Works page.
  categories: ["Architectuur", "Stedenbouw", "Onderzoek", "Gebouwd", "Tentoonstelling", "Publicatie", "Installatie"],

  // PROJECTS are not listed here any more.
  // Each project is its own folder in /public/projects with an info.json.
  // The build (npm run build) turns those into the Works grid automatically.

  // NEWS is not listed here any more: one markdown file per item in src/content/news/ (see README.md).

  // ---------------------------------------------------------------- ABOUT
  about: {
    heading: "Studio Meent is een ontwerpstudio voor architectuur, stedenbouw, strategie en onderzoek.",
    text: [
      "Een Meent was ooit een stuk grond in gemeenschappelijk bezit en gebruik. Vandaar dat ‘Meenten’ nog vaak terugkomen in de benaming van straten of pleinen. Deze ‘gemeenschappelijkheid’ is het vertrekpunt van elk project: het creëren van ruimte voor het collectief en de plekken waar mensen elkaar kunnen ontmoeten. We richten ons op sociale en maatschappelijke meerwaarde en versterken de zeggenschap van betrokkenen. Het behoud van gebouwen, materialen en sociale structuren gaat voor nieuwbouw. Wat we toevoegen is duurzaam en gezond.",
      "We werken momenteel aan verschillende projecten in samenwerking met Platform Woonopgave. Onder andere een onderzoek naar het ‘Beter Benutten van Bestaande Rijtjeswoningen’ voor het College van Rijksbouwmeester en Rijksadviseurs, ‘Wonen in de binnenstad’ voor de City Deal Binnensteden, een onderzoeksproject ‘Eerlijk Wonen’ in samenwerking met DGBC en Platform31 en een ‘Stadscampagne Woningen Vinden’ samen met Recht op de Stad voor de TBI Klimaattrein.",
    ],
    // Label / value rows under the text.
    facts: [
      ["Opgericht", "2024, door Sanne van Manen"],
      ["Team", "Sanne van Manen, Agata Holdenmajer, Kaan Smits, Huigh van Donselaar"],
      ["Disciplines", "Architectuur, stedenbouw, strategie, onderzoek"],
      ["Samenwerking", "Platform Woonopgave"],
    ],
  },

  // ----------------------------------------------------------------- TEAM
  // Photos that float next to the cursor when you point at a name in the "Team" row on the About page.
  // Put the photo in base/images/team/ (portrait, about 600 px wide, under ~150 KB).
  // A name without a photo (or with a missing file) just stays plain text.
  team: {
    "Sanne van Manen": "base/images/team/sanne-van-manen.jpg",
  },

  // -------------------------------------------------------------- CONTACT
  contact: {
    email: "hello@studiomeent.nl",
    rows: [
      ["Studio", '<a href="https://www.google.com/maps/search/?api=1&query=Damruststraat+3%2C+3035+KV+Rotterdam" target="_blank" rel="noopener">Damruststraat 3<br>3035 KV Rotterdam</a>'],
      ["Instagram", '<a href="https://instagram.com/" target="_blank" rel="noopener">@studiomeent</a>'],
      ["KvK", "00000000"],
    ],
  },
};
