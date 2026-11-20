/**
 * "להרחבה": the guides (magazine articles) and glossary terms each commercial page points to, so
 * the money pages link back to the answers that support them (topical cluster + a citation path
 * for answer engines). Rendered by ServiceFaq (the side card, looked up by the page path) and by
 * the /faq/ answers (`more` in src/content/faq.ts uses the same helpers).
 * Names and titles are read from src/content/blog.ts and src/content/glossary.ts, never typed here.
 */
import { getBlogPost } from "@/lib/blog";
import { glossaryTerms } from "@/content/glossary";

export interface FurtherReading {
  /** blog slugs (/blog/<slug>/) */
  guides: string[];
  /** glossary term slugs (/glossary/#term-<slug>) */
  terms: string[];
}

const BUSINESS_SITE: FurtherReading = {
  guides: ["business-website-guide", "google-business-profile-guide"],
  terms: ["business-website", "google-business-profile"],
};
const BOOKING_SITE: FurtherReading = {
  guides: ["appointment-system-guide", "business-website-guide"],
  terms: ["appointment-system", "business-website"],
};
const LANDING: FurtherReading = { guides: ["landing-page-cost"], terms: ["landing-page", "cta", "conversion"] };

export const furtherReading: Record<string, FurtherReading> = {
  "/services/": { guides: ["5-things-before-building-website", "website-cost-2026"], terms: ["web-spec", "seo"] },
  "/services/web-development/": {
    guides: ["5-things-before-building-website", "website-cost-2026"],
    terms: ["web-spec", "responsive"],
  },
  "/services/website-development/": {
    guides: ["website-cost-2026", "react-vs-wordpress-2026"],
    terms: ["web-spec", "crm", "cms"],
  },
  "/services/react-development/": { guides: ["react-vs-wordpress-2026"], terms: ["react", "cms"] },
  "/services/website-performance/": {
    guides: ["website-speed-fix"],
    terms: ["core-web-vitals", "lcp", "inp", "cls", "ttfb"],
  },
  "/services/appointment-system/": { guides: ["appointment-system-guide"], terms: ["appointment-system", "crm"] },
  "/services/business-website/": {
    guides: ["business-website-guide", "business-website-or-online-store"],
    terms: ["business-website", "online-store"],
  },
  "/services/business-website/accountant/": BUSINESS_SITE,
  "/services/business-website/architect/": BUSINESS_SITE,
  "/services/business-website/consultant/": BUSINESS_SITE,
  "/services/business-website/contractor/": BUSINESS_SITE,
  "/services/business-website/real-estate/": BUSINESS_SITE,
  "/services/business-website/lawyer/": {
    guides: ["business-website-guide", "website-accessibility-israel"],
    terms: ["business-website", "israeli-standard-5568"],
  },
  "/services/business-website/beauty/": BOOKING_SITE,
  "/services/business-website/clinic/": {
    guides: ["appointment-system-guide", "website-accessibility-israel"],
    terms: ["appointment-system", "israeli-standard-5568"],
  },
  "/services/landing-pages/": LANDING,
  "/services/landing-page-development/": LANDING,
  "/services/landing-page-development/campaign/": { guides: ["landing-page-cost"], terms: ["landing-page", "conversion"] },
  "/services/landing-page-development/lead-generation/": { guides: ["landing-page-cost"], terms: ["lead", "cta"] },
  "/services/landing-page-development/trades/": {
    guides: ["landing-page-cost", "google-business-profile-guide"],
    terms: ["landing-page", "cta"],
  },
};

export interface ResolvedLink {
  href: string;
  label: string;
}

const norm = (path: string) => (path.endsWith("/") ? path : `${path}/`);

/** The guides and terms for a page path, resolved to real titles / names (unknown slugs throw at build). */
export function resolveFurther(spec: FurtherReading): { guides: ResolvedLink[]; terms: ResolvedLink[] } {
  const guides = spec.guides.map((slug) => {
    const post = getBlogPost(slug);
    if (!post) throw new Error(`further-reading: unknown article "${slug}"`);
    return { href: `/blog/${post.slug}/`, label: post.title };
  });
  const terms = spec.terms.map((slug) => {
    const term = glossaryTerms.find((t) => t.slug === slug);
    if (!term) throw new Error(`further-reading: unknown glossary term "${slug}"`);
    return { href: `/glossary/#term-${term.slug}`, label: term.name };
  });
  return { guides, terms };
}

export function furtherFor(path: string) {
  const spec = furtherReading[norm(path)];
  return spec ? resolveFurther(spec) : null;
}
