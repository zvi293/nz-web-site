/**
 * generate-seo-pages.mjs
 * Post-build script: creates static HTML copies of every route with
 * correct title, description, canonical, and JSON-LD injected.
 *
 * Why: React SPA sends one index.html for all routes. Google must
 * render JS to see meta tags. Pre-generated HTML lets Google read them
 * INSTANTLY without JavaScript — faster indexing, better rankings.
 *
 * How: copies dist/index.html to dist/<route>/index.html, replacing
 * the meta tags inline. The React bundle still hydrates normally.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const BASE_URL = "https://nz-web.com";

if (!existsSync(join(DIST, "index.html"))) {
  console.error("❌  dist/index.html not found — run `npm run build` first.");
  process.exit(1);
}

const BASE_HTML = readFileSync(join(DIST, "index.html"), "utf-8");

/* ─── helpers ─── */
function esc(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inject(html, { title, description, keywords, canonical, schema }) {
  let h = html;

  const t = esc(title);
  const d = esc(description);
  const k = esc(keywords ?? "");
  const c = esc(canonical);

  // title tag
  h = h.replace(/<title>[^<]*<\/title>/, `<title>${t}</title>`);

  // description
  h = h.replace(/(name="description"\s+content=")[^"]*(")/g, `$1${d}$2`);
  h = h.replace(/(content="[^"]*"\s+name="description")/g, () =>
    `content="${d}" name="description"`
  );

  // keywords
  h = h.replace(/(name="keywords"\s+content=")[^"]*(")/g, `$1${k}$2`);

  // canonical
  h = h.replace(/(rel="canonical"\s+href=")[^"]*(")/g, `$1${c}$2`);

  // og:title
  h = h.replace(/(property="og:title"\s+content=")[^"]*(")/g, `$1${t}$2`);

  // og:description
  h = h.replace(/(property="og:description"\s+content=")[^"]*(")/g, `$1${d}$2`);

  // og:url
  h = h.replace(/(property="og:url"\s+content=")[^"]*(")/g, `$1${c}$2`);

  // twitter:title
  h = h.replace(/(name="twitter:title"\s+content=")[^"]*(")/g, `$1${t}$2`);

  // twitter:description
  h = h.replace(/(name="twitter:description"\s+content=")[^"]*(")/g, `$1${d}$2`);

  // inject page-specific JSON-LD just before </head>
  if (schema) {
    const schemaTag = `<script type="application/ld+json">${JSON.stringify(schema, null, 0)}</script>`;
    h = h.replace("</head>", `${schemaTag}\n</head>`);
  }

  return h;
}

function writePage(routePath, seo) {
  const canonical = `${BASE_URL}${routePath}`;
  const html = inject(BASE_HTML, { ...seo, canonical });

  // e.g. /about → dist/about/index.html
  const segments = routePath.replace(/^\//, "").split("/").filter(Boolean);
  const dir = segments.length ? join(DIST, ...segments) : DIST;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
  console.log(`  ✓  ${routePath}`);
}

/* ─── page definitions ─── */
const PAGES = [
  /* ── Homepage ── */
  {
    path: "/",
    title: "NZ-web | בניית אתרים ופיתוח אתרים מקצועי לעסקים בישראל",
    description: "NZ-web – סטודיו מוביל לבניית אתרים ופיתוח אתרים בישראל. בניית אתר תדמית, חנות אונליין, דפי נחיתה ומערכת ניהול תורים. Perfect in every Pixel.",
    keywords: "בניית אתרים, פיתוח אתרים, בניית אתר תדמית, עיצוב אתרים, מערכת ניהול תורים, דפי נחיתה, NZ-web",
  },

  /* ── Main pages ── */
  {
    path: "/about",
    title: "מי אנחנו | NZ-web – סטודיו לבניית אתרים בישראל",
    description: "NZ-web – סטודיו מוביל לבניית אתרים ופיתוח אתרים בישראל. 50+ פרויקטים, 5+ שנות ניסיון. Perfect in every Pixel.",
    keywords: "NZ-web מי אנחנו, סטודיו בניית אתרים, צבי משה, פיתוח אתרים ישראל",
    schema: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "@id": "https://nz-web.com/about#page",
      "url": "https://nz-web.com/about",
      "name": "מי אנחנו – NZ-web",
      "description": "סטודיו מוביל לבניית אתרים ופיתוח אתרים בישראל"
    },
  },
  {
    path: "/projects",
    title: "פורטפוליו | פרויקטי בניית אתרים ופיתוח | NZ-web",
    description: "גלו פרויקטי בניית אתרים ופיתוח שביצענו ללקוחות בישראל. אתרי תדמית, חנויות אונליין, מערכות ניהול תורים ודפי נחיתה.",
    keywords: "פורטפוליו בניית אתרים, דוגמאות אתרים, תיק עבודות, פרויקטי פיתוח אתרים",
  },
  {
    path: "/contact",
    title: "צרו קשר | קבלו הצעת מחיר לבניית אתר | NZ-web",
    description: "צרו קשר עם NZ-web לקבלת הצעת מחיר לבניית אתר, פיתוח אתרים או מערכת ניהול תורים. שיחת ייעוץ ראשונית חינם.",
    keywords: "הצעת מחיר לבניית אתר, צרו קשר, ייעוץ בניית אתר חינם",
    schema: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "url": "https://nz-web.com/contact",
      "name": "צרו קשר – NZ-web"
    },
  },
  {
    path: "/faq",
    title: "שאלות נפוצות על בניית אתרים | NZ-web",
    description: "כמה עולה לבנות אתר? כמה זמן לוקח? כל התשובות לשאלות הנפוצות על בניית אתרים ופיתוח אתרים בישראל.",
    keywords: "שאלות נפוצות בניית אתרים, כמה עולה לבנות אתר, מחיר בניית אתר",
  },
  {
    path: "/blog",
    title: "בלוג בניית אתרים | מדריכים ו-SEO | NZ-web",
    description: "מדריכים, טיפים ותובנות על בניית אתרים, פיתוח אתרים, עיצוב UI/UX וקידום SEO בישראל.",
    keywords: "בלוג בניית אתרים, מדריך פיתוח אתרים, טיפים SEO, עיצוב אתרים",
  },

  /* ── Services ── */
  {
    path: "/services",
    title: "שירותי בניית אתרים ופיתוח | NZ-web – ישראל",
    description: "כל שירותי בניית האתרים ופיתוח האתרים של NZ-web. בניית אתר תדמית, מערכת ניהול תורים, דפי נחיתה ובניית אתר מכירות.",
    keywords: "שירותי בניית אתרים, שירותי פיתוח אתרים, בניית אתר תדמית, מערכת ניהול תורים",
  },
  {
    path: "/services/web-development",
    title: "בניית אתרים מקצועיים לעסקים בישראל | NZ-web",
    description: "בניית אתרים מהירים, מודרניים ומרהיבים לעסקים בישראל. React, TypeScript, ניקוד 90+ PageSpeed, SEO מובנה.",
    keywords: "בניית אתרים, בניית אתר אינטרנט, בניית אתרים מקצועיים, פיתוח אתרים",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "בניית אתרים מקצועיים",
      "url": "https://nz-web.com/services/web-development",
      "provider": { "@type": "Organization", "name": "NZ-web", "url": "https://nz-web.com" },
      "areaServed": { "@type": "Country", "name": "Israel" },
      "description": "בניית אתרים מהירים, מודרניים ומרהיבים לעסקים בישראל"
    },
  },
  {
    path: "/services/website-development",
    title: "פיתוח אתרים מקצועי בישראל | React TypeScript | NZ-web",
    description: "פיתוח אתרים מתקדם עם ארכיטקטורה שמחזיקה לשנים. React, TypeScript, Supabase. פיתוח מערכות לעסקים בישראל.",
    keywords: "פיתוח אתרים, פיתוח מערכות לעסקים, פיתוח Full Stack, React Developer",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "פיתוח אתרים",
      "url": "https://nz-web.com/services/website-development",
      "provider": { "@type": "Organization", "name": "NZ-web", "url": "https://nz-web.com" },
      "areaServed": { "@type": "Country", "name": "Israel" }
    },
  },
  {
    path: "/services/business-website",
    title: "בניית אתר תדמית לעסקים | NZ-web – ישראל",
    description: "בניית אתר תדמית מקצועי לעסקים בישראל. עיצוב ייחודי, תוכן ממיר, SEO מובנה. 40+ אתרי תדמית שנבנו.",
    keywords: "בניית אתר תדמית, אתר תדמית לעסקים, עיצוב אתר תדמית, בניית אתר לחברה",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "בניית אתר תדמית לעסקים",
      "url": "https://nz-web.com/services/business-website",
      "provider": { "@type": "Organization", "name": "NZ-web", "url": "https://nz-web.com" },
      "areaServed": { "@type": "Country", "name": "Israel" }
    },
  },
  {
    path: "/services/appointment-system",
    title: "מערכת ניהול תורים | מערכת קביעת תורים | NZ-web",
    description: "מערכת ניהול תורים חכמה לעסקים בישראל. הזמנות אונליין, תזכורות SMS, דוחות. מפחיתה no-shows ב-70%.",
    keywords: "מערכת ניהול תורים, מערכת קביעת תורים, הזמנת תורים אונליין, תוכנה לניהול תורים",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "מערכת ניהול תורים",
      "url": "https://nz-web.com/services/appointment-system",
      "provider": { "@type": "Organization", "name": "NZ-web", "url": "https://nz-web.com" },
      "areaServed": { "@type": "Country", "name": "Israel" }
    },
  },
  {
    path: "/services/landing-page-development",
    title: "בניית דפי נחיתה ממירים לעסקים | NZ-web",
    description: "בניית דפי נחיתה לקמפיינים ממומנים. עיצוב ממוקד המרה, טעינה מתחת ל-2 שניות, A/B testing.",
    keywords: "בניית דפי נחיתה, דף נחיתה, landing page, דף נחיתה ממיר",
    schema: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "בניית דפי נחיתה",
      "url": "https://nz-web.com/services/landing-page-development",
      "provider": { "@type": "Organization", "name": "NZ-web", "url": "https://nz-web.com" },
      "areaServed": { "@type": "Country", "name": "Israel" }
    },
  },
  {
    path: "/services/react-development",
    title: "פיתוח React | אפליקציות Web מתקדמות | NZ-web",
    description: "פיתוח אפליקציות React מתקדמות לעסקים בישראל. SPA, דשבורדים, ממשקי ניהול. React 18 + TypeScript.",
    keywords: "פיתוח React, React Developer Israel, SPA, אפליקציות Web",
  },

  /* ── Blog posts ── */
  {
    path: "/blog/5-things-before-building-website",
    title: "5 דברים לדעת לפני בניית אתר | NZ-web בלוג",
    description: "בניית אתר לעסק היא השקעה משמעותית. 5 דברים שרוב בעלי עסקים לא יודעים לפני שמתחילים.",
    keywords: "לפני בניית אתר, טיפים בניית אתר, תכנון אתר לעסק",
  },
  {
    path: "/blog/seo-2026-what-works",
    title: "SEO ב-2026: מה עובד ומה לא | NZ-web בלוג",
    description: "המדריך המעשי לקידום אורגני בגוגל בשוק הישראלי. Core Web Vitals, E-E-A-T ו-Local SEO.",
    keywords: "SEO 2026, קידום אתרים, Core Web Vitals, קידום אורגני ישראל",
  },
  {
    path: "/blog/react-vs-wordpress-2026",
    title: "React vs WordPress ב-2026 | NZ-web בלוג",
    description: "WordPress קל ומוכר. React מהיר וגמיש. ניתוח כנה — מה נכון לעסק שלכם?",
    keywords: "React vs WordPress, בניית אתר React, WordPress ישראל, השוואת טכנולוגיות",
  },
  {
    path: "/blog/website-cost-2026",
    title: "כמה עולה לבנות אתר ב-2026 | NZ-web בלוג",
    description: "מדריך כנה ושקוף על מחיר בניית אתר בישראל. תבניות, WordPress, פיתוח מותאם — מה ההבדל?",
    keywords: "כמה עולה לבנות אתר, מחיר בניית אתר, עלות פיתוח אתר",
  },
  {
    path: "/blog/uiux-trends-2026",
    title: "טרנדים UI/UX ב-2026 | NZ-web בלוג",
    description: "AI-Assisted Design, Micro-interactions, Glassmorphism — מה עובד ומה לאמץ כבר עכשיו.",
    keywords: "UI UX 2026, טרנדים עיצוב אתרים, Micro-interactions, עיצוב ממשקים",
  },
  {
    path: "/blog/website-speed-fix",
    title: "למה האתר שלכם איטי – 5 פתרונות | NZ-web בלוג",
    description: "53% עוזבים אתר שלוקח מעל 3 שניות. הבעיות הנפוצות ואיך לתקן אותן לביצועים גבוהים.",
    keywords: "אתר איטי, שיפור מהירות אתר, PageSpeed, Core Web Vitals תיקון",
  },
];

/* ─── run ─── */
console.log("\n🔍  Generating pre-rendered HTML pages for SEO...\n");

let success = 0;
let fail = 0;

for (const page of PAGES) {
  try {
    writePage(page.path, page);
    success++;
  } catch (err) {
    console.error(`  ✗  ${page.path} — ${err.message}`);
    fail++;
  }
}

console.log(`\n✅  Done: ${success} pages generated${fail ? `, ${fail} failed` : ""}\n`);
