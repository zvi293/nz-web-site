import { useEffect } from "react";

export interface BreadcrumbPage {
  name: string;
  path: string;
  /** Optional parent breadcrumb — adds a 3rd level (e.g. Services → Web Dev) */
  parent?: { name: string; path: string };
}

/**
 * Injects a BreadcrumbList JSON-LD script into document.head.
 * Supports 2-level (Home → Page) and 3-level (Home → Parent → Page) trails.
 * Google uses this to display breadcrumbs in search results (SERP).
 */
export function useBreadcrumb({ name, path, parent }: BreadcrumbPage): void {
  useEffect(() => {
    const origin = "https://nz-web.com";

    /* Breadcrumb item URLs must match the canonical (trailing-slash) form so
       they point at the 200 URL, never the 301-redirecting non-slash one. */
    const slash = (p: string) => {
      if (!p || p === "/") return "/";
      const clean = p.split(/[?#]/)[0].replace(/\/{2,}/g, "/");
      return clean.endsWith("/") ? clean : `${clean}/`;
    };

    const items: Array<{ "@type": string; position: number; name: string; item: string }> = [
      { "@type": "ListItem", position: 1, name: "דף הבית", item: `${origin}/` },
    ];

    if (parent) {
      items.push({ "@type": "ListItem", position: 2, name: parent.name, item: `${origin}${slash(parent.path)}` });
      items.push({ "@type": "ListItem", position: 3, name, item: `${origin}${slash(path)}` });
    } else {
      items.push({ "@type": "ListItem", position: 2, name, item: `${origin}${slash(path)}` });
    }

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = "breadcrumb-schema";
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items,
    });

    document.getElementById("breadcrumb-schema")?.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById("breadcrumb-schema")?.remove();
    };
  }, [name, path, parent]);
}
