#!/usr/bin/env node
/**
 * NZ-web screenshots + live layout checks (puppeteer, headless Chrome for Testing).
 *
 *   npm run shoot -- [options] [/path1/ /path2/ …]
 *
 *   --base <url>        site origin (default http://localhost:8080 — `npm run dev` (astro dev) or,
 *                       after `npm run build`, `npm run preview` (serves dist/ on the same port))
 *   --widths 390,1440   viewport widths (default 390,1440). < 768 = phone emulation
 *                       (isMobile, hasTouch, DPR 2, Android Chrome UA); otherwise desktop DPR 1
 *   --out <dir>         output folder (default .qa/shots — git-ignored)
 *   --format jpg|png    image format (default jpg, quality 85)
 *   --wait <ms>         extra settle time after load, before scrolling (default 400)
 *   --reduced-motion    emulate prefers-reduced-motion: reduce (final states, no transitions)
 *   --motion            look like a real browser to the boot script: navigator.webdriver reads
 *                       false (evaluateOnNewDocument, before any page script), so BaseLayout's
 *                       boot script and initMotionGate() put html.nz-motion on and the motion
 *                       start/end states are captured. Without it, headless runs show final
 *                       states only (the motion gate stays closed for automation browsers).
 *                       Ignored with --reduced-motion (that one wins, as on a real device).
 *   --cookie-banner     keep the first-visit cookie banner (default: pre-declined so it does not
 *                       cover the layout; the banner itself is still worth one shot now and then)
 *   --mode scroll|full  scroll (default): capture viewport by viewport while scrolling and stitch
 *                       (sections appear as a visitor sees them; fixed UI shown once at the top).
 *                       full: puppeteer fullPage capture (one frame; in-view animations may show
 *                       their hidden state and tall DPR-2 pages can repeat content)
 *   --no-shots          run the checks only, no image files
 *   paths               site paths or full URLs (default "/")
 *
 * For each path × width: load, wait for network idle + document.fonts.ready, scroll to the bottom
 * in steps (lazy images, IntersectionObserver reveals), wait for images, scroll back to the top,
 * then take a full-page screenshot (stitched, see --mode). Printed per shot:
 *   ERROR  horizontal overflow (scrollWidth > innerWidth) + the elements that stick out
 *   ERROR  console errors / uncaught exceptions, failed requests and HTTP >= 400
 *   ERROR  <img> without alt
 *   warn   empty alt on an image that is not aria-hidden / role=presentation
 *   warn   tap targets smaller than 44×44 (phone widths) / 24×24 (desktop, WCAG 2.2 AA) —
 *          visible links/buttons; links inside running text are exempt
 *   warn   elements whose text overflows its box (clipped or spilling)
 * Exit code 1 if any page failed to load or any ERROR was found.
 */
import { mkdirSync, existsSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { spawnSync } from "node:child_process";
import puppeteer from "puppeteer";
import sharp from "sharp";

/* ───────────────────────── args ───────────────────────── */
const argv = process.argv.slice(2);
const VALUE_FLAGS = new Set(["--base", "--widths", "--out", "--format", "--wait", "--mode"]);
const opts = {};
const paths = [];
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--help" || a === "-h") {
    console.log("usage: npm run shoot -- [--base URL] [--widths 390,1440] [--out DIR] [--format jpg|png] [--wait MS] [--mode scroll|full] [--reduced-motion] [--motion] [--cookie-banner] [--no-shots] /path/ …");
    process.exit(0);
  }
  if (VALUE_FLAGS.has(a)) opts[a.slice(2)] = argv[++i];
  else if (a.includes("=") && VALUE_FLAGS.has(a.split("=")[0])) opts[a.split("=")[0].slice(2)] = a.slice(a.indexOf("=") + 1);
  else if (a.startsWith("--")) opts[a.slice(2)] = true;
  else paths.push(a);
}
const BASE = String(opts.base || "http://localhost:8080").replace(/\/+$/, "");
const WIDTHS = String(opts.widths || "390,1440").split(",").map((w) => parseInt(w, 10)).filter((w) => w >= 200 && w <= 4000);
const OUT = resolve(opts.out || ".qa/shots");
const FORMAT = opts.format === "png" ? "png" : "jpg";
const EXTRA_WAIT = Number(opts.wait ?? 400) || 0;
const SHOTS = !opts["no-shots"];
const MODE = opts.mode === "full" ? "full" : "scroll";
const FRAME_WAIT = 450; // ms per viewport frame: lets in-view reveals land before the capture
const MAX_HEIGHT = 30000; // CSS px; longer pages are cut (sharp/JPEG limits stay far away)
if (!paths.length) paths.push("/");
if (!WIDTHS.length) { console.error("--widths: no valid width (200–4000)"); process.exit(2); }

