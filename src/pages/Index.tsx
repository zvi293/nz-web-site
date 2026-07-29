import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AmbientShapes from "@/components/AmbientShapes";
import AboutIntroSection from "@/components/AboutIntroSection";
import ServicesSection from "@/components/ServicesSection";
import PricingSection from "@/components/PricingSection";
import ProcessSection from "@/components/ProcessSection";
import PortfolioSection from "@/components/PortfolioSection";
import MarqueeRibbon from "@/components/MarqueeRibbon";
import BackToTopButton from "@/components/BackToTopButton";
import ClientLogosSection from "@/components/ClientLogosSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { scrollToSelectorWithRetry } from "@/lib/scroll-navigation";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useSeoMeta({
    title: "NZ-web | בניית אתרים ופיתוח אתרים מקצועי לעסקים בישראל",
    description:
      "NZ-web – סטודיו מוביל לבניית אתרים ופיתוח אתרים בישראל. בניית אתר תדמית, בניית אתר מכירות, חנות אונליין, דפי נחיתה ומערכת ניהול תורים. ביצועים ללא פשרות.",
    keywords:
      "בניית אתרים, פיתוח אתרים, בניית אתר תדמית, עיצוב אתרים, בניית אתר אינטרנט, פיתוח מערכות לעסקים, בניית אתר מכירות, חנות אונליין, דפי נחיתה, מערכת ניהול תורים, פתרונות דיגיטליים לעסקים, קידום אתרים",
  });

  useEffect(() => {
    if (location.hash) {
      return scrollToSelectorWithRetry(location.hash);
    }
  }, [location.hash]);

  useEffect(() => {
    if (
      location.state &&
      typeof location.state === "object" &&
      "scrollTo" in location.state
    ) {
      const scrollTo = location.state.scrollTo;
      if (typeof scrollTo === "string") {
        return scrollToSelectorWithRetry(scrollTo, {
          onSuccess: () => {
            navigate(location.pathname + location.hash, {
              replace: true,
              state: null,
            });
          },
        });
      }
    }
  }, [location.hash, location.pathname, location.state, navigate]);

  return (
    <div key={location.key} className="relative bg-background pt-[68px] md:pt-[84px]">
      <AmbientShapes />
      <Header />

      <main id="page-content">
      <HeroSection />

      {/* Brand ribbon — bridges the hero into the page and states the offering
          in one glance. Wrapper owns the overflow so the tilt can't create
          horizontal scroll. */}
      <div className="relative z-10 overflow-hidden bg-background py-5 md:py-7">
        <MarqueeRibbon />
      </div>

      <ServicesSection />
      <PricingSection />
      <ProcessSection />
      <div id="portfolio" aria-hidden="true" />
      <PortfolioSection />
      <AboutIntroSection />
      <ClientLogosSection />
      <ContactCTA />
      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default Index;
