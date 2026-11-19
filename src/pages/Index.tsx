import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import HomeHero from "@/components/home/HomeHero";
import HomeServices from "@/components/home/HomeServices";
import HomeProcess from "@/components/home/HomeProcess";
import HomeCollection from "@/components/home/HomeCollection";
import HomeManifesto from "@/components/home/HomeManifesto";
import HomeOffer from "@/components/home/HomeOffer";
import HomeMagazine from "@/components/home/HomeMagazine";
import HomeFaq from "@/components/home/HomeFaq";
import HomeFinalCta from "@/components/home/HomeFinalCta";
import "@/components/home/home.css";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";
import { homeSeo } from "@/content/home";
import { offerFaq } from "@/content/offer";

const SITE = "https://nz-web.com";

const homeSchema = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE}/#webpage`,
    url: `${SITE}/`,
    name: homeSeo.title,
    description: homeSeo.description,
    inLanguage: "he",
    isPartOf: { "@id": `${SITE}/#website` },
    about: { "@id": `${SITE}/#organization` },
    primaryImageOfPage: { "@type": "ImageObject", url: `${SITE}/og-image.png` },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE}/#faq`,
    mainEntity: offerFaq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useSeoMeta({
    title: homeSeo.title,
    description: homeSeo.description,
    schema: homeSchema,
  });

  useEffect(() => {
    if (location.hash) {
      return scrollToSelectorWithRetry(location.hash);
    }
  }, [location.hash]);

  useEffect(() => {
    if (location.state && typeof location.state === "object" && "scrollTo" in location.state) {
      const scrollTo = location.state.scrollTo;
      if (typeof scrollTo === "string") {
        return scrollToSelectorWithRetry(scrollTo, {
          onSuccess: () => {
            navigate(location.pathname + location.hash, { replace: true, state: null });
          },
        });
      }
    }
  }, [location.hash, location.pathname, location.state, navigate]);

  return (
    <div key={location.key} className="relative bg-bone pt-[var(--header-h)]">
      <Header />

      <main id="page-content">
        <HomeHero />
        <HomeServices />
        <HomeProcess />
        <HomeCollection />
        <HomeManifesto />
        <HomeOffer />
        <HomeMagazine />
        <HomeFaq />
        <HomeFinalCta />
      </main>

      <Footer />
      <AccessibilityWidget />
    </div>
  );
};

export default Index;