const MOBILE_UA =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36";

/* ───────────────────────── Chrome ───────────────────────── */
function ensureChrome() {
  let exe = "";
  try { exe = puppeteer.executablePath(); } catch { /* not installed */ }
  if (exe && existsSync(exe)) return;
  console.log("Chrome for Testing not found — running: npx puppeteer browsers install chrome");
  const r = spawnSync("npx", ["puppeteer", "browsers", "install", "chrome"], { stdio: "inherit" });
  if (r.status !== 0) { console.error("Chrome install failed."); process.exit(2); }
}

/* ───────────────────────── helpers ───────────────────────── */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const color = process.stdout.isTTY && !process.env.NO_COLOR;
const red = (s) => (color ? `\x1b[31m${s}\x1b[0m` : s);
const yel = (s) => (color ? `\x1b[33m${s}\x1b[0m` : s);
const grn = (s) => (color ? `\x1b[32m${s}\x1b[0m` : s);
const bold = (s) => (color ? `\x1b[1m${s}\x1b[0m` : s);

function toUrl(p) {
  if (/^https?:\/\//i.test(p)) return p;
  return BASE + (p.startsWith("/") ? p : "/" + p);
}
function slug(url) {
  const u = new URL(url);
  const s = (u.pathname + (u.search || "")).replace(/^\/+|\/+$/g, "").replace(/[^\w.\-֐-׿]+/g, "_");
  return s || "home";
}
const short = (s, n = 110) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

/* In-page probe: returns overflow offenders, image/tap/text issues. Runs in the browser. */
function probe(isPhone) {
  const vw = window.innerWidth;
  const de = document.documentElement;
  const describe = (el) => {
    let d = el.tagName.toLowerCase();
    if (el.id) d += "#" + el.id;
    const cls = (typeof el.className === "string" ? el.className : el.getAttribute("class") || "").trim().split(/\s+/).filter(Boolean);
    if (cls.length) d += "." + cls.slice(0, 3).join(".");
    const t = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("alt") || "").replace(/\s+/g, " ").trim();
    if (t) d += ` "${t.slice(0, 40)}${t.length > 40 ? "…" : ""}"`;
    return d;
  };
  const visible = (el, cs = getComputedStyle(el)) =>
    cs.display !== "none" && cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.01;
  const clipsX = (cs) => ["hidden", "clip", "auto", "scroll"].includes(cs.overflowX) || cs.contain.includes("paint");
  const fixedOrClipped = (el) => {
    for (let p = el; p && p !== de; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (cs.position === "fixed") return true;
      if (p !== el && clipsX(cs)) return true;
    }
    return false;
  };

  /* 1. horizontal overflow */
  const scrollWidth = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const overflow = [];
  if (scrollWidth > vw + 1) {
    const all = [...document.body.querySelectorAll("*")];
    const sticks = new Set();
    for (const el of all) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.right > vw + 1 || r.left < -1) {
        if (fixedOrClipped(el)) continue;
        sticks.add(el);
      }
    }
    // report the outermost offenders (their parent does not stick out) — those are the causes
    for (const el of sticks) {
      if (el.parentElement && sticks.has(el.parentElement)) continue;
      const r = el.getBoundingClientRect();
      overflow.push(`${describe(el)}  [left ${Math.round(r.left)}, right ${Math.round(r.right)}, width ${Math.round(r.width)}]`);
      if (overflow.length >= 10) break;
    }
  }

  /* 2. images */
  const noAlt = [];
  const emptyAlt = [];
  for (const img of document.images) {
    const src = (img.currentSrc || img.getAttribute("src") || "").replace(location.origin, "");
    const label = src.startsWith("data:") ? "data: URI" : src.slice(0, 90);
    if (!img.hasAttribute("alt")) noAlt.push(label);
    else if (!img.getAttribute("alt").trim()) {
      const role = (img.getAttribute("role") || "").toLowerCase();
      if (!img.closest('[aria-hidden="true"]') && role !== "presentation" && role !== "none") emptyAlt.push(label);
    }
  }

  /* 3. tap targets */
  const min = isPhone ? 44 : 24;
  const tap = [];
  const targets = document.querySelectorAll('a[href], button, [role="button"], input[type="checkbox"], input[type="radio"], input[type="submit"], select, summary');
  for (const el of targets) {
    const cs = getComputedStyle(el);
    if (!visible(el, cs) || el.closest('[aria-hidden="true"], [inert]')) continue;
    const r = el.getBoundingClientRect();
    if (r.width <= 2 || r.height <= 2) continue; // visually-hidden (skip link until focused)
    if (r.width >= min && r.height >= min) continue;
    // inline links inside running text are exempt (WCAG 2.5.5 / 2.5.8 "inline" exception)
    if (el.tagName === "A" && cs.display === "inline") {
      const block = el.parentElement && el.parentElement.closest("p, li, dd, td, figcaption, blockquote, label, span");
      const own = (el.textContent || "").trim().length;
      if (block && (block.textContent || "").trim().length > own + 3) continue;
    }
    tap.push(`${describe(el)}  ${Math.round(r.width)}×${Math.round(r.height)}`);
  }

  /* 4. text overflowing its box */
  const textOverflow = [];
  for (const el of document.body.querySelectorAll("*")) {
    if (["SCRIPT", "STYLE", "SVG", "svg", "IMG", "VIDEO", "CANVAS", "INPUT", "TEXTAREA", "SELECT", "IFRAME", "PICTURE"].includes(el.tagName)) continue;
    if (el.closest("svg")) continue; // SVG <text>/<tspan> has no meaningful scrollWidth
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim().length > 1);
    if (!hasText) continue;
    const cs = getComputedStyle(el);
    if (!visible(el, cs) || (cs.display.startsWith("inline") && cs.display !== "inline-block" && cs.display !== "inline-flex")) continue;
    if (el.clientWidth <= 2 || el.clientHeight <= 2) continue; // sr-only / collapsed
    const over = el.scrollWidth - el.clientWidth;
    if (over <= 1) continue;
    if (["auto", "scroll"].includes(cs.overflowX)) continue; // intentionally scrollable
    if (cs.webkitLineClamp && cs.webkitLineClamp !== "none") continue; // intentional clamp
    const clipped = clipsX(cs);
    textOverflow.push(`${describe(el)}  ${clipped ? "clipped" : "spills"} by ${over}px`);
    if (textOverflow.length >= 10) break;
  }

  return { scrollWidth, vw, height: de.scrollHeight, overflow, noAlt, emptyAlt, tap: tap.slice(0, 15), tapTotal: tap.length, textOverflow };
}

