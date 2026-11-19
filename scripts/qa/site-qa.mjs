#!/usr/bin/env node
/**
 * NZ-web static site QA — checks the built dist/ (Astro static pages) against SITE-PLAYBOOK.md.
 *
 *   npm run build          (astro build + scripts/postbuild.mjs; this tool never builds)
 *   npm run qa             (= node scripts/qa/site-qa.mjs)
 *   npm run qa -- --quiet                 errors only, no warnings
 *   npm run qa -- --page /services/       report only pages whose URL starts with this prefix
 *   npm run qa -- --dist path/to/dist     check another folder (default: ./dist)
 *
 * ERROR = breaks a playbook rule (fix before deploy).  warn = worth a look, not blocking.
 * Exit code 1 when there is at least one error, 0 otherwise. Prints "NO PROBLEMS" when fully clean.
 *
 * Per HTML page (dist/**\/*.html):
 *   - parsed with jsdom (scripts never run); exactly one <h1>; <html lang="he" dir="rtl">
 *   - no duplicated <title> / description / canonical / robots tags (head drift)
 *   - <title> present, <= 65 chars (warn > 60), ends with "| NZ-web" (warn)
 *   - indexable pages only: meta description 110–165 chars (warn outside 140–160); titles and
 *     descriptions unique; canonical = https://nz-web.com/<path>/ (absolute, trailing slash, matches
 *     the file); og:title / og:description / og:image / og:url present (og:url == canonical: warn)
 *   - every <img> has alt (empty alt only with aria-hidden="true" — on itself or an ancestor — or
 *     role="presentation"/"none") and width + height
 *   - every JSON-LD block parses; no price fields (price, priceRange, offers, priceSpecification …)
 *   - no prices in visible text / meta / attributes / JSON-LD strings / WhatsApp prefill texts
 *   - banned words (old package names, invented numbers, buzzwords, retired email, wrong brand case)
 *   - internal <a href="/…"> resolve to a dist page or asset (missing trailing slash: warn);
 *     internal src/srcset/link href resolve too; #fragments exist on the target page (warn)
 *   - <a target="_blank"> to external sites carries rel="noopener"
 * Site-wide:
 *   - sitemap.xml exists; every <loc> maps to an indexable dist page whose canonical equals it;
 *     every indexable dist page is listed; robots.txt references the sitemap; llms.txt exists
 *     (llms-full.txt: warn if missing); llms files are scanned for prices / banned words and
 *     their nz-web.com links must resolve.
 */
