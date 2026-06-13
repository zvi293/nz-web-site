# Technical SEO fixes — Phase 1 (Workstreams A + B)

**Scope of this phase:** the critical indexing bugs (A1–A4) + technical/trust fixes (B1, B2),
with credibility stats (B3) flagged for your decision. Workstream C (vertical content pages),
B4 accessibility for new pages, and the full QA/regression + GSC steps (E/F) are the **next phase**.

> ⚠️ **Git/preview were done on your side.** All changes are edited directly in the working
> tree (CRLF preserved). I could not run `git`, push, open the PR, or build the Netlify preview
> from my environment. **Nothing is on `main`/production until you commit + review the preview.**

---

## A — Critical bugs (all confirmed against live production first)

| # | Bug (verified live) | Fix |
|---|---|---|
| A1 | `/<any-unknown-url>` returned **HTTP 200** (soft-404) — caused by the `/* → /index.html 200` catch-all in `netlify.toml`. | Removed the global catch-all. Added explicit SPA fallbacks only for the **non-pre-rendered** client routes (`/blog/*`, `/admin/*`, `/thank-you`). Everything else now falls through to a real `dist/404.html` → **genuine HTTP 404**. `prerender.mjs` now renders a branded Hebrew `404.html` (with `noindex`); if Chrome is unavailable it copies the SPA shell so the 404 status is still correct. |
| A2 | Pages served at `/services/` but canonical pointed to `/services` (which 301-redirects). | `getCanonicalUrl()` now always emits the **trailing-slash** form (root stays `/`), strips `?`/`#`, collapses `//`. Canonical is now self-referential to the exact 200 URL. `og:url` derives from it automatically. |
| A3 | `sitemap.xml` listed non-slash (redirecting) URLs. | `prerender.mjs` `writeSitemap()` now outputs every `<loc>` in trailing-slash form (incl. blog slugs) → matches canonical, 200 with no 301 hop. |
| A4 | Internal links used non-slash paths → a 301 hop on every navigation. | Converted **121 internal links across 23 files** to trailing-slash (nav menus, footer, CTAs, service cards, breadcrumb JSON-LD). Hashes (`/#services`), `/admin/*`, root `/`, and dynamic `:slug` links were correctly left alone. React Router v6 still matches `/x/` against `path="/x"`, so client-side nav has no redirect. |

**Bonus bug found & fixed:** `ThankYou.tsx` linked to `/all-projects` — a route that does **not exist**
(the real route is `/projects`). It previously rendered the SPA as a soft-200; after A1 it would have
been a real 404. Fixed to `/projects/`.

**Guardrail added:** any *future* client-only (non-pre-rendered) route must be added to the fallback
list in `netlify.toml`, or it will (correctly) 404 on direct load. This is documented in the file.

### Files changed (A)
- `netlify.toml` — redirects rework (A1) + HSTS (B1)
- `scripts/prerender.mjs` — trailing-slash sitemap (A3) + branded `404.html` generation (A1)
- `src/lib/site-url.ts` — `getCanonicalUrl()` trailing-slash (A2)
- `src/hooks/useBreadcrumb.ts` — breadcrumb item URLs trailing-slash (A2/A4)
- `src/pages/NotFound.tsx` — title + `noindex` so it works as the real 404 page (A1)
- `src/pages/BlogPost.tsx` — `noindex` when a slug resolves to no post (prevents new soft-404s)
- `src/pages/ThankYou.tsx` — broken `/all-projects` link fixed
- + 22 files touched by the internal-link codemod (A4)

---

## B — Technical & trust

- **B1 — Security headers:** added `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
  to the `/*` headers block in `netlify.toml`. (HSTS was previously only the Netlify default without
  `includeSubDomains; preload`.) `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
  `Permissions-Policy` were already present and are kept.
- **B2 — keywords meta removed:** deleted the stuffed static `<meta name="keywords">` from `index.html`
  and stopped injecting it in `useSeoMeta.ts` (the `keywords` prop is kept as a deprecated **no-op** so
  no call sites break). Google ignores this tag; ours was stuffed and duplicated.

### B3 — Credibility stats — **NEEDS YOUR DECISION (not changed)**
The brief mentioned `54% שביעות רצון` / `36+ פרויקטים`, but the current code already shows different
numbers. Flagging the live values for you to confirm as honest/defensible:

- **Homepage hero** (`HeroSection.tsx`): `50+ פרויקטים`, `5+ שנות ניסיון`, **`100% שביעות רצון`**
- **About page** (`About.tsx`): `50+ פרויקטים הושלמו`, `40+ לקוחות מרוצים`, `5+ שנות ניסיון`, **`100% שביעות רצון`**
- The About **meta description** repeats `50+ פרויקטים, 5+ שנות ניסיון, 100% שביעות רצון`.

Concern: `100% שביעות רצון`, `50+ פרויקטים`, and `40+ לקוחות מרוצים` may not be verifiable. Tell me the
real, defensible figures (or to drop the satisfaction stat) and I'll update hero + about + meta together.

### Also flagged (per "don't touch existing marketing silently"):
- **`ClientLogosSection`** is live on the homepage (Supabase-driven client logos). The brief says
  *no client logos anywhere*. It's tied to Supabase data, so I did **not** remove it — your call.
- **`TestimonialsSection.tsx`** exists in the codebase but is **not rendered** anywhere (dormant). No action taken.

---

## Verification

**Done now (logic-level, in a clean sandbox):**
- ✅ Canonical path normalization — 7/7 cases pass (`/services`→`/services/`, query/hash stripped, `//`→`/`, root preserved).
- ✅ Sitemap `<loc>` trailing-slash output verified.
- ✅ `useSeoMeta.ts` has no dangling keyword references after removal.

**You must run (couldn't build reliably from my mount — see note below):**
```bash
cd "neon-rtl-hero-main"
npm run build            # vite build + puppeteer chrome + prerender (writes dist/404.html + sitemap)
npx tsc --noEmit -p tsconfig.app.json   # typecheck
```

**Post-deploy curl checks (the brief's Workstream D — run on the Netlify preview URL):**
```bash
curl -sI https://<preview>/this-page-does-not-exist-xyz   # expect: HTTP/2 404
curl -sI https://<preview>/services/                       # expect: 200, no 301
curl -sI https://<preview>/services                        # expect: 301 → /services/ (fine; canonical points to /services/)
curl -s  https://<preview>/services/ | grep canonical      # expect: href=".../services/"  (trailing slash)
curl -s  https://<preview>/sitemap.xml | grep -o '<loc>[^<]*'  # every loc ends in /
curl -sI https://<preview>/services/ | grep -i strict-transport  # expect includeSubDomains; preload
curl -s  https://<preview>/services/ | grep keywords       # expect: nothing
```

> ⚠️ **OneDrive sync caution:** while editing, the bash mount showed `scripts/prerender.mjs` truncated
> even though the real file (file-tool view) is complete (288 lines). This is the known OneDrive
> sync lag on this folder. **Please open `scripts/prerender.mjs` once after syncing to confirm it ends
> with the `run().catch(...)` block** before you build, just to be safe.

---

## Not done this phase (proposed next)
- **C** — vertical אתר-תדמית / landing pages (unique Hebrew content, JSON-LD, hub-and-spoke linking, sitemap entries).
- **B4** — accessibility pass for those new pages (existing widget/statement untouched and still cover current pages).
- **E / F** — full regression sign-off + Google Search Console submission/indexing.

Recommended: you commit Phase 1 to a feature branch → preview → run the curl checks above → approve,
then I build Workstream C on top (starting with a reusable template + 2 proven verticals for your review).
