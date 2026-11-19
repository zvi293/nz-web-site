import ServicePageTemplate from "@/components/ServicePageTemplate";
import NotFound from "@/views/NotFound";
import { buildLandingConfig } from "@/data/landings";

/**
 * One route component for every דף-נחיתה sub-page
 * (/services/landing-page-development/[landing]/). The slug comes from the Astro
 * page's getStaticPaths and is looked up in the data-driven LANDINGS registry.
 * Only known slugs are built, so any other path is a real Netlify 404.
 */
const LandingPageVertical = ({ landing }: { landing: string }) => {
  const config = landing ? buildLandingConfig(landing) : null;

  if (!config) return <NotFound />;

  return <ServicePageTemplate config={config} />;
};

export default LandingPageVertical;
