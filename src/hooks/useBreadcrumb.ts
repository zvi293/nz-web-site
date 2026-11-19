import { useEffect } from "react";
import { breadcrumb, type Crumb } from "@/lib/schema";
import { setPageJsonLd } from "@/hooks/useSeoMeta";

export interface BreadcrumbPage {
  name: string;
  path: string;
  /** Optional parent breadcrumb — adds a 3rd level (e.g. Services → Web Dev) */
  parent?: { name: string; path: string };
  /** Optional full middle trail (between דף הבית and this page) for deeper pages; overrides `parent`. */
  trail?: Crumb[];
}

/**
 * Adds a BreadcrumbList (@id <canonical>#breadcrumb) to the page's single JSON-LD @graph
 * (<script id="page-jsonld">, written together with useSeoMeta's nodes).
 * Trail: דף הבית → [parent | trail…] → this page. Item URLs use the trailing-slash canonical form.
 */
export function useBreadcrumb({ name, path, parent, trail }: BreadcrumbPage): void {
  const parentName = parent?.name;
  const parentPath = parent?.path;
  const trailKey = trail ? JSON.stringify(trail) : "";

  useEffect(() => {
    const middle: Crumb[] = trailKey
      ? JSON.parse(trailKey)
      : parentName && parentPath
        ? [{ name: parentName, path: parentPath }]
        : [];
    const items: Crumb[] = [{ name: "דף הבית", path: "/" }, ...middle, { name, path }];
    return setPageJsonLd("breadcrumb", [breadcrumb(items, path)]);
  }, [name, path, parentName, parentPath, trailKey]);
}
