/**
 * Loads Google Analytics 4 and the Meta (Facebook) Pixel — plain module, no React.
 * Called once per page load by src/scripts/global.ts (every page is a full document, so each
 * load is one page view; the trackers report it themselves on init).
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

/* IDs are validated before they go into a script URL (a typo or a stray character in the
   Netlify env var must never turn into an injected URL): GA4 "G-XXXXXXXXXX", Pixel = digits. */
const rawGa = ((import.meta.env.VITE_GA_ID as string | undefined) ?? "").trim();
const rawFb = ((import.meta.env.VITE_FB_PIXEL_ID as string | undefined) ?? "").trim();
const GA_ID = /^G-[A-Z0-9]{4,16}$/.test(rawGa) ? rawGa : undefined;
const FB_PIXEL_ID = /^\d{5,20}$/.test(rawFb) ? rawFb : undefined;
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
    tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`;
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

/**
 * Consent withdrawn (the visitor switched to "רק חיוניות" after accepting): tell the trackers
 * already running on this page to stop storing/sending, and delete the cookies they set
 * (_ga, _ga_<id>, _gid, _gat*, _fbp, _fbc) on this host and on the parent domain. The next page
 * load injects nothing (every page is a full document).
 */
function revokeTrackers(): void {
  if (injected) {
    /* Google's documented opt-out flag: stops every further gtag hit on this page (consent mode
       alone would keep sending cookieless pings until the next page load) */
    if (GA_ID) (window as unknown as Record<string, boolean>)[`ga-disable-${GA_ID}`] = true;
    window.gtag?.("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
    window.fbq?.("consent", "revoke");
  }
  try {
    const host = location.hostname;
    const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
    for (const raw of document.cookie.split(";")) {
      const name = raw.split("=")[0].trim();
      if (!/^(_ga(_.+)?|_gid|_gat(_.+)?|_fbp|_fbc)$/.test(name)) continue;
      for (const d of domains) {
        document.cookie = `${name}=; Max-Age=0; Path=/${d ? `; Domain=${d}` : ""}; SameSite=Lax`;
      }
    }
  } catch {
    /* cookies blocked — nothing was stored either */
  }
}

/** Inject the trackers now if consent was given, and again whenever the cookie banner records a choice. */
export function initAnalytics(): void {
  if (typeof window === "undefined" || (!GA_ID && !FB_PIXEL_ID)) return;
  const onChoice = () => {
    if (hasConsent()) injectTrackers();
    else revokeTrackers();
  };
  if (hasConsent()) injectTrackers();
  window.addEventListener("nz-consent-updated", onChoice);
}
