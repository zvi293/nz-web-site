# SEO Phase 2 — Vertical "אתר תדמית" pattern + first sample page (lawyer)

**Status:** code complete on disk, **not committed** (git is wedged on the OneDrive mount — see "Git handoff" below). Authoritative build + Netlify preview must run on your machine.

This session scope (agreed): **build the reusable, config-driven vertical page pattern + ONE complete sample vertical (עורך דין)** for you to approve the pattern before the remaining verticals, landing pages, and pricing (C7) are mass-produced.

---

## What changed

### New files
- `src/data/verticals.ts` — the **config-driven data layer**. Each industry page is a pure-data object in the `VERTICALS` registry; `buildVerticalConfig(slug)` assembles a full `ServicePageConfig` (breadcrumb parent = the business-website hub, schema id/url, canonical, hub-and-spoke links). Adding a new vertical = add one object here + one line in `prerender.mjs`. Currently contains **`lawyer`** with ~1,170 words of original Hebrew copy.
- `src/pages/services/VerticalBusinessWebsite.tsx` — one route component for `/services/business-website/:vertical`. Looks up the slug; an **unknown slug renders `NotFound`** (noindex), and since the path isn't pre-rendered Netlify also returns a real 404 — consistent with the A1 soft-404 fix.

### Edited files (all backward-compatible — existing pages unchanged)
- `src/components/ServicePageTemplate.tsx` — added two **optional** config fields: `image?` (rendered as a CLS-safe `aspect-[16/9]` figure in the intro, `loading="lazy"`, Hebrew `alt`) and `relatedLinks?` (curated hub-and-spoke links that override the default related-services strip). Pages that omit them behave exactly as before.
- `src/App.tsx` — lazy import + route `"/services/business-website/:vertical"`.
- `scripts/prerender.mjs` — added `/services/business-website/lawyer` to `STATIC_ROUTES` (→ pre-rendered static HTML **and** auto-added to `sitemap.xml` with trailing slash).
- `src/pages/services/BusinessWebsite.tsx` — hub now links **down to the lawyer spoke** with descriptive anchor text ("בניית אתר תדמית לעורך דין"), via `relatedLinks`.

### The lawyer page (`/services/business-website/lawyer/`)
- Primary keyword in the single `<h1>`: **בניית אתר תדמית לעורך דין**.
- Genuinely unique, lawyer-specific copy (not spun from the generic business-website page): trust-as-the-product, page-per-practice-area, trust **without** testimonials/ratings/logos, discreet contact funnel, and an honest **לשכת עורכי הדין advertising-rules** angle (framed as general context, not legal advice, with "final wording subject to your approval").
- Secondary keywords woven naturally: אתר אינטרנט לעורך דין, בניית אתר למשרד עורכי דין, אתר תדמית לעו"ד, עיצוב אתר לעורך דין, + practice areas (מקרקעין/משפחה/פלילי/מסחרי/נזיקין/דיני עבודה) and cities (ת"א, חיפה, ירושלים) per the safe geo approach (no doorway pages).
- JSON-LD: **Service** + **FAQPage** (from the template) + **BreadcrumbList** 3-level Home → אתר תדמית לעסקים → אתר תדמית לעורך דין (from `useBreadcrumb`).
- Self-referential trailing-slash canonical; in `sitemap.xml`; reachable from the hub (not orphaned).
- **No testimonials / reviews / ratings / client logos** anywhere (per brief).

---

## Self-verification (what I could check on the mount)
| Check | Result |
|---|---|
| All files present + wired (route, import, prerender entry, hub link, template fields) | ✅ pass (grep) |
| File integrity (complete, well-formed) via authoritative Read tool | ✅ pass |
| Unique Hebrew word count on the lawyer page | ✅ ~1,172 (target 900–1,400) |
| `ServicePageConfig` shape produced by `buildVerticalConfig` | ✅ all required fields present |
| Backward compatibility (new template fields optional) | ✅ existing pages untouched |

> ⚠️ **`tsc`/`vite build` could not be trusted on this OneDrive mount** — bash reads served truncated copies of freshly tool-edited files (false "unterminated string / missing closing tag" errors at file ends). The Read tool confirmed the on-disk files are correct. **Run the real build + preview on your machine** (the approval gate).

---

## Git handoff (do this on your machine)
Git is stuck on this mount: a stale, unremovable `.git/index.lock`, and the working copy was left on an empty branch `feature/seo-verticals-and-fixes`. On your machine:

