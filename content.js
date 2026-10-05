/* =====================================================================
   STUDIO MEENT — SITE TEXTS
   News, About, Contact and the filter words. Edit, save, refresh.
   Projects live in their own folders in /projects (see README.md).

   Tips
   - Keep the quotes "..." and the commas at the end of each line.
   - Text may contain simple HTML: <em>italic</em>, <strong>bold</strong>,
     <a href="https://...">link</a>, <br> for a line break.
   - Images for news etc. go in /base/images; refer to them as "base/images/name.jpg".
   ===================================================================== */

const SITE = {

  // Filter words at the top of the Works page.
  categories: ["Architectuur", "Stedenbouw", "Onderzoek", "Gebouwd", "Tentoonstelling", "Publicatie", "Installatie"],

  // PROJECTS are not listed here any more.
  // Each project is its own folder in /projects with an info.json.
  // build.js turns those into the Works grid automatically.

  // ----------------------------------------------------------------- NEWS
  // Newest first. text = one entry per paragraph.
  news: [
    // Newest first. Every item is shown in full on the News page (blog).
    //   date:  "dd/mm/jjjj"
    //   text:  one entry per paragraph
    //   image: optional, e.g. a project thumbnail or "base/images/foto.jpg"
    //   link:  optional, opens a project ("projects/<folder>/index.html")
    //   linkLabel: optional text of that link (default "Bekijk het project →")
    //   A news item with its own page: put it in news/<folder>/ and link to it.
    // NB: dates marked "controleer" are guesses — check them.
    {
      date: "01/10/2026", // controleer
      title: "Geen huis = geen sleutel",
      image: "news/omi-keychain/thumbnail.jpg",
      link: "news/omi-keychain/index.html",
      linkLabel: "Lees verder →",
      text: [
        "Voor OMI ontwierpen we een sleutelhanger. In een stad met 100.000 woningzoekenden maakten we er een voor een sleutel die de meeste mensen niet hebben.",
        "Het inlegstuk is met de laser gegraveerd in helder plexiglas: een oude huissleutel, het aantal woningzoekenden in Rotterdam en langs de rand ‘geen huis = geen sleutel’.",
      ],
    },
    {
      date: "18/06/2026",
      title: "Werksessie Coöperatieve Kansenkaart in Rotterdam",
      image: "projects/cooperatieve-kansenkaart/thumbnail.jpg",
      link: "projects/cooperatieve-kansenkaart/index.html",
      text: [
        "Met buurtbewoners, ontwerpers, stedenbouwkundigen van de gemeente en corporatiemedewerkers onderzochten we in vier Rotterdamse wijken waar wooncoöperaties kunnen bijdragen aan een betere buurt: Bospolder-Tussendijken, Lombardijen, Groot IJsselmonde en het Oude Noorden.",
        "De conclusie is helder: er liggen veel kansen voor buurtverbeteringen én voor meer woningen. De uitkomsten zijn uitgewerkt in de Coöperatieve Kansenkaart.",
      ],
    },
    {
      date: "01/04/2026", // controleer
      title: "Kaart van het Woonbeleid",
      image: "projects/kaart-van-het-woonbeleid/thumbnail.jpg",
      link: "projects/kaart-van-het-woonbeleid/index.html",
      text: [
        "Alle wetten en regels rond de woonopgave op één kaart: van artikel 22 van de Grondwet in het midden tot de planetaire grenzen aan de rand.",
        "Zoom in op elke regel, of volg de rondleiding met stem, in het Nederlands of het Engels.",
      ],
    },
    {
      date: "18/10/2025",
      title: "De toekomst is al gebouwd! op de Dutch Design Week",
      image: "projects/ddw-eindhoven/thumbnail.jpg",
      link: "projects/ddw-eindhoven/index.html",
      text: [
        "Op de Dutch Design Week in Eindhoven laten we met Platform Woonopgave zien dat er nog ruimte is voor 4 miljoen extra woningen, zonder te slopen: door transformatie, woningdelen, optoppen, renovatie en verdichten.",
        "Loop online mee door het straatprofiel.",
      ],
    },
    {
      date: "01/10/2025", // controleer
      title: "Publicatie: Beter benutten bestaande rijtjeswoningen",
      image: "projects/beter-benutten-bestaande-rijtjeswoningen/thumbnail.jpg",
      link: "projects/beter-benutten-bestaande-rijtjeswoningen/index.html",
      text: [
        "Voor het College van Rijksbouwmeester en Rijksadviseurs onderzochten we de kansen voor woningdelen, woningsplitsen en kleinschalig inbreiden in buurten met rijtjeswoningen uit de jaren ’60, ’70 en ’80.",
        "Blader door een selectie van het boek of download het volledig.",
      ],
    },
    {
      date: "01/07/2025", // controleer
      title: "Goed Wonen in de Binnenstad",
      image: "projects/goed-wonen-in-de-binnenstad/thumbnail.jpg",
      link: "projects/goed-wonen-in-de-binnenstad/index.html",
      text: [
        "Ons ontwerpvoorstel voor de veerkrachtige binnenstad, voor de City Deal Dynamische Binnensteden: vier doelgroepen, een actieagenda in tien punten en tien projecten.",
      ],
    },
  ],

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
