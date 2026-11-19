# Service page system (`src/components/service`)

Replaces `ServicePageTemplate.tsx`. Static Astro sections in the gallery language + one island per
page (its signature). Reference pages: `src/pages/services/business-website/index.astro` (core
service) and `src/pages/services/index.astro` (hub). CSS prefix `sv-` (`service.css`, imported by
every section — nothing to import yourself).

## 1. Data → SEO (frontmatter)

```astro
---
import BaseLayout from "@/layouts/BaseLayout.astro";
import type { ServicePageData } from "@/components/service";
import { serviceSeo } from "@/lib/page-seo";
const page: ServicePageData = { path: "/services/x/", crumb: { name: "…" }, seo: { title, description },
  schema: { name, serviceType }, heroVariant: "split-ink", hero: { …, art: "<signature slug>" }, faqs: [...] , … };
const seo = serviceSeo(page);   // WebPage(speakable h1+.lead, hero image) + Service + FAQPage + Breadcrumb + LCP preload
---
<BaseLayout seo={seo} mainClass="relative bg-bone pt-[var(--header-h)]"> … </BaseLayout>
```
- `crumb.parent` defaults to שירותים (`/services/`); verticals pass `parent: { name: "אתר תדמית לעסקים", path: "/services/business-website/" }`.
- `serviceSeo(page, { jsonLd: [howTo(...)], ogImage, webPageNode, noService })` for extras. No prices/offers ever.
- Types: `src/components/service/types.ts` (all plain data, serialisable). Put page content in a TS data
  file (see `data/business-website.ts`). Legacy `VerticalContent` maps over easily — drop icons/accents/stats.
- FAQ: pass the SAME `page.faqs` to `<ServiceFaq items>` — JSON-LD is built from it. Unique site-wide.

## 2. Sections (import each `.astro` directly; all static, no directive)

| component | props (besides `tone` bone/ink/paper, `opener`, `index`, `label`, `id`) | visual idea / variants |
|---|---|---|
| `ServiceHero` | `data` (hero), `variant` `framed-right` \| `full-bleed` \| `split-ink`, `path`, `crumb`, `room?`, `position?` | crumbs, room plaque "אולם 03 · חדר 0X", H1 + accent, `.lead`, WhatsApp CTA, facts row, LCP art |
| `ServiceIntro` | `data` {title, paragraphs, pull?, notes?} | catalogue essay: drop cap, pull quote, margin notes, folio |
| `SignatureSlot` | `name`, `title`, `lede?`, `hint` (touch/pointer), `keys?` (keyboard sentence — shown only with a fine pointer), `width?` — **child: your island** | the live exhibit frame |
| `ServiceFeatures` | `title`, `lede?`, `items` {title, description, zone?, sketch?}, `variant` `diagram` \| `specimens` \| `plate`, `sheet?` | annotated site drawing with numbered markers (zones: nav headline image cta cards text form footer phone speed) / materials sample board, each item beside its drawn specimen (`sketch`) / double-ruled spec plate (text only — prefer the other two) |
| `ServiceDeepDive` | `data` {title, lede?, blocks {heading, body, sketch?}}, `variant` `ledger` \| `spine` | ruled catalogue entries, each with its framed drawing (`sketch`); a dotted-leader contents index from 4 entries / chapters on a spine. **3–4 entries, never answers your FAQ already gives** |
| `ServiceWhoFor` | `title`, `lede?`, `items`, `variant` `names` \| `guide` | credits wall of serif names / ruled visitor guide |
| `ServiceProcess` | `title`, `lede?`, `steps`, `art?` (slugs, default the art map's process works), `avoid?` (slugs your page already shows) | plinths rising step by step, a small work standing on each, the vermilion "sold" dot on the last. Your room's hero slug is avoided automatically |
| `ServiceOutcomes` | `title`, `lede?`, `items` {word, title, body} | one-word typographic works in frames (salon hang). No numbers |
| `IndustriesGrid` | `title`, `lede?`, `items` {label, href, art?, desc?}, `prefix?` | catalogue plates (framed thumbnails), no-orphan columns |
| `ServiceFaq` | `items` {q, a}, `title?`, `lede?`, `note?`, `card` `book` \| `plaque` | printed interview ש./ת. `<details>` + visitor-book card (bone) or ink plaque |
| `ServiceRelated` | `currentPath`, `items?` (2–4 links; rooms auto-fill line/art/number) | museum wayfinding signs |
| `ServiceCta` | `data` {title, body, button?, message?}, `label?`, `variant` `invite` \| `door` | the invitation card with a seal / the lit doorway of room 09 (used by /services/) |
| `ServiceOpener` | `variant` `rule` \| `split` \| `numeral` \| `stacked` \| `quote`, `title`, `accent?`, `lede?` | section header — every section takes `opener=` |

`Sketch.astro` (`kind`: code a11y mobile speed seo care domain materials launch calendar form search
layers chat) is the small line-drawing library behind specimens and ledger figures — add a kind there
(append-only) if your page needs one. Copy is rendered through `Nb.astro`, which keeps "ב-NZ-web",
"ו-SEO", "חד-פעמית", "ת״י 5568" on one line — use it for any long data string you render yourself.

**Variety is your job:** pick a different hero variant, opener mix, tone order and section order per page
(alternate bone/ink/paper; never two identical pages). Not every page needs every section — and a page
may add its own section (put it in `src/components/<page>/` with its own prefix). Number the openers'
`index` in page order ("01", "02"…).

## 3. Rooms (`rooms.ts`)
`SERVICE_ROOMS` = the 8 core service pages with room number, short name, line, "חומרים", signature art.
The hero shows the page's room automatically (by path). Verticals/landings have no room — pass `room=""`
or a parent room via `room="01"`. `HERO_SIZES[variant]` is the `sizes` of the LCP art (serviceSeo uses it).

## 4. Signature
`src/components/service/signatures/<Name>.tsx` (+ css with its own prefix), first line
`// Signature component: <name> — <model>`. Render it inside `<SignatureSlot>` with `client:visible`.
Serialisable props only; SSR output = meaningful no-JS state; keyboard + aria-live; reduced motion →
final state (`html.nz-motion` gate). Taken models so far: floor-plan selection (`FloorPlan`), drag-to-resize
(`ThreeScreens`) — see SITE-PLAYBOOK §9. Do not use `<Artwork>` inside an island that may hydrate after the
image loads (className mismatch warning) — use plain `<picture>` with `getArt()` srcsets (see FloorPlan `Thumb`).