import { readFileSync, existsSync, statSync, readdirSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";
import { JSDOM, VirtualConsole } from "jsdom";

/* ───────────────────────── config ───────────────────────── */
const ORIGIN = "https://nz-web.com";
const BRAND_SUFFIX = "| NZ-web";
const TITLE_MAX = 65;
const TITLE_SOFT_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 165;
const DESC_SOFT = [140, 160];

const HEB = "\\u0590-\\u05FF";
const notHebBefore = `(?<![${HEB}])`;
const notHebAfter = `(?![${HEB}])`;
const word = (w) => new RegExp(`${notHebBefore}${w}${notHebAfter}`, "u");

/** [label, regex, level] — scanned over every text source of a page (and the llms files). */
const BANNED = [
  ["old package name סמארט", word("סמארט"), "error"],
  ["old package name פרו", new RegExp(`${notHebBefore}פרו(?=\\s)`, "u"), "error"],
  ["old package name עילית", word("עילית"), "error"],
  ["old package name / slogan מובילות", word("מובילות"), "error"],
  ["old package name פסגה", word("פסגה"), "error"],
  ['"הנבחרת ביותר"', /הנבחרת ביותר/u, "error"],
  ['"נוכחות" (check it is not a package name)', word("נוכחות"), "warn"],
  ['invented claim "סטודיו מוביל"', /סטודיו מוביל/u, "error"],
  ['invented number "100/100"', /100\s*\/\s*100/u, "error"],
  ['invented number "50+"', /(?<!\d)50\s?\+/u, "error"],
  ['invented number "40+"', /(?<!\d)40\s?\+/u, "error"],
  ['invented number "5+ שנות"', /(?<!\d)5\s?\+\s*שנ(?:ות|ים)/u, "error"],
  ['invented number "100% שביעות"', /100\s?%\s*שביעות/u, "error"],
  ['buzzword "Perfect in every Pixel"', /perfect in every pixel/iu, "error"],
  ["retired email nzweb295@gmail.com", /nzweb295@gmail\.com/iu, "error"],
  ['wrong brand case "NZ-WEB"', /NZ-WEB/u, "error"],
  ['wrong brand case "NZ WEB"', /NZ WEB/u, "error"],
];

/** Price tokens in human-readable text. */
const PRICES = [
  ["₪ sign", /₪/u, "error"],
  ['ש"ח', /ש["״׳']ח/u, "error"],
  ["שקל/שקלים with a number", /\d[\d,.]*\s*(?:אלף\s*)?שקל(?:ים)?|שקל(?:ים)?\s*\d/u, "error"],
  ['"החל מ" + number', /החל\s+מ[-־]?\s*\d/u, "error"],
  ['"החל מ" (make sure it is not a price)', /החל\s+מ(?![-־]?\s*\d)/u, "warn"],
  ['"price" (text)', /\bprice\b/iu, "warn"],
];

/** JSON-LD keys that must never appear. */
const PRICE_KEYS = new Set([
  "price", "priceRange", "offers", "priceSpecification", "priceCurrency",
  "lowPrice", "highPrice", "estimatedCost", "minPrice", "maxPrice",
]);

/* ───────────────────────── args ───────────────────────── */
const argv = process.argv.slice(2);
const opt = (name) => { const i = argv.indexOf(name); return i >= 0 ? argv[i + 1] : undefined; };
if (argv.includes("--help") || argv.includes("-h")) {
  console.log("usage: node scripts/qa/site-qa.mjs [--dist dist] [--page /prefix/] [--quiet]");
  process.exit(0);
}
const DIST = resolve(opt("--dist") || "dist");
const PAGE_FILTER = opt("--page");
const QUIET = argv.includes("--quiet");

if (!existsSync(DIST) || !statSync(DIST).isDirectory()) {
  console.error(`✖ ${DIST} not found — run "npm run build" first.`);
  process.exit(1);
}

/* ───────────────────────── helpers ───────────────────────── */
const ws = (t) => String(t ?? "").replace(/[\s ]+/g, " ").trim();
const snippet = (text, idx, len) => {
  const a = Math.max(0, idx - 30);
  const b = Math.min(text.length, idx + len + 30);
  return (a > 0 ? "…" : "") + ws(text.slice(a, b)) + (b < text.length ? "…" : "");
};

function walkFiles(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walkFiles(p, out);
    else out.push(p);
  }
  return out;
}

/** dist-relative file (posix) → site URL path. */
function urlOf(rel) {
  if (rel === "index.html") return "/";
  if (rel.endsWith("/index.html")) return "/" + rel.slice(0, -"index.html".length);
  return "/" + rel;
}

/** Site URL path → dist file it is served from (null if none). Mirrors Netlify pretty URLs. */
function fileFor(pathname) {
  let p;
  try { p = decodeURIComponent(pathname); } catch { p = pathname; }
  const rel = p.replace(/^\/+/, "");
  if (p.endsWith("/")) {
    const f = join(DIST, rel, "index.html");
    return existsSync(f) ? { file: f, slashFix: false } : null;
  }
  const f = join(DIST, rel);
  if (existsSync(f) && statSync(f).isFile()) return { file: f, slashFix: false };
  if (existsSync(join(f, "index.html"))) return { file: join(f, "index.html"), slashFix: true };
  if (existsSync(f + ".html")) return { file: f + ".html", slashFix: false };
  return null;
}

const report = new Map(); // group → { errors: [], warns: [] }
function bucket(group) {
  if (!report.has(group)) report.set(group, { errors: [], warns: [] });
  return report.get(group);
}
const E = (group, msg) => bucket(group).errors.push(msg);
const W = (group, msg) => bucket(group).warns.push(msg);

function scanText(group, label, text, rules) {
  if (!text) return;
  for (const [name, re, level] of rules) {
    const m = re.exec(text);
    if (!m) continue;
    const msg = `${name} in ${label}: "${snippet(text, m.index, m[0].length)}"`;
    (level === "error" ? E : W)(group, msg);
  }
}

function collectLdStrings(node, out) {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => collectLdStrings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => collectLdStrings(n, out));
}
function findPriceKeys(node, out) {
  if (Array.isArray(node)) node.forEach((n) => findPriceKeys(n, out));
  else if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (PRICE_KEYS.has(k)) out.add(k);
      findPriceKeys(v, out);
    }
  }
}

