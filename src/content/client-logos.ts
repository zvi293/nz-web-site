import type { ClientLogo } from "@/content/types";

/**
 * Client logos strip on the homepage.
 *
 * Empty on purpose — the old CMS held no published logos, so the section hides
 * itself. To show logos, drop the files in src/assets, import them here and add
 * an entry: { id: "acme", name: "Acme", image: acmeLogo, visible: true, order: 0 }.
 */
export const clientLogos: ClientLogo[] = [];

export const visibleClientLogos = clientLogos
  .filter((logo) => logo.visible)
  .sort((a, b) => a.order - b.order);