```bash
cd "…/NZ-web site/neon-rtl-hero-main"
del .git\index.lock           # PowerShell/CMD  (or: rm -f .git/index.lock)
git checkout main
git branch -D feature/seo-verticals-and-fixes   # the empty stray branch I created
git checkout -b feature/seo-vertical-pattern
# vertical pattern + lawyer page
git add src/data/verticals.ts src/pages/services/VerticalBusinessWebsite.tsx \
        src/components/ServicePageTemplate.tsx src/App.tsx \
        scripts/prerender.mjs src/pages/services/BusinessWebsite.tsx
git commit -m "feat(seo): config-driven אתר תדמית vertical pattern + lawyer sample page"

# C7 pricing packages (homepage + hub + contact prefill)
git add src/data/pricing.ts src/components/PricingSection.tsx \
        src/pages/Index.tsx src/components/Header.tsx src/components/HeroSection.tsx \
        src/components/ContactSection.tsx SEO-PHASE2-report.md
git commit -m "feat(pricing): config-driven אתר-תדמית pricing packages on home page + CTAs"

git push -u origin feature/seo-vertical-pattern   # → open PR, let Netlify build the preview
```
> ⚠️ There are ~20 other **unrelated uncommitted files** in the working tree (Admin tabs, supabase migrations, lib/*-api, index.css, Contact.tsx, send-contact-email). I did **not** touch or stage those — stage explicitly as above so the PR stays clean.

## Verify on the Netlify preview (Workstream D/E)
```bash
curl -sI https://<preview>/services/business-website/lawyer/   # → HTTP 200
curl -sI https://<preview>/services/business-website/lawyer    # → 301 → /lawyer/
curl -sI https://<preview>/services/business-website/nonexistent-xyz/  # → 404 (unknown slug)
# canonical === the fetched trailing-slash URL; lawyer URL present in /sitemap.xml
```
Then: Lighthouse/axe a11y pass on the lawyer page (B4, no critical violations), Google Rich Results test on its JSON-LD, and confirm every existing page still renders (E1 regression).

---

## Flags & proposals for you (Zvi)

**B3 — credibility stats (still needs your decision; I did not change them):** homepage/about show numbers like `100% שביעות רצון`, `50+ פרויקטים`, `40+ לקוחות מרוצים`, `5+ שנות ניסיון` that may be unverifiable, and a `ClientLogosSection` is live although the brief says no client logos. The lawyer page deliberately avoids unverifiable counts (uses "רוב", "24/7", "3 שניות"). Tell me what's defensible and I'll align the rest.

**C6 — blog idea for the lawyer vertical (proposed, not written):**
- Title: **"כמה עולה אתר תדמית לעורך דין — ומה חייב להופיע בו"**
  - מה משפיע על המחיר: מספר תחומי עיסוק (עמוד לכל תחום), עיצוב ייחודי מול תבנית, תוכן
  - מה חובה שיהיה: עמוד לכל התמחות, מסלול פנייה דיסקרטי, נגישות לפי חוק, התאמה לכללי הלשכה
  - internal link → `/services/business-website/lawyer/`

---

## C7 — Pricing packages (built this session)

Config-driven, homepage-first, lead-capture only. **No VAT/מע"מ wording anywhere; no payment/checkout flow** (verified by grep — the only matches are code comments stating their absence).

### New files
- `src/data/pricing.ts` — single source of truth: 3 plans (בסיסית / סטנדרט / פרימיום), feature matrix, commitment message, and 5 pricing FAQs. Edit prices/features here without touching markup.
- `src/components/PricingSection.tsx` — reusable RTL section using the existing design-system cards. **Standard** card is featured with a "הכי פופולרי" badge. Cards **lift on hover** (spring animation). Each plan CTA **opens WhatsApp with a message naming the chosen plan** (name + setup + monthly price) — lead capture only. Includes a WhatsApp quick link and the pricing FAQ; injects **FAQPage JSON-LD** (toggle via `withFaqSchema`).

### Wiring
- **Home page (primary):** `<PricingSection />` with `id="pricing"`, placed after the services section. Works with the site's existing `/#hash` scroll (`scrollToSelectorWithRetry`) so **`/#pricing` scrolls on direct load**.
- **CTA higher up:** added "**החבילות שלנו**" button in the hero + a "**חבילות**" link in the sticky header nav, both anchoring to `#pricing`.
- **`/services/business-website/`:** pricing shown via a new optional `config.pricing` flag on the template (`withFaqSchema={false}` there, since that page already emits a FAQPage).
- **Vertical pages:** compact "חבילות ומחירים לאתר תדמית" link → `/#pricing`.
- **Plan pre-fill (secondary path):** plan CTAs now go to WhatsApp; the contact form *also* reads `?plan=` and pre-fills the inquiry type + subject for any link that uses it. **Frontend initial value only — the Supabase submit/email logic is untouched.**

### Prices (per your instruction) & *(proposed)* values to confirm
| | בסיסית | סטנדרט | פרימיום |
|---|---|---|---|
| הקמה (חד-פעמי) | 1,200 ₪ | 2,590 ₪ | 2,590 ₪ |
| חודשי | 199 ₪ | 390 ₪ | 590 ₪ |

*(proposed)* values I filled in — **please confirm or adjust in `src/data/pricing.ts`:** pages (5 / 8 / 12), content updates (1 / 3 / 5+priority per month), analytics & lead tracking (basic / ✓ / advanced), monthly performance report (premium only), and the SEO/AI/support tier wording. Prices, the management-panel concept, and the SEO/AI/support/pages differentiators are per your instructions.

### Pricing notes
- **FAQPage JSON-LD:** yes (on the homepage and `/pricing` if added). **Offer/Product JSON-LD: intentionally skipped** — a plan has both a setup fee and a monthly price, which doesn't map cleanly to a single valid `Offer`; adding it risks an invalid schema. Can revisit if you want it.
- No standalone `/pricing/` page yet — easy to add later (render `<PricingSection />` in a thin page + add to prerender). Tell me if you want it.

---

## Not done yet (next increments)
- Remaining C3 verticals (accountant, real-estate, clinic, architect, consultant, beauty→appointments, contractor→landing) — each a new object in `verticals.ts`.
- A dedicated "industries" grid section on the hub once there are several spokes (currently surfaced via `relatedLinks`).
- C4 landing-page pages and C6 full blog drafts (1 lawyer blog idea proposed above).
