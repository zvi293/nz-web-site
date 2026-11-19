# NZ-web — Site Playbook (the binding rulebook)

nz-web.com — a Hebrew (RTL) web design & development studio site for businesses in Israel.
Owner: צבי משה. Stack: Astro (static multi-page site) + React 18 islands + TypeScript + Tailwind 3,
deployed on Netlify from GitHub `zvi293/nz-web-site` (branch `main`). NOT an SPA (see §4).

Sister sites by the same owner (different brands, different looks — never copy their visual identity):
- zstore-ai.co.il (Hebrew, violet, Leon font) and zstore-ai.com (English, orange ceramic Z, "Tactile Play").
- NZ-web keeps its own brand. Footer carries the Zstore AI credit pill (logo only, NO caption) — never restyle it away.

---

## 1. Iron rules

1. **Mobile first, always.** Design at 390px, then scale up. Before calling anything done, take 390px and 1440px
   screenshots (`npm run shoot -- <path>`) and LOOK at them: spacing, type sizes, tap targets ≥ 44px,
   no horizontal scroll, no ragged button rows, no floating element covering content. "OK on mobile" is not done.
2. **Zero prices.** No ₪, "ש"ח", "החל מ", numeric costs, `price`/`priceRange`/`offers`/`priceSpecification` in JSON-LD,
   meta, llms files or images. Pricing is described only as a model: one-time setup (הקמה) + optional monthly
   subscription (מנוי חודשי), scope sets the quote, personal quote on WhatsApp.
3. **No packages.** One offer, tailored per client. The old tiers סמארט / פרו / עילית / "נוכחות" / "מובילות" / "פסגה" /
   "הנבחרת ביותר" are banned words. The URL `/packages/` stays (SEO) but now presents the single offer ("ההצעה").
4. **No invented facts.** No project counts, years of experience, satisfaction %, client counts, ratings, stars,
   testimonials, awards, "סטודיו מוביל", "100/100", unsourced statistics. If a statistic is truly needed in an
   article, it must name a real, checkable source — otherwise phrase it qualitatively.
5. **Hebrew copy for humans.** No buzzword soup ("חוויות דיגיטליות מרהיבות", "שובר שגרה", "חסרי פשרות",
   "Perfect in every Pixel"). Short, concrete, confident sentences. Benefits framed for the client.
   Avoid: "כאבי ראש טכניים", "לא מסתתרים", "המלצה כנה", "בלי הפתעות", "הכול בידיים שלכם". No long em-dashes in copy.
   Never promise the studio uploads the client's content/products for them.
6. **Accessibility:** WCAG 2.1 AA / ת"י 5568. Real buttons and links, keyboard support, visible focus,
   contrast ≥ 4.5:1 (≥ 3:1 for large text/UI), alt text in Hebrew, `prefers-reduced-motion` respected,
   no content hidden if JS fails. The accessibility widget and statement stay.
7. **Performance:** LCP image preloaded with `fetchpriority="high"`; every other image lazy with width/height
   (no CLS). Animate only `transform`, `opacity`, `clip-path`, `filter` on small elements. No scroll listeners
   for animation — IntersectionObserver / CSS scroll-driven animations with fallbacks. No new runtime
   animation libraries; new code must not use framer-motion or gsap (they will be removed).
8. **Replace = delete.** When an image, font or component is replaced, the old one is deleted from the code
   (and its file, once nothing references it).
9. **Push / deploy only with the owner's explicit approval.** Each push costs Netlify credits.
10. All text written to the owner is Hebrew. Code, file names and commits stay English (commit messages Hebrew).

## 2. Contact facts (the only ones)

- WhatsApp / phone: 058-7292029 → `https://wa.me/972587292029?text=...` (always `target="_blank" rel="noopener"`).
- Email: **zstore.ai295@gmail.com** (nzweb295@gmail.com is retired — must not appear anywhere).
- Owner: צבי משה. Accessibility coordinator: צבי משה, zvi293293@gmail.com, 058-7292029.
- Hours: א׳–ה׳ 09:00–19:00. Service area: all of Israel (do not write "שירות בכל הארץ" as a slogan).
- Contact form → composes a WhatsApp message (no backend).
- Real portfolio (src/content/projects.ts) — real client sites only.

---

## 3. Concept — "הגלריה" (The Gallery)

> Every website we build is treated as a work of art: conceived, composed, crafted, hung on the wall.

The site is an **exhibition**. Calm bone-white gallery walls, deep ink "night rooms", one vermilion
signal colour, huge serif statements, and the art collection (`src/content/art-manifest.json`) hung like
real works — framed, lit, with museum wall labels (תווית מוזיאון: index number, Hebrew title, a quiet line of
"medium" / details). The metaphor is felt through craft, not forced in words: navigation and headings stay
plain and SEO-clear ("שירותים", "עבודות", "מגזין"); the gallery voice appears in labels, captions, transitions.

**What makes it premium (do):** restraint, generous negative space, a strict typographic scale, editorial
asymmetric grid, hairline rules, real light & shadow on frames, slow confident motion with mass, one accent
colour used with discipline, art at large scale, every detail aligned.

**What made the old site look like AI slop (never again):** violet→blue→cyan gradients, glassmorphism,
aurora blobs, grain+grid overlays, floating glass badges, fake browser chrome, pulsing "available" pills,
5-star chips, animated stat counters, tilted marquee ribbons, custom cursors, magnetic buttons, lucide icon
tiles on every item, pastel gradient cards, oversized "01–04" outline numerals as decoration, sparkles,
check-mark bullet walls, confetti, everything floating/shimmering. None of these may return.

### 3.1 Colour tokens (CSS custom properties)

| token | value | use |
|---|---|---|
| `--bone` | `#EFEAE2` | the gallery wall — default page ground |
| `--bone-2` | `#E6DFD4` | recessed panels, label cards on bone |
| `--paper` | `#F8F6F2` | reading surfaces (articles, forms) |
| `--ink` | `#121110` | night rooms, primary text on light |
| `--ink-2` | `#1C1A18` | raised surfaces on ink |
| `--ink-3` | `#2A2724` | borders/hover on ink |
| `--graphite` | `#57524B` | secondary text on bone (≈ 6.9:1) |
| `--ash` | `#A8A097` | secondary text on ink (≈ 7:1) |
| `--vermilion` | `#E0401F` | THE accent: CTAs, the active dot, one highlighted word, the "cube" |
| `--vermilion-deep` | `#B8321A` | accent as small text on bone (≥ 4.5:1), pressed state |
| `--line` | `rgba(18,17,16,.14)` | hairlines on bone |
| `--line-ink` | `rgba(239,234,226,.14)` | hairlines on ink |

Vermilion is used sparingly: never for body text on ink at small size, never as large background floods
except one deliberate CTA moment. No gradients as decoration (a subtle radial "gallery light" on walls is fine).

### 3.2 Typography

- **Display:** Frank Ruhl Libre (self-hosted woff2, Hebrew + Latin subsets) — weights 300/500/700(/900 optional).
  Big statements in 300–500 with tight leading (0.95–1.05) and slight negative tracking; never 900 everywhere.
- **Text/UI:** Heebo 400/500/700 (already self-hosted). Rubik is removed.
- Scale (fluid `clamp`): display-xl 56→168px, display-l 44→112px, h2 34→72px, h3 22→32px, lede 18→22px, body 16→18px,
  label 12–13px (Heebo 500, letter-spacing .04em, tabular numerals).
