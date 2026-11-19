/**
 * Service page system — data shapes. Plain, serialisable objects only (no icon components,
 * no functions), so any slice can also be handed to an island as props.
 * See src/components/service/README.md for the section API.
 */

export interface Crumb {
  name: string;
  path: string;
}

/** A link with an optional short line and an artwork slug (thumbnail). */
export interface ServiceLink {
  label: string;
  href: string;
  desc?: string;
  art?: string;
}

/** Hero layouts. Each has its own `sizes` string (HERO_SIZES) — the LCP preload uses it too. */
export type HeroVariant = "framed-right" | "full-bleed" | "split-ink";

/** Section opener styles (playbook §10: never the same eyebrow+H2 everywhere). */
export type OpenerVariant = "rule" | "split" | "numeral" | "stacked" | "quote";

export type SectionTone = "bone" | "ink" | "paper";

export interface ServiceHeroData {
  /** Kicker under the room plaque, e.g. "אתר תדמית לעסקים". */
  kicker: string;
  /** The H1 — must contain the page's primary keyword. */
  title: string;
  /** One word/phrase of `title` to set in vermilion (must appear verbatim in title). */
  accent?: string;
  /** Answer-first lead, 40–70 words. Rendered as <p class="lead"> (speakable). */
  lead: string;
  /** Artwork slug — the page's signature slug from the art map (the LCP image). */
  art: string;
  /** "חומרים" line on the wall label — what the work stands for on this page. */
  medium?: string;
  /** WhatsApp CTA. */
  cta?: { label: string; message?: string };
  /** Quiet secondary link. */
  secondary?: { label: string; href: string };
  /** Up to 3 short true facts printed as a quiet label row (no numbers you can't back). */
  facts?: string[];
}

export interface ServiceIntroData {
  title: string;
  paragraphs: string[];
  /** A sentence lifted out as a pull quote (serif, large). */
  pull?: string;
  /** Up to 3 margin notes (short). */
  notes?: string[];
}

/**
 * Small line drawings (Sketch.astro) that give a text block its own visual: specimens on the
 * features "specimens" board and the figure beside a ledger entry. Drawn in the section's ink.
 */
export type SketchKind =
  | "code" | "a11y" | "mobile" | "speed" | "seo" | "care"
  | "domain" | "materials" | "launch"
  | "calendar" | "form" | "search" | "layers" | "chat";

export interface DeepDiveBlock {
  heading: string;
  body: string;
  /** A small drawn figure beside the entry (ledger variant). */
  sketch?: SketchKind;
}

export interface ServiceDeepDiveData {
  title: string;
  lede?: string;
  blocks: DeepDiveBlock[];
}

/** Where the feature's marker sits on the annotated site schematic (variant "diagram"). */
export type FeatureZone = "nav" | "headline" | "image" | "cta" | "cards" | "text" | "form" | "footer" | "phone" | "speed";

export interface FeatureItem {
  title: string;
  description: string;
  zone?: FeatureZone;
  /** The specimen drawn for this item on the "specimens" board. */
  sketch?: SketchKind;
}

export interface AudienceItem {
  title: string;
  description: string;
}

export interface ServiceWhoForData {
  title: string;
  lede?: string;
  items: AudienceItem[];
}

export interface StepItem {
  title: string;
  description: string;
}

/** An outcome hung as a typographic work: a word, a title, a line. NO invented numbers. */
export interface OutcomeItem {
  word: string;
  title: string;
  body: string;
}

/** FAQ item — the visible <details> and the FAQPage JSON-LD are built from the same objects. */
export interface ServiceFaqItem {
  q: string;
  a: string;
}

export interface ServiceCtaData {
  title: string;
  body: string;
  /** WhatsApp button label. */
  button?: string;
  /** Pre-filled WhatsApp message. */
  message?: string;
}

/**
 * Everything a service page needs. Pages may also pass slices directly to sections.
 *   seo + schema + crumb + hero.art + faqs → serviceSeo() (src/lib/page-seo.ts)
 */
export interface ServicePageData {
  /** Site path with trailing slash, e.g. "/services/business-website/". */
  path: string;
  /** Room number in the services wing ("01"…), see rooms.ts. Shown as "אולם 03 · חדר 01". */
  room?: string;
  crumb: { name: string; parent?: Crumb; trail?: Crumb[] };
  seo: { title: string; description: string };
  schema: { name: string; serviceType: string; alternateName?: string | string[] };
  heroVariant?: HeroVariant;
  hero: ServiceHeroData;
  intro?: ServiceIntroData;
  deepDive?: ServiceDeepDiveData;
  features?: { title: string; lede?: string; items: FeatureItem[] };
  whoFor?: ServiceWhoForData;
  process?: { title: string; lede?: string; steps: StepItem[] };
  outcomes?: { title: string; lede?: string; items: OutcomeItem[] };
  faqs: ServiceFaqItem[];
  related?: ServiceLink[];
  cta?: ServiceCtaData;
  /** dateModified for WebPage JSON-LD (ISO date). */
  updated?: string;
}