/**
 * Full-page capture by walking the page one viewport at a time and stitching the frames.
 * Why not puppeteer's fullPage: (1) phone captures taller than Chrome's 16384px texture limit
 * (DPR 2 → any page over ~8000 CSS px) come back with repeated content, and (2) capturing beyond
 * the viewport shows in-view animations in their "out of view" state. Walking the page shows
 * every section as a visitor sees it. Fixed elements (and sticky headers) are hidden after the
 * first frame so they do not repeat down the image.
 */
async function stitchedShot(page, file, dpr) {
  const { vh, vw, total } = await page.evaluate(() => ({
    vh: window.innerHeight,
    vw: window.innerWidth,
    total: Math.max(document.documentElement.scrollHeight, document.body ? document.body.scrollHeight : 0),
  }));
  const H = Math.min(total, MAX_HEIGHT);
  const frames = [];
  for (let y = 0, i = 0; y < H; y += vh, i++) {
    const top = Math.min(y, Math.max(0, total - vh)); // the last frame is aligned to the page bottom
    await page.evaluate((t) => window.scrollTo(0, t), top);
    if (i >= 1) {
      // hide fixed UI (header, floating buttons, progress bar, banners) — re-marked every frame
      // because some appear only after scrolling. Tall fixed elements (≥ half the viewport) are
      // pinned scroll scenes, not chrome, and stay visible. A !important rule survives re-renders.
      await page.evaluate(() => {
        if (!document.getElementById("qa-hide-fixed")) {
          const st = document.createElement("style");
          st.id = "qa-hide-fixed";
          st.textContent = "[data-qa-fixed]{visibility:hidden!important}";
          document.head.appendChild(st);
        }
        const vh = window.innerHeight;
        for (const el of document.body.querySelectorAll("*")) {
          const cs = getComputedStyle(el);
          const ui = cs.position === "fixed" || (cs.position === "sticky" && el.closest("header, nav, [role=banner]"));
          if (ui && el.getBoundingClientRect().height < vh * 0.5) el.setAttribute("data-qa-fixed", "");
        }
      });
    }
    await sleep(i === 0 ? 150 : FRAME_WAIT);
    const buf = await page.screenshot({ type: "png", captureBeyondViewport: false });
    // keep only the part of this frame that has not been captured yet
    const skip = y - top; // > 0 only on the bottom-aligned last frame
    const keep = Math.min(vh - skip, H - y);
    frames.push({ buf, skip, keep, y });
  }
  // undo the hiding (keeps the page sane if it is reused)
  await page.evaluate(() => {
    document.getElementById("qa-hide-fixed")?.remove();
    document.querySelectorAll("[data-qa-fixed]").forEach((el) => el.removeAttribute("data-qa-fixed"));
    window.scrollTo(0, 0);
  });

  const meta = await sharp(frames[0].buf).metadata();
  const width = Math.min(meta.width, Math.round(vw * dpr));
  const frameH = meta.height;
  const parts = [];
  for (const f of frames) {
    const top = Math.round(f.skip * dpr);
    const height = Math.min(Math.round(f.keep * dpr), frameH - top);
    if (height <= 0) continue;
    const input = await sharp(f.buf).extract({ left: 0, top, width, height }).toBuffer();
    parts.push({ input, top: Math.round(f.y * dpr), left: 0 });
  }
  const canvasH = Math.round(H * dpr);
  let img = sharp({ create: { width, height: canvasH, channels: 3, background: "#ffffff" } })
    .composite(parts.filter((p) => p.top < canvasH));
  img = FORMAT === "png" ? img.png() : img.jpeg({ quality: 85, mozjpeg: true });
  await img.toFile(file);
  return { capped: total > MAX_HEIGHT };
}

