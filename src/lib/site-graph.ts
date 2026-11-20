/**
 * The site-wide JSON-LD entities — in EVERY page's single @graph (BaseLayout puts them first).
 *
 *   #organization  the business (Organization + ProfessionalService, "NZ-web")
 *   #founder       Person, צבי משה
 *   #website       WebSite, publisher → #organization
 *
 * Page nodes (src/lib/schema.ts builders) only REFERENCE these by @id. Facts only: no prices,
 * offers, ratings or claims (SITE-PLAYBOOK §1–2). Same @id → same name everywhere.
 */
import { SITE, ORG_ID, FOUNDER_ID, WEBSITE_ID, type JsonLdNode } from "@/lib/schema";

const HOURS = {
  "@type": "OpeningHoursSpecification",
  dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
  opens: "09:00",
  closes: "19:00",
};

export const ORGANIZATION: JsonLdNode = {
  "@type": ["Organization", "ProfessionalService"],
  "@id": ORG_ID,
  name: "NZ-web",
  alternateName: "NZ web",
  url: `${SITE}/`,
  logo: {
    "@type": "ImageObject",
    "@id": `${SITE}/#logo`,
    url: `${SITE}/nz-web-logo.png`,
    contentUrl: `${SITE}/nz-web-logo.png`,
    width: 512,
    height: 512,
    caption: "NZ-web",
  },
  image: { "@id": `${SITE}/#logo` },
  description:
    "סטודיו לעיצוב ובניית אתרים לעסקים בישראל: אתרי תדמית, דפי נחיתה, מערכות לקביעת תורים ופיתוח אתרים ב-React, בקוד שנכתב לכל לקוח, עם נגישות, מהירות ו-SEO כחלק מהעבודה.",
  email: "zstore.ai295@gmail.com",
  telephone: "+972-58-729-2029",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    telephone: "+972-58-729-2029",
    email: "zstore.ai295@gmail.com",
    url: "https://wa.me/972587292029",
    availableLanguage: "he",
    areaServed: "IL",
    hoursAvailable: HOURS,
  },
  address: { "@type": "PostalAddress", addressCountry: "IL" },
  areaServed: { "@type": "Country", name: "Israel", sameAs: "https://www.wikidata.org/wiki/Q801" },
  knowsLanguage: "he",
  knowsAbout: [
    "עיצוב אתרים",
    "בניית אתרים לעסקים",
    "בניית אתר תדמית",
    "דפי נחיתה",
    "מערכת לקביעת תורים",
    "פיתוח אתרים ב-React",
    "שיפור מהירות אתרים",
    'נגישות אתרים לפי ת"י 5568',
    "קידום אתרים אורגני (SEO)",
    "GEO: התאמת אתרים למנועי תשובות מבוססי AI",
    "עיצוב UI/UX",
  ],
  openingHoursSpecification: HOURS,
  founder: { "@id": FOUNDER_ID },
  /* the Google Business Profile by its Knowledge Graph id (the share.google short link 302s to a
     session-tracked search URL carrying this same kgmid) */
  sameAs: ["https://www.google.com/search?kgmid=/g/11nq8wcnzc"],
};

export const FOUNDER: JsonLdNode = {
  "@type": "Person",
  "@id": FOUNDER_ID,
  name: "צבי משה",
  alternateName: "Zvi Moshe",
  jobTitle: "מייסד NZ-web, מעצב ומפתח אתרים",
  url: `${SITE}/about/`,
  worksFor: { "@id": ORG_ID },
  knowsLanguage: "he",
  knowsAbout: ["עיצוב אתרים", "פיתוח אתרים", "React", "TypeScript", "עיצוב UI/UX", "נגישות אתרים", "SEO"],
};

export const WEBSITE: JsonLdNode = {
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  name: "NZ-web",
  url: `${SITE}/`,
  inLanguage: "he",
  description: "NZ-web: עיצוב ובניית אתרים לעסקים בישראל",
  publisher: { "@id": ORG_ID },
};

export const SITE_GRAPH: JsonLdNode[] = [ORGANIZATION, FOUNDER, WEBSITE];
