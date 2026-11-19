import { useCallback, useEffect, useRef, useState } from "react";
import "@/components/legal/floating-ui.css";
import { ctaInZone, setSheetLift } from "@/components/legal/floating";

const COOKIE_CONSENT_KEY = "nz_web_cookie_consent";
const COOKIE_PREFERENCES_KEY = "nz_web_cookie_preferences";
/** Reopen the sheet from anywhere (e.g. the privacy page): window.dispatchEvent(new Event(...)). */
export const COOKIE_REOPEN_EVENT = "nz:cookies-open";

/**
 * Cookie consent — a slim bone/ink sheet (global chrome — BaseLayout: <CookieConsent client:idle />).
 *
 *  - Shows once, on the first visit, and records the choice in localStorage
 *    ("nz_web_cookie_consent" = accepted | declined, "nz_web_cookie_preferences" = JSON) — the keys
 *    src/lib/analytics.ts and scripts/qa/shoot.mjs rely on. "nz-consent-updated" tells the tracker
 *    loader the choice changed. Until a visitor accepts, no tracker loads at all.
 *  - Accept and decline are the same size and the same style (consent that can only be given
 *    is not consent — GDPR / Israel's Privacy Protection Law), 44px tall.
 *  - Never covers a primary call to action: it waits while a CTA sits in the bottom zone of the
 *    first screen and appears once that zone is clear (or after the first scroll moves it away).
 *    While open on a phone it publishes its height (--nz-sheet-h) so the corner beads ride above it.
 *  - A non-modal <dialog> opened by its `open` attribute (not show(), which would move focus into
 *    it on page load): the page stays fully usable behind it and focus stays where it was.
 */
const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
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
      /* nothing to persist to — the sheet simply reappears next visit */
    }
    setVisible(false);
    window.dispatchEvent(new Event("nz-consent-updated"));
  }, []);

  /* First visit: wait a beat, then appear — but never on top of a primary CTA. */
  useEffect(() => {
    try {
      if (localStorage.getItem(COOKIE_CONSENT_KEY)) return;
    } catch {
      /* storage blocked (private mode / hardened browser) — ask anyway */
    }
    let done = false;
    let timer = 0;
    const zone = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const phone = vw < 768;
      const w = phone ? vw : Math.min(720, vw - 48);
      const left = phone ? 0 : (vw - w) / 2;
      return { top: vh - (phone ? 170 : 130), bottom: vh, left, right: left + w };
    };
    const tryShow = () => {
      if (done) return;
      if (ctaInZone(zone())) return;
      done = true;
      setVisible(true);
      cleanup();
    };
    const onScroll = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(tryShow, 250);
    };
    const cleanup = () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
    const start = window.setTimeout(() => {
      tryShow();
      if (!done) window.addEventListener("scroll", onScroll, { passive: true });
    }, 1200);
    return () => {
      window.clearTimeout(start);
      cleanup();
    };
  }, []);

  /* Reopen on request (privacy page: "לשנות את הבחירה"). */
  useEffect(() => {
    const reopen = () => setVisible(true);
    window.addEventListener(COOKIE_REOPEN_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_REOPEN_EVENT, reopen);
  }, []);

  /* Open/close the non-modal dialog and publish its height for the beads. */
  useEffect(() => {
    const dlg = ref.current;
    if (!dlg) return;
    if (!visible) {
      setSheetLift(0);
      return;
    }
    const measure = () => setSheetLift(window.innerWidth < 768 ? dlg.getBoundingClientRect().height : 0);
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(dlg);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
      setSheetLift(0);
    };
  }, [visible]);

  return (
    <dialog
      ref={ref}
      open={visible}
      className="nzc-cookies"
      aria-labelledby="nz-cookies-title"
      aria-describedby="nz-cookies-text"
      data-nz-float=""
      data-a11y-exclude="true"
      onCancel={(e) => e.preventDefault()}
    >
      <div className="nzc-cookies__card">
        <p id="nz-cookies-title" className="nzc-cookies__title">
          <span className="nzc-cube" aria-hidden="true" />
          עוגיות
        </p>
        <p id="nz-cookies-text" className="nzc-cookies__text">
          עוגיות חיוניות שומרות את ההגדרות שלכם. עוגיות מדידה נטענות רק אם תאשרו.{" "}
          <a href="/privacy/#collected" className="nzc-cookies__more">
            מה זה אומר
          </a>
        </p>
        <div className="nzc-cookies__actions">
          <button type="button" className="nzc-pill" onClick={() => persist("accepted")}>
            לאשר הכול
          </button>
          <button type="button" className="nzc-pill" onClick={() => persist("declined")}>
            רק חיוניות
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default CookieConsent;