/** Visible-ish text of an element: text nodes outside script/style/template, block-separated. */
function textOf(root) {
  const SKIP = new Set(["SCRIPT", "STYLE", "TEMPLATE"]);
  const parts = [];
  const walk = (n) => {
    for (const c of n.childNodes) {
      if (c.nodeType === 3) parts.push(c.nodeValue);
      else if (c.nodeType === 1 && !SKIP.has(c.tagName.toUpperCase())) { parts.push(" "); walk(c); parts.push(" "); }
    }
  };
  walk(root);
  return ws(parts.join(""));
}

/* ───────────────────────── load pages ───────────────────────── */
const allFiles = walkFiles(DIST);
const htmlFiles = allFiles
  .filter((f) => f.endsWith(".html"))
  .map((f) => relative(DIST, f).split(sep).join("/"))
  .sort((a, b) => (a === "index.html" ? -1 : b === "index.html" ? 1 : a.localeCompare(b)));

const vc = new VirtualConsole(); // swallow jsdom CSS parse noise
const pages = new Map(); // rel → { rel, url, raw, doc, indexable, canonical, ids }
for (const rel of htmlFiles) {
  const raw = readFileSync(join(DIST, rel), "utf-8");
  const dom = new JSDOM(raw, { virtualConsole: vc });
  const doc = dom.window.document;
  const robots = [...doc.querySelectorAll('meta[name="robots" i]')].map((m) => m.getAttribute("content") || "").join(",");
  const indexable = !/noindex/i.test(robots) && rel !== "404.html";
  const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || "";
  const ids = new Set([...doc.querySelectorAll("[id]")].map((n) => n.id));
  doc.querySelectorAll("a[name]").forEach((a) => ids.add(a.getAttribute("name")));
  pages.set(rel, { rel, url: urlOf(rel), raw, doc, indexable, canonical, ids });
}

const pageByFile = (file) => pages.get(relative(DIST, file).split(sep).join("/"));

/* ───────────────────────── per-page checks ───────────────────────── */
const titles = new Map();
const descs = new Map();

