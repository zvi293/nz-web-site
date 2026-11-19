import { useEffect } from "react";
import { getCanonicalUrl, getResolvedOgImageUrl, OG_IMAGE_SIZE, DEFAULT_OG_IMAGE, DEFAULT_OG_IMAGE_ALT } from "@/lib/site-url";
import { buildGraph, webPage, type JsonLdNode } from "@/lib/schema";
import { siteSettings as settings } from "@/content/site-settings";

export interface SeoArticleMeta {
  /** ISO 8601 (e.g. post.published_at). */
  publishedTime: string;
  /** ISO 8601 (e.g. post.updated_at ?? post.published_at). */
  modifiedTime?: string;
  section?: string;
  tags?: string[];
}

export interface SeoMetaOptions {
  title: string;
  description?: string;
  /**
   * @deprecated The `keywords` meta tag is ignored by Google and was removed
   * site-wide. Accepted so existing call sites keep compiling; never rendered.
   */
  keywords?: string;
  /** robots "noindex, follow"; also suppresses the automatic WebPage node. */
  noindex?: boolean;
  /** Per-page Open Graph / Twitter image (absolute URL, or root-relative). See OG_IMAGES. */
  ogImage?: string;
  /** Hebrew alt text for the social card (og:image:alt + twitter:image:alt). */
  ogImageAlt?: string;
  /** Pixel size of a custom ogImage. Cards from OG_IMAGES are known to be 1200x630. */
  ogImageWidth?: number;
  ogImageHeight?: number;
  /** og:type = article + article:published_time / modified_time / section / tag. */
  article?: SeoArticleMeta;
  /**
   * Page JSON-LD nodes from src/lib/schema.ts (webPage(), service(), faqPage(), article()…).
   * Merged with `schema` and the breadcrumb into ONE <script id="page-jsonld"> @graph.
   * Memoise it: compared by reference.
   */
  jsonLd?: JsonLdNode[];
  /** @deprecated Legacy: JSON-LD object(s) with their own @context. Still supported, merged into the graph. */
  schema?: object | object[];
}

const DEFAULT_ROBOTS = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const NOINDEX_ROBOTS = "noindex, follow";
/** Marks <meta> tags created at runtime, so a pre-rendered copy is recognised and removed on leave. */
const OWNED = "data-nz-seo";

/* ── One JSON-LD script per page ─────────────────────────────────────────────────────────────
   useSeoMeta and useBreadcrumb each register their nodes under a key; every change rewrites the
   single <script type="application/ld+json" id="page-jsonld">. Entries carry a token so a page
   that unmounts AFTER the next page mounted (route transitions) cannot remove the new page's data. */
const PAGE_JSONLD_ID = "page-jsonld";
const registry = new Map<string, { token: symbol; nodes: unknown[] }>();

function flushPageJsonLd() {
  const nodes = [...registry.entries()]
    .sort(([a], [b]) => (a === "page" ? -1 : b === "page" ? 1 : a.localeCompare(b)))
    .flatMap(([, entry]) => entry.nodes);
  document.getElementById(PAGE_JSONLD_ID)?.remove();
  if (nodes.length === 0) return;
  const el = document.createElement("script");
  el.type = "application/ld+json";
  el.id = PAGE_JSONLD_ID;
  el.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": buildGraph(nodes) });
  document.head.appendChild(el);
}

/** Registers JSON-LD nodes for the current page under `key`; returns the cleanup. */
export function setPageJsonLd(key: string, nodes: unknown[]): () => void {
  const token = Symbol(key);
  registry.set(key, { token, nodes });
  flushPageJsonLd();
  return () => {
    if (registry.get(key)?.token !== token) return;
    registry.delete(key);
    flushPageJsonLd();
  };
}

/* ── <meta> helpers ─────────────────────────────────────────────────────────────────────── */
interface MetaRecord {
  element: HTMLMetaElement | null;
  /** Created at runtime (or a pre-rendered runtime copy): removed on leave. */
  owned: boolean;
  /** A static index.html tag taken out for this page (e.g. og:image:width for a cover of unknown
      size): put back on leave. */
  detached: boolean;
  previous: string | null;
  value: string | null;
}

function setMeta(attr: "name" | "property", key: string, value: string | null): MetaRecord {
  let element = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  const previous = element?.getAttribute("content") ?? null;
  let owned = element?.hasAttribute(OWNED) ?? false;
  if (value === null) {
    if (!element) return { element: null, owned: false, detached: false, previous: null, value: null };
    element.remove();
    return owned
      ? { element: null, owned: false, detached: false, previous: null, value: null }
      : { element, owned: false, detached: true, previous, value: null };
  }
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attr, key);
    element.setAttribute(OWNED, "");
    document.head.appendChild(element);
    owned = true;
  }
  element.setAttribute("content", value);
  return { element, owned, detached: false, previous, value };
}

function restoreMeta({ element, owned, detached, previous, value }: MetaRecord) {
  if (!element) return;
  if (owned) {
    element.remove();
    return;
  }
  if (detached) {
    const attr = element.hasAttribute("name") ? "name" : "property";
    const taken = document.head.querySelector(`meta[${attr}="${element.getAttribute(attr)}"]`);
    if (!element.isConnected && !taken) document.head.appendChild(element);
    return;
  }
  /* Only restore if nobody (the next page) changed it since. */
  if (previous !== null && element.getAttribute("content") === value) element.setAttribute("content", previous);
}

