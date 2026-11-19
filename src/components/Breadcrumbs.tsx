import "@/components/legal/floating-ui.css";
import { roomFor } from "@/components/nz/nav";

export interface Crumb {
  label: string;
  /** Omit on the current page — the last crumb is never a link. */
  href?: string;
}

interface BreadcrumbsProps {
  items: Crumb[];
  className?: string;
  /** The room number ("אולם 09"). Default: derived from `path` or the first crumb's href. */
  room?: number;
  /** This page's path, used to find its room. */
  path?: string;
  /** "ink" when the trail sits in a night room. */
  tone?: "bone" | "ink";
}

/**
 * Gallery wayfinding: "אולם 09 · דף הבית / מדיניות פרטיות".
 *
 * The visible twin of the BreadcrumbList JSON-LD (PageSeo.breadcrumb in the page frontmatter):
 * Google wants structured data to describe something the visitor can see. Static markup — in an
 * .astro page render it without a client directive (zero JS). "דף הבית" is prepended
 * automatically; callers pass only the trail below it.
 */
const Breadcrumbs = ({ items, className = "", room, path, tone }: BreadcrumbsProps) => {
  const crumbs: Crumb[] = [{ label: "דף הבית", href: "/" }, ...items];
  const number = room ?? roomFor(path ?? items.find((c) => c.href)?.href);

  return (
    <nav aria-label="מיקום באתר" className={`nzc-crumbs ${className}`} data-tone={tone}>
      {number !== undefined && (
        <span className="nzc-crumbs__room">
          <span className="nzc-crumbs__num">אולם {String(number).padStart(2, "0")}</span>
          <span className="nzc-crumbs__dot" aria-hidden="true" />
        </span>
      )}
      <ol className="nzc-crumbs__list">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="nzc-crumbs__item">
              {isLast || !crumb.href ? (
                <span aria-current={isLast ? "page" : undefined} className="nzc-crumbs__here">
                  {crumb.label}
                </span>
              ) : (
                <a href={crumb.href} className="nzc-crumbs__link">
                  {crumb.label}
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
