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
 *  6. Cookie link  — the footer's "הגדרות עוגיות" ([data-cookie-settings]) reopens the cookie card
 *                    on the current page instead of navigating to /privacy/#cookie-settings.
 *  7. Chip rows    — a focused chip in a sideways-scrolling row is scrolled into view.
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

/* ── 6. Cookie settings link ───────────────────────────────────────────────── */
/* CookieConsent hydrates on idle: if the card is not open right after the click, the request is
   repeated briefly (as CookieChoice does), then focus moves to the card's first choice. */
document.querySelectorAll<HTMLAnchorElement>("a[data-cookie-settings]").forEach((link) => {
  link.setAttribute("aria-haspopup", "dialog");
  link.addEventListener("click", (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    /* after a choice the card closes: focus comes back to this link, not to <body> (WCAG 2.4.3) */
    window.addEventListener(
      "nz-consent-updated",
      () => {
        const active = document.activeElement;
        const dlg = document.querySelector("dialog.nzc-cookies");
        if (!active || active === document.body || dlg?.contains(active)) link.focus({ preventScroll: true });
      },
      { once: true },
    );
    const ask = () => window.dispatchEvent(new Event("nz:cookies-open"));
    ask();
    let tries = 0;
    const settle = () => {
      const dlg = document.querySelector<HTMLDialogElement>("dialog.nzc-cookies");
      if (dlg?.open && !dlg.hasAttribute("data-phase")) {
        dlg.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
        return;
      }
      if (++tries > 25) {
        window.location.assign(link.href); /* no card on this page: go to the settings box */
        return;
      }
      if (tries % 3 === 0) ask();
      window.setTimeout(settle, 200);
    };
    window.setTimeout(settle, 60);
  });
});

/* ── 7. Scrolling chip rows ────────────────────────────────────────────────── */
/* The article's "מה בפנים" row scrolls sideways on phones; Chrome does not scroll a partly
   visible chip into view on focus, so a Tab stop could sit mostly under the edge fade
   (WCAG 2.4.7 / 2.4.11). The row's scroll-padding keeps it clear of the fade. */
document.querySelectorAll<HTMLElement>(".ar-inside__row").forEach((row) => {
  row.addEventListener("focusin", (e) => {
    const chip = e.target instanceof Element ? e.target.closest(".ar-chip") : null;
    chip?.scrollIntoView({ inline: "nearest", block: "nearest" });
  });
});
