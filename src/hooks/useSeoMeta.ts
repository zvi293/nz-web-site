import { useEffect } from "react";
import { getCanonicalUrl } from "@/lib/site-url";

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
  useEffect(() => {
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
    canonicalEl.setAttribute("href", getCanonicalUrl(window.location.pathname));

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
    };
  }, [title, description, noindex]);
}