- `text-wrap: balance` on headings, `pretty` on paragraphs. Latin words inside Hebrew in `<span dir="ltr">` / `<bdi>`.
- Museum label style: small Heebo, `--graphite`, a vermilion index ("01"), a hairline above.

### 3.3 Layout

- Container max 1440px, side gutter 20px (mobile) → 48px → 64px. 12-col editorial grid on desktop,
  asymmetric compositions (text on the right in RTL, art offset), single column on mobile.
- Section rhythm 72px (mobile) → 160px (desktop). Sections alternate bone walls and ink rooms deliberately.
- Radius: art frames 2px (real frames are square) or 0; buttons are pills (999px); cards 4–8px. No 2rem blobby radii.

### 3.4 Motion principles

1. **Light, then reveal.** Art enters with a slow `clip-path` wipe (curtain) + scale 1.08→1 over ~1.1s, ease
   `cubic-bezier(.2,.8,.1,1)`. Text lines rise 16px + fade, staggered 60ms.
2. **Mass, not float.** Nothing bobs or loops forever. Hover = subtle: frames lift 4px with a deeper shadow;
   links get an underline that draws from right to left (RTL).
3. **Scroll as a walk through rooms** — one or two signature scroll moments per page, not everywhere.
4. **Quiet when asked:** `prefers-reduced-motion` or the a11y widget's pause → final states, no transforms.
   Hidden start states live only under a JS-set class (e.g. `html.nz-motion`) so no-JS shows everything.

### 3.5 Art usage

- Always via the shared `<Artwork slug=… />` component (AVIF+WebP `<picture>`, srcset 640/1080/1600, LQIP blur
  placeholder + dominant colour, width/height, lazy by default, `priority` for the LCP image).
- Each slug is used **once per page**, and a given slug is the "signature" of one page only (see map below);
  repeating it elsewhere as a small thumbnail (e.g. related cards) is fine.
- Alt text and exhibit titles come from the manifest.
- The source PNGs live in `תמונות תדמית/` (git-ignored). Add art: edit `scripts/art/registry.mjs`, run `npm run art`.

**Art map (page → signature slug)**

| page | slug |
|---|---|
| Home hero (the exhibit; may rotate between a few) | `brushstroke-cube` (primary), alternates `cobalt-glass`, `origami-crane`, `amber-sun-stair`, `paper-plane` |
| Home final CTA ("the curtain rises") | `emerald-curtain` |
| /services/ | `darkroom-glow` |
| business-website | `titanium-ribbon` |
| website-development | `shell-staircases` |
| web-development | `mobius-brick` |
| react-development | `indigo-loom` |
| landing-pages | `coral-ladders` |
| landing-page-development | `paper-plane` (hero) |
| website-performance | `lime-prism` |
| appointment-system | `brass-clockwork` |
| (e-commerce mentions / store topics) | `cobalt-storefront` |
| SEO / GEO topics | `copper-roots`, `lighthouse-blueprint` |
| UI/UX topics | `kinetic-balance` |
| Vertical: lawyer | `balance-dome` |
| Vertical: accountant | `felt-coral-drawer` |
| Vertical: real-estate | `cobalt-brutalist` |
| Vertical: clinic | `origami-lemon` |
| Vertical: architect | `emerald-staircase` |
| Vertical: consultant | `chess-pawn` |
| Vertical: beauty | `carnation-pavilion` |
| Vertical: contractor | `stone-arcs` |
| Landing: campaign | `ruby-amphora` |
| Landing: lead-generation | `luminous-net` |
| Landing: trades | `terracotta-waterfall` |
| Process steps | `marble-maze` (אפיון), `kinetic-balance` (עיצוב), `indigo-loom` (פיתוח), `emerald-curtain`/`amber-sun-stair` (השקה) |
| /projects/ | `neon-gallery-door` |
| /about/ | `ceramics-volcanic` (+ `embroidered-comet` for the philosophy) |
| /contact/ | `ceramic-handsets` |
| /faq/ | `harp-bridge` |
| /packages/ (ההצעה) | `chair-bubble` |
| /blog/ hub | `zipper-library` |
| /accessibility/ | `thermal-hand` |
| /privacy/ & /terms/ | `ice-constellation` |
| 404 | `ceramic-portals` |
| /thank-you/ | `embroidered-comet` |
| Blog covers | the remaining slugs: `ultramarine-spill`, `silver-droplet`, `porcelain-shockwave`, `cyanotype-jellyfish`, `chocolate-landscape`, `sneaker-pool`, `handbag-ice`, `snowflake-furnace`, `obsidian-tear`, `turquoise-fans`, `book-garden`, `keycap-hotel`, `chrome-umbrella`, `cobalt-storefront` (store topics), `copper-roots` / `lighthouse-blueprint` (SEO/GEO topics) |

---

## 4. Architecture, components & code conventions

### 4.1 Architecture — Astro static MPA (never an SPA)
- Every URL is a complete HTML document generated at build time: `astro build` →
  `dist/<path>/index.html` (`trailingSlash: "always"`, `build.format: "directory"`), plus `dist/404.html`.
  URLs keep their trailing slash forever (SEO equity). No client router, no SPA fallback, no runtime
  `<head>` changes. Navigation = plain `<a href>`; Astro prefetches internal links on hover/focus.
- **Zero JS by default.** React runs only in *islands* (`client:*` directives). Everything else is static HTML.
- Files:
  - `src/pages/**.astro` — routes ONLY (one file per URL; `[slug].astro` + `getStaticPaths` for data-driven pages:
    blog posts from `src/content/blog.ts`, verticals from `src/data/verticals*`, landings from `src/data/landings*`).
  - `src/layouts/BaseLayout.astro` — the one document shell: full `<head>`, boot script, skip link, `<Header>`
    (island, fully server-rendered), `<main id="main-content">`, `<Footer>` (static), global islands
    (cookie banner, accessibility widget), and `src/scripts/global.ts`.
  - `src/views/**` — React page bodies (legacy pages still render one whole view as one island).
  - `src/components/nz/` (kit primitives), `src/components/art/` (`Artwork`), `src/components/home/` (home sections).
  - `src/lib/seo.ts` (`PageSeo` → head), `src/lib/schema.ts` (JSON-LD builders), `src/lib/site-graph.ts`
    (#organization / #founder / #website stubs), `src/scripts/global.ts` (motion gate, `<Reveal>`, art fade-in,
    skip link, analytics after consent).
- **SEO lives in the page's frontmatter** → `<BaseLayout seo={…}>`, computed at build time: title, description,
  canonical, robots/noindex, OG/Twitter (`OG_IMAGES`), breadcrumb, the LCP preload (`lcpArt`) and the page's
  JSON-LD nodes. One `@graph` per page. Islands never touch `<head>`.
