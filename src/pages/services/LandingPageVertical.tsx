import { useParams } from "react-router-dom";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import NotFound from "@/pages/NotFound";
import { buildLandingConfig } from "@/data/landings";

/**
 * One route component for every דף-נחיתה sub-page
 * (/services/landing-page-development/:landing). The slug is looked up in the
 * data-driven LANDINGS registry; an unknown slug renders the branded NotFound
 * page (noindex), and since the path isn't pre-rendered Netlify also serves a
 * real HTTP 404 — consistent with the soft-404 fix.
 */
const LandingPageVertical = () => {
  const { landing } = useParams<{ landing: string }>();
  const config = landing ? buildLandingConfig(landing) : null;

  if (!config) return <NotFound />;

  return <ServicePageTemplate config={config} />;
};

export default LandingPageVertical;
