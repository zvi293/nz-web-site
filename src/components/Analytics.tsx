import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

/**
 * Loads Google Analytics 4 and the Meta (Facebook) Pixel.
 *
 * Privacy-respecting: trackers load ONLY after the visitor accepts cookies
 * (via the CookieConsent banner) AND only if the relevant ID is configured.
 *
 * Configure with environment variables (e.g. in Netlify → Site settings → Env):
 *   VITE_GA_ID        — Google Analytics 4 Measurement ID, e.g. "G-XXXXXXXXXX"
 *   VITE_FB_PIXEL_ID  — Meta (Facebook) Pixel ID, e.g. "123456789012345"
 *
 * If an ID is not set, that tracker is simply skipped — nothing breaks.
 */

const GA_ID = import.meta.env.VITE_GA_ID as string | undefined;
const FB_PIXEL_ID = import.meta.env.VITE_FB_PIXEL_ID as string | undefined;
const CONSENT_KEY = "nz_web_cookie_consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & {
      callMethod?: (...a: unknown[]) => void;
      queue?: unknown[];
      loaded?: boolean;
      version?: string;
      push?: unknown;
    };
    _fbq?: unknown;
  }
}

let injected = false;

function hasConsent(): boolean {
  try {
    return localStorage.getItem(CONSENT_KEY) === "accepted";
  } catch {
    return false;
  }
}

function injectTrackers(): void {
  if (injected || typeof document === "undefined") return;
  injected = true;

  /* ── Google Analytics 4 ── */
  if (GA_ID) {
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // GA expects the raw `arguments` object pushed onto the dataLayer.
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID);
  }

  /* ── Meta (Facebook) Pixel ── */
  if (FB_PIXEL_ID) {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    (function (f: any, b: Document, e: string, v: string) {
      if (f.fbq) return;
      const n: any = (f.fbq = function () {
        if (n.callMethod) {
          // eslint-disable-next-line prefer-spread, prefer-rest-params
          n.callMethod.apply(n, arguments);
        } else {
          // eslint-disable-next-line prefer-rest-params
          n.queue.push(arguments);
        }
      });
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      const t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      const s = b.getElementsByTagName(e)[0];
      s.parentNode!.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
    /* eslint-enable @typescript-eslint/no-explicit-any */

    window.fbq!("init", FB_PIXEL_ID);
    window.fbq!("track", "PageView");
  }
}

const Analytics = () => {
  const location = useLocation();
  const ready = useRef(false);
  const firstRun = useRef(true);

  /* Load trackers once consent is granted — on mount, and if consent changes later. */
  useEffect(() => {
    if (!GA_ID && !FB_PIXEL_ID) return;

    const tryInject = () => {
      if (hasConsent()) {
        injectTrackers();
        ready.current = true;
      }
    };

    tryInject();
    window.addEventListener("nz-consent-updated", tryInject);
    return () => window.removeEventListener("nz-consent-updated", tryInject);
  }, []);

  /* Report a page_view on each SPA route change (the first page is already
     reported by the trackers' own initialisation, so we skip the first run). */
  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    if (!ready.current) return;

    const pagePath = location.pathname + location.search;
    if (GA_ID && window.gtag) {
      window.gtag("event", "page_view", { page_path: pagePath });
    }
    if (FB_PIXEL_ID && window.fbq) {
      window.fbq("track", "PageView");
    }
  }, [location.pathname, location.search]);

  return null;
};

export default Analytics;