- **Adding a page:** create `src/pages/<route>.astro` (that alone creates the URL and its sitemap entry):
  ```astro
  ---
  import BaseLayout from "@/layouts/BaseLayout.astro";
  import MyHero from "@/components/<page>/MyHero";          // React or .astro sections
  import MySignature from "@/components/<page>/MySignature";
  import "@/styles/pages/<page>.css";
  import { webPage, faqPage, OG_IMAGES } from "@/lib/schema";
  import { heroImage, type PageSeo } from "@/lib/seo";
  const PATH = "/my-page/";
  const title = "מילת מפתח ראשית … | NZ-web";
  const description = "…140–160 תווים…";
  const HERO_SIZES = "(min-width: 1024px) 50vw, 100vw";      // same string as <Artwork priority sizes>
  const seo: PageSeo = {
    path: PATH, title, description, ogImage: OG_IMAGES.services,
    lcpArt: { slug: "darkroom-glow", sizes: HERO_SIZES },
    breadcrumb: { name: "שם העמוד", path: PATH, parent: { name: "שירותים", path: "/services/" } },
    jsonLd: [webPage({ path: PATH, title, description, primaryImage: heroImage("darkroom-glow", PATH), speakable: true }),
             faqPage(faqItems, PATH)],
  };
  ---
  <BaseLayout seo={seo}>
    <MyHero />                          <!-- static: no directive -->
    <MySignature client:visible />      <!-- interactive, below the fold -->
  </BaseLayout>
  ```
  `npm run build` then lists it in `sitemap.xml` (with its hero image) automatically; `noindex: true` keeps it out.
- **Island policy:** static by default (no directive) — `<Reveal>`, artwork fade-in and the motion gate work without
  React (global script). `client:visible` for below-the-fold interactivity (signature components, hover previews,
  scroll moments). `client:load` only for an interactive above-the-fold element (e.g. the home hero switcher).
  `client:idle` for global chrome (header menus, cookie banner, a11y widget). Island props must be serialisable
  (strings/numbers/plain objects — pass a slug, never icon components or functions). Island code must not touch
  `window`/`document` during render (only in effects/handlers), because islands are server-rendered too.
