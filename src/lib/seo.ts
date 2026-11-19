/**
 * seo.ts — the page <head>, computed at BUILD time (Astro frontmatter → BaseLayout props).
 *
 * Every src/pages/*.astro passes one `PageSeo` object to <BaseLayout seo={…}>. BaseLayout calls
 * resolveHead() and prints: <title>, description, robots, self-canonical (absolute, trailing
 * slash), Open Graph + Twitter, article:* times, the optional LCP image preload, and ONE
 * <script type="application/ld+json"> {"@context","@graph":[site stubs + page nodes]}.
 * Nothing touches <head> at runtime (islands never do).
 *
 *   ---
 *   import BaseLayout from "@/layouts/BaseLayout.astro";
 *   import { webPage, service, faqPage, OG_IMAGES } from "@/lib/schema";
 *   const PATH = "/services/";
 *   const title = "…| NZ-web", description = "…";
 *   const seo = {
 *     path: PATH, title, description, ogImage: OG_IMAGES.services,
 *     lcpArt: { slug: "darkroom-glow", sizes: "(min-width: 1024px) 50vw, 100vw" },
 *     breadcrumb: { name: "שירותים", path: PATH },
 *     jsonLd: [webPage({ path: PATH, title, description, speakable: true }), faqPage(items, PATH)],
 *   };
 *   ---
 *   <BaseLayout seo={seo}> … </BaseLayout>
 */
import { getArt } from "@/lib/art";
import { buildGraph, breadcrumb as breadcrumbNode, imageObject, pageUrl, webPage, type Crumb, type JsonLdNode } from "@/lib/schema";
import { SITE_GRAPH } from "@/lib/site-graph";
import { DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT, OG_IMAGE_SIZE, getResolvedOgImageUrl } from "@/lib/site-url";

export const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
export const NOINDEX_ROBOTS = "noindex, follow";
const SITE_URL = "https://nz-web.com";

export interface SeoArticleMeta {
  /** ISO 8601 (e.g. post.published_at). */
  publishedTime: string;
  /** ISO 8601 (e.g. post.updated_at ?? post.published_at). */
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface BreadcrumbInput {
  /** This page's crumb. */
  name: string;
  path: string;
  /** Optional parent (adds a 3rd level, e.g. שירותים → פיתוח React). */
  parent?: Crumb;
  /** Optional full middle trail (between דף הבית and this page); overrides `parent`. */
  trail?: Crumb[];
}

export interface PageSeo {
  /** Site path of the page ("/services/" — the trailing slash is added if missing). */
  path: string;
  /** ≤ 60 chars, primary keyword first, ending "| NZ-web". */
  title: string;
  /** 140–160 chars, unique. */
  description?: string;
  /** robots "noindex, follow"; also: no automatic WebPage node, left out of the sitemap. */
  noindex?: boolean;
  /** false = no <link rel=canonical> / og:url (the 404 page, which answers on any URL). */
  canonical?: false;
  /** Social card: a key of OG_IMAGES (absolute URL) or a root-relative / absolute image URL. */
  ogImage?: string;
  ogImageAlt?: string;
  ogImageWidth?: number;
  ogImageHeight?: number;
  /** og:type=article + article:* tags. */
  article?: SeoArticleMeta;
  /** Page JSON-LD nodes from src/lib/schema.ts. A plain WebPage is added if none is given. */
  jsonLd?: unknown[];
  /** BreadcrumbList (דף הבית → … → this page). */
  breadcrumb?: BreadcrumbInput;
  /**
   * The LCP artwork. Emits <link rel="preload" as="image" imagesrcset imagesizes
   * fetchpriority="high"> (AVIF) so the hero starts downloading before CSS/JS. `sizes` must be
   * the SAME string the <Artwork priority sizes=…> uses, or the browser fetches twice.
   */
  lcpArt?: { slug: string; sizes: string };
  /** Non-art LCP image (e.g. a blog cover): plain preload by URL. */
  lcpImage?: { href: string; srcset?: string; sizes?: string; type?: string };
}

export interface ResolvedHead {
  title: string;
  description: string;
  /** Absolute canonical URL, or null when the page opts out (404). */
  canonical: string | null;
  robots: string;
  og: {
    type: "website" | "article";
    url: string | null;
    title: string;
    description: string;
    image: string;
    imageWidth?: number;
    imageHeight?: number;
    imageType?: string;
    imageAlt?: string;
  };
  article?: SeoArticleMeta;
  preload?: { id: string; href?: string; imagesrcset?: string; imagesizes?: string; type?: string };
  /** Serialised {"@context","@graph"} — safe to print inside <script type="application/ld+json">. */
  jsonLd: string;
}

const DEFAULT_DESCRIPTION =
  "NZ-web מעצבת ובונה אתרים לעסקים בישראל: אתרי תדמית, דפי נחיתה ומערכות לקביעת תורים, בקוד שנכתב לכל לקוח, עם נגישות, מהירות ו-SEO כחלק מהעבודה.";

function imageType(url: string): string | undefined {
  const path = url.split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".avif")) return "image/avif";
  return undefined;
}

