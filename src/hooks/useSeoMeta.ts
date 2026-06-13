import { useEffect } from "react";
import { getCanonicalUrl, getResolvedOgImageUrl } from "@/lib/site-url";
import { useSiteSettings } from "@/lib/site-settings-api";

export interface SeoMetaOptions {
  title: string;
  description?: string;
  /**
   * @deprecated The `keywords` meta tag is ignored by Google and was removed
   * site-wide (it was stuffed and duplicated). This prop is accepted but no
   * longer rendered, so existing call sites keep working as a no-op.
   */
  keywords?: string;
  noindex?: boolean;
  /** Optional per-page Open Graph / Twitter image (absolute URL). Falls back to the site default. */
  ogImage?: string;
  /** JSON-LD schema object(s) — injected as <script type="application/ld+json"> */
  schema?: object | object[];
}

const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

/**
 * Sets per-route document title, meta description, robots directive,
 * self-canonical link, Open Graph, Twitter card, and optional JSON-LD schema.
 * Googlebot renders JavaScript and picks up these dynamic values.
 *
 * Note: the `keywords` meta tag is intentionally NOT set — it is ignored by
 * search engines and was removed site-wide.
 */
export function useSeoMeta({
  title,
  description,
  noindex = false,
  ogImage,
  schema,
}: SeoMetaOptions): void {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(window.location.pathname, settings.siteUrl);
    /* Per-page og:image when provided (e.g. a blog post's cover); else the site default. */
    const ogImageUrl =
      ogImage && /^https?:\/\//i.test(ogImage)
        ? ogImage
        : getResolvedOgImageUrl(settings.siteUrl, settings.seo.ogImage);

    /* ── Title ── */
    const prevTitle = document.title;
    document.title = title;

    /* ── Description ── */
    const descMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute("content") ?? null;
    if (descMeta && description) descMeta.setAttribute("content", description);

    /* ── Robots ── */
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevRobots = robotsMeta?.getAttribute("content") ?? null;
    if (robotsMeta && noindex) robotsMeta.setAttribute("content", "noindex, nofollow");

    /* ── Canonical ── */
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

    /* ── Open Graph + Twitter ── */
    const metaRecords = [
      { selector: 'meta[property="og:title"]',       attr: "property", key: "og:title",           value: title },
      { selector: 'meta[property="og:description"]', attr: "property", key: "og:description",      value: description ?? prevDesc ?? "" },
      { selector: 'meta[property="og:url"]',         attr: "property", key: "og:url",              value: canonicalUrl },
      { selector: 'meta[property="og:image"]',       attr: "property", key: "og:image",            value: ogImageUrl },
      { selector: 'meta[name="twitter:title"]',      attr: "name",     key: "twitter:title",       value: title },
      { selector: 'meta[name="twitter:description"]',attr: "name",     key: "twitter:description", value: description ?? prevDesc ?? "" },
      { selector: 'meta[name="twitter:image"]',      attr: "name",     key: "twitter:image",       value: ogImageUrl },
    ].map(({ selector, attr, key, value }) => {
      let element = document.querySelector<HTMLMetaElement>(selector);
      let created = false;
      const previous = element?.getAttribute("content") ?? null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attr, key);
        document.head.appendChild(element);
        created = true;
      }
      element.setAttribute("content", value);
      return { element, created, previous };
    });

    /* ── Page-specific JSON-LD schema ── */
    const schemaScriptId = `page-schema-${canonicalUrl.replace(/[^a-z0-9]/gi, "-")}`;
    let schemaEl: HTMLScriptElement | null = null;
    if (schema) {
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemaEl = document.createElement("script");
      schemaEl.type = "application/ld+json";
      schemaEl.id = schemaScriptId;
      schemaEl.textContent = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(schemaEl);
    }

    return () => {
      document.title = prevTitle;
      if (descMeta && prevDesc !== null) descMeta.setAttribute("content", prevDesc);
      if (robotsMeta) robotsMeta.setAttribute("content", prevRobots ?? DEFAULT_ROBOTS);

      if (createdCanonical) { canonicalEl?.remove(); }
      else if (canonicalEl && prevCanonicalHref !== null) canonicalEl.setAttribute("href", prevCanonicalHref);

      metaRecords.forEach(({ element, created, previous }) => {
        if (created) { element?.remove(); }
        else if (element && previous !== null) element.setAttribute("content", previous);
      });

      schemaEl?.remove();
    };
  }, [title, description, noindex, ogImage, schema, settings.seo.ogImage, settings.siteUrl]);
}