function imageType(url: string): string | null {
  const path = url.split(/[?#]/)[0].toLowerCase();
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".avif")) return "image/avif";
  return null;
}

/**
 * Per-route <head>: title, description, robots, self-canonical, Open Graph, Twitter card,
 * article times, and the page's JSON-LD @graph (see src/lib/schema.ts for the builders).
 * Pre-rendered pages arrive with all of this baked in; hydration rewrites the same values.
 */
export function useSeoMeta({
  title,
  description,
  noindex = false,
  ogImage,
  ogImageAlt,
  ogImageWidth,
  ogImageHeight,
  article,
  jsonLd,
  schema,
}: SeoMetaOptions): void {
  const articleKey = article ? JSON.stringify(article) : "";

  /* ── Head tags ── */
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(window.location.pathname, settings.siteUrl);
    const ogImageUrl =
      ogImage && /^https?:\/\//i.test(ogImage)
        ? ogImage
        : getResolvedOgImageUrl(settings.siteUrl, ogImage || settings.seo.ogImage);
    const isGeneratedCard = /\/og\/[a-z0-9-]+\.jpg$/i.test(ogImageUrl);
    const width = ogImageWidth ?? (isGeneratedCard ? OG_IMAGE_SIZE.width : undefined);
    const height = ogImageHeight ?? (isGeneratedCard ? OG_IMAGE_SIZE.height : undefined);
    /* Alt: explicit > the default card's own alt > the page title for a per-page card > none. */
    const alt =
      ogImageAlt ?? (ogImageUrl === DEFAULT_OG_IMAGE ? DEFAULT_OG_IMAGE_ALT : isGeneratedCard ? title : null);
    const art: SeoArticleMeta | null = articleKey ? JSON.parse(articleKey) : null;

    const prevTitle = document.title;
    document.title = title;

    /* Canonical */
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    let createdCanonical = false;
    const prevCanonicalHref = canonicalEl?.getAttribute("href") ?? null;
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalEl);
      createdCanonical = true;
    }
    canonicalEl.setAttribute("href", canonicalUrl);

    const prevDesc = document.head.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";
    const desc = description ?? prevDesc;

    const records: MetaRecord[] = [
      setMeta("name", "description", desc),
      setMeta("name", "robots", noindex ? NOINDEX_ROBOTS : DEFAULT_ROBOTS),
      setMeta("property", "og:type", art ? "article" : "website"),
      setMeta("property", "og:title", title),
      setMeta("property", "og:description", desc),
      setMeta("property", "og:url", canonicalUrl),
      setMeta("property", "og:image", ogImageUrl),
      setMeta("property", "og:image:width", width ? String(width) : null),
      setMeta("property", "og:image:height", height ? String(height) : null),
      setMeta("property", "og:image:type", imageType(ogImageUrl)),
      setMeta("property", "og:image:alt", alt),
      setMeta("name", "twitter:title", title),
      setMeta("name", "twitter:description", desc),
      setMeta("name", "twitter:image", ogImageUrl),
      setMeta("name", "twitter:image:alt", alt),
      setMeta("property", "article:published_time", art?.publishedTime ?? null),
      setMeta("property", "article:modified_time", art ? art.modifiedTime ?? art.publishedTime : null),
      setMeta("property", "article:section", art?.section ?? null),
      setMeta("property", "article:author", art ? "https://nz-web.com/about/" : null),
    ];

    /* article:tag can repeat — runtime-owned, rebuilt each time. */
    document.head.querySelectorAll(`meta[property="article:tag"][${OWNED}]`).forEach((el) => el.remove());
    const tagEls = (art?.tags ?? []).map((tag) => {
      const el = document.createElement("meta");
      el.setAttribute("property", "article:tag");
      el.setAttribute("content", tag);
      el.setAttribute(OWNED, "");
      document.head.appendChild(el);
      return el;
    });

    return () => {
      if (document.title === title) document.title = prevTitle;
      if (createdCanonical) canonicalEl?.remove();
      else if (canonicalEl && prevCanonicalHref !== null && canonicalEl.getAttribute("href") === canonicalUrl)
        canonicalEl.setAttribute("href", prevCanonicalHref);
      records.forEach(restoreMeta);
      tagEls.forEach((el) => el.remove());
    };
  }, [title, description, noindex, ogImage, ogImageAlt, ogImageWidth, ogImageHeight, articleKey]);

  /* ── JSON-LD @graph ── */
  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(window.location.pathname, settings.siteUrl);
    const legacy = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
    const nodes: unknown[] = [...(jsonLd ?? []), ...legacy];
    const hasWebPage = buildGraph(nodes).some((n) => n["@id"] === `${canonicalUrl}#webpage`);
    if (!noindex && !hasWebPage) {
      nodes.unshift(webPage({ path: window.location.pathname, title, description }));
    }
    if (noindex && nodes.length === 0) return setPageJsonLd("page", []);
    return setPageJsonLd("page", nodes);
  }, [jsonLd, schema, noindex, title, description]);
}