for (const pg of pages.values()) {
  const { rel, url, raw, doc, indexable } = pg;
  const G = `${url}${indexable ? "" : "  (noindex)"}`;
  const head = doc.head;

  /* html lang / dir */
  const html = doc.documentElement;
  if (html.getAttribute("lang") !== "he" || html.getAttribute("dir") !== "rtl")
    E(G, `<html> must have lang="he" dir="rtl" (found lang=${html.getAttribute("lang")} dir=${html.getAttribute("dir")})`);

  /* duplicated head tags */
  const count = (sel) => doc.querySelectorAll(sel).length;
  for (const [sel, name] of [
    ["head > title", "<title>"], ['meta[name="description" i]', "meta description"],
    ['link[rel="canonical"]', "canonical"], ['meta[name="robots" i]', "meta robots"],
    ['meta[property="og:title"]', "og:title"], ['meta[property="og:url"]', "og:url"],
  ]) {
    const n = count(sel);
    if (n > 1) E(G, `${n}× ${name} — must appear once`);
  }

  /* h1 */
  const h1s = doc.querySelectorAll("h1");
  if (h1s.length !== 1) (indexable ? E : W)(G, `${h1s.length} <h1> elements (exactly one required)`);

  /* title */
  const title = ws(doc.querySelector("head > title")?.textContent);
  if (!title) E(G, "missing <title>");
  else {
    if (title.length > TITLE_MAX) E(G, `title is ${title.length} chars (max ${TITLE_MAX}): "${title}"`);
    else if (title.length > TITLE_SOFT_MAX) W(G, `title is ${title.length} chars (playbook target ≤ ${TITLE_SOFT_MAX}): "${title}"`);
    if (!title.endsWith(BRAND_SUFFIX)) W(G, `title should end with "${BRAND_SUFFIX}": "${title}"`);
  }

  /* meta helpers */
  const meta = (sel) => doc.querySelector(sel)?.getAttribute("content") ?? null;
  const desc = ws(meta('meta[name="description" i]'));

  if (indexable) {
    /* description */
    if (!desc) E(G, "missing meta description");
    else if (desc.length < DESC_MIN || desc.length > DESC_MAX)
      E(G, `meta description is ${desc.length} chars (allowed ${DESC_MIN}–${DESC_MAX})`);
    else if (desc.length < DESC_SOFT[0] || desc.length > DESC_SOFT[1])
      W(G, `meta description is ${desc.length} chars (playbook target ${DESC_SOFT[0]}–${DESC_SOFT[1]})`);

    /* uniqueness */
    if (title) {
      if (titles.has(title)) E(G, `duplicate title (same as ${titles.get(title)})`);
      else titles.set(title, url);
    }
    if (desc) {
      if (descs.has(desc)) E(G, `duplicate meta description (same as ${descs.get(desc)})`);
      else descs.set(desc, url);
    }

    /* canonical */
    const expected = ORIGIN + url;
    const c = pg.canonical;
    if (!c) E(G, "missing canonical");
    else if (!c.startsWith(ORIGIN + "/")) E(G, `canonical must be absolute ${ORIGIN}/…: ${c}`);
    else if (!c.endsWith("/")) E(G, `canonical must end with "/": ${c}`);
    else if (c !== expected) E(G, `canonical ${c} does not match the file (expected ${expected})`);

    /* Open Graph */
    for (const p of ["og:title", "og:description", "og:image", "og:url"]) {
      if (!ws(meta(`meta[property="${p}"]`))) E(G, `missing ${p}`);
    }
    const ogUrl = meta('meta[property="og:url"]');
    if (ogUrl && c && ogUrl !== c) W(G, `og:url (${ogUrl}) differs from canonical (${c})`);
    const ogImg = meta('meta[property="og:image"]');
    if (ogImg && !/^https:\/\//.test(ogImg)) E(G, `og:image must be an absolute https URL: ${ogImg}`);
  }

  /* images */
  for (const img of doc.querySelectorAll("img")) {
    const src = (img.getAttribute("src") || img.getAttribute("srcset") || "").slice(0, 80);
    const label = src.startsWith("data:") ? "data: URI" : src || "(no src)";
    if (!img.hasAttribute("alt")) E(G, `<img> without alt: ${label}`);
    else if (img.getAttribute("alt").trim() === "") {
      const role = (img.getAttribute("role") || "").toLowerCase();
      const hidden = img.closest('[aria-hidden="true"]');
      if (!hidden && role !== "presentation" && role !== "none")
        E(G, `<img> with empty alt but no aria-hidden/role="presentation": ${label}`);
    }
    if (!img.hasAttribute("width") || !img.hasAttribute("height")) E(G, `<img> without width/height: ${label}`);
  }

  /* JSON-LD */
  const ldStrings = [];
  doc.querySelectorAll('script[type="application/ld+json"]').forEach((s, i) => {
    let data;
    try { data = JSON.parse(s.textContent); } catch (e) {
      E(G, `JSON-LD block #${i + 1} does not parse: ${e.message}`);
      return;
    }
    const keys = new Set();
    findPriceKeys(data, keys);
    if (keys.size) E(G, `price field(s) in JSON-LD block #${i + 1}: ${[...keys].join(", ")}`);
    collectLdStrings(data, ldStrings);
  });

  /* text sources for prices + banned words */
  const sources = [];
  sources.push(["<title>", title]);
  doc.querySelectorAll("meta[content]").forEach((m) => {
    const k = m.getAttribute("name") || m.getAttribute("property") || "";
    if (/^(description|keywords|author|og:|twitter:)/i.test(k)) sources.push([`meta ${k}`, m.getAttribute("content")]);
  });
  if (doc.body) sources.push(["visible text", textOf(doc.body)]);
  const attrTexts = [];
  doc.querySelectorAll("[alt],[title],[aria-label],[placeholder],[aria-description]").forEach((n) => {
    for (const a of ["alt", "title", "aria-label", "placeholder", "aria-description"]) {
      const v = n.getAttribute(a);
      if (v) attrTexts.push(v);
    }
  });
  sources.push(["alt/title/aria-label attributes", attrTexts.join(" ⋯ ")]);
  sources.push(["JSON-LD", ldStrings.join(" ⋯ ")]);
  const prefills = [];
  doc.querySelectorAll('a[href*="wa.me/"], a[href*="api.whatsapp.com"]').forEach((a) => {
    try {
      const t = new URL(a.getAttribute("href")).searchParams.get("text");
      if (t) prefills.push(t);
    } catch { /* malformed href is reported elsewhere */ }
  });
  sources.push(["WhatsApp prefill text", prefills.join(" ⋯ ")]);
  for (const [label, text] of sources) {
    scanText(G, label, text, PRICES);
    scanText(G, label, text, BANNED.filter(([n]) => !n.startsWith("retired email")));
  }
  // the retired email must not appear anywhere in the file (mailto:, scripts, comments …)
  scanText(G, "page source", raw, BANNED.filter(([n]) => n.startsWith("retired email")));

  /* links */
  const seenBroken = new Set();
  for (const a of doc.querySelectorAll("a[href]")) {
    const href = a.getAttribute("href").trim();
    if (!href || /^(mailto:|tel:|sms:|javascript:|data:)/i.test(href)) continue;
    let u;
    try { u = new URL(href, ORIGIN + url); } catch { E(G, `malformed href: ${href}`); continue; }
    const external = !/^(www\.)?nz-web\.com$/i.test(u.hostname);

    if (a.getAttribute("target") === "_blank" && external) {
      const rel = (a.getAttribute("rel") || "").toLowerCase().split(/\s+/);
      if (!rel.includes("noopener")) {
        if (rel.includes("noreferrer")) W(G, `target=_blank link has rel="noreferrer" but not "noopener": ${href.slice(0, 80)}`);
        else E(G, `target=_blank link without rel="noopener": ${href.slice(0, 80)}`);
      }
    }
    if (external) continue;
    if (/^https?:/i.test(href) && (u.protocol !== "https:" || u.hostname !== "nz-web.com"))
      W(G, `absolute internal link should be https://nz-web.com/… or relative: ${href}`);

    if (u.pathname === url && href.startsWith("#")) {
      if (u.hash.length > 1 && !pg.ids.has(decodeURIComponent(u.hash.slice(1)))) W(G, `#fragment target not found on this page: ${href}`);
      continue;
    }
    const hit = fileFor(u.pathname);
    if (!hit) {
      if (!seenBroken.has(u.pathname)) E(G, `broken internal link: ${href}`);
      seenBroken.add(u.pathname);
      continue;
    }
    if (hit.slashFix) W(G, `internal link missing trailing slash (costs a redirect): ${href} → ${u.pathname}/`);
    if (u.hash.length > 1 && hit.file.endsWith(".html")) {
      const target = pageByFile(hit.file);
      if (target && !target.ids.has(decodeURIComponent(u.hash.slice(1)))) W(G, `#fragment not found on target page: ${href}`);
    }
  }

  /* assets referenced by src / srcset / link href */
  const assetRefs = new Set();
  doc.querySelectorAll("[src]").forEach((n) => assetRefs.add(n.getAttribute("src")));
  doc.querySelectorAll("[srcset]").forEach((n) =>
    n.getAttribute("srcset").split(",").forEach((part) => assetRefs.add(part.trim().split(/\s+/)[0])));
  doc.querySelectorAll("link[href]").forEach((n) => {
    const r = (n.getAttribute("rel") || "").toLowerCase();
    if (/(stylesheet|icon|preload|modulepreload|manifest|apple-touch-icon)/.test(r)) assetRefs.add(n.getAttribute("href"));
  });
  for (const ref of assetRefs) {
    if (!ref || /^(data:|blob:|mailto:|tel:)/i.test(ref)) continue;
    let u;
    try { u = new URL(ref, ORIGIN + url); } catch { E(G, `malformed asset URL: ${ref}`); continue; }
    if (!/^(www\.)?nz-web\.com$/i.test(u.hostname)) {
      W(G, `third-party asset (playbook: no external CDNs/fonts): ${ref.slice(0, 100)}`);
      continue;
    }
    if (!fileFor(u.pathname)) E(G, `missing asset: ${ref}`);
  }
}

/* ───────────────────────── site-wide checks ───────────────────────── */
const SITE = "site-wide";

/* sitemap */
const sitemapFile = join(DIST, "sitemap.xml");
if (!existsSync(sitemapFile)) E(SITE, "dist/sitemap.xml is missing");
else {
  const xml = readFileSync(sitemapFile, "utf-8");
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/&amp;/g, "&"));
  if (!locs.length) E(SITE, "sitemap.xml has no <loc> entries");
  const listed = new Set();
  for (const loc of locs) {
    if (listed.has(loc)) { E(SITE, `sitemap lists ${loc} twice`); continue; }
    listed.add(loc);
    if (!loc.startsWith(ORIGIN + "/")) { E(SITE, `sitemap URL is not on ${ORIGIN}: ${loc}`); continue; }
    const path = loc.slice(ORIGIN.length);
    if (!path.endsWith("/")) W(SITE, `sitemap URL without trailing slash: ${loc}`);
    const hit = fileFor(path);
    const pg = hit && pageByFile(hit.file);
    if (!pg) { E(SITE, `sitemap URL has no dist page: ${loc}`); continue; }
    if (!pg.indexable) E(SITE, `sitemap lists a noindex page: ${loc}`);
    else if (pg.canonical && pg.canonical !== loc) E(SITE, `sitemap URL ${loc} ≠ page canonical ${pg.canonical}`);
  }
  for (const m of xml.matchAll(/<lastmod>\s*([^<\s]+)\s*<\/lastmod>/g)) {
    if (!/^\d{4}-\d{2}-\d{2}(T[\d:.]+(Z|[+-]\d{2}:\d{2})?)?$/.test(m[1])) W(SITE, `sitemap lastmod is not ISO 8601: ${m[1]}`);
    else if (new Date(m[1]) > new Date(Date.now() + 864e5)) W(SITE, `sitemap lastmod is in the future: ${m[1]}`);
  }
  for (const pg of pages.values()) {
    if (pg.indexable && !listed.has(ORIGIN + pg.url)) E(SITE, `indexable page missing from sitemap: ${pg.url}`);
  }
}

