import { useParams } from "react-router-dom";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import NotFound from "@/pages/NotFound";
import { buildVerticalConfig } from "@/data/verticals";

/**
 * One route component for every "אתר תדמית" vertical
 * (/services/business-website/:vertical). The slug is looked up in the
 * data-driven `VERTICALS` registry; an unknown slug renders the branded
 * NotFound page (noindex), and because the path isn't pre-rendered Netlify
 * also serves a real HTTP 404 — consistent with the soft-404 fix.
 */
const VerticalBusinessWebsite = () => {
  const { vertical } = useParams<{ vertical: string }>();
  const config = vertical ? buildVerticalConfig(vertical) : null;

  if (!config) return <NotFound />;

  return <ServicePageTemplate config={config} />;
};

export default VerticalBusinessWebsite;
