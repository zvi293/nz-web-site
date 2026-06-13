# SEO Phase 3 — Mass-produced verticals + landing pages

**Status:** code complete on disk, **not committed** (git is wedged on the OneDrive mount — broken HEAD + stale `.git/index.lock`; see "Git handoff"). The authoritative `npm run build` + Netlify preview run on your machine — the sandbox can't build here (esbuild `write EPIPE` crash + flaky mount reads that give false "unterminated string" errors on files that are correct on disk, including already-live files like `App.tsx`).

Built on the **proven, live pattern** (lawyer + pricing). 10 new pages total.

---

## New pages (10)

### 7 אתר-תדמית verticals — `/services/business-website/<slug>/`
| Slug | Page | H1 primary keyword | Type |
|---|---|---|---|
| accountant | רואה חשבון / יועץ מס | בניית אתר תדמית לרואה חשבון | תדמית |
| real-estate | מתווך נדל"ן | בניית אתר תדמית למתווך נדל"ן | תדמית + לידים |
| clinic | קליניקה / רופא שיניים / מטפל | בניית אתר תדמית לקליניקה ורופא שיניים | תדמית + **תורים** |
| architect | אדריכל / מעצב פנים | בניית אתר תדמית לאדריכל ומעצב פנים | תדמית / פורטפוליו |
| consultant | יועץ / מאמן | בניית אתר תדמית ליועץ ומאמן | תדמית + **תורים** |
| beauty | יופי / טיפוח | בניית אתר ומערכת תורים לעסק יופי | **תורים** |
| contractor | בעלי מקצוע | בניית אתר ודף נחיתה לבעלי מקצוע | **לידים** |

### 3 דף-נחיתה sub-pages — `/services/landing-page-development/<slug>/`
| Slug | H1 primary keyword |
|---|---|
| campaign | בניית דף נחיתה לקמפיין פייסבוק וגוגל |
| lead-generation | בניית דף נחיתה ל-Lead Generation לעסקים |
| trades | בניית דף נחיתה לשיפוצניק וצבעי |

**Appointment cross-links (C2):** beauty, clinic and consultant each pitch and link to `/services/appointment-system/` (in copy + related links). **contractor & trades** are lead-gen focused (chiv/WhatsApp CTAs, gallery, service areas).

---

## Architecture (config-driven, scalable)
- Each vertical = one data file `src/data/verticals/<slug>.ts` (`VerticalContent`). `src/data/verticals.ts` imports + registers them; the proven **lawyer** object stays untouched in `verticals.ts`.
- Landings mirror it: `src/data/landings/<slug>.ts` + `src/data/landings.ts` (`buildLandingConfig`) + route component `src/pages/services/LandingPageVertical.tsx` on `/services/landing-page-development/:landing`.
- **Hub→every spoke (C1a):** new optional `industries` grid on `ServicePageTemplate`; the business-website hub lists all 7+lawyer (`VERTICAL_CARDS`), the landing hub lists all 3 (`LANDING_CARDS`). Spokes link up to hub, sideways to 2-3 siblings, and to the matching service — descriptive Hebrew anchors, no "לחץ כאן".
- All 10 routes registered in `src/App.tsx` and in `scripts/prerender.mjs` `STATIC_ROUTES` (→ static HTML + sitemap entry each).
- **Adding the next vertical = 1 data file + 1 prerender line.**

## Per-page checks
| Page | Unique Hebrew words (approx) |
|---|---|
| accountant | 1015 |
| beauty | 963 |
| contractor | 963 |
| real-estate | 944 |
| consultant | 937 |
| clinic | 915 |
| architect | ~915 (after top-up) |
| campaign | 901 |
| lead-generation | 915 |
| trades | ~915 (after top-up) |

- ✅ Each: single `<h1>` containing the primary keyword (template renders exactly one h1); `Service` + `FAQPage` + `BreadcrumbList` JSON-LD (template + `useBreadcrumb`, 3-level with hub parent); self-referential trailing-slash canonical; on-brand **lazy WebP/PNG** image with descriptive Hebrew `alt`; a11y via the shared accessible template.
- ✅ **No testimonials / reviews / ratings / logos** anywhere (verticals explicitly state this as a feature where relevant).
- ✅ **No VAT/מע"מ** token in any new page (grep-verified).
- ✅ No Hebrew/Latin text corruption (grep-verified across all 10 files).
- ✅ Lawyer H1 (item 3): single `<h1>` = "בניית אתר תדמית לעורך דין שמשרה ביטחון" — contains the keyword. Already correct, no fix needed.

> Verification limits: build/transpile can't run in the sandbox (esbuild EPIPE; mount serves intermittently-truncated reads). Wiring, registry, word counts, safety greps and file integrity were confirmed via the authoritative file API. **You must run `npm run build` locally** to get the real compile + prerender.

---

## Git handoff (your machine)
```bash
cd "…/NZ-web site/neon-rtl-hero-main"
del .git\index.lock            # clear the stale lock (PowerShell/CMD)
git checkout main && git pull
git checkout -b feature/seo-verticals-batch
git add src/data/verticals.ts src/data/verticals/ src/data/landings.ts src/data/landings/ \
        src/pages/services/LandingPageVertical.tsx src/App.tsx scripts/prerender.mjs \
        src/components/ServicePageTemplate.tsx src/pages/services/BusinessWebsite.tsx \
        src/pages/services/LandingPageDevelopment.tsx SEO-PHASE3-report.md
git commit -m "feat(seo): 7 vertical pages + 3 landing pages (config-driven) + hub industries grids"
npm run build      # vite build + prerender; approve the puppeteer install when prompted
git push -u origin feature/seo-verticals-batch   # open PR → Netlify preview
```
> `npm run build` must pass and the preview must look right before merge. If the build flags anything, send me the output and I'll fix.

## Production checks after merge + deploy
- `curl -sI https://nz-web.com/services/business-website/<vertical>/` → **200** (all 7) and `/services/landing-page-development/<slug>/` → **200** (all 3).
- `curl -sI` the non-slash form of each → **301** to the trailing slash; an unknown slug under either hub → **404**.
- `/sitemap.xml` `<loc>` count grows by **10** (was ~29 incl. blog → ~39).
- Spot-check 2-3 new pages: single H1 w/ keyword, valid JSON-LD (Rich Results Test), images load, internal links work, Lighthouse/axe a11y no critical violations.
- Then in Search Console: resubmit sitemap + Request Indexing for the homepage and the new pages.

## Notes / not done
- C6 blog drafts: still proposed-only (1 idea per vertical can be drafted on request) — none auto-published.
- B3 homepage stats (`50+ / 5+ / 100%`) still untouched — your call.
- Optional standalone `/pricing/` page not added.
