/**
 * Global page behaviour — bundled by Astro into ONE small external module (BaseLayout imports
 * it with a plain <script>), so it runs on every page, static or not, without React.
 *
 *  1. Motion gate  — initMotionGate() keeps html.nz-motion in sync with prefers-reduced-motion
 *                    and the a11y widget's pause (the class itself is set before first paint by
 *                    the tiny inline boot script in BaseLayout, so nothing flashes).
 *  2. Reveal       — every [data-reveal] (the kit's <Reveal>) gets [data-in] when it scrolls into
 *                    view. Works for static Astro HTML and for elements islands render later.
 *  3. Art loaded   — <Artwork>/<FramedImage> images mark their .nz-art wrapper .is-loaded when they
 *                    finish loading (fades the LQIP out). Islands do this themselves too; this
 *                    covers server-rendered, non-hydrated artwork.
 *  4. Skip link    — "דלג לתוכן הראשי" moves focus into <main> (not only the scroll position).
 *  5. Analytics    — GA4 / Meta Pixel, only after cookie consent (src/lib/analytics.ts).
 *
 * Keep it tiny: no framework, no libraries, no scroll listeners.
 */
import { initMotionGate } from "@/lib/motion";
import { initAnalytics } from "@/lib/analytics";

initMotionGate();
initAnalytics();

/* ── 2. Reveal ─────────────────────────────────────────────────────────────── */
const DEFAULT_MARGIN = "0px 0px -8% 0px";
const observers = new Map<string, IntersectionObserver>();
const seen = new WeakSet<Element>();

function observerFor(margin: string): IntersectionObserver {
  let io = observers.get(margin);
  if (!io) {
    io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-in", "");
          obs.unobserve(entry.target);
        }
      },
      { rootMargin: margin, threshold: 0 },
    );
    observers.set(margin, io);
  }
  return io;
}

function watchReveal(el: Element) {
  if (seen.has(el) || el.hasAttribute("data-in")) return;
  seen.add(el);
  if (typeof IntersectionObserver === "undefined") {
    el.setAttribute("data-in", "");
    return;
  }
  observerFor(el.getAttribute("data-reveal-margin") || DEFAULT_MARGIN).observe(el);
}

/* ── 3. Art loaded ─────────────────────────────────────────────────────────── */
function markLoaded(img: Element) {
  img.closest(".nz-art")?.classList.add("is-loaded");
}

function checkImage(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth > 0) markLoaded(img);
}

/* One capturing listener catches every image load (load does not bubble, but it is captured). */
document.addEventListener(
  "load",
  (e) => {
    const t = e.target as Element | null;
    if (t instanceof HTMLImageElement && t.classList.contains("nz-art__img")) markLoaded(t);
  },
  true,
);

function scan(root: ParentNode) {
  root.querySelectorAll("[data-reveal]").forEach(watchReveal);
  root.querySelectorAll<HTMLImageElement>(".nz-art__img").forEach(checkImage);
}

scan(document);

/* Islands hydrate (and some render new nodes) after this runs — pick those up. */
new MutationObserver((records) => {
  for (const r of records) {
    r.addedNodes.forEach((node) => {
      if (!(node instanceof Element)) return;
      if (node.matches("[data-reveal]")) watchReveal(node);
      if (node instanceof HTMLImageElement && node.classList.contains("nz-art__img")) checkImage(node);
      scan(node);
    });
  }
}).observe(document.body, { childList: true, subtree: true });

/* ── 4. Skip link ──────────────────────────────────────────────────────────── */
document.querySelector<HTMLAnchorElement>("a.nz-skip")?.addEventListener("click", (e) => {
  const main = document.getElementById("main-content");
  if (!main) return;
  e.preventDefault();
  main.setAttribute("tabindex", "-1");
  main.focus({ preventScroll: true });
  main.scrollIntoView();
});
