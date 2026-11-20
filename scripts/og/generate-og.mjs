/**
 * generate-og.mjs — per-page Open Graph cards (1200x630 JPEG) for nz-web.com.
 *
 *   npm run og                       render every card (PAGES + one per blog post)
 *   npm run og -- home faq           render only the named cards
 *   npm run og -- blog/<slug>        render one article card
 *
 * Each card is a small "gallery wall": bone background, the NZ-web serif wordmark with the
 * vermilion cube, the page title in Hebrew (RTL), and the page's signature artwork hung in a
 * frame on the left. Output: public/og/<name>.jpg (served as https://nz-web.com/og/<name>.jpg).
 *
 * Article cards ("blog/<slug>") are built from src/content/blog.ts (cover art, seo_title ?? title,
 * wall label "מגזין") and written to public/og/blog/<slug>.jpg; src/pages/blog/[slug].astro uses
 * that file as og:image automatically when it exists. Re-run after adding a post or changing a
 * post's title/art. (blog.ts is imported directly: Node ≥ 22.18 strips its type-only import.)
 *
 * Page cards live in src/content/og-cards.json (key = the page path without slashes); a page whose
 * key has a rendered file uses it automatically (src/lib/seo.ts). OG_IMAGES in src/lib/site-url.ts
 * names the hub cards for explicit use. Art comes from src/assets/art/<slug>-1080.webp (see SITE-PLAYBOOK §3.5 art map).
 * Copy rules: no prices, no package names, no invented claims (SITE-PLAYBOOK §1).
 */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const OUT_DIR = join(ROOT, "public", "og");
const ART_DIR = join(ROOT, "src", "assets", "art");
const FONT_DIR = join(ROOT, "public", "fonts");
const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 85;

/**
 * name → { art slug, Hebrew title, small wall label }: src/content/og-cards.json, the SAME file the
 * site reads (src/lib/seo.ts) for the card's og:image:alt and to give every page with a card
 * (services/business-website/lawyer → /og/services/business-website/lawyer.jpg) its own og:image.
 */
const PAGES = JSON.parse(readFileSync(join(ROOT, "src", "content", "og-cards.json"), "utf-8"));

/** One card per article: "blog/<slug>" → public/og/blog/<slug>.jpg */
async function blogCards() {
  const { blogPosts } = await import(pathToFileURL(join(ROOT, "src", "content", "blog.ts")).href);
  return Object.fromEntries(
    blogPosts.map((post) => [`blog/${post.slug}`, { art: post.art, title: post.seo_title ?? post.title, label: "מגזין" }]),
  );
}

const fileUrl = (p) => pathToFileURL(p).href;

function fontFaces() {
  const faces = [];
  for (const weight of [300, 500, 700]) {
    for (const subset of ["hebrew", "latin-core", "latin-ext"]) {
      const file = join(FONT_DIR, `frank-ruhl-${weight}-${subset}.woff2`);
      if (!existsSync(file)) continue;
      /* Same unicode-ranges as BaseLayout's <style id="nz-fonts">. */
      const range =
        subset === "hebrew"
          ? "U+0307-0308,U+0590-05FF,U+200C-2010,U+20AA,U+25CC,U+FB1D-FB4F"
          : subset === "latin-core"
            ? "U+0000-00BF,U+00D7,U+00F7,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
            : "U+00C0-00D6,U+00D8-00F6,U+00F8-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329";
      faces.push(
        `@font-face{font-family:'Frank Ruhl Libre';font-weight:${weight};font-style:normal;src:url('${fileUrl(file)}') format('woff2');unicode-range:${range}}`,
      );
    }
  }
  for (const weight of [400, 500]) {
    for (const subset of ["hebrew", "latin-core"]) {
      /* Heebo is one variable file per subset (all weights share it). */
      const file = join(FONT_DIR, `heebo-${subset}.woff2`);
      if (!existsSync(file)) continue;
      faces.push(
        `@font-face{font-family:'Heebo';font-weight:${weight};font-style:normal;src:url('${fileUrl(file)}') format('woff2')}`,
      );
    }
  }
  return faces.join("\n");
}

