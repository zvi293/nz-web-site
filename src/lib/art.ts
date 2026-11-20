/**
 * The art collection — single source for every artwork on the site.
 *
 *   getArt("brushstroke-cube") → { slug, title, alt, width, height, color, lqip, tone,
 *                                  avifSrcSet, webpSrcSet, src }
 *
 * Files: src/assets/art/<slug>-{320,640,828,1080,1600}.{avif,webp} (built by `npm run art`).
 * Metadata: src/content/art-manifest.json (title + alt in Hebrew, dominant colour, LQIP).
 * Render it with <Artwork slug="…" /> from "@/components/art" — never a bare <img>.
 */

export interface ArtMeta {
  width: number;
  height: number;
  color: string;
  lqip: string;
  tone: "light" | "dark";
  title: string;
  alt: string;
}

export interface Art extends ArtMeta {
  slug: string;
  avifSrcSet: string;
  webpSrcSet: string;
  /** Fallback src (WebP, 1080w). */
  src: string;
  /** Largest file's real width (the "1600" file is capped at the source width). */
  maxWidth: number;
}

const manifestModule = import.meta.glob("/src/content/art-manifest.json", { eager: true, import: "default" });
const manifest = (Object.values(manifestModule)[0] ?? {}) as Record<string, ArtMeta>;

const files = import.meta.glob("/src/assets/art/*.{avif,webp}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

const WIDTHS = [320, 640, 828, 1080, 1600] as const;
const cache = new Map<string, Art>();

function fileUrl(slug: string, w: number, ext: "avif" | "webp"): string | undefined {
  return files[`/src/assets/art/${slug}-${w}.${ext}`];
}

/** All slugs in the collection. */
export const artSlugs: string[] = Object.keys(manifest);

export function hasArt(slug: string | undefined | null): slug is string {
  return !!slug && slug in manifest;
}

/** Returns the artwork for a slug. Unknown slugs fall back to the hero piece (and warn in dev). */
export function getArt(slug: string): Art {
  const hit = cache.get(slug);
  if (hit) return hit;
  let meta = manifest[slug];
  let key = slug;
  if (!meta) {
    if (import.meta.env.DEV) console.warn(`[art] unknown slug "${slug}" — falling back to brushstroke-cube`);
    key = "brushstroke-cube";
    meta = manifest[key];
  }
  const maxWidth = Math.min(1600, meta.width);
  const descriptor = (w: number) => (w === 1600 ? maxWidth : Math.min(w, meta.width));
  const set = (ext: "avif" | "webp") =>
    WIDTHS.map((w) => {
      const url = fileUrl(key, w, ext);
      return url ? `${url} ${descriptor(w)}w` : null;
    })
      .filter(Boolean)
      .join(", ");
  const art: Art = {
    ...meta,
    slug: key,
    avifSrcSet: set("avif"),
    webpSrcSet: set("webp"),
    src: fileUrl(key, 1080, "webp") ?? fileUrl(key, 640, "webp") ?? "",
    maxWidth,
  };
  cache.set(slug, art);
  return art;
}

/**
 * Attributes for a `<link rel="preload" as="image">` of an LCP artwork (AVIF — the
 * format every browser that honours `imagesrcset` preloads also decodes).
 * Use with `usePreloadArt` (Artwork's `priority` does this automatically).
 */
export function getArtPreloadAttrs(slug: string, sizes: string) {
  const art = getArt(slug);
  return {
    rel: "preload",
    as: "image",
    type: "image/avif",
    imagesrcset: art.avifSrcSet,
    imagesizes: sizes,
    fetchpriority: "high",
  } as const;
}

/**
 * Injects (once) a preload link for an LCP artwork into <head> at runtime — a fallback only.
 * The real preload is printed at build time by BaseLayout (PageSeo.lcpArt, same id
 * "nz-preload-<slug>"), so this finds it and does nothing.
 */
export function preloadArt(slug: string, sizes: string): void {
  if (typeof document === "undefined") return;
  const id = `nz-preload-${slug}`;
  if (document.getElementById(id)) return;
  const attrs = getArtPreloadAttrs(slug, sizes);
  const link = document.createElement("link");
  link.id = id;
  Object.entries(attrs).forEach(([k, v]) => link.setAttribute(k, v));
  document.head.appendChild(link);
}

/** Warms the browser cache for an artwork (e.g. the next exhibit) without rendering it. */
export function prefetchArt(slug: string, sizes: string): void {
  if (typeof window === "undefined") return;
  const art = getArt(slug);
  const img = new Image();
  img.decoding = "async";
  img.sizes = sizes;
  // AVIF — the same candidate the <picture> will pick in every current browser,
  // so the later render is a cache hit instead of a second download.
  img.srcset = art.avifSrcSet;
}
