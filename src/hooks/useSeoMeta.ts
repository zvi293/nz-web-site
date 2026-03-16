import { useEffect } from "react";
import { getCanonicalUrl } from "@/lib/site-url";
import { useSiteSettings } from "@/lib/site-settings-api";

export interface SeoMetaOptions {
  title: string;
  description?: string;
  noindex?: boolean;
}

const DEFAULT_ROBOTS =
  "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

/**
 * Sets per-route document title, meta description, robots directive,
 * and self-canonical link for CSR SEO.
 * Googlebot renders JavaScript and picks up these dynamic values.
 */
export function useSeoMeta({ title, description, noindex = false }: SeoMetaOptions): void {
  const { settings } = useSiteSettings();

  useEffect(() => {
    const canonicalUrl = getCanonicalUrl(window.location.pathname, settings.siteUrl);
    const ogImageUrl = settings.seo.ogImage;

    // --- Title ---
    const prevTitle = document.title;
    document.title = title;

    // --- Meta Description ---
    const descMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDesc = descMeta?.getAttribute("content") ?? null;
    if (descMeta && description) {
      descMeta.setAttribute("content", description);
    }

    // --- Robots ---
    const robotsMeta = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const prevRobots = robotsMeta?.getAttribute("content") ?? null;
    if (robotsMeta && noindex) {
      robotsMeta.setAttribute("content", "noindex, nofollow");
    }

    // --- Self-Canonical ---
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

    const metaRecords = [
      { selector: 'meta[property="og:title"]', attr: "property", key: "og:title", value: title },
      { selector: 'meta[property="og:description"]', attr: "property", key: "og:description", value: description ?? prevDesc ?? "" },
      { selector: 'meta[property="og:url"]', attr: "property", key: "og:url", value: canonicalUrl },
      { selector: 'meta[property="og:image"]', attr: "property", key: "og:image", value: ogImageUrl },
      { selector: 'meta[name="twitter:title"]', attr: "name", key: "twitter:title", value: title },
      { selector: 'meta[name="twitter:description"]', attr: "name", key: "twitter:description", value: description ?? prevDesc ?? "" },
      { selector: 'meta[name="twitter:image"]', attr: "name", key: "twitter:image", value: ogImageUrl },
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

    return () => {
      document.title = prevTitle;
      if (descMeta && prevDesc !== null) {
        descMeta.setAttribute("content", prevDesc);
      }
      if (robotsMeta) {
        robotsMeta.setAttribute("content", prevRobots ?? DEFAULT_ROBOTS);
      }
      if (createdCanonical) {
        canonicalEl?.remove();
      } else if (canonicalEl && prevCanonicalHref !== null) {
        canonicalEl.setAttribute("href", prevCanonicalHref);
      }

      metaRecords.forEach(({ element, created, previous }) => {
        if (created) {
          element?.remove();
        } else if (element && previous !== null) {
          element.setAttribute("content", previous);
        }
      });
    };
  }, [title, description, noindex, settings.seo.ogImage, settings.siteUrl]);
}
