/**
 * page-seo.ts — build-time SEO for pages that still render the LEGACY ServicePageTemplate
 * (service pages, vertical pages, landing sub-pages). Their <head> data lives in the page's
 * config object; this turns it into a PageSeo for <BaseLayout seo={…}>.
 *
 * Delete once every service page has been redesigned with its own frontmatter SEO.
 */
import type { ServicePageConfig } from "@/components/ServicePageTemplate";
import { faqPage, service, webPage } from "@/lib/schema";
import type { PageSeo } from "@/lib/seo";

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