- **CSP:** `scripts/postbuild.mjs` hashes every inline executable `<script>` in `dist/` (Astro's island runtime +
  BaseLayout's boot script) into `dist/_headers` (`script-src 'self' 'sha256-…'`). Never add `unsafe-inline`; never
  add a `<meta>` CSP. New behaviour goes in a bundled module (`<script>` in .astro, or an island), not `is:inline`.
- Images in TS/TSX: `import x from "@/assets/…/file.webp"` gives the hashed URL string (astro.config.mjs plugin).
- Legacy pages (still old visuals) render their whole view as one `client:load` island and still use
  framer-motion/gsap — when you redesign a page, replace it with static sections + small islands.

### 4.2 Components & code conventions
- Shared design-system code lives in `src/components/nz/` (primitives) and `src/components/art/` (`Artwork`).
  Global tokens + base styles in `src/index.css`. **Page-specific CSS** goes in its own file
  (e.g. `src/styles/pages/<name>.css`, imported by the page's .astro file) with a class prefix per page — do not grow
  `index.css` with page styles.
- Tailwind is available (content globs include `.astro`); prefer token-based utilities / semantic classes over ad-hoc colours.
- Every page: SEO in frontmatter (above), exactly one `<h1>`, landmark structure from BaseLayout
  (`header`, `main#main-content`, `footer`, skip link) — page views must NOT render their own `<main>`.
- **Every page AND every article has its own signature component** — an original interaction or composition
  invented for that page's subject (see §9). Never copy one page's signature to another, never reuse the same
  interaction model (e.g. if one page has a drag-to-compare, no other page gets a drag-to-compare). The shared
  kit (buttons, sections, Artwork, labels) is the brand; the signature is the page's own voice.
- RTL: use logical properties (`ms-`/`me-`, `inset-inline-start`, `padding-inline`), never left/right for layout.
- Commands: `npm run dev` (astro dev, :8080) · `npm run build` (astro build + postbuild) · `npm run preview` (dist on :8080).

## 5. SEO / GEO / AEO checklist (every indexable page)

- `<title>` ≤ 60 chars, primary keyword first, ending `| NZ-web`. Meta description 140–160 chars, unique.
- Self-referencing absolute canonical with trailing slash; OG + Twitter tags; `og:locale he_IL`.
- Exactly one H1 containing the page's primary keyword; logical H2/H3.
- JSON-LD: the single business entity `#organization` (in index.html) + per page `WebPage`/`Service`/`FAQPage`/
  `BlogPosting`/`BreadcrumbList` that reference it by `@id`. No prices. `dateModified` kept current.
- FAQ blocks: visible Q&A matches FAQPage schema exactly.
- Internal links: hub-and-spoke (services ↔ verticals ↔ articles), descriptive Hebrew anchor text.
- `public/llms.txt` + `public/llms-full.txt` kept in sync with pages/articles; robots allows AI crawlers.
- Sitemap generated by `scripts/postbuild.mjs` from the built pages (real `lastmod`; image entries for the hero art).
- After an approved push: IndexNow fires (Netlify function), then sitemap/indexing in Search Console and Bing.

## 6. Security

- Strict CSP generated into `dist/_headers` by `scripts/postbuild.mjs` (inline scripts allowed only by sha256 hash, no
  `unsafe-inline` for scripts; GA/Meta only after cookie consent). HSTS preload, nosniff, frame-ancestors,
  Referrer/Permissions/COOP/CORP policies stay in `netlify.toml`.
- No third-party CDNs, no external fonts. Fonts self-hosted in `public/fonts`.

## 7. QA process

1. `npm run build` (astro build + postbuild: sitemap + CSP `_headers`) must pass.
2. `npm run qa` — static checks over `dist/` (titles, descriptions, canonicals, one H1, alt text, JSON-LD parses,
   banned words/prices/numbers, retired email, internal links resolve, sitemap matches routes).
3. `npm run shoot -- / /services/ …` — 390px + 1440px full-page screenshots; look at them.
4. Lighthouse-level sanity: no console errors, no CLS, LCP image preloaded.

## 8. Monthly articles (מגזין)

- One new article per month (scheduled task), written for Israeli small-business owners, on a topic with real
  search demand that the site can rank for, without cannibalising existing pages.
- Article = entry in `src/content/blog.ts` (cover `art` slug from the unused list, category, read time, date),
  2,000–3,000 Hebrew words, H2/H3 structure, a short answer-first summary at the top (AEO/GEO), an FAQ block
  (FAQPage schema), internal links to 2–3 service pages and 2 related articles, no invented statistics.
- Update `llms.txt` / `llms-full.txt`, run build + qa + shoot, then send the owner a summary and wait for approval
  before any push.

### 8.1 Article anatomy — never a wall of text (owner, 19/11/2026)
Articles must feel like the best Zstore guides and better: a designed, visual reading experience. Every article has:
1. Hero: cover artwork (framed, museum label) + eyebrow "מגזין · N דקות קריאה" + H1 + answer-first lead (40–70 words) + "מה בפנים" chips that jump to sections.
2. The prose broken by **2–4 visual blocks** (choose per topic, vary between articles): numbered process steps with
   connecting rail; split section (text + framed art or diagram) with a check-list of glazed beads; comparison table that
   becomes stacked cards on mobile; "בקצרה" key-takeaways card; tip / warning callout; pull quote; illustrated diagram (SVG);
   do/don't pair; mini checklist the reader can tick (state kept locally).
3. ONE original signature component ([[signature]] marker) born from the topic — never a model used elsewhere (§9).
4. Byline + updated date + reading time; FAQ (4–5 unique Qs, FAQPage JSON-LD identical); "ממשיכים לקרוא" (3 cards);
   final CTA; glossary links on first use of terms; 3–8 contextual internal links.
5. Mobile: comfortable 17–18px body, 1.7 line-height, max 68ch, floating TOC pill; desktop: sticky TOC rail, margin notes.
The content renderer (src/lib/blog.ts) must support these blocks through simple markers in the content string
(e.g. `:::steps`, `:::compare`, `:::takeaways`, `:::tip`, `:::warn`, `:::checklist`, `:::split art=<slug>`, `> pull quote`),
each rendered by a designed component.

## 10. Proven practices borrowed from the Zstore sites (adapted to NZ-web)

Take the craft, never the look (no Leon, no violet, no orange ceramic Z, no slabs/stickers/keycaps).

**"Alive, never boring" (per page):** besides the signature component, 2–3 more *living touches* that vary page to
page (scroll reveals with mass, kinetic/split serif type, self-drawing hairlines/SVG, sticky storytelling, parallax
inside frames, pointer-reactive light) **and** a fresh layout idea (asymmetric grid, overlapping frames, oversized
type, a room that changes tone). Section openers must vary — not the same eyebrow+H2 everywhere (rotate: hairline
rule + index, split title/lede row, giant serif numeral, stacked label, pull-quote opener). 60fps on phones.

**Mobile beauty pass:** shoot every page at 360 / 390 / 430 and 1440; a harsh judge per page answers "stunning or
not, and why"; fix until stunning. Pages must survive 200% text at 390 without horizontal scroll. Never crop an
artwork's focal object on phones (set `object-position` per image or show the full frame).

**SEO / GEO / AEO depth**
- One primary keyword per page (no cannibalisation; service pages commercial, articles informational). Keyword at
  the start of the title, in the H1, the first sentence, one H2, the slug, the meta.
- Answer-first lead of 40–70 words under the H1 (marked as `speakable`). H2s phrased as real search questions, each
  opening with a 1–2 sentence direct answer.
- E-E-A-T byline on articles: "נכתב על ידי צבי משה, מייסד NZ-web" (link to /about/) + "עודכן ב-<time>" + reading time.
- JSON-LD as one `@graph` per page: stubs `#organization`, `#website`, `#founder` (Person); page nodes with
  canonical + fragment ids (`#webpage`, `#breadcrumb`, `#faq`, `#article`, `#service`); WebPage with `isPartOf`,
  `primaryImageOfPage`, `speakable` ["h1", ".lead"], `datePublished`/`dateModified`. Home adds HowTo (the 4-step
  process). Hubs: CollectionPage + ItemList. Same `@id` → same name everywhere. Never reviews/AggregateRating/price/offers.
- ImageObject licensing on hero images: `license` (/terms/#ip — the anchor must exist), `acquireLicensePage`
  (/contact/), `creditText` "NZ-web", `copyrightNotice` "© צבי משה, NZ-web", `creator` {"@id": "#founder"} —
  exactly once (a duplicate `creator` key made GSC mark the page unparsable on the sister site).
- FAQs unique site-wide, and FAQPage text identical to the visible `<details>` (same order).
- 3–8 contextual internal links with descriptive Hebrew anchors; "ממשיכים לקרוא" (3 cards) at the end of
  articles; no orphan pages; no links inside headings.
- `llms.txt` with a key-facts table and a "הנחיות לעוזרי AI" block (never quote prices, no packages, no ratings
  or client counts) + `llms-full.txt` with every page's summary and FAQ verbatim; declare the site as the
  canonical source. `humans.txt`. robots.txt: named AI-crawler groups each repeating
  `Content-Signal: search=yes, ai-input=yes, ai-train=yes` (a named group ignores `*`).
- Sitemap with the image namespace (`image:image` for each page's hero art) and real `lastmod`.
- IndexNow on every production deploy (Netlify event function `netlify/functions/deploy-succeeded.js` + key file
  at the root served `text/plain` + `X-Robots-Tag: noindex`); never fails the deploy; `/netlify/*` 404'd.
- Post-launch: GSC sitemap + Request indexing (~10/day), Bing Webmaster sitemap + URL Submission (feeds ChatGPT
  Search / Copilot), the `site-launch` skill.
- Per-page OG images (1200×630) generated at build from the page's artwork + title, instead of one generic card.

**Security:** CSP as a response header only (never also a meta CSP — they stack and silently block things);
`script-src` without `unsafe-inline` (hash any unavoidable inline boot script); `frame-ancestors 'none'`;
`form-action` limited; text files served with utf-8 content types; long immutable cache only for hashed assets.

**Accessibility depth:** focusables get `scroll-margin-top` = header height + 16px (WCAG 2.4.11 focus not
obscured); native `<dialog>` for every popup/sheet with one history entry so the phone BACK button closes it,
body scroll pinned without layout shift, focus returned to the opener; new components join the a11y widget's
font/contrast/motion lists; `<details><summary>` FAQs; no-JS fallbacks (`html:not(.js)`).

**UX touches:** a floating WhatsApp button that springs in after ~60% of the first screen and politely hides when
it would cover text or a tap target (probe with `elementsFromPoint`); a floating "בעמוד הזה · 02/06" pill + sheet
TOC with reading progress on long articles (sticky rail on desktop ≥1100px); a magazine hub with category filter
and counts in one scroll row; a glossary of web terms (DefinedTermSet) that articles link to on first use.
No-orphan grid rule: the column count must divide the card count (or use a wide card).

**Process:** build → critic → fix per page; one consolidated QA (`npm run qa` until NO PROBLEMS, shots, zero
console/CSP errors) before asking the owner; clean temp files, servers and headless browsers at the end.

## 11. NZ-web originals (ideas unique to this site)

- **Wall labels everywhere art appears** — index in vermilion, Hebrew title, a "חומרים" line (what the work
  stands for on that page). Consistent micro-typography makes the whole site feel curated.
- **Rooms, not sections** — each page quietly carries a room number in its first label ("אולם 03 · שירותים"),
  giving wayfinding across the site without changing the SEO-plain navigation.
- **Gallery light** — art frames get a soft, scroll-linked light falloff (CSS scroll-driven animation with a
  static fallback), never a cursor spotlight.
- **View Transitions between rooms** — where supported, a card's artwork morphs into the next page's hero
  (`document.startViewTransition` / `view-transition-name`); instant navigation elsewhere and with reduced motion.
- **Magazine as print** — articles typeset like a catalogue essay: serif drop cap, pull quotes, margin notes
  (side-notes on desktop, tap-to-open on mobile), a print stylesheet that prints beautifully.
- **Each monthly article is a "גיליון"** (issue number + month) and adds one never-seen signature component.
- **Curtain as the brand transition** — the vermilion "cube" and the curtain wipe are the recurring brand gestures;
  everything else on a page is new.

## 9. Signature components — creativity rules + registry

The owner's standing instruction: be creative all the time, on every page. Take inspiration from the best
(Awwwards SOTD, Stripe, Linear, Apple, Vercel, Framer, editorial magazines, museum websites) and invent beyond it.
Nothing repeats itself; every new page or monthly article adds something new and different.

Rules for a signature component:
1. It is born from the page's subject (a page about speed gets something about speed; a lawyer page about balance/
   precedent; an article about accessibility lets you feel what a keyboard user feels…). It must teach or show
   something — never decoration for its own sake.
2. A NEW interaction model each time (drag, dial, scrub, reorder, reveal, x-ray loupe, flip, weigh, assemble,
   type, sort, compare, light a spot, pull a thread…). Check this registry first; do not reuse a model already listed.
3. Mobile first: it must be delightful by touch at 390px (thumb reach, no hover-only behaviour, no tiny targets),
   then richer with a pointer on desktop.
4. Accessible: keyboard operable, screen-reader sensible (aria-live where state changes), works without JS
   (meaningful static fallback), `prefers-reduced-motion` → final/static state.
5. Light: CSS + small vanilla TS hooks, no new libraries; pauses off-screen; no layout shift.
6. Log it here: `page — name — interaction model — one line description` right after you build it.
   The first line of its component file is a comment: `// Signature component: <name> — <model>`.

### Registry (keep appending — newest last)
| page | name | interaction model | description |
|---|---|---|---|
| / (home) | המוצג הבא | switch exhibit (curtain wipe) | hero artwork cycles between 5 works with a clip-path curtain; museum label updates (aria-live) |
| / (home) | אולם השירותים | focus/hover preview | serif service rows; the focused row's artwork appears in a sticky frame |
| / (home) | המסך עולה | scroll-opened curtain | final CTA revealed by a curtain opening as it enters the viewport |
| /services/ | מפת האולמות | floor-plan selection | SVG floor plan of the services wing (8 service rooms + the conversation room at the end of the hall); tap/click a room (or arrow keys, radiogroup) to light it in warm darkroom light, draw the walk from the entrance in vermilion and show its wall label (art, line, "חומרים", link; aria-live); the directory beside it is the no-JS fallback (on phones it folds into "כל החדרים ברשימה" once the plan is live) |
| /services/business-website/ | סרט אחד, שלושה מסכים | drag-to-resize | drag the vermilion handle (slider: arrows/PageUp/Home/End), tap the ruler or the נייד/טאבלט/מחשב stops to stretch a mini business site from 360 to 1280 virtual px (true proportions via container-query units); menu folds, hero splits, cards go 1→2→3 live; dashed outlines show the wider screens and the free wall beside a narrow screen carries live notes on what the layout changed ("מה השתנה בפריסה"); one hint nudge on first view |
| /services/website-development/ | מסלול האתר | sign-off gates (stamp your approval to unhook the rope to the next station) | the way from a first call to a live site, as it really works: five stations on one line (אפיון → מבנה → עיצוב → פיתוח → השקה), start on the right, and between every two a velvet museum rope that only the client unhooks; the open station's paper card (what happens, "מה מקבלים בסוף התחנה", "מה נצטרך מכם", a self-drawing sketch of the deliverable) carries a rubber stamp "אישור שלכם": press it and it thumps an "אושר" impression onto the card, the rope drops and hangs from its brass post, the line is inked on and the next card opens (focus moves to it); passed stations stay open to re-read, stations ahead are roped off (aria-disabled; a tap shakes the rope and says what opens it); the last stamp, "לעלות לאוויר", leaves "באוויר" and the real wa.me start + "מההתחלה"; "רק לקרוא את כל התחנות, בלי לאשר" for skimmers; tablist with roving tabindex over open stations, aria-live; all cards share one grid cell (no layout shift); no-JS lists every station; the stations also feed the page's HowTo JSON-LD |
| /services/web-development/ | הקוד מאחורי הקיר | turn the canvas over (flip a part to read its verso) | a small bakery's home page hangs like a canvas on its stretcher, built of six panels (nav, H1, WhatsApp button, picture, sections, footer); tap a panel, or its note, and it turns over on its horizontal axis (3D rotateX, backface hidden) like a painting turned to read its back: the verso is raw linen on wooden stretcher bars with an inventory sticker ("02 <h1>") and, written on it, the code that holds that part up (one H1, a real wa.me link, a light <picture> with fixed size, sections with H2, JSON-LD), bidi-safe (Hebrew text runs keep their punctuation); six numbered notes beside it say why it is written that way and are the keyboard / screen-reader controls (aria-pressed); "להפוך את כל הבד" cascades every panel, "חזרה לחזית" turns them back; the picture panel lifts its edge once on first view; aria-live "הפכתם את … 3 מתוך 6"; SSR / no-JS = the H1 panel shown from the back; reduced motion = instant swap |
| /services/react-development/ | רינדור חי | type → live highlight | a small tea shop (paper screen) beside its component tree drawn as loom threads; type in its search (or "הקלידו בשבילי", which types a word letter by letter without a phone keyboard) or put a tea in the cart, and only the components that depend on the change render again: each re-rendered region of the shop gets a vermilion outline and pops its own render count (×N) on the spot, a dark devtools strip on top of the shop counts "N / total" (phones; the tree says it on desktop), and the tree flashes their threads and bumps each count (Catalog/SearchBox/ResultsList + newly mounted TeaCards on typing; CartBadge + the pressed card on cart); a switch "בלי חלוקה לרכיבים" shows the whole page redrawn on every change; fixed TeaCard slots and a reserved why-line keep the island's height constant (no shift while typing or during the demo); a plain why-line + aria-live (debounced); no-JS = every component rendered once |
| /services/landing-pages/ | סולם ההמרה | hand-over-hand climb (alternate two thumb buttons; same hand twice = slip) | a ladder leaning to a coral light ("פנייה") beside a framed sample landing page (a children's swim school); two big thumb buttons יד ימין / יד שמאל under the stage — each pull with the OTHER hand raises the click one rung, the hands grip the rails, the card under it explains that rung's principle (מסר תואם → פעולה אחת קצרה) and the sample page scrolls to and lights the block where it lives; the same hand twice slips (no rung is skipped — nor does a visitor); the seventh pull lights the light and recaps the six; ←/→ also pull; aria-live; no-JS = climber at the top + the six principles as text, hands hidden |
| /services/landing-page-development/ | מבחן חמש השניות | timed recall | a roller blind lifts on a sample landing page for five seconds (vermilion time bar + serif countdown), drops, and asks what it offered (four answer pills); round 1 is a busy page (vague headline, three offers, popup), round 2 the same business on a clear page; a verdict per answer explains each round, "לראות את הדף שוב" reopens it untimed; the summary shows both pages side by side + what the clear page did; phones: each phase brings the exhibit under the header and the closed blind folds to a strip so answers + verdict fit one screen; focus follows question → verdict → summary → intro heading, aria-live; no-JS = the summary as a still |
| /services/website-performance/ | מירוץ האור | race playback | first view = the finished race (both small screens built, notes lit, dials full); tap to replay it: the same page twice, heavy vs optimised, a lime beam (the prism's light) runs along each lane as it loads, the screen at the lane's end builds itself (text → main image → button; the heavy one stalls on a blocking script and jumps when a banner lands), a large dial fills with the time spent, notes light up as each lane passes them; a Wi-Fi / weak-cellular switch stretches both; labelled as an illustration (no numbers); the rAF loop is cancelled off screen and restarted on return; reduced motion / no-JS = the finished race; aria-live result |
| /services/appointment-system/ | חוגת הזמן | rotary dial | a brass telephone-style finger wheel with eight time holes: pick a day (radiogroup), drag the wheel round / tap a hole / arrow keys (role=slider, ↑/→ = later) until the time sits under the vermilion stop; input on an HTML grip over the wheel (touch-action:none works there, taps resolved by angle + radius); taken holes are dark and skipped; two brass gears behind it turn with the wheel; "לקבוע את התור" stamps the ticket card "נקבע" and the slot becomes taken (no double booking); upright labels, rubber-band ends, aria-live; no-JS = the dial + an example card, controls hidden |
| vertical lawyer | המאזניים | weigh (drag a weight onto a balance pan; touch: press to lift, then drag) | a beam with two hanging pans: five questions a client asks before calling a lawyer weigh one pan down; drag a weight from the shelf onto the empty pan (mouse/pen at once; on touch a 160ms press lifts it, then it follows the finger while the page stays still, a quick swipe still scrolls) or tap it (keyboard, aria-pressed) and it flies in (FLIP), ticks the question it answers and the beam swings toward level (CSS --tilt, damped settle); one trap weight, "a promise to win", falls onto the questions' side (Bar advertising rules); all answered → the beam levels, turns vermilion, "מאוזן" seal; aria-live; one swing on first view |
| vertical accountant | המגירות | pull drawers (filing cabinet; a ledger sheet rises from a hanging folder) | an ink filing cabinet, one drawer per service page (brass label holders); drag a drawer's pull down (touch-action none on the pull only) or tap the drawer (aria-expanded) and it slides out: the tray opens (clip-path), a hanging file folder sits in it and the page's ledger sheet rises out of it (red margin rule, the H1, ruled lines of what is on the page, the Google search it catches double-ruled like a total); the drawers below glide (FLIP, transform only); a site-map tree beside it ticks pages visited; no-JS shows every tray |
| vertical real-estate | סדר הצפייה | reorder (drag rows of a listing page into a buyer's reading order) | a paper property page of a realtor's site built office-first, photos-last; six rows (photos, details, floor plan, map, the agent, WhatsApp with the property name), each with a line drawing; drag a row by its grip (touch-action none on the grip only; transforms while dragging, DOM reorders on release + FLIP) or tap its ▲/▼ (keyboard ↑/↓/Home/End on the grip, focus kept); every slot says what the buyer is doing at that depth, a vermilion reading line runs down as far as he reads and marks where he leaves (photos first, details second, WhatsApp last → "נקבע ביקור" stamp); aria-live; no-JS states the order that works |
| vertical clinic | חדר שקט | press-and-hold (breathe) | a noisy clinic site (pop-up, flashing deal, fake countdown, nagging chat, wall of text); press and hold the round button (or hold Space/Enter) and breathe in with the ring: the next noise blurs and fades while held, a full breath swaps it for the calm element a worried patient needs; letting go eases the breath back; five breaths → a quiet room; on phones the button rides the bottom edge of the screen over the page (sticky), on desktop it stands beside it; stays focusable when done (aria-disabled); "להשקיט הכול" for anyone who cannot hold; aria-live |
| vertical architect | מהשרטוט לבניין | tracing-paper overlays (flip translucent sheets down onto a drawing, any order) | a drafting board holds the empty frame of a portfolio site; five sheets of tracing paper hang above it on masking tape, one layer each (grid = structure, walls = the page's spaces, dimensions, materials = type and captions, light = photographs + the one action colour); tap a sheet's paper tab (aria-pressed) and it swings down on its hinge (rotateX, origin top) and its lines draw in (stroke-dashoffset); tap again and it lifts; layers combine in any order; all five → "הבניין עומד" stamp; legend + aria-live say what each layer adds; no-JS = every sheet down |
| vertical consultant | המהלך הבא | branching choice on a board | a 5×5 board with a glass-green pawn; move one (three marked squares = niche / named method / the stage), move two (two squares = a call in the calendar / content that leads to one); the pawn slides, the path draws in vermilion, the moves are written in chess notation (א–ה), and a strategy card shows home page, key page and next step; options also listed as buttons; aria-live |
| vertical beauty | פלטת הגוונים | re-theme picker | a make-up compact with six colour pans (native radios) beside a small beauty-studio site; a pan re-themes it live (ground, ink, button, serif/sans, radius, gallery shapes); real WCAG contrast ratios are computed for text and button, and when white fails AA on a light shade (mint, gold) the button switches to dark text by itself and says "תוקן" |
| vertical contractor | אבן הראשה | load test (roll a weight across an arch; weak stones crack and fall, re-cut them) | a stone arch on its wooden centring that looks whole, built like many tradespeople's sites: four of seven stones are weak (no business details, stock photos, every job on one page, a phone number at the bottom); drag the cart ("לקוח") along the arch (the scene is a role=slider, pan-y keeps vertical scrolling; arrows/Home/End) or press "להעביר את העגלה"; every weak stone the load passes cracks and drops, saying what the customer did not find; tap a fallen stone in the test report to re-cut it (it rises back as the right part of the site); test again; when every stone holds the keystone (call/WhatsApp) locks, the centring is struck, "הקשת עומדת"; aria-live; no-JS shows the full report |
| landing campaign | ההתאמה | match pairs (workbook threads, near misses) | three ads of one sample plant nursery and six landing pages: three continue an ad exactly, three are near misses broken in ONE place (generic headline · stock photo · a button asking for something else); pick an ad, then the page you would send its click to: כותרת · מראה · פעולה are scored separately, so the verdict names the broken thread + what the visitor thinks ("כמעט. חוט אחד נקרע"); threads: vermilion + dot = continues, vermilion dashed + knot = near miss, grey + cut = broken; phones: one ad at a time (א · ב · ג), the pages as a choice sheet, the verdict under it scrolls into view and draws the pair as mini ad — thread — mini page, paired pages carry the ad's letter; desktop: ads | pages with threads + sticky verdict; "למודעה הבאה" / "חברו בשבילי" / restart; aria-pressed cards, sr-only live verdict; no-JS shows the answer key |
| landing lead-generation | פחות שדות | declutter/remove (two gauges) | a sample twelve-field "בקשה להצעה" form; tap × to remove a field and two number-free gauges answer: "קל למלא" rises; "מה תדעו לפני השיחה" is decided by WHICH fields stay (no phone = nothing to go back to, no name = anonymous, no need / timing = you know who but not what or when; extras only nudge it); a verdict names the state (too long → on the way → balanced, or "no way back" / "anonymous" / "no filtering"), each removal says why it could go; removed fields wait in a tray and come back with a tap; on phones a compact meter (~100px) sticks under the header and focused buttons scroll clear of it; sr-only live summary, focus moves to the next ×; no-JS lists what a balanced form keeps |
| landing trades | שיחה בלחיצה | tap-flow simulation (count your own taps) | a hand-held phone mock: play the visitor searching for a painter and tap your way to a call; switch "דף נחיתה" (result → call bar or WhatsApp with a ready message: two taps at best) vs "אתר רגיל" (result → home → menu → contact page → the number in small print: four at best); nothing is marked — the other results, the logo, "קראו עוד", every menu item and the contact form are tappable, every tap counts and the narration says what it led to; a vermilion ring shows the way only after a few idle seconds or a wrong tap; the counter + narration sit right above the phone on phones (beside it on desktop), the route's steps under it, and after both routes the visitor's own two counts stand side by side; focus moves to the new screen; no-JS states both routes in text; sample business and number |
| /about/ | מהאפר לכלי | flick-to-spin potter's wheel (momentum builds the object) | a lump of ash-grey clay on a wheel head; drag/flick the wheel sideways (touch-action pan-y, momentum with friction) or press the button (one stage per press) and the turns throw it: lump → centred dome → opened bowl → pulled cylinder → vase (SVG silhouette morph), each stage lighting one line of the "יומן האבניים" log (מרכזים·הקשבה … שורפים·השקה, a manifesto line each); the last stage fires it (ember glow → bone glaze, vermilion lip); aria-live stage + aria-current; one free nudge on first view; no-JS = finished vessel + full log; small bundled script, no React |
| /contact/ | השפופרת | turn-taking phone call (lift the receiver) | the brief is a conversation, not a form: lift the ceramic receiver off its cradle, צבי asks ONE question per turn (earpiece pulses + typing dots), the visitor answers once per turn (reply buttons or a short text, skip allowed), answers drop into the line as their bubbles; the call folds into a ready WhatsApp message (real wa.me link, same text by email), take back the last answer, restart or hang up; role=log, focus moves to the next turn for keyboard users; fixed-height receiver (no layout shift); no-JS: topics list + direct wa.me link; one island (client:visible) |
| /faq/ | המיתרים | pluck strings | each native details/summary is a harp string tied to a pillar: strings lengthen and thicken down the page, C strings vermilion; tapping plucks it (slow damped SVG vibration ~2s + haptic tick on phones), the two neighbouring strings ring faintly (sympathetic resonance) and the answer settles in; fine pointers bow the string; a mini harp per topic lights open strings; small bundled script, no React |
| /packages/ | בועת ההיקף | fling into a bubble (tap to toss, hold-and-throw with momentum) | the building blocks lie as stones on a shelf under a soap bubble that already holds a chair (the foundations); tap a stone and it is tossed in an arc into the bubble, or hold it (press with a mouse) and throw it: the bubble swallows it with a surface-tension wobble and inflates so its area follows the scope; a weak throw falls back to the shelf; tap a stone that is inside to take it out; a switch draws the optional subscription as an orbit, a pin pops it all; the contents go to WhatsApp as one plain list and the tab walks on to /thank-you/ (no prices, no tiers; aria-pressed stones, switch, aria-live) |
| /projects/ | קיר הסלון | salon hang + lightbox zoom | every real work hangs as a desktop+phone pair of frames in a hand-composed salon wall (brass plaques, a reserved empty frame); tap → framed `<dialog>` lightbox with tap-to-zoom + drag/scroll pan, desktop⇄phone view, prev/next (buttons, ←/→, swipe), outbound link; one history entry so phone BACK closes it; no-JS frames link to the catalogue |
| /blog/ | הרוכסן | unzip reveal + filter (the handle is a role=slider like the business-website ruler, but the outcome is a reveal, not a resize) | the tower artwork (zipper-library) hangs as one tall framed object; under it the tower's glass carries on, drawn in the same pencil + grey wash (SVG mullions, cloud reflections), the zipper still closed — drag the pull, tap it, or use the arrow keys and the glass opens in a lens along the seam exactly like the drawing; fully open it stays a lens (glass slivers in the corners); inside, the library: one shelf per department, its count in serif and one book spine per article; a shelf filters the magazine (shared with the sticky chip row, #dept-<key> kept in the URL, the query string kept); DOM order pull → shelves; no-JS: shelves are plain links to the archive departments |
| /glossary/ | מגירת הכרטיסים | riffle a card-catalogue drawer (scrub along the card tops) | a library catalogue drawer holds one index card per term, guide cards with taller letter tabs; run a thumb / the mouse along the card tops and the drawer riffles: the card under the finger rises and is read on the large card above (term, other name, field, definition on ruled lines, the rod hole), neighbours lift in a wave; "ראו גם" are cross-reference tabs that riffle to that card; slider semantics (arrows, PageUp/Down by letter, Home/End) + prev/next buttons, the settled card announced; the live search + letter thumb index stay as tools above the static entries (id=term-<slug>), with three illustrated plates between letter groups; no-JS: the first card + the full list |
| /accessibility/ | לוח הבקרה | live switchboard (breakers + monitor) | a piece of equipment inside the statement: a sticky monitor (aria-live readout + a live specimen: heading, link, focused button, picture, moving part) above a console with a long text-size fader, one three-position contrast throw (dark · normal · light, native radios) and nine breakers with a real throw and lamp (role=switch) + a master reset bar; everything flips the REAL settings (same store as the floating widget, synced both ways); the console keeps its own palette in the contrast modes while the monitor shows the real override |
| /privacy/ | קבוצת המנעול | pattern-lock trace (swipe a path through points) | the policy in short as six stars on the outline of a padlock in a planisphere; like a phone pattern lock, put a finger on a star and swipe through the others (only a gesture that starts on a star traces, the rest of the sky still scrolls the page); each star lit tells its point in plain words (aria-live card + jump to the section) and the padlock draws itself; all six lit → the shackle drops, keyhole + "נעול" seal; tap/Enter lights one by one (aria-pressed toggles); no-JS lists every point |
| /terms/ | הכתב הקטן | bar magnifier (drag a lens over fine print) | the terms set as a sheet of real fine print with a brass bar magnifier on it; drag the bar (touch/mouse), tap a clause, hover on desktop or use the arrows (role=slider) and the print under the lens becomes one plain sentence (two layers in one layout, lens = clip-path band); every clause read → a "נקרא עד הסוף" stamp; aria-live reads the plain sentence; no-JS shows each plain sentence under its clause |
| 404 | השערים | portal tunnel (walk through receding gates) | glazed ceramic portals (lit left face, terracotta shade, leaning like the artwork) recede into a starry desert, each the door to a real room named on its lintel; a room card under the scene names the front gate's room + "enter" link; "next gate" / ↑← keys / tap the gate behind it (nothing covers it) and the front gate flies past you (aria-live); full room list always rendered as links |
| /thank-you/ | השביט | free-hand sewing (drag the needle, draw your own thread) | grab the needle at the giving hand's fingertip and sew the golden thread across the embroidered canvas along any route you like to the open palm; a knot is tied where each "what happens now" step is reached and its title is written on the canvas (aria-live); "sew it for me" stitches the suggested route; keyboard: arrows move the needle, Enter sews; no-JS / reduced motion = fully stitched; the step list stays at full contrast |
| / (home) | כרטיס הכניסה | tear-off ticket stub | the offer as a museum admission ticket: main ticket = הקמה, perforated stub = optional monthly subscription; pull the stub sideways (touch/mouse) or press the button to tear it off / reattach (aria-live); paper texture, cube stamp, 3D tilt on fine pointers |
| / (home) | שורות נגדיות | scroll-linked counter-drift | manifesto set as huge serif lines that slide in opposite directions while the ink room passes (CSS scroll-driven, no JS); a vermilion brush paints under "במקומו" |
| article: website-accessibility-israel | מסע המקלדת | real focus traversal (Tab / screen-reader swipe) | a small clinic page built from real links, buttons and a field; press "התחילו" and walk it with your own keyboard (Tab / Shift+Tab move the real focus, Enter on the skip link really skips) or, on a phone, swipe across it like VoiceOver / TalkBack (right = next) with plain next/previous buttons too; every stop is numbered on a dashed trail and narrated (aria-live); the inaccessible build of the same page: no skip link, no visible focus, the footer link early in the code so the order jumps, a field with no label, and a <div> "book" button focus never reaches; stops are tabbable only during a run, no focus trap; no-JS: both walks listed |
| article: geo-ai-search-guide | מבחן הציטוט | two-bin triage | six sentences from an imaginary studio's site dealt one by one; decide "an AI engine would quote it / skip it", get the verdict + the reason at once, the card drops into its pile; a score and the pattern behind quotable sentences at the end |
| article: business-website-or-online-store | המצפן | answers swing a gauge needle | six questions from the article as native radio chips; every answer swings a brass needle on a half-dial between "אתר תדמית", "באמצע" and "חנות אונליין", and the reading under it names the direction and what it usually means (aria-live) |
| article: website-content-writing-guide | המשפט החד | tap-to-cycle words in place | a homepage opening sentence in three parts; tap a part inside the sentence to swap vague words for concrete ones (3 levels, wavy proofreader underline → solid), a focus scale moves from "מטושטש" to "חד" and a ledger shows what the visitor now knows |
| article: google-business-profile-guide | אותו סיפור | blink comparator (tap what jumps) | a sample physiotherapy studio's Google profile card and its website footer, shown as two plate-holder thumbnails (a recognisable profile card with map pin + call/route/site chips, and a page fading into its footer strip) above one big "eyepiece" frame with reticle corners that blinks between the two copies in the same layout (only on screen, only with motion allowed); matching lines stay still, the four contradictions (keyword-stuffed name, swapped phone digits, address, Friday hours) jump. Both values of every line are rendered stacked in one grid cell (visibility toggles) so the blink never moves the layout (no CLS). Tap a jumping line to fix it in both copies: a vermilion ink ring is drawn round it and the note says why it matters; all four → an "אותו סיפור" seal. The thumbnails are the manual switch (aria-pressed); without motion the copy says "find what changes" instead of "what jumps". Screen readers get both values in each line's label; aria-live note; no JS: the four contradictions with bdi-isolated values |
| article: appointment-system-guide | היומן של מחר | advance the clock (step a day, with a switch) | one sample clinic day of six booked slots; set the "תזכורות אוטומטיות" switch, then move the clock by hand (evening before → morning → during the day → end of day) while the clock hands turn forward: without reminders two slots become hatched empty windows at their hour; with reminders the cancellation arrives the evening before as a message bubble, the slot frees and is booked from the site in the morning; after both runs the two outcomes stand side by side; aria-live narration; no-JS tells both days |
| article: landing-page-cost | הדלי הדולף | plug the leaks (tap holes in a leaking vessel) | the ad pours paid clicks (dashed streams) into a glass vessel = the landing page; six holes leak them away, each a scope factor (speed, message, structure, one action, design, measurement); tap a hole on the glass or its line in the list to cork it: the stream stops, the line switches from what leaks to which part of the work stops it, and the enquiries bowl fills; no numbers, no money; streams pause off-screen, static with reduced motion; aria-pressed + aria-live; no-JS lists leaks and plugs |
| article: business-website-guide | המספריים | cut along the dashed line (split one page into many) | a sample law office's single "השירותים שלנו" sheet with three crammed services; drag the vermilion scissors along the dashed cut line (sideways, pan-y keeps scrolling) or tap / Enter / ← and the paper is cut: the service becomes its own page (own address, title, CTA, slight rotation); beside it three searches switch from "the general page, answer buried in the middle" to "a page that answers exactly"; "הדביקו בחזרה" restores; aria-live; no-JS lists the searches |
| article: website-cost-2026 | ההצעה המקופלת | unfold a concertina (zigzag paper folds) | two sample quotes with the same cover line; under them a paper concertina of eight folds (strips leaning back and forth with light on alternate faces), one per cost factor; tap a fold and it swings flat to show both quotes side by side on that factor, a vermilion "לא כתוב" stamp on what one leaves out; "פתחו את כל הקפלים" cascades; never a number or a price: compare scope against scope; aria-expanded folds, live counter; no-JS = sheet fully open |
| article: react-vs-wordpress-2026 | המבט המפורק | pull a layer out of the stack (Jenga) and watch what breaks | the site as an exploded isometric stack, spaced to its layer count inside a fixed stage: WordPress (server+PHP+database, core, theme, forms/SEO/security/cache plugins, admin, content) or React with pre-built HTML (CDN, pre-built HTML, open-source libraries, code written for the business, optional self-edit panel, content); each plate has its own glyph printed on its top face (rack slots, gear, layout grid, form fields, magnifier, lock, clock, pencil, text lines, network nodes, package boxes, </>, braces), leaders with dots run to the labels, a vermilion mark + legend shows what updates on its own. Slide a plate sideways out of the stack (touch-action pan-y on the stage; tap a plate or its label as the single-pointer/keyboard alternative, aria-pressed): the plates above settle into the gap, those that depended on it tilt and are hatched, and a live mini site of a sample carpentry shop with its Google result shows what breaks (database error, blank page, unstyled text, a raw form shortcode, a generic snippet, an unlocked admin, a slow load bar, no edit button, empty content, an unreachable site, a frozen build, a spinner + empty snippet for crawlers, everything unstyled without the business's code). aria-live card: what broke, what the layer does, who maintains it. Fair: the admin is shown as WordPress's strength, React's own libraries are a ticked layer. No JS: both stacks listed with what each layer does and what breaks without it |
| article: uiux-trends-2026 | צבע אחד | give the single accent away (tap the one thing that may shout) | a sample ceramics studio homepage starts with everything shouting in vermilion; tap the one element that deserves the page's single accent (logo, menu link, "חדש!" sticker, headline key word, picture frame, main button, secondary link) and everything else falls quiet; a small "1" marks where the eye lands first and a graded verdict (right / fair / not here) says why; aria-pressed elements, aria-live verdict; no-JS states the rule |
| article: seo-2026-what-works | החפירה | scratch-off (rub the soil away to uncover what lies under it) | a young tree on a ground line; below it eight plots of soil made of rounded clods; rub a plot with a finger (sideways, pan-y) or just pass the mouse over it and the clods crumble; a tap or Enter digs it at once; once enough is gone the plot shows a living copper root (intent, Core Web Vitals, experience and trust, local SEO, structured data) or a dead dashed one (keyword stuffing, bought links, mass generic content), and each living root grows a leaf on the tree; aria-live finds; no-JS lists all eight |
| article: website-speed-fix | מפל הטעינה | reschedule a waterfall by hand (drag each bar into its dashed slot) | a sample phone page's requests as bars on an RTL time axis, grouped into the article's five problems (main image, JS and plugins, server, render-blocking files, cache on a repeat visit); each lane shows a dashed outline of where its bars belong once fixed (index.html squeezed short, CSS/font squeezed, scripts pushed past the flag, hero.jpg pulled earlier and lighter, the repeat visit served from cache). Drag a lane horizontally (touch-action pan-y; the grip point follows the finger 1:1) and the whole chart reflows live, the vermilion "main content" flag (LCP) and a readout strip against Google's 2.5s target included; let go past halfway and it settles fixed (chat-widget.js fades out as removed), otherwise it springs back. Single-pointer alternative: tap the dashed outline (or the faint "before" outline to undo). Keyboard: each lane is a role=slider (arrows in the drag direction, Home/End, Enter). Flag and target are drawn inside each lane, never across the headings; file names ≥12px above their bars, full contrast. Times illustrative (no axis numbers). aria-live narration; no JS: the five problems and their fixes |
| article: 5-things-before-building-website | שרשרת הדומינו | chain reaction (knock one over, the ones that lean on it fall) | the five things to settle (goal, audience, scope, content, after launch) as five ivory dominoes with their number in pips; tap one to skip it and it tips back, knocking down every domino after it in a staggered fall; the ledger turns each fallen one's question into what falls without it (skip the goal and everything falls, skip the last and only it does); tap a fallen one to stand the row up; aria-live; no-JS lists questions and consequences |
