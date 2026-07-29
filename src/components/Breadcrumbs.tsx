import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

export interface Crumb {
  label: string;
  /** Omit on the current page — the last crumb is never a link. */
  href?: string;
}

/**
 * Visible breadcrumb trail.
 *
 * The site already emits BreadcrumbList JSON-LD (see `useBreadcrumb`), but
 * Google's guidance is that structured data should describe something the
 * visitor can actually see. This renders that same trail, and gives deep pages
 * a cheap, descriptive internal link back up the hierarchy.
 *
 * "דף הבית" is prepended automatically — callers pass only the trail below it.
 */
const Breadcrumbs = ({ items, className = "" }: { items: Crumb[]; className?: string }) => {
  const crumbs: Crumb[] = [{ label: "דף הבית", href: "/" }, ...items];

  return (
    <nav aria-label="מיקום בתוך האתר" className={`mb-6 ${className}`} dir="rtl">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-muted-foreground md:text-sm">
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${crumb.label}-${i}`} className="flex items-center gap-1.5">
              {i > 0 && <ChevronLeft aria-hidden="true" className="h-3 w-3 shrink-0 opacity-50" />}
              {isLast || !crumb.href ? (
                <span aria-current="page" className="font-semibold text-foreground">
                  {crumb.label}
                </span>
              ) : (
                <Link to={crumb.href} className="transition-colors hover:text-primary">
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
