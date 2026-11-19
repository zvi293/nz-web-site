/**
 * Landing sub-pages (/services/landing-page-development/<slug>/) — data shape.
 * A ServicePageData (src/components/service/types.ts) + the hub-card fields + the copy of the
 * page's own sections (src/components/landings/). Plain, serialisable data only.
 * Rules: no prices, no packages, no invented numbers; FAQ text unique site-wide (the FAQPage
 * JSON-LD is built from the same `faqs` array by serviceSeo()).
 */
import type { ServicePageData } from "@/components/service/types";

/** A station on the campaign page's "הדף בתוך הקמפיין" loop: what the page does for the ad system there. */
export interface ClickStation {
  /** Short station word on the line ("ציון האיכות"). */
  name: string;
  /** H3. */
  title: string;
  body: string;
  /** What gets connected at this station (shown on the wire plugged into the line). */
  wire: string;
}

/** A framed "feed crop" on the campaign page's audience wall. */
export type FeedCrop = "feed" | "search" | "story" | "variants" | "board" | "waitlist";
export interface ChannelItem {
  crop: FeedCrop;
  title: string;
  description: string;
}

/** A tool on the trades page's shadow board. */
export type TradeTool = "roller" | "hammer" | "trowel" | "plug" | "tape";
export interface TradeItem {
  tool: TradeTool;
  title: string;
  description: string;
}

/** A moment on the lead-generation page's "אחרי השליחה" timeline. */
export interface AfterMoment {
  /** Small time label ("ברגע השליחה"). */
  when: string;
  title: string;
  body: string;
}

/** A ruled line on the trades page's work-order pad. */
export interface OrderLine {
  /** The printed field name on the pad ("ערוץ"). */
  field: string;
  /** What is "handwritten" in the field (short). */
  entry: string;
  /** H3. */
  title: string;
  body: string;
}

export interface LandingPage extends ServicePageData {
  slug: string;
  /** Name in the hub's list and the breadcrumb. */
  navName: string;
  /** One line for the hub card. */
  card: string;
  /** The page's own sections (one per page). */
  journey?: { title: string; lede: string; stations: ClickStation[] };
  /** Campaign: who it is for, as framed crops of where the ad runs. */
  channels?: { title: string; lede: string; items: ChannelItem[] };
  /** Trades: who it is for, as tools on a shadow board. */
  tools?: { title: string; lede: string; items: TradeItem[] };
  afterSubmit?: { title: string; lede: string; moments: AfterMoment[] };
  workOrder?: { title: string; lede: string; lines: OrderLine[] };
}