/** JSON for an inline <script>: "</script>" and U+2028/9 can never break out of the element. */
export function safeJson(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/[\u2028]/g, "\\u2028")
    .replace(/[\u2029]/g, "\\u2029");
}

/** A licensed ImageObject for the page's hero artwork (id <canonical>#primaryimage). */
export function heroImage(slug: string, path: string): JsonLdNode {
  const art = getArt(slug);
  return imageObject(slug, art.src, { path, variant: 1080 });
}

export function resolveHead(seo: PageSeo): ResolvedHead {
  const canonical = pageUrl(seo.path);
  const description = seo.description ?? DEFAULT_DESCRIPTION;

  /* ── Open Graph image ── */
  const ogImage =
    seo.ogImage && /^https?:\/\//i.test(seo.ogImage) ? seo.ogImage : getResolvedOgImageUrl(SITE_URL, seo.ogImage);
  const isGeneratedCard = /\/og\/[a-z0-9-]+\.jpg$/i.test(ogImage);
  const imageWidth = seo.ogImageWidth ?? (isGeneratedCard ? OG_IMAGE_SIZE.width : undefined);
  const imageHeight = seo.ogImageHeight ?? (isGeneratedCard ? OG_IMAGE_SIZE.height : undefined);
  const imageAlt =
    seo.ogImageAlt ?? (ogImage === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : isGeneratedCard ? seo.title : undefined);

  /* ── JSON-LD: site stubs + page nodes (+ WebPage if missing) + breadcrumb ── */
  const nodes: unknown[] = [...SITE_GRAPH, ...(seo.jsonLd ?? [])];
  const hasWebPage = buildGraph(nodes).some((n) => n["@id"] === `${canonical}#webpage`);
  if (!seo.noindex && !hasWebPage) {
    nodes.splice(SITE_GRAPH.length, 0, webPage({ path: seo.path, title: seo.title, description: seo.description }));
  }
  if (seo.breadcrumb) {
    const { name, path, parent, trail } = seo.breadcrumb;
    const middle: Crumb[] = trail ?? (parent ? [parent] : []);
    nodes.push(breadcrumbNode([{ name: "דף הבית", path: "/" }, ...middle, { name, path }], path));
  }
  const jsonLd = safeJson({ "@context": "https://schema.org", "@graph": buildGraph(nodes) });

  /* ── LCP preload ── */
  let preload: ResolvedHead["preload"];
  if (seo.lcpArt) {
    const art = getArt(seo.lcpArt.slug);
    preload = {
      id: `nz-preload-${art.slug}`,
      imagesrcset: art.avifSrcSet,
      imagesizes: seo.lcpArt.sizes,
      type: "image/avif",
    };
  } else if (seo.lcpImage) {
    preload = {
      id: "nz-preload-lcp",
      href: seo.lcpImage.href,
      imagesrcset: seo.lcpImage.srcset,
      imagesizes: seo.lcpImage.sizes,
      type: seo.lcpImage.type,
    };
  }

  return {
    title: seo.title,
    description,
    canonical: seo.canonical === false ? null : canonical,
    robots: seo.noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS,
    og: {
      type: seo.article ? "article" : "website",
      url: seo.canonical === false ? null : canonical,
      title: seo.title,
      description,
      image: ogImage,
      imageWidth,
      imageHeight,
      imageType: imageType(ogImage),
      imageAlt,
    },
    article: seo.article,
    preload,
    jsonLd,
  };
}
