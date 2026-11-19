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
| /services/ | מפת האולמות (planned) | floor-plan selection | an SVG gallery floor plan; each room is a service — tap a room to light it and read its wall label |
| /services/business-website/ | סרט אחד, שלושה מסכים (planned) | drag-to-resize | drag a handle to stretch a mini site from phone to desktop width; the layout reflows live |
| /services/website-development/ | מסלול האתר (planned) | stepped path / stations | a journey line with stations (brief → structure → design → build → launch); tap a station to open it |
| /services/web-development/ | הקוד מאחורי הקיר (planned) | before/after wipe | a wipe slider reveals the code/structure behind a finished page |
| /services/react-development/ | רינדור חי (planned) | type → live highlight | type into a field and watch only the affected component nodes light up and update |
| /services/landing-pages/ | סולם ההמרה (planned) | scroll-scrub | scrubbing climbs a landing page rung by rung; each rung highlights one conversion principle |
| /services/landing-page-development/ | מבחן חמש השניות (planned) | timed recall | a landing page flashes for 5 seconds, then asks what it offered — clarity made tangible |
| /services/website-performance/ | מירוץ האור (planned) | race playback | tap to race a heavy page against an optimised one; a light beam crosses as each loads |
| /services/appointment-system/ | חוגת הזמן (planned) | rotary dial | turn a dial to choose a slot; brass gears rotate and a confirmation card is stamped |
| vertical lawyer | המאזניים (planned) | weigh | drag trust elements onto a balance until the beam levels |
| vertical accountant | המגירות (planned) | pull drawers | pull drawers out of a cabinet to reveal the site's organised sections |
| vertical real-estate | סיור בנכס (planned) | swipe deck with depth | swipe through property cards stacked in depth like an open house |
| vertical clinic | חדר שקט (planned) | press-and-hold | hold to "breathe" the page open, calm paced reveal |
| vertical architect | מהשרטוט לבניין (planned) | self-drawing SVG on scroll | blueprint lines draw themselves and fill into a finished site |
| vertical consultant | המהלך הבא (planned) | branching choice | choose a move on a mini board; each move reveals the matching page strategy |
| vertical beauty | פלטת הגוונים (planned) | re-theme picker | pick a palette swatch and a mini site re-themes live |
| vertical contractor | אבן הראשה (planned) | ordered placement puzzle | place stones in order to build an arch; the keystone locks it |
| landing campaign | ההתאמה (planned) | match pairs | pair an ad with the right landing page and see the message-match verdict |
| landing lead-generation | פחות שדות (planned) | declutter/remove | remove fields from a form and watch the completion meter rise |
| landing trades | שיחה בלחיצה (planned) | tap-flow simulation | a phone mock where one tap goes from search result to a call/WhatsApp |
| /about/ | מהאפר לכלי (planned) | scroll-lit kiln text | the studio manifesto lights word by word like ceramics glowing in a kiln |
| /contact/ | השפופרת (planned) | message composer | choose chips; the brief is "spoken" into a live WhatsApp preview |
| /faq/ | המיתרים (planned) | pluck strings | each question is a harp string; tap to pluck it open with a vibration |
| /packages/ | בועת ההיקף (planned) | configurator with scaling bubble | choose building blocks; a bubble grows to hold the scope; ends in a WhatsApp brief (no prices) |
| /projects/ | קיר הסלון (planned) | lightbox zoom | salon-hang wall of real works; tap to zoom into a framed lightbox |
| /blog/ | הרוכסן (planned) | unzip reveal + filter | unzip the tower to reveal the categories and filter the magazine |
| /glossary/ | האינדקס (planned) | live search + letter index | type or tap a letter; terms filter and flip into view |
| /accessibility/ | לוח הבקרה (planned) | live switchboard | flip real accessibility settings from inside the statement |
| /privacy/ /terms/ | קבוצת הכוכבים (planned) | tap constellation points | key points as stars; tap a star for the plain-language summary |
| 404 | השערים (planned) | portal tunnel | portals recede; each opens to a suggested room |
| /thank-you/ | השביט (planned) | stitched path animation | a golden comet is stitched from one hand to the other |
| / (home) | כרטיס הכניסה | tear-off ticket stub | the offer as a museum admission ticket: main ticket = הקמה, perforated stub = optional monthly subscription; pull the stub sideways (touch/mouse) or press the button to tear it off / reattach (aria-live); paper texture, cube stamp, 3D tilt on fine pointers |
| / (home) | שורות נגדיות | scroll-linked counter-drift | manifesto set as huge serif lines that slide in opposite directions while the ink room passes (CSS scroll-driven, no JS); a vermilion brush paints under "במקומו" |
