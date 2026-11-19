/**
 * postbuild.mjs — runs after `astro build` (npm run build). Reads the finished dist/ only.
 *
 *  1. dist/sitemap.xml
 *     - every built page (dist/**\/index.html) except noindex pages and 404.html;
 *     - <loc> = the trailing-slash URL (same as each page's self-canonical);
 *     - <lastmod>: blog posts → updated_at ?? published_at (from article:modified_time /
 *       article:published_time in the page head), every other page → the build date;
 *     - image sitemap (xmlns:image): one <image:image> per page for its hero, read from the HTML:
 *       <link rel="preload" as="image"> first (largest srcset candidate), else the first
 *       <img fetchpriority="high">.
 *
 *  2. dist/_headers — the Content-Security-Policy for "/*" (Netlify applies _headers from the
 *     publish dir). Astro inlines a few tiny executable scripts (the island runtime
 *     <astro-island> + its client:load/idle/visible directives) and BaseLayout has one boot script
 *     (motion gate + saved a11y settings, before first paint). Every inline executable <script>
 *     in every page is hashed (sha256) into script-src, so no 'unsafe-inline' is needed.
 *     JSON-LD blocks are data (CSP does not apply) and are skipped. The rest of the policy is the
 *     same as before; netlify.toml keeps every OTHER header and no longer sets a CSP.
 *
 * Never edits pages. Exits 1 only if dist/ is missing.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");
const SITE = "https://nz-web.com";
const TODAY = new Date().toISOString().slice(0, 10);

/* ── CSP (identical to the policy that used to live in netlify.toml, plus the hashes) ── */
const SCRIPT_HOSTS = ["https://www.googletagmanager.com", "https://www.google-analytics.com", "https://connect.facebook.net"];
const CSP_REST = [
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://*.google-analytics.com https://www.googletagmanager.com https://www.facebook.com",
  "font-src 'self'",
  "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com https://www.facebook.com https://connect.facebook.net",
  "media-src 'self'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  "frame-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://wa.me https://api.whatsapp.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

/* Sitemap hints (changefreq / priority) by path; anything else gets the default. */
const HINTS = [
  [/^\/$/, "weekly", "1.0"],
  [/^\/(packages|contact|services)\/$/, "monthly", "0.9"],
  [/^\/projects\/$/, "weekly", "0.85"],
  [/^\/about\/$/, "monthly", "0.8"],
  [/^\/blog\/$/, "weekly", "0.8"],
  [/^\/faq\/$/, "monthly", "0.75"],
  [/^\/services\/(web-development|website-development|business-website|appointment-system)\/$/, "monthly", "0.9"],
  [/^\/services\/business-website\/[^/]+\/$/, "monthly", "0.85"],
  [/^\/services\/landing-page-development\/$/, "monthly", "0.85"],
  [/^\/services\/[^/]+\/$/, "monthly", "0.8"],
  [/^\/services\/landing-page-development\/[^/]+\/$/, "monthly", "0.8"],
  [/^\/blog\/[^/]+\/$/, "monthly", "0.7"],
  [/^\/(privacy|terms|accessibility)\/$/, "yearly", "0.3"],
];
function hintsFor(path) {
  for (const [re, changefreq, priority] of HINTS) if (re.test(path)) return { changefreq, priority };
  return { changefreq: "monthly", priority: "0.6" };
}

/* ── helpers ── */
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const xmlEscape = (v) =>
  String(v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

function attr(tag, name) {
  const m = tag.match(new RegExp(`\\s${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, "i"));
  return m ? (m[2] ?? m[3] ?? m[4] ?? "").replace(/&amp;/g, "&") : null;
}

function absoluteUrl(src) {
  if (!src || src.startsWith("data:") || src.startsWith("blob:")) return null;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("//")) return `https:${src}`;
  return `${SITE}${src.startsWith("/") ? "" : "/"}${src}`;
}

/** Largest candidate of a srcset ("a.avif 640w, b.avif 1600w" → b.avif). */
function largestCandidate(srcset) {
  let best = null;
  let bestW = -1;
  for (const part of srcset.split(",")) {
    const [url, d] = part.trim().split(/\s+/);
    const w = d ? parseFloat(d) : 0;
    if (url && w >= bestW) {
      best = url;
      bestW = w;
    }
  }
  return best;
}

function primaryImageOf(html) {
  for (const [tag] of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel\s*=\s*["']?preload/i.test(tag) || attr(tag, "as") !== "image") continue;
    const href = attr(tag, "href") || largestCandidate(attr(tag, "imagesrcset") || "");
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

function metaContent(html, key, value) {
  for (const [tag] of html.matchAll(/<meta\b[^>]*>/gi)) {
    if ((attr(tag, key) || "").toLowerCase() === value) return attr(tag, "content");
  }
  return null;
}

const isNoindex = (html) => /noindex/i.test(metaContent(html, "name", "robots") || "");

/* ── main ── */
if (!existsSync(join(DIST, "index.html"))) {
  console.error("✗ dist/index.html not found — run `astro build` first.");
  process.exit(1);
}

const files = walk(DIST);
const pages = [];
const hashes = new Map(); // hash → first file that has it
let inlineCount = 0;

for (const file of files) {
  const rel = relative(DIST, file).split(sep).join("/");
  const html = readFileSync(file, "utf-8");

  /* CSP: every inline, executable <script> (no src, not a JSON / ld+json data block). */
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1];
    if (/\ssrc\s*=/i.test(attrs)) continue;
    const type = (attr(`<x ${attrs}>`, "type") || "").toLowerCase();
    if (type && !["module", "text/javascript", "application/javascript"].includes(type)) continue;
    if (!m[2].trim()) continue;
    inlineCount++;
    const hash = `'sha256-${createHash("sha256").update(m[2], "utf8").digest("base64")}'`;
    if (!hashes.has(hash)) hashes.set(hash, rel);
  }

  /* Sitemap candidates: directory pages only (index.html), never 404.html. */
  if (!rel.endsWith("index.html")) continue;
  const path = `/${rel.replace(/index\.html$/, "")}`;
  if (isNoindex(html)) {
    console.log(`  · ${path}  (noindex — not in sitemap)`);
    continue;
  }
  const modified = metaContent(html, "property", "article:modified_time") || metaContent(html, "property", "article:published_time");
  pages.push({
    path,
    lastmod: modified ? modified.slice(0, 10) : TODAY,
    image: primaryImageOf(html),
    ...hintsFor(path),
  });
}

/* ── 1. sitemap.xml ── */
pages.sort((a, b) => (a.path === "/" ? -1 : b.path === "/" ? 1 : a.path.localeCompare(b.path)));
const urls = pages
  .map(({ path, lastmod, changefreq, priority, image }) => {
    const loc = `${SITE}${path}`;
    const alt = path === "/" ? `\n    <xhtml:link rel="alternate" hreflang="he" href="${loc}"/>` : "";
    const img = image ? `\n    <image:image>\n      <image:loc>${xmlEscape(image)}</image:loc>\n    </image:image>` : "";
    return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>${alt}${img}
  </url>`;
  })
  .join("\n\n");

writeFileSync(
  join(DIST, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">

${urls}

</urlset>
`,
  "utf-8",
);
console.log(`  ✓ sitemap.xml — ${pages.length} URLs, ${pages.filter((p) => p.image).length} with an image entry`);

/* ── 2. _headers (CSP) ── */
const scriptSrc = ["'self'", ...[...hashes.keys()].sort(), ...SCRIPT_HOSTS].join(" ");
const csp = ["default-src 'self'", `script-src ${scriptSrc}`, ...CSP_REST].join("; ");
writeFileSync(
  join(DIST, "_headers"),
  `# Generated by scripts/postbuild.mjs — do not edit. Inline-script hashes change with Astro
# versions / BaseLayout's boot script, so this file is rebuilt on every build.
/*
  Content-Security-Policy: ${csp}
`,
  "utf-8",
);
console.log(`  ✓ _headers — CSP with ${hashes.size} inline-script hash(es) (${inlineCount} inline scripts across ${files.length} HTML files)`);
for (const [hash, file] of hashes) console.log(`      ${hash}  first seen in ${file}`);