/* robots.txt */
const robotsFile = join(DIST, "robots.txt");
if (!existsSync(robotsFile)) E(SITE, "dist/robots.txt is missing");
else if (!/^\s*Sitemap:\s*https:\/\/nz-web\.com\/sitemap\.xml\s*$/im.test(readFileSync(robotsFile, "utf-8")))
  E(SITE, "robots.txt does not reference Sitemap: https://nz-web.com/sitemap.xml");

/* llms files */
for (const [name, required] of [["llms.txt", true], ["llms-full.txt", false]]) {
  const f = join(DIST, name);
  if (!existsSync(f)) { (required ? E : W)(SITE, `dist/${name} is missing`); continue; }
  const text = readFileSync(f, "utf-8");
  scanText(SITE, name, text, PRICES);
  scanText(SITE, name, text, BANNED);
  const broken = new Set();
  for (const m of text.matchAll(/https?:\/\/(?:www\.)?nz-web\.com(\/[^\s)\]>"'`]*)?/g)) {
    const path = (m[1] || "/").replace(/[.,;:]+$/, "").split(/[?#]/)[0];
    if (!fileFor(path)) broken.add(path);
  }
  for (const p of broken) E(SITE, `${name} links to a page that does not exist: ${ORIGIN}${p}`);
}

/* ───────────────────────── output ───────────────────────── */
/* The same finding on many pages almost always comes from the shared layout (header, footer,
   index.html JSON-LD). Collapse those into one group so per-page sections stay readable. */
const SHARED = "shared layout (same finding on several pages)";
const SHARED_MIN = 3;
const norm = (m) => m.replace(/: ".*"$/s, "");
// per-page metrics (lengths, title suffix, duplicates) are never "shared layout" even when repeated
const collapsible = (m) => !/^(meta description is|title is|title should end|duplicate |missing )/.test(m);
{
  const tally = new Map(); // "level\0msg" → [groups]
  for (const [g, b] of report) {
    if (g === SITE) continue;
    if (PAGE_FILTER && !g.startsWith(PAGE_FILTER)) continue;
    for (const [lvl, list] of [["e", b.errors], ["w", b.warns]])
      for (const m of new Set(list)) {
        if (!collapsible(m)) continue;
        const k = lvl + "\0" + norm(m); // snippets differ by surrounding text; group by rule + source
        if (!tally.has(k)) tally.set(k, { groups: [], example: m });
        const t = tally.get(k);
        if (!t.groups.includes(g.split("  ")[0])) t.groups.push(g.split("  ")[0]);
      }
  }
  for (const [k, { groups, example }] of tally) {
    if (groups.length < SHARED_MIN) continue;
    const [lvl, key] = k.split("\0");
    for (const [g, b] of report) {
      if (g === SITE) continue;
      const list = lvl === "e" ? b.errors : b.warns;
      for (let i = list.length - 1; i >= 0; i--) if (norm(list[i]) === key) list.splice(i, 1);
    }
    const where = groups.length > 6 ? `${groups.slice(0, 5).join(", ")} … +${groups.length - 5}` : groups.join(", ");
    (lvl === "e" ? E : W)(SHARED, `${example}  [${groups.length} pages: ${where}]`);
  }
}
const filtered = [...report.entries()]
  .filter(([g]) => !PAGE_FILTER || g === SITE || g === SHARED || g.startsWith(PAGE_FILTER))
  .sort(([a], [b]) => (a === SHARED ? -1 : b === SHARED ? 1 : 0));
let nErr = 0;
let nWarn = 0;
const color = process.stdout.isTTY && !process.env.NO_COLOR;
const red = (s) => (color ? `\x1b[31m${s}\x1b[0m` : s);
const yel = (s) => (color ? `\x1b[33m${s}\x1b[0m` : s);
const bold = (s) => (color ? `\x1b[1m${s}\x1b[0m` : s);

const checked = PAGE_FILTER ? [...pages.values()].filter((p) => p.url.startsWith(PAGE_FILTER)).length : pages.size;
console.log(bold(`NZ-web site QA — ${checked} HTML page(s) in ${DIST.startsWith(process.cwd() + sep) ? relative(process.cwd(), DIST) : DIST}`));
for (const [group, { errors, warns }] of filtered) {
  nErr += errors.length;
  nWarn += warns.length;
  if (!errors.length && (QUIET || !warns.length)) continue;
  console.log("\n" + bold(group));
  const counted = (list) => {
    const c = new Map();
    for (const m of list) c.set(m, (c.get(m) || 0) + 1);
    return [...c].map(([m, n]) => (n > 1 ? `${m}  (×${n})` : m));
  };
  for (const m of counted(errors)) console.log("  " + red("ERROR") + " " + m);
  if (!QUIET) for (const m of counted(warns)) console.log("  " + yel("warn ") + " " + m);
}
console.log("");
if (!nErr && !nWarn) console.log("NO PROBLEMS");
else console.log(`${nErr ? red(nErr + " error(s)") : "0 errors"}, ${nWarn} warning(s)${QUIET && nWarn ? " (hidden by --quiet)" : ""}`);
process.exit(nErr ? 1 : 0);
