/**
 * landings.ts — the דף-נחיתה sub-pages under /services/landing-page-development/<slug>/.
 * One static page per entry (src/pages/services/landing-page-development/[landing].astro,
 * getStaticPaths), built from the service system (src/components/service) + the page's own
 * section and signature (src/components/landings). Content: src/data/landings/*.ts.
 */
import { campaign } from "./landings/campaign";
import { leadGeneration } from "./landings/lead-generation";
import { trades } from "./landings/trades";
import type { LandingPage } from "./landings/types";

export type { LandingPage } from "./landings/types";

export const LANDINGS: Record<string, LandingPage> = {
  [campaign.slug]: campaign,
  [leadGeneration.slug]: leadGeneration,
  [trades.slug]: trades,
};

/** All landing paths (trailing slash). */
export const LANDING_PATHS = Object.values(LANDINGS).map((v) => v.path);

/** List for the landing hub "types" links: { label, href, desc, art }. */
export const LANDING_CARDS = Object.values(LANDINGS).map((v) => ({
  label: v.navName,
  href: v.path,
  desc: v.card,
  art: v.hero.art,
}));
