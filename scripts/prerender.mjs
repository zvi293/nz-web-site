/**
 * prerender.mjs
 * Post-build script: real full-HTML pre-rendering for SEO.
 *
 * Why: a React SPA ships one empty index.html for every route. Google reads
 * the raw HTML first and only renders JS later — so it sees blank pages.
 *
 * How: after `vite build`, this script serves dist/ with `vite preview`,
 * opens every route in a headless Chrome (Puppeteer), waits for React to
 * finish rendering, and saves the FULLY-RENDERED HTML to dist/<route>/index.html.
 * Google now gets complete pages (H1s, text, links, meta, JSON-LD) instantly.
 * The React bundle still hydrates on top for the normal SPA experience.
 *
 * It also regenerates dist/sitemap.xml from the same route list — one source
 * of truth, no manual maintenance — and renders a branded dist/404.html so
 * Netlify returns a genuine HTTP 404 for unmatched paths.
 *
 * Sitemap details:
 *  - pages whose rendered <meta name="robots"> says noindex are left out;
 *  - <lastmod>: blog posts use updated_at ?? published_at, every other page the build date;
 *  - image sitemap (xmlns:image): one <image:image> per page for its primary (hero) image,
 *    read from the rendered HTML: <link rel="preload" as="image"> first, else the first
 *    <img fetchpriority="high">.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { preview } from "vite";
import puppeteer from "puppeteer";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DIST = join(ROOT, "dist");
const BASE_URL = "https://nz-web.com";
const TODAY = new Date().toISOString().slice(0, 10);

/* ─── static routes (path + sitemap hints) ─── */
const STATIC_ROUTES = [
  { path: "/",                                  changefreq: "weekly",  priority: "1.0" },
  { path: "/about",                             changefreq: "monthly", priority: "0.8" },
  { path: "/projects",                          changefreq: "weekly",  priority: "0.85" },
  { path: "/packages",                          changefreq: "monthly", priority: "0.9" },
  { path: "/contact",                           changefreq: "monthly", priority: "0.9" },
  { path: "/faq",                               changefreq: "monthly", priority: "0.75" },
  { path: "/blog",                              changefreq: "weekly",  priority: "0.8" },
  { path: "/services",                          changefreq: "monthly", priority: "0.9" },
  { path: "/services/web-development",          changefreq: "monthly", priority: "0.9" },
  { path: "/services/website-development",      changefreq: "monthly", priority: "0.9" },
  { path: "/services/business-website",         changefreq: "monthly", priority: "0.9" },
  { path: "/services/business-website/lawyer",      changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/accountant",  changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/real-estate", changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/clinic",      changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/architect",   changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/consultant",  changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/beauty",      changefreq: "monthly", priority: "0.85" },
  { path: "/services/business-website/contractor",  changefreq: "monthly", priority: "0.85" },
  { path: "/services/appointment-system",       changefreq: "monthly", priority: "0.9" },
  { path: "/services/landing-page-development", changefreq: "monthly", priority: "0.85" },
  { path: "/services/landing-page-development/campaign",        changefreq: "monthly", priority: "0.8" },
  { path: "/services/landing-page-development/lead-generation", changefreq: "monthly", priority: "0.8" },
  { path: "/services/landing-page-development/trades",          changefreq: "monthly", priority: "0.8" },
  { path: "/services/landing-pages",            changefreq: "monthly", priority: "0.8" },
  { path: "/services/react-development",        changefreq: "monthly", priority: "0.8" },
  { path: "/services/website-performance",      changefreq: "monthly", priority: "0.8" },
  { path: "/privacy",                           changefreq: "yearly",  priority: "0.3" },
  { path: "/terms",                             changefreq: "yearly",  priority: "0.3" },
  { path: "/accessibility",                     changefreq: "yearly",  priority: "0.3" },
  /* TODO: add { path: "/glossary", changefreq: "monthly", priority: "0.6" } (מילון מונחים) once
     <Route path="/glossary"> exists in src/App.tsx. */
];

