/**
 * page-seo.ts — build-time SEO for service pages.
 *
 *   serviceSeo(data, opts?)   NEW system (src/components/service): a ServicePageData → PageSeo with
 *                             WebPage (speakable h1 + .lead, licensed hero image, dateModified),
 *                             Service (#service, provider #organization, NO offers/prices),
 *                             FAQPage (#faq, the same q/a objects the visible <details> render),
 *                             BreadcrumbList, the LCP preload of the hero art and the OG card.
 *
 *   servicePageSeo(config)    LEGACY — pages still rendering src/components/ServicePageTemplate.tsx.
 *                             Delete it (and its import) when the last of them is migrated.
 */
import type { ServicePageConfig } from "@/components/ServicePageTemplate";
import { HERO_SIZES } from "@/components/service";
import type { ServicePageData } from "@/components/service/types";
import { faqPage, service, webPage, OG_IMAGES, SITE_LAST_UPDATED } from "@/lib/schema";
import { heroImage, type PageSeo } from "@/lib/seo";

export interface ServiceSeoOptions {
  /** Social card (default OG_IMAGES.services). */
  ogImage?: string;
  /** Extra JSON-LD nodes (e.g. collectionPage() for a hub, howTo()). */
  jsonLd?: unknown[];
  /** Replace the WebPage node (e.g. a hub passes its CollectionPage instead). */
  webPageNode?: unknown;
  /** Skip the Service node (hub pages that are not one service). */
  noService?: boolean;
}

const SERVICES_CRUMB = { name: "שירותים", path: "/services/" };

export function serviceSeo(data: ServicePageData, opts: ServiceSeoOptions = {}): PageSeo {
  const { path, seo, schema, hero, faqs } = data;
  const { title, description } = seo;
  const sizes = HERO_SIZES[data.heroVariant ?? "framed-right"];
  const image = heroImage(hero.art, path);
  const parent = data.crumb.trail ? undefined : (data.crumb.parent ?? SERVICES_CRUMB);

  const nodes: unknown[] = [
    opts.webPageNode ??
      webPage({
        path,
        title,
        description,
        primaryImage: image,
        dateModified: data.updated ?? SITE_LAST_UPDATED,
        speakable: true,
      }),
  ];
  if (!opts.noService) {
    nodes.push(
      service({
        path,
        name: schema.name,
        description,
        serviceType: schema.serviceType,
        alternateName: schema.alternateName,
        image,
      }),
    );
  }
  if (faqs.length) nodes.push(faqPage(faqs.map((f) => ({ question: f.q, answer: f.a })), path));
  if (opts.jsonLd) nodes.push(...opts.jsonLd);

  return {
    path,
    title,
    description,
    ogImage: opts.ogImage ?? OG_IMAGES.services,
    lcpArt: { slug: hero.art, sizes },
    breadcrumb: { name: data.crumb.name, path, parent, trail: data.crumb.trail },
    jsonLd: nodes,
  };
}

/** @deprecated LEGACY ServicePageTemplate pages only — use serviceSeo(). */
export function servicePageSeo(config: ServicePageConfig, extra: Partial<PageSeo> = {}): PageSeo {
  const path = config.breadcrumb.path;
  const { title, description } = config.seo;
  return {
    path,
    title,
    description,
    breadcrumb: {
      name: config.breadcrumb.name,
      path,
      parent: config.breadcrumb.parent,
    },
    jsonLd: [
      webPage({ path, title, description }),
      service({ path, name: title, description, serviceType: config.schemaServiceType }),
      ...(config.faqs?.length
        ? [faqPage(config.faqs.map((f) => ({ question: f.q, answer: f.a })), path)]
        : []),
    ],
    ...extra,
  };
}
