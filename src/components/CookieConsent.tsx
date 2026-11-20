import { useCallback, useEffect, useRef, useState } from "react";
import "@/components/legal/floating-ui.css";
import { ctaInZone, setSheetLift } from "@/components/legal/floating";

const COOKIE_CONSENT_KEY = "nz_web_cookie_consent";
const COOKIE_PREFERENCES_KEY = "nz_web_cookie_preferences";
/** Reopen the card from anywhere (e.g. the privacy page): window.dispatchEvent(new Event(...)). */
export const COOKIE_REOPEN_EVENT = "nz:cookies-open";

/** Breathing room kept clear above a primary CTA (px). */
const CTA_CLEARANCE = 12;

type Phase = "idle" | "measure" | "open";

/**
 * Cookie consent — a slim floating card (global chrome — BaseLayout: <CookieConsent client:idle />).
 *
 *  - Shows once, on the first visit, and records the choice in localStorage
 *    ("nz_web_cookie_consent" = accepted | declined, "nz_web_cookie_preferences" = JSON) — the keys
 *    src/lib/analytics.ts and scripts/qa/shoot.mjs rely on. "nz-consent-updated" tells the tracker
 *    loader the choice changed. Until a visitor accepts, no tracker loads at all.
 *  - Accept and decline are the same size and the same style (consent that can only be given
 *    is not consent — GDPR / Israel's Privacy Protection Law), 44px tall. Escape (focus inside
 *    the card) = "רק חיוניות", the privacy-preserving choice.
 *  - Compact: one line of copy + two pills (~100px on a phone, one ~64px row on desktop, kept
 *    clear of the corner beads).
 *  - Never covers a primary call to action: the card is first laid out invisibly (phase
 *    "measure") so its REAL height is known (text zoom, long words), and it appears only when no
 *    CTA sits in that strip (+12px). Otherwise it waits and re-checks each time scrolling settles.
 *  - Never covers content for good: while open it publishes its height — --nz-cookie-h on <html>
 *    (the footer grows by that much, so the end of every page can be scrolled clear of it) and,
 *    on phones, --nz-sheet-h (the corner beads ride above it).
 *  - A non-modal <dialog> opened by its `open` attribute (not show(), which would move focus into
 *    it on page load): the page stays fully usable behind it and focus stays where it was.
 */
const CookieConsent = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  const ref = useRef<HTMLDialogElement>(null);

  const persist = useCallback((value: "accepted" | "declined") => {
    const optedIn = value === "accepted";
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value);
      localStorage.setItem(
        COOKIE_PREFERENCES_KEY,
        JSON.stringify({ essential: true, analytics: optedIn, marketing: optedIn }),
      );
    } catch {
      /* nothing to persist to — the card simply reappears next visit */
    }
    setPhase("idle");
    window.dispatchEvent(new Event("nz-consent-updated"));
  }, []);

  /* First visit: wait a beat, then lay the card out invisibly. */
  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;
    } catch {
      /* storage blocked (private mode / hardened browser) — ask anyway */
    }
    const start = window.setTimeout(() => setPhase("measure"), 1200);
    return () => window.clearTimeout(start);
  }, []);

  /* Measure → appear only where no CTA would be covered; otherwise re-check when scrolling settles. */
  useEffect(() => {
    if (phase !== "measure") return;
    const dlg = ref.current;
    if (!dlg) return;
    let timer = 0;
    const tryShow = () => {
      const r = dlg.getBoundingClientRect();
      const zone = { top: r.top - CTA_CLEARANCE, bottom: window.innerHeight, left: r.left, right: r.right };
      if (ctaInZone(zone)) return false;
      setPhase("open");
      return true;
    };
    if (tryShow()) return;
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tryShow, 250);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.clearTimeout(timer);
    };
  }, [phase]);

  /* Reopen on request (privacy page: "לשנות את הבחירה") — straight to open, the visitor asked. */
  useEffect(() => {
    const reopen = () => setPhase("open");
    window.addEventListener(COOKIE_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_REOPEN_EVENT, reopen);
  }, []);

  /* While open: publish the card's footprint (footer spacer everywhere, bead lift on phones).
     Measured on the <dialog> box, never on the card, whose entrance animation translates it. */
  useEffect(() => {
    const dlg = ref.current;
    const root = document.documentElement;
    const clear = () => {
      root.style.removeProperty("--nz-cookie-h");
      setSheetLift(0);
    };
    if (!dlg || phase !== "open") {
      clear();
      return;
    }
    const measure = () => {
      const r = dlg.getBoundingClientRect();
      const footprint = Math.max(0, window.innerHeight - r.top); // card + its gap to the bottom edge
      root.style.setProperty("--nz-cookie-h", `${Math.ceil(footprint)}px`);
      setSheetLift(window.innerWidth < 768 ? footprint : 0);
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(dlg);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      clear();
    };
  }, [phase]);

  const open = phase !== "idle";

  return (
    <dialog
      ref={ref}
      open={open}
      className="nzc-cookies"
      data-phase={phase === "measure" ? "measure" : undefined}
      aria-labelledby="nz-cookies-title"
      aria-describedby="nz-cookies-text"
      data-nz-float=""
      data-a11y-exclude="true"
      onCancel={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key === "Escape" && phase === "open") {
          e.preventDefault();
          persist("declined");
        }
      }}
    >
      <div className="nzc-cookies__card">
        <p id="nz-cookies-title" className="nz-sr">
          הסכמה לעוגיות
        </p>
        <p id="nz-cookies-text" className="nzc-cookies__text">
          <span className="nzc-cube" aria-hidden="true" />
          <span>
            עוגיות מדידה נטענות רק באישור.{" "}
            <a href="/privacy/#cookies" className="nzc-cookies__more" tabIndex={phase === "open" ? undefined : -1}>
              מה זה אומר
            </a>
          </span>
        </p>
        <div className="nzc-cookies__actions">
          <button
            type="button"
            className="nzc-pill"
            tabIndex={phase === "open" ? undefined : -1}
            onClick={() => persist("accepted")}
          >
            לאשר הכול
          </button>
          <button
            type="button"
            className="nzc-pill"
            tabIndex={phase === "open" ? undefined : -1}
            onClick={() => persist("declined")}
          >
            רק חיוניות
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CookieConsent;
