import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { fetchAboutData, getDefaultAboutData, type AboutPageData } from "@/lib/about-api";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

interface AccordionColumnProps {
  title: string;
  items: { title: string; desc: string }[];
  delayOffset?: number;
}

const AccordionColumn = ({ title, items, delayOffset = 0 }: AccordionColumnProps) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delayOffset }}
    >
      <h3
        className="text-2xl md:text-3xl font-extrabold text-foreground mb-8"
        style={{ fontFamily: "'Heebo', sans-serif" }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-3">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i} className="border-b border-border/50 pb-3">
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 text-right group cursor-pointer"
              >
                <span className="text-base md:text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {item.title}
                </span>
                <span className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                  {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pt-3 text-sm md:text-base text-muted-foreground leading-relaxed">
                      {item.desc}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

const About = () => {
  const [data, setData] = useState<AboutPageData>(getDefaultAboutData());

  useSeoMeta({
    title: "מי אנחנו | NZ-web – סטודיו לפיתוח ועיצוב אתרים",
    description:
      "גלו את NZ-web – סטודיו של צבי משה לפיתוח Full-Stack, עיצוב UI/UX ואוטומציית AI. מאמינים בפרפקציוניזם דיגיטלי עם הסלוגן: Perfect in every Pixel.",
  });
  useBreadcrumb({ name: "מי אנחנו", path: "/about" });

  useEffect(() => {
    let isActive = true;

    const loadAboutData = async () => {
      try {
        const aboutData = await fetchAboutData();
        if (isActive) {
          setData(aboutData);
        }
      } catch (error) {
        console.error(error);
      }
    };

    void loadAboutData();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="relative bg-background pt-[72px]" dir="rtl">
      <AmbientShapes />
      <Header />
      <BackToHome />

      {/* Hero */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 text-center max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-primary font-rubik text-sm font-semibold uppercase tracking-widest mb-4"
          >
            {data.heroSubtitle}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black text-foreground leading-tight mb-6"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            {data.heroTitle}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed"
          >
            {data.heroDescription.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < data.heroDescription.split("\n").length - 1 && <br className="hidden md:block" />}
              </span>
            ))}
          </motion.p>
          <motion.blockquote
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 border-r-4 border-primary pr-6 text-right text-muted-foreground text-base md:text-lg italic leading-relaxed"
          >
            "{data.heroQuote}"
          </motion.blockquote>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-black text-foreground text-center mb-16"
            style={{ fontFamily: "'Heebo', sans-serif" }}
          >
            {data.servicesTitle}
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12 max-w-6xl mx-auto">
            {data.columns.map((col, i) => (
              <AccordionColumn key={i} title={col.title} items={col.items} delayOffset={i * 0.12} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/services/business-website" className="font-heebo text-sm text-primary hover:text-primary/80 transition-colors underline underline-offset-4">
              לפרטים על שירות בניית אתר תדמית לעסקים ←
            </Link>
          </div>
        </div>
      </section>

      {/* Vision & Approach */}
      <section className="py-20 md:py-28 bg-background">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="max-w-3xl mx-auto text-right bg-secondary/40 rounded-3xl p-8 md:p-12 border border-border/50"
          >
            <h2
              className="text-2xl md:text-4xl font-black text-foreground leading-snug mb-8"
              style={{ fontFamily: "'Heebo', sans-serif" }}
            >
              {data.visionTitle}
            </h2>
            <div className="space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
              {data.visionParagraphs.map((p, i) => (
                <p key={i}>
                  {i === 1 && p.startsWith("ובשביל זה NZ-web כאן.") ? (
                    <>
                      <span className="text-primary font-bold">ובשביל זה NZ-web כאן.</span>
                      {p.slice("ובשביל זה NZ-web כאן.".length)}
                    </>
                  ) : p}
                </p>
              ))}
            </div>
            <div className="mt-8 text-right">
              <Link to="/projects" className="text-primary font-semibold hover:underline">
                ראו את הפרויקטים שלנו ←
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24 md:py-32 bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="container mx-auto px-6 max-w-2xl relative z-10"
        >
          <motion.h2 
            className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight" 
            style={{ fontFamily: "'Heebo', sans-serif" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {data.ctaTitle}
          </motion.h2>
          <motion.p 
            className="text-primary/90 text-lg md:text-xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {data.ctaSubtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => {
                window.location.href = data.ctaButtonLink;
              }}
              className="inline-block bg-primary text-primary-foreground font-bold text-lg px-12 py-5 rounded-full shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {data.ctaButtonText}
            </button>
          </motion.div>
        </motion.div>
      </section>

      <Footer />
      <WhatsAppButton />
      <AccessibilityWidget />
    </main>
  );
};

export default About;