/* Vertical / landing sub-pages are data-driven (src/data/verticals*, src/data/landings*), so any
   new data file is picked up automatically; the explicit entries above keep their priorities.
   A slug that does not resolve renders the noindex NotFound page and is dropped from the sitemap. */
function getDataRoutes() {
  const out = [];
  const collect = (dir, base, extraFile) => {
    const slugs = new Set();
    const folder = join(ROOT, "src", "data", dir);
    if (existsSync(folder)) {
      for (const f of readdirSync(folder)) if (/\.tsx?$/.test(f) && !/^index\./.test(f)) slugs.add(f.replace(/\.tsx?$/, ""));
    }
    const file = join(ROOT, "src", "data", extraFile);
    if (existsSync(file)) {
      for (const [, slug] of readFileSync(file, "utf-8").matchAll(/^\s*slug:\s*"([a-z0-9-]+)"/gm)) slugs.add(slug);
    }
    for (const slug of slugs) out.push({ path: `${base}/${slug}`, changefreq: "monthly", priority: "0.8" });
  };
  collect("verticals", "/services/business-website", "verticals.ts");
  collect("landings", "/services/landing-page-development", "landings.ts");
  return out;
}

/* Routes that must exist as real static files (so a direct load / refresh works)
   but must NEVER enter the sitemap. Each page sets `noindex` on itself. */
const UNLISTED_ROUTES = [{ path: "/thank-you" }];

/* ─── blog routes, read straight from the static content module ───
   src/content/blog.ts is TypeScript with asset imports, so it cannot simply be
   imported here — the slugs and dates are pulled out textually instead. Keep
   the `slug: "…"` / `published_at: "…"` fields in each post object (that is the
   shape the file is written in) and this keeps working. */
function getBlogRoutes() {
  const file = join(ROOT, "src", "content", "blog.ts");
  if (!existsSync(file)) {
    console.warn("  ⚠  src/content/blog.ts not found — skipping blog routes.");
    return [];
  }

  const source = readFileSync(file, "utf-8");
  const routes = [];
  /* Each post object starts at its `slug: "…"`; its dates live between that and the next slug. */
  const starts = [...source.matchAll(/\bslug:\s*"([^"]+)"/g)];
  starts.forEach((m, i) => {
    const chunk = source.slice(m.index, i + 1 < starts.length ? starts[i + 1].index : undefined);
    const published = chunk.match(/\bpublished_at:\s*"([^"]+)"/)?.[1];
    const updated = chunk.match(/\bupdated_at:\s*"([^"]+)"/)?.[1];
    if (!published) return; // not a post object
    routes.push({
      path: `/blog/${m[1]}`,
      changefreq: "monthly",
      priority: "0.7",
      lastmod: (updated || published || TODAY).slice(0, 10),
    });
  });

  if (routes.length === 0) {
    console.warn("  ⚠  No blog posts found in src/content/blog.ts.");
  }

  return routes;
}

/* ─── write a fully-rendered page to dist/<route>/index.html ───
   IMPORTANT: nothing may be written while the crawl is still running.
   `vite preview` serves dist/index.html as the SPA fallback for every route, so
   overwriting it mid-crawl would make every *later* route boot from the already-
   rendered homepage — inheriting its <head> (its JSON-LD, its injected schema).
   Renders are therefore buffered and flushed only after the browser is closed. */
function writePage(routePath, html) {
  const segments = routePath.replace(/^\//, "").split("/").filter(Boolean);
  const dir = segments.length ? join(DIST, ...segments) : DIST;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
}

/* Buffered renders: route path → rendered HTML. Flushed by flushPages(). */
const renderedPages = new Map();

function flushPages() {
  for (const [routePath, html] of renderedPages) writePage(routePath, html);
}

/* ─── normalize any route path to its canonical TRAILING-SLASH form ─── */
function withTrailingSlash(path) {
  if (!path || path === "/") return "/";
  const clean = path.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
  return clean.endsWith("/") ? clean : `${clean}/`;
}

/* ─── XML-escape a URL for the sitemap ─── */
const xmlEscape = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

/* ─── read one attribute from a raw tag string ─── */
function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return m ? (m[2] ?? m[3] ?? "").replace(/&amp;/g, "&") : null;
}

