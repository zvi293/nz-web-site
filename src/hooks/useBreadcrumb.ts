import { useEffect } from "react";

export interface BreadcrumbPage {
  /** Display name for this page in the breadcrumb trail */
  name: string;
  /** Absolute path, e.g. "/about" */
  path: string;
}

/**
 * Injects a two-level BreadcrumbList JSON-LD script into document.head.
 * Position 1 is always the homepage; position 2 is the current page.
 * Uses window.location.origin for the base URL so it resolves correctly
 * on any deployment without hardcoding a domain.
 */
export function useBreadcrumb({ name, path }: BreadcrumbPage): void {
  useEffect(() => {
    const origin = window.location.origin;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "breadcrumb-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "דף הבית",
          item: origin + "/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name,
          item: origin + path,
        },
      ],
    });

    document.getElementById("breadcrumb-schema")?.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById("breadcrumb-schema")?.remove();
    };
  }, [name, path]);
}