const escapeHtml = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function template({ art, title, label }) {
  const artFile = join(ART_DIR, `${art}-1080.webp`);
  if (!existsSync(artFile)) throw new Error(`Missing artwork: ${artFile}`);
  return `<!doctype html>
<html lang="he" dir="rtl">
<head>
<meta charset="utf-8">
<style>
${fontFaces()}
:root{--bone:#EFEAE2;--bone-2:#E6DFD4;--ink:#121110;--graphite:#57524B;--vermilion:#E0401F;--line:rgba(18,17,16,.14)}
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${WIDTH}px;height:${HEIGHT}px;overflow:hidden}
body{
  background:
    radial-gradient(ellipse 70% 90% at 26% 42%, rgba(255,255,255,.55), rgba(255,255,255,0) 70%),
    var(--bone);
  color:var(--ink);
  font-family:'Frank Ruhl Libre','Times New Roman',Georgia,serif;
  display:grid;
  grid-template-columns:1fr 560px;
  gap:0;
  padding:56px 64px 52px;
}
.text{display:flex;flex-direction:column;justify-content:space-between;padding-inline-end:48px;min-width:0}
.mark{display:flex;align-items:center;gap:14px;font-weight:700;font-size:40px;letter-spacing:-.01em;line-height:1}
.mark .cube{width:22px;height:22px;background:var(--vermilion);flex:none}
.title{font-weight:500;font-size:64px;line-height:1.06;letter-spacing:-.015em;text-wrap:balance;max-width:560px}
.title.is-long{font-size:54px;line-height:1.08}
.label{font-family:'Heebo',system-ui,sans-serif;font-weight:500;font-size:19px;color:var(--graphite);
  letter-spacing:.03em;border-top:1px solid var(--line);padding-top:16px;display:flex;justify-content:space-between;gap:24px}
.label .room::before{content:"";display:inline-block;width:8px;height:8px;background:var(--vermilion);margin-inline-end:10px;vertical-align:middle;transform:translateY(-2px)}
.wall{display:flex;align-items:center;justify-content:center}
.frame{
  background:#16130f;padding:14px;border-radius:2px;
  box-shadow:0 1px 0 rgba(255,255,255,.6) inset, 0 30px 50px -18px rgba(18,17,16,.45), 0 12px 18px -10px rgba(18,17,16,.35);
}
.mat{background:#F8F6F2;padding:22px}
.mat img{display:block;max-width:468px;max-height:440px;width:auto;height:auto}
</style>
</head>
<body>
  <div class="text">
    <div class="mark"><span class="cube" aria-hidden="true"></span><span dir="ltr">NZ-web</span></div>
    <h1 class="title${title.length > 38 ? " is-long" : ""}">${escapeHtml(title)}</h1>
    <div class="label"><span class="room">${escapeHtml(label)}</span><span dir="ltr">nz-web.com</span></div>
  </div>
  <div class="wall"><div class="frame"><div class="mat"><img src="${fileUrl(artFile)}" alt=""></div></div></div>
</body>
</html>`;
}

async function main() {
  const CARDS = { ...PAGES, ...(await blogCards()) };
  const only = process.argv.slice(2);
  const names = only.length ? only : Object.keys(CARDS);
  const unknown = names.filter((n) => !CARDS[n]);
  if (unknown.length) throw new Error(`Unknown card(s): ${unknown.join(", ")}. Known: ${Object.keys(CARDS).join(", ")}`);

  mkdirSync(OUT_DIR, { recursive: true });
  const tmp = mkdtempSync(join(tmpdir(), "nz-og-"));
  const browser = await puppeteer.launch({ headless: true, args: ["--allow-file-access-from-files"] });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 1 });
    for (const name of names) {
      const htmlFile = join(tmp, `${name.replace(/\//g, "__")}.html`);
      writeFileSync(htmlFile, template(CARDS[name]), "utf-8");
      await page.goto(fileUrl(htmlFile), { waitUntil: "load" });
      await page.evaluate(async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => (img.complete ? null : img.decode().catch(() => null))));
      });
      const out = join(OUT_DIR, `${name}.jpg`);
      mkdirSync(dirname(out), { recursive: true });
      await page.screenshot({
        path: out,
        type: "jpeg",
        quality: QUALITY,
        clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
        /* true (the default with a clip) re-lays the page out at full size and captured a blank wall */
        captureBeyondViewport: false,
      });
      console.log(`  ✓  public/og/${name}.jpg  (${Math.round(statSync(out).size / 1024)} KB)`);
    }
  } finally {
    await browser.close();
    rmSync(tmp, { recursive: true, force: true });
  }
}

main().catch((err) => {
  console.error("✗ OG generation failed:", err.message);
  process.exit(1);
});
