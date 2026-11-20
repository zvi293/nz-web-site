/**
 * Service page system — TS entry (types, the rooms list, hero sizes).
 * The sections themselves are .astro files — import them directly:
 *   import ServiceHero from "@/components/service/ServiceHero.astro";
 * Full API: src/components/service/README.md
 */
import type { HeroVariant } from "./types";

export * from "./types";
export { SERVICE_ROOMS, SERVICES_WING, roomFor, roomPlaque, type ServiceRoom } from "./rooms";

/**
 * `sizes` of the hero artwork per hero variant. ServiceHero uses it for <Artwork priority sizes>
 * and serviceSeo() for the LCP preload — the SAME string, so the image is fetched once.
 */
export const HERO_SIZES: Record<HeroVariant, string> = {
  "framed-right": "(min-width: 1440px) 510px, (min-width: 1024px) 36vw, calc(100vw - 64px)",
  "full-bleed": "100vw",
  "split-ink": "(min-width: 1440px) 450px, (min-width: 1024px) 31vw, calc(100vw - 64px)",
};
