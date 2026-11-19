import ServicePageTemplate from "@/components/ServicePageTemplate";
import NotFound from "@/views/NotFound";
import { buildVerticalConfig } from "@/data/verticals";

/**
 * One route component for every "אתר תדמית" vertical
 * (/services/business-website/[vertical]/). The slug comes from the Astro page's
 * getStaticPaths (src/pages/services/business-website/[vertical].astro) and is
 * looked up in the data-driven `VERTICALS` registry. Only known slugs are built,
 * so any other path is a real Netlify 404.
 */
const VerticalBusinessWebsite = ({ vertical }: { vertical: string }) => {
  const config = vertical ? buildVerticalConfig(vertical) : null;

  if (!config) return <NotFound />;

  return <ServicePageTemplate config={config} />;
};

export default VerticalBusinessWebsite;
