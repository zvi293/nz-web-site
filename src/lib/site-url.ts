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

export function getCanonicalUrl(pathname?: string, siteUrl?: string | null): string {
  const baseUrl = getResolvedSiteUrl(siteUrl);
  const path = pathname?.trim() || (canUseWindow() ? window.location.pathname : "/");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}
