/**
 * Floating chrome helpers — the WhatsApp bead, the accessibility bead and the cookie sheet.
 *
 *  probeCovers(rect, kinds, ignore)   samples a 3×3 grid of points inside `rect` with
 *                                     document.elementsFromPoint() and says whether the floating
 *                                     element would sit on text, a form field, a tap target, or
 *                                     ("avoid") the text of a block marked [data-float-avoid]
 *                                     (key facts that must never be covered).
 *  watchWhileScrolling(fn)            runs `fn` ~10×/s only while the page is scrolling (+ once
 *                                     after it settles, on resize, and once the first screen has
 *                                     settled: fonts loaded, page loaded, entrance animations
 *                                     done — so a bead that lands on key facts at load moves
 *                                     without waiting for a scroll). Not an animation driver:
 *                                     the beads only flip a class; CSS does the motion.
 *  setSheetLift(px)                   the cookie sheet publishes its height as --nz-sheet-h on
 *                                     <html>, so the corner beads ride above it on phones.
 *
 * Every floating element carries [data-nz-float] so the probes never "see" each other.
 */

export type CoverKind = "text" | "field" | "target" | "avoid";

const FIELD_SEL = 'input:not([type="hidden"]), select, textarea, [contenteditable="true"]';
const TARGET_SEL =
  'a[href], button, summary, label, [role="button"], [role="link"], [role="switch"], [role="tab"], [tabindex]:not([tabindex="-1"])';

function onText(el: Element, x: number, y: number): boolean {
  const range = document.createRange();
  for (const node of Array.from(el.childNodes)) {
    if (node.nodeType !== Node.TEXT_NODE || !node.textContent?.trim()) continue;
    range.selectNodeContents(node);
    for (const r of Array.from(range.getClientRects())) {
      if (x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 2 && y <= r.bottom + 2) return true;
    }
  }
  return false;
}

/** What the rect would cover (first hit wins), or null when the spot is clear. */
export function probeCovers(rect: DOMRect, kinds: CoverKind[], inset = 4): CoverKind | null {
  if (typeof document === "undefined" || !document.elementsFromPoint) return null;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const xs = [rect.left + inset, rect.left + rect.width / 2, rect.right - inset];
  const ys = [rect.top + inset, rect.top + rect.height / 2, rect.bottom - inset];
  for (const y of ys) {
    for (const x of xs) {
      if (x < 0 || y < 0 || x >= vw || y >= vh) continue;
      const hit = document.elementsFromPoint(x, y).find((el) => !el.closest("[data-nz-float]"));
      if (!hit || hit === document.documentElement || hit === document.body) continue;
      if (kinds.includes("field") && hit.closest(FIELD_SEL)) return "field";
      const target = hit.closest(TARGET_SEL);
      if (kinds.includes("target") && target && target !== document.body && !target.matches("main, [id='main-content']")) return "target";
      if (kinds.includes("avoid") && hit.closest("[data-float-avoid]") && onText(hit, x, y)) return "avoid";
      if (kinds.includes("text") && onText(hit, x, y)) return "text";
    }
  }
  return null;
}

/** Calls `fn` about 10×/s while scrolling, once when scrolling settles, on resize, and a few
 *  times while the first screen settles (fonts, load, entrance animations). */
export function watchWhileScrolling(fn: () => void, hz = 10): () => void {
  let timer = 0;
  let idle = 0;
  let live = true;
  const settle = [1200, 2400].map((ms) => window.setTimeout(() => live && fn(), ms));
  const onLoad = () => live && fn();
  document.fonts?.ready.then(onLoad).catch(() => {});
  if (document.readyState !== "complete") window.addEventListener("load", onLoad, { once: true });
  const period = Math.round(1000 / hz);
  const tick = () => fn();
  const onScroll = () => {
    if (!timer) {
      tick();
      timer = window.setInterval(tick, period);
    }
    window.clearTimeout(idle);
    idle = window.setTimeout(() => {
      window.clearInterval(timer);
      timer = 0;
      tick();
    }, 180);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  return () => {
    live = false;
    settle.forEach((t) => window.clearTimeout(t));
    window.removeEventListener("load", onLoad);
    window.removeEventListener("scroll", onScroll);
    window.removeEventListener("resize", onScroll);
    window.clearInterval(timer);
    window.clearTimeout(idle);
  };
}

/** The cookie sheet's height (0 when closed) → --nz-sheet-h on <html>. */
export function setSheetLift(px: number): void {
  const root = document.documentElement;
  if (px > 0) root.style.setProperty("--nz-sheet-h", `${Math.ceil(px)}px`);
  else root.style.removeProperty("--nz-sheet-h");
}

/** True when any "primary" call to action would sit inside `zone` (viewport coordinates):
 *  a kit button, anything marked [data-cta], or any WhatsApp / phone link in <main>. */
export function ctaInZone(zone: { top: number; left: number; right: number; bottom: number }): boolean {
  const ctas = document.querySelectorAll<HTMLElement>(
    'main .nz-btn, main [data-cta], main a[href^="https://wa.me"], main a[href^="tel:"]',
  );
  for (const el of Array.from(ctas)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.bottom > zone.top && r.top < zone.bottom && r.right > zone.left && r.left < zone.right) return true;
  }
  return false;
}

/** True while the header's own WhatsApp pill is rendered (it is on every width except a very
 *  narrow / zoomed header, where the menu carries the CTA). */
export function headerWhatsAppVisible(): boolean {
  return Array.from(document.querySelectorAll<HTMLElement>(".nz-header__wa")).some(
    (el) => el.offsetWidth > 0 && el.offsetHeight > 0,
  );
}

/** True while a WhatsApp link inside <main> is on screen (an in-section CTA already offers it). */
export function whatsAppCtaInView(): boolean {
  const vh = window.innerHeight;
  const links = document.querySelectorAll<HTMLElement>('main a[href^="https://wa.me"], main a[href*="api.whatsapp.com"]');
  for (const el of Array.from(links)) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.bottom > 0 && r.top < vh) return true;
  }
  return false;
}
