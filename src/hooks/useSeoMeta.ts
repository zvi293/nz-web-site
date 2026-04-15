import { useEffect } from "react";
import { getCanonicalUrl, getResolvedOgImageUrl } from "@/lib/site-url";
import { useSiteSettings } from "@/lib/site-settings-api";

export interface SeoMetaOptions {
  title: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
  /** JSON-LD schema object(s) — injected as <script type="application/ld+json"> */
  schema?: object | object[];
}

const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

const BASE_KEYWORDS =
  "בניית אתרים, פיתוח אתרים, עיצוב אתרים, בניית אתר תדמית, בניית אתר אינטרנט, NZ-web";

/**
 * Sets per-route document title, meta description, keywords, robots directive,
 * self-canonical link, Open Graph, Twitter card, and optional JSON-LD schema.
 * Googlebot renders JavaScript and picks up these dynamic values.
 */
export function useSeoMeta({
  title,
  description,
  keywords,
  noindex = false,
  schema,
}: SeoMetaOptions): void {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(window.location.pathname, settings.siteUrl);
    const ogImageUrl = getResolvedOgImageUrl(settings.siteUrl, settings.seo.ogImage);
    const mergedKeywords = keywords
      ? `${keywords}, ${BASE_KEYWORDS}`
      : BASE_KEYWORDS;

    /* ── Title ── */
    const prevTitle = document.title;
    document.title = title;

    /* ── Description ── */
    const descMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute("content") ?? null;
    if (descMeta && description) descMeta.setAttribute("content", description);

    /* ── Keywords ── */
    let keywordsMeta = document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
    let createdKeywords = false;
    const prevKeywords = keywordsMeta?.getAttribute("content") ?? null;
    if (!keywordsMeta) {
      keywordsMeta = document.createElement("meta");
      keywordsMeta.setAttribute("name", "keywords");
      document.head.appendChild(keywordsMeta);
      createdKeywords = true;
    }
    keywordsMeta.setAttribute("content", mergedKeywords);

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

      if (createdKeywords) { keywordsMeta?.remove(); }
      else if (keywordsMeta && prevKeywords !== null) keywordsMeta.setAttribute("content", prevKeywords);

      if (createdCanonical) { canonicalEl?.remove(); }
      else if (canonicalEl && prevCanonicalHref !== null) canonicalEl.setAttribute("href", prevCanonicalHref);

      metaRecords.forEach(({ element, created, previous }) => {
        if (created) { element?.remove(); }
        else if (element && previous !== null) element.setAttribute("content", previous);
      });

      schemaEl?.remove();
    };
  }, [title, description, keywords, noindex, schema, settings.seo.ogImage, settings.siteUrl]);
}