/* ───────────────────────── run ───────────────────────── */
ensureChrome();
if (SHOTS) mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({
  headless: true,
  protocolTimeout: 90000, // a stuck page fails that shot instead of hanging the run
  args: ["--hide-scrollbars", "--no-first-run", "--no-default-browser-check", "--disable-extensions", "--lang=he-IL"],
});

let totalErrors = 0;
let totalWarns = 0;
let failedLoads = 0;
const files = [];

try {
  for (const p of paths) {
    const url = toUrl(p);
    for (const width of WIDTHS) {
      const isPhone = width < 768;
      const tag = `${slug(url)}-w${width}`;
      // the 404 page answers with HTTP 404 on purpose
      const expect404 = /\/404(\.html|\/)?$/.test(new URL(url).pathname);
      // one retry when a dev-server reload (HMR) kills the page mid-shot
      for (let attempt = 0; attempt < 2; attempt++) {
      const page = await browser.newPage();
      const consoleErrors = [];
      const failed = [];
      page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text()); });
      page.on("pageerror", (e) => consoleErrors.push("uncaught: " + (e?.message || String(e)).split("\n")[0]));
      page.on("requestfailed", (r) => {
        const err = r.failure()?.errorText || "failed";
        if (err === "net::ERR_ABORTED" && /\.(mp4|webm|mov|m4v)(\?|$)/i.test(r.url())) return; // media range aborts are normal
        failed.push(`${err}  ${r.url().replace(BASE, "")}`);
      });
      page.on("response", (r) => {
        if (expect404 && r.status() === 404 && r.request().isNavigationRequest()) return;
        if (r.status() >= 400) failed.push(`HTTP ${r.status()}  ${r.url().replace(BASE, "")}`);
      });

      try {
        if (isPhone) await page.setUserAgent(MOBILE_UA);
        await page.setViewport({ width, height: isPhone ? 844 : 900, deviceScaleFactor: isPhone ? 2 : 1, isMobile: isPhone, hasTouch: isPhone });
        if (opts["reduced-motion"]) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
        else if (opts.motion) {
          // the boot script gates html.nz-motion on !navigator.webdriver — present a real browser
          await page.evaluateOnNewDocument(() => {
            Object.defineProperty(Navigator.prototype, "webdriver", { get: () => false, configurable: true });
          });
        }
        if (!opts["cookie-banner"]) {
          await page.evaluateOnNewDocument(() => {
            try { if (!localStorage.getItem("nz_web_cookie_consent")) localStorage.setItem("nz_web_cookie_consent", "declined"); } catch { /* blocked */ }
          });
        }

        const res = await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        if (!res || (res.status() >= 400 && !(expect404 && res.status() === 404))) throw new Error(`HTTP ${res ? res.status() : "no response"}`);
        await page.waitForNetworkIdle({ idleTime: 500, concurrency: 0, timeout: 15000 }).catch(() => {});
        await page.evaluate(() => document.fonts.ready.then(() => true));
        await sleep(EXTRA_WAIT);

        // walk the page: lazy images + reveal-on-scroll; the page may grow while we scroll
        await page.evaluate(async () => {
          const pause = (ms) => new Promise((r) => setTimeout(r, ms));
          const step = Math.max(200, Math.round(window.innerHeight * 0.6));
          let y = 0;
          for (let i = 0; i < 300; i++) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            if (y >= max) break;
            y = Math.min(y + step, max);
            window.scrollTo(0, y);
            await pause(140);
          }
          await pause(400);
        });
        await page.waitForNetworkIdle({ idleTime: 400, concurrency: 0, timeout: 15000 }).catch(() => {});
        await page.evaluate(() =>
          Promise.race([
            Promise.all([...document.images].filter((i) => !i.complete).map((i) => new Promise((r) => { i.onload = i.onerror = r; }))),
            new Promise((r) => setTimeout(r, 6000)),
          ]).then(() => true));
        await page.evaluate(() => window.scrollTo(0, 0));
        await sleep(1200); // let reveal transitions finish and the header settle at the top

        const info = await page.evaluate(probe, isPhone);

        let file = "";
        if (SHOTS) {
          file = join(OUT, `${tag}.${FORMAT}`);
          if (MODE === "full") {
            await page.screenshot({
              path: file,
              fullPage: true,
              captureBeyondViewport: true,
              type: FORMAT === "png" ? "png" : "jpeg",
              ...(FORMAT === "jpg" ? { quality: 85 } : {}),
            });
          } else {
            await stitchedShot(page, file, isPhone ? 2 : 1);
          }
          files.push(file);
        }

        /* report */
        const errs = [];
        const warns = [];
        if (info.scrollWidth > info.vw + 1) {
          errs.push(`horizontal overflow: scrollWidth ${info.scrollWidth} > ${info.vw}`);
          for (const o of info.overflow) errs.push("    ↳ " + o);
          if (!info.overflow.length) errs.push("    ↳ (no single element found — check fixed/transformed elements and 100vw widths)");
        }
        for (const c of [...new Set(consoleErrors)].slice(0, 10)) errs.push("console: " + short(c, 200));
        for (const f of [...new Set(failed)].slice(0, 10)) errs.push("request: " + short(f, 200));
        for (const s of info.noAlt) errs.push("img without alt: " + s);
        for (const s of info.emptyAlt) warns.push("empty alt, not aria-hidden: " + s);
        for (const t of info.tap) warns.push(`tap target < ${isPhone ? 44 : 24}px: ${t}`);
        if (info.tapTotal > info.tap.length) warns.push(`    … +${info.tapTotal - info.tap.length} more small tap targets`);
        for (const t of info.textOverflow) warns.push("text overflow: " + t);

        totalErrors += errs.filter((e) => !e.startsWith("    ")).length;
        totalWarns += warns.filter((w) => !w.startsWith("    ")).length;
        const where = file ? relative(process.cwd(), file) : "(no shot)";
        const status = errs.length ? red("✖") : warns.length ? yel("•") : grn("✓");
        console.log(`${status} ${bold(`${new URL(url).pathname} @${width}${isPhone ? " (phone)" : ""}`)}  height ${info.height}px  → ${where}`);
        for (const e of errs) console.log("    " + red("ERROR") + " " + e);
        for (const w of warns) console.log("    " + yel("warn ") + " " + w);
        break;
      } catch (e) {
        if (attempt === 0 && /Execution context was destroyed|detached|Target closed/i.test(e.message)) {
          console.log(`${yel("•")} ${bold(`${url} @${width}`)}  reloaded mid-shot (${short(e.message, 80)}), retrying once`);
          continue;
        }
        failedLoads++;
        console.log(`${red("✖")} ${bold(`${url} @${width}`)}  FAILED: ${e.message}`);
        for (const c of consoleErrors.slice(0, 5)) console.log("    console: " + short(c, 200));
      } finally {
        await page.close().catch(() => {});
      }
      }
    }
  }
} finally {
  await browser.close().catch(() => {});
}

console.log(
  `\n${paths.length} page(s) × ${WIDTHS.length} width(s): ` +
  `${failedLoads ? red(failedLoads + " failed to load, ") : ""}` +
  `${totalErrors ? red(totalErrors + " error(s)") : "0 errors"}, ${totalWarns} warning(s)` +
  (files.length ? `\nscreenshots in ${relative(process.cwd(), OUT) || OUT}/ — open and LOOK at them (playbook §1.1)` : ""),
);
process.exit(failedLoads || totalErrors ? 1 : 0);
