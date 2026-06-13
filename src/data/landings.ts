/**
 * landings.ts — config-driven דף-נחיתה sub-pages under
 * /services/landing-page-development/<slug>/. Reuses the VerticalContent shape
 * and the shared ServicePageTemplate; only the parent hub + schema prefix differ.
 */
import type { ServicePageConfig } from "@/components/ServicePageTemplate";
import type { VerticalContent } from "@/data/verticals";
import { campaign } from "./landings/campaign";
import { leadGeneration } from "./landings/lead-generation";
import { trades } from "./landings/trades";

const BASE_URL = "https://nz-web.com";
const LP_HUB = { name: "דפי נחיתה", path: "/services/landing-page-development" } as const;

export const LANDINGS: Record<string, VerticalContent> = {
  [campaign.slug]: campaign,
  [leadGeneration.slug]: leadGeneration,
  [trades.slug]: trades,
};

/** Build a full ServicePageConfig from a landing slug (null if unknown). */
export function buildLandingConfig(slug: string): ServicePageConfig | null {
  const v = LANDINGS[slug];
  if (!v) return null;
  const path = `/services/landing-page-development/${v.slug}`;
  return {
    seo: v.seo,
    breadcrumb: { name: v.navName, path, parent: { name: LP_HUB.name, path: LP_HUB.path } },
    schemaId: `service-schema-lp-${v.slug}`,
    schemaServiceType: v.schemaServiceType,
    schemaUrl: `${BASE_URL}${path}`,
    hero: v.hero,
    intro: v.intro,
    deepDive: v.deepDive,
    whoFor: v.whoFor,
    features: v.features,
    process: v.process,
    results: v.results,
    faqs: v.faqs,
    cta: v.cta,
    image: v.image,
    relatedLinks: [
      { label: "כל סוגי דפי הנחיתה", href: `${LP_HUB.path}/` },
      ...v.related,
    ],
  };
}

/** All landing paths (trailing slash) — used by the hub page + prerender list. */
export const LANDING_PATHS = Object.values(LANDINGS).map(
  (v) => `/services/landing-page-development/${v.slug}/`,
);

/** List for the landing hub "types" links. */
export const LANDING_CARDS = Object.values(LANDINGS).map((v) => ({
  label: v.navName,
  href: `/services/landing-page-development/${v.slug}/`,
  desc: v.hero.badge,
}));
