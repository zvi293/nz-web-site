import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AmbientShapes from "@/components/AmbientShapes";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ClientLogosSection from "@/components/ClientLogosSection";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import { useSeoMeta } from "@/hooks/useSeoMeta";

const Index = () => {
  const location = useLocation();

  useSeoMeta({
    title: "NZ-web | פיתוח אתרים, UI/UX ואוטומציות AI",
    description:
      "NZ-web – סטודיו לפיתוח Full-Stack, עיצוב UI/UX ואוטומציות AI. בונים אתרי תדמית, חנויות איקומרס ומערכות דיגיטליות מרהיבות עם ביצועים חסרי פשרות. Perfect in every Pixel.",
  });

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) {
          const headerOffset = window.innerWidth < 768 ? 56 : 100;
          const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);
  return (
    <main key={location.key} className="relative bg-background pt-[72px]">
      <AmbientShapes />
      <Header />
      <HeroSection />
      <ServicesSection />
      <PortfolioSection />
      <ClientLogosSection />
      <ContactCTA />
      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

export default Index;
