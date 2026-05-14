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
 * of truth, no manual maintenance.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
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
  { path: "/contact",                           changefreq: "monthly", priority: "0.9" },
  { path: "/faq",                               changefreq: "monthly", priority: "0.75" },
  { path: "/blog",                              changefreq: "weekly",  priority: "0.8" },
  { path: "/services",                          changefreq: "monthly", priority: "0.9" },
  { path: "/services/web-development",          changefreq: "monthly", priority: "0.9" },
  { path: "/services/website-development",      changefreq: "monthly", priority: "0.9" },
  { path: "/services/business-website",         changefreq: "monthly", priority: "0.9" },
  { path: "/services/appointment-system",       changefreq: "monthly", priority: "0.9" },
  { path: "/services/landing-page-development", changefreq: "monthly", priority: "0.85" },
  { path: "/services/landing-pages",            changefreq: "monthly", priority: "0.8" },
  { path: "/services/react-development",        changefreq: "monthly", priority: "0.8" },
  { path: "/services/website-performance",      changefreq: "monthly", priority: "0.8" },
  { path: "/privacy",                           changefreq: "yearly",  priority: "0.3" },
  { path: "/terms",                             changefreq: "yearly",  priority: "0.3" },
  { path: "/accessibility",                     changefreq: "yearly",  priority: "0.3" },
];

/* ─── read env (.env.local for local builds, process.env on Netlify) ─── */
function loadEnv() {
  const env = { ...process.env };
  const envFile = join(ROOT, ".env.local");
  if (existsSync(envFile)) {
    for (const line of readFileSync(envFile, "utf-8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
  return env;
}

/* ─── fetch published blog slugs from Supabase ─── */
async function fetchBlogSlugs(env) {
  const url = env.VITE_SUPABASE_URL;
  const key = env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn("  ⚠  Supabase env vars missing — skipping dynamic blog routes.");
    return [];
  }
  try {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=slug,published_at&is_published=eq.true&order=published_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: ctrl.signal }
    ).finally(() => clearTimeout(timer));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const rows = await res.json();
    return rows
      .filter((r) => r && typeof r.slug === "string" && r.slug)
      .map((r) => ({
        path: `/blog/${r.slug}`,
        changefreq: "monthly",
        priority: "0.7",
        lastmod: (r.published_at || TODAY).slice(0, 10),
      }));
  } catch (err) {
    console.warn(`  ⚠  Could not fetch blog slugs (${err.message}) — skipping dynamic blog routes.`);
    return [];
  }
}

/* ─── write a fully-rendered page to dist/<route>/index.html ─── */
function writePage(routePath, html) {
  const segments = routePath.replace(/^\//, "").split("/").filter(Boolean);
  const dir = segments.length ? join(DIST, ...segments) : DIST;
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "index.html"), html, "utf-8");
}

/* ─── build sitemap.xml from the route list ─── */
function writeSitemap(routes) {
  const urls = routes
    .map(({ path, changefreq, priority, lastmod }) => {
      const loc = `${BASE_URL}${path === "/" ? "/" : path}`;
      const alt =
        path === "/"
          ? `\n    <xhtml:link rel="alternate" hreflang="he" href="${loc}"/>`
          : "";
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod || TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alt}
  </url>`;
    })
    .join("\n\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">

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
  const env = loadEnv();

  const blogRoutes = await fetchBlogSlugs(env);
  const routes = [...STATIC_ROUTES, ...blogRoutes];

  /* serve the built dist/ folder */
  const server = await preview({
    root: ROOT,
    preview: { port: 4178, strictPort: true },
    logLevel: "silent",
  });
  const origin = server.resolvedUrls.local[0].replace(/\/$/, "");

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let success = 0;
  let fail = 0;

  for (const route of routes) {
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
      writePage(route.path, html);
      console.log(`  ✓  ${route.path}`);
      success++;
    } catch (err) {
      console.error(`  ✗  ${route.path} — ${err.message}`);
      fail++;
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await server.httpServer.close();

  writeSitemap(routes);
  console.log(`\n  ✓  sitemap.xml — ${routes.length} URLs`);
  console.log(`\n✅  Done: ${success} pages pre-rendered${fail ? `, ${fail} failed` : ""}\n`);

  if (fail > 0) process.exit(1);
}

run().catch((err) => {
  console.error("❌  Pre-render failed:", err);
  process.exit(1);
});
