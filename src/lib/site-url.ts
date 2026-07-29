const DEFAULT_SITE_URL = "https://nz-web.com";
const OG_IMAGE_PATH = "/og-image.png";
const ALLOWED_OG_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp"];
const NON_OG_ASSET_PATHS = new Set([
  "/nz-web-logo.png",
  "/favicon.ico",
  "/favicon.svg",
  "/favicon-16x16.png",
  "/favicon-32x32.png",
  "/favicon-48x48.png",
  "/apple-touch-icon.png",
  "/android-chrome-192x192.png",
  "/android-chrome-512x512.png",
]);

function canUseWindow() {
  return typeof window !== "undefined" && typeof window.location?.origin === "string";
}

export function normalizeSiteUrl(input?: string | null): string {
  const value = input?.trim();

  if (!value) {
    return "";
  }

  try {
    const normalized = new URL(value).origin;
    return normalized.replace(/\/$/, "");
  } catch {
    return "";
  }
}

export function getEnvSiteUrl(): string {
  return normalizeSiteUrl(import.meta.env.VITE_SITE_URL) || DEFAULT_SITE_URL;
}

export function getResolvedSiteUrl(siteUrl?: string | null): string {
  return normalizeSiteUrl(siteUrl) || getEnvSiteUrl() || (canUseWindow() ? window.location.origin : DEFAULT_SITE_URL);
}

export function isAllowedOgImageUrl(value?: string | null): boolean {
  const input = value?.trim();

  if (!input) {
    return false;
  }

  try {
    const url = input.startsWith("/")
      ? new URL(input, getEnvSiteUrl())
      : new URL(input);

    return ALLOWED_OG_EXTENSIONS.some((extension) => url.pathname.toLowerCase().endsWith(extension));
  } catch {
    return false;
  }
}

export function getResolvedOgImageUrl(siteUrl?: string | null, ogImage?: string | null): string {
  const baseUrl = getResolvedSiteUrl(siteUrl);
  const input = ogImage?.trim();

  if (!input) {
    return `${baseUrl}${OG_IMAGE_PATH}`;
  }

  if (!isAllowedOgImageUrl(input)) {
    return `${baseUrl}${OG_IMAGE_PATH}`;
  }

  try {
    const resolved = new URL(input, `${baseUrl}/`);

    if (resolved.origin === baseUrl && NON_OG_ASSET_PATHS.has(resolved.pathname)) {
      return `${baseUrl}${OG_IMAGE_PATH}`;
    }

    return resolved.toString();
  } catch {
    return `${baseUrl}${OG_IMAGE_PATH}`;
  }
}

/**
 * Promotes a bundled asset path ("/assets/cover-a1b2.webp") to an absolute URL.
 *
 * Vite rewrites imported images to a root-relative hashed path. That is fine in
 * `<img src>`, but Open Graph and schema.org both require absolute URLs — a
 * relative one is silently dropped by Google and by every social scraper.
 */
export function getAbsoluteAssetUrl(path?: string | null): string {
  const value = path?.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("data:") || value.startsWith("blob:")) return "";
  return `${getEnvSiteUrl()}${value.startsWith("/") ? value : `/${value}`}`;
}

/**
 * Normalises an ABSOLUTE url to the canonical trailing-slash form.
 *
 * Every URL the site publishes — canonicals, breadcrumb items, schema `url`
 * fields — must be the exact address that answers 200. Netlify 301-redirects
 * `/services` → `/services/`, so a slash-less URL in structured data points at a
 * redirect and weakens the signal.
 */
export function withTrailingSlash(url: string): string {
  if (!url) return url;
  const [base, ...rest] = url.split(/([?#])/);
  const suffix = rest.join("");
  if (/\.[a-z0-9]{2,5}$/i.test(base)) return url; // a file, not a route
  return base.endsWith("/") ? `${base}${suffix}` : `${base}/${suffix}`;
}

/**
 * Builds the self-referential canonical URL for a route.
 *
 * The site is served with a forced TRAILING SLASH (Netlify redirects
 * `/services` → `/services/` with a 301). The canonical must therefore always
 * carry a trailing slash so it points at the exact URL that returns 200 — never
 * at a URL that redirects. We strip any query string / hash (only the clean
 * path is canonical) and collapse accidental double slashes.
 */
export function getCanonicalUrl(pathname?: string, siteUrl?: string | null): string {
  const baseUrl = getResolvedSiteUrl(siteUrl);
  const raw = pathname?.trim() || (canUseWindow() ? window.location.pathname : "/");

  // keep only the path portion — drop ?query and #hash
  let path = raw.split(/[?#]/)[0];
  if (!path.startsWith("/")) path = `/${path}`;
  path = path.replace(/\/{2,}/g, "/"); // collapse // → /

  // force a single trailing slash (root "/" already has one)
  if (!path.endsWith("/")) path = `${path}/`;

  return `${baseUrl}${path}`;
}