function absoluteUrl(src) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${BASE_URL}${src.startsWith("/") ? "" : "/"}${src}`;
}

/* ─── the page's primary image: <link rel=preload as=image>, else first <img fetchpriority=high> ─── */
function primaryImageOf(html) {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']?preload/i.test(tag) || attr(tag, "as") !== "image") continue;
    const href = attr(tag, "href") || (attr(tag, "imagesrcset") || "").split(",").pop()?.trim().split(/\s+/)[0];
    const url = absoluteUrl(href);
    if (url) return url;
  }
  for (const [tag] of html.matchAll(/<img\b[^>]*>/gi)) {
    if ((attr(tag, "fetchpriority") || "").toLowerCase() !== "high") continue;
    const url = absoluteUrl(attr(tag, "src"));
    if (url) return url;
  }
  return null;
}

const isNoindex = (html) =>
  [...html.matchAll(/<meta\b[^>]*>/gi)].some(
    ([tag]) => (attr(tag, "name") || "").toLowerCase() === "robots" && /noindex/i.test(attr(tag, "content") || ""),
  );

/* ─── build sitemap.xml from the route list ─── */
function writeSitemap(routes) {
  const urls = routes
    .map(({ path, changefreq, priority, lastmod, image }) => {
      /* Every <loc> must be the final URL that returns 200 with NO 301 hop —
         i.e. the trailing-slash form, identical to each page's self-canonical. */
      const loc = `${BASE_URL}${withTrailingSlash(path)}`;
      const alt =
        path === "/"
          ? `\n    <xhtml:link rel="alternate" hreflang="he" href="${loc}"/>`
          : "";
      const img = image
        ? `\n    <image:image>\n      <image:loc>${xmlEscape(image)}</image:loc>\n    </image:image>`
        : "";
      return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alt}${img}
  </url>`;
    })
    .join("\n\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urls}

</urlset>
`;
  writeFileSync(join(DIST, "sitemap.xml"), xml, "utf-8");
}

/* ─── main ─── */
async function run() {
  if (!existsSync(join(DIST, "index.html"))) {
    console.error("❌  dist/index.html not found — run `vite build` first.");
    process.exit(1);
  }

  console.log("\n🔍  Pre-rendering pages for SEO...\n");

  /* `routes` = everything that goes in the sitemap.
     `crawlRoutes` = everything that gets a static file (sitemap routes + the
     unlisted, self-noindexed ones). */
  const seen = new Set();
  const routes = [...STATIC_ROUTES, ...getDataRoutes(), ...getBlogRoutes()].filter((r) => {
    const key = withTrailingSlash(r.path);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const crawlRoutes = [...routes, ...UNLISTED_ROUTES];

  /* serve the built dist/ folder */
  const server = await preview({
    root: ROOT,
    preview: { port: 4178, strictPort: true },
    logLevel: "silent",
  });
  const origin = server.resolvedUrls.local[0].replace(/\/$/, "");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  } catch (err) {
    /* Could not launch headless Chrome (e.g. not installed on the build host).
       Pre-rendering is an SEO layer on top of a fully-working SPA, so skip it
       with a loud warning instead of failing the whole deploy. */
    console.warn(
      "\n  ⚠  Skipping pre-render — could not launch headless Chrome:\n" +
        "     " + err.message + "\n" +
        "     The site still deploys as a normal SPA.\n"
    );
    writeSitemap(routes);
    console.log("  ✓  sitemap.xml — " + routes.length + " URLs\n");
    /* Even without pre-render, ship a 404.html so Netlify returns a real HTTP
       404 for unmatched paths (the SPA shell renders the branded NotFound page
       client-side). Without this file Netlify would serve a generic 404. */
    copyFileSync(join(DIST, "index.html"), join(DIST, "404.html"));
    console.log("  ✓  404.html (SPA shell fallback)\n");
    await server.httpServer.close();
    return;
  }

  let success = 0;
  let fail = 0;

  for (const route of crawlRoutes) {
    const page = await browser.newPage();
    /* block heavy/irrelevant requests so pages settle fast */
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "image" || type === "media" || type === "font") req.abort();
      else req.continue();
    });
    try {
      /* domcontentloaded is fast; we then wait for React explicitly */
      await page.goto(`${origin}${route.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 20000,
      });
      /* wait for React to mount real content (every page renders a <footer>) */
      await page.waitForFunction(
        () => {
          const root = document.getElementById("root");
          return (
            root &&
            root.childElementCount > 0 &&
            document.querySelector("footer") &&
            document.title &&
            document.title.length > 0
          );
        },
        { timeout: 20000, polling: 150 }
      );
      /* short settle for late meta / JSON-LD injection */
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();
      renderedPages.set(route.path, html);
      route.image = primaryImageOf(html);
      route.noindex = isNoindex(html);
      console.log(`  ✓  ${route.path}${route.noindex ? "  (noindex — not in sitemap)" : ""}`);
      success++;
    } catch (err) {
      console.error(`  ✗  ${route.path} — ${err.message}`);
      fail++;
    } finally {
      await page.close();
    }
  }

  /* ─── 404 page ─── render the SPA's NotFound route and save it as
     dist/404.html. Netlify serves this for any unmatched path WITH a genuine
     HTTP 404 status, replacing the old soft-404 (unknown URLs returning 200). */
  try {
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const type = req.resourceType();
      if (type === "image" || type === "media" || type === "font") req.abort();
      else req.continue();
    });
    await page.goto(`${origin}/__nz_not_found__`, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });
    await page.waitForFunction(
      () => {
        const root = document.getElementById("root");
        return root && root.childElementCount > 0 && document.querySelector("footer") && document.title;
      },
      { timeout: 20000, polling: 150 }
    );
    await new Promise((r) => setTimeout(r, 500));
    const html = await page.content();
    renderedPages.set("/404.html", html);
    await page.close();
    console.log("  ✓  404.html (branded, noindex)");
  } catch (err) {
    /* Fall back to the SPA shell so Netlify still returns a real 404 status.
       dist/index.html is still the pristine shell at this point — nothing has
       been written yet — which is exactly what the fallback wants. */
    renderedPages.set("/404.html", readFileSync(join(DIST, "index.html"), "utf-8"));
    console.warn(`  ⚠  404.html branded render failed (${err.message}) — used SPA shell fallback.`);
  }

  await browser.close();
  await server.httpServer.close();

  /* Every route has been captured against a pristine shell — safe to write now. */
  const notFoundHtml = renderedPages.get("/404.html");
  renderedPages.delete("/404.html");
  flushPages();
  if (notFoundHtml) writeFileSync(join(DIST, "404.html"), notFoundHtml, "utf-8");

  /* Sitemap = indexable, successfully rendered routes only (a failed render keeps its entry:
     the SPA shell still serves it). */
  const listed = routes.filter((r) => !r.noindex);
  writeSitemap(listed);
  const withImages = listed.filter((r) => r.image).length;
  console.log(`\n  ✓  sitemap.xml — ${listed.length} URLs, ${withImages} with an image entry`);
  console.log(`\n✅  Done: ${success} pages pre-rendered${fail ? `, ${fail} failed` : ""}\n`);

  /* A partial pre-render failure must never block the deploy — the SPA works
     without it. Log loudly; the Netlify build log makes it visible. */
  if (fail > 0) {
    console.warn("  ⚠  " + fail + " page(s) did not pre-render — deploy continues anyway.");
  }
}

run().catch((err) => {
  /* Never fail the build over pre-rendering — the SPA works without it. */
  console.warn("⚠  Pre-render step errored — deploy continues as a normal SPA:", err.message);
});
