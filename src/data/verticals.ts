/**
 * verticals.ts — the 8 industry pages /services/business-website/<slug>/ (אתר תדמית לפי תחום).
 *
 * Each page is pure DATA in src/data/verticals/<slug>.ts (a `VerticalPage` = the service system's
 * ServicePageData + a section plan + its signature). ONE route renders them all:
 * src/pages/services/business-website/[vertical].astro (getStaticPaths over VERTICALS), with the
 * service sections (src/components/service) and the page's own signature island
 * (src/components/verticals). Adding a vertical = one data file + one entry below.
 *
 * Rules (SITE-PLAYBOOK): no prices, no packages, no invented numbers or testimonials; FAQ text is
 * unique site-wide and the FAQPage JSON-LD is built from the same `faqs` (serviceSeo()).
 * Hub-and-spoke: every vertical links up to the hub and across to siblings/services.
 */
import type { OpenerVariant, SectionTone, ServiceLink, ServicePageData } from "@/components/service/types";
import { lawyer } from "./verticals/lawyer";
import { accountant } from "./verticals/accountant";
import { realEstate } from "./verticals/real-estate";
import { clinic } from "./verticals/clinic";
import { architect } from "./verticals/architect";
import { consultant } from "./verticals/consultant";
import { beauty } from "./verticals/beauty";
import { contractor } from "./verticals/contractor";

export const VERTICALS_HUB = { name: "אתר תדמית לעסקים", path: "/services/business-website/" } as const;

interface SectionBase {
  tone?: SectionTone;
  opener?: OpenerVariant;
  label?: string;
}

/**
 * The page's own trade composition (src/components/verticals/trade): a static object born from the
 * trade that carries the page's `whoFor` (who the site is for) — case files, a ledger page, a
 * neighbourhood map, appointment cards, a lobby directory, a whiteboard, a treatment menu, a site sign.
 */
export type TradeVariant = "case-files" | "ledger" | "map" | "appointments" | "directory" | "whiteboard" | "menu" | "site-sign";

/** One room of the page, in order. The page numbers the openers ("01", "02"…) itself. */
export type VerticalSection =
  | ({ kind: "intro" } & SectionBase)
  | ({ kind: "trade"; variant: TradeVariant } & SectionBase)
  | ({ kind: "signature" } & SectionBase)
  | ({ kind: "features"; variant: "diagram" | "specimens" | "plate"; sheet?: string } & SectionBase)
  | ({ kind: "deepDive"; variant: "ledger" | "spine" } & SectionBase)
  | ({ kind: "process" } & SectionBase)
  | ({ kind: "outcomes" } & SectionBase)
  | ({
      kind: "faq";
      card: "book" | "plaque";
      title: string;
      lede?: string;
      note?: { title: string; body: string; cta?: string; message?: string };
    } & SectionBase);

/** Which island the page hangs in its SignatureSlot (src/components/verticals). */
export type SignatureKey =
  | "scales"
  | "drawers"
  | "viewing-order"
  | "quiet-room"
  | "blueprint"
  | "next-move"
  | "palette"
  | "keystone";

export interface VerticalSignature {
  key: SignatureKey;
  /** Registry name (SITE-PLAYBOOK §9). */
  name: string;
  title: string;
  lede: string;
  /** How to use it by touch / pointer. */
  hint: string;
  /** Keyboard sentence (shown with a fine pointer only). */
  keys?: string;
}

export interface VerticalPage extends ServicePageData {
  slug: string;
  /** Breadcrumb leaf + link label on the hub. */
  navName: string;
  signature: VerticalSignature;
  sections: VerticalSection[];
  /** object-position of the hero art when cropped. */
  heroPosition?: string;
  /** Heading of the wayfinding signs at the end. */
  relatedTitle?: string;
}

/* ───────────────────────── registry ───────────────────────── */
export const VERTICALS: Record<string, VerticalPage> = {
  [lawyer.slug]: lawyer,
  [accountant.slug]: accountant,
  [realEstate.slug]: realEstate,
  [clinic.slug]: clinic,
  [architect.slug]: architect,
  [consultant.slug]: consultant,
  [beauty.slug]: beauty,
  [contractor.slug]: contractor,
};

const pathOf = (slug: string) => `${VERTICALS_HUB.path}${slug}/`;

/** The page's wayfinding signs: sibling verticals get their art + kicker line automatically. */
export function verticalRelated(page: VerticalPage): ServiceLink[] {
  return (page.related ?? []).map((link) => {
    const sib = Object.values(VERTICALS).find((v) => pathOf(v.slug) === link.href);
    return sib ? { desc: (sib.hero.facts ?? []).slice(0, 2).join(" · "), art: sib.hero.art, ...link } : link;
  });
}

/** Rich list for the hub's industry plates (label, href, desc, art). */
export const VERTICAL_CARDS = Object.values(VERTICALS).map((v) => ({
  label: v.navName,
  href: pathOf(v.slug),
  desc: v.hero.kicker,
  art: v.hero.art,
}));
