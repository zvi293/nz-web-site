import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Quote, Star } from "lucide-react";
import { testimonials } from "@/content/testimonials";

const StarRating = ({ count }: { count: number }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: count }).map((_, i) => (
      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
    ))}
  </div>
);

const TestimonialsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  /**
   * Injects AggregateRating + Review JSON-LD built from the REAL testimonials.
   * Shares the business @id with the LocalBusiness schema in index.html, so Google
   * attaches the rating to the business — making star ratings eligible in search results.
   * The ratings are also visibly shown on this section (StarRating), as Google requires.
   */
  useEffect(() => {
    const visible = testimonials.filter((item) => item.rating > 0);
    if (visible.length === 0) return;
    const avg = visible.reduce((sum, item) => sum + item.rating, 0) / visible.length;
    const SCHEMA_ID = "testimonials-aggregate-rating";
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = SCHEMA_ID;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://nz-web.com/#business",
      name: "NZ-web",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avg.toFixed(1),
        reviewCount: String(visible.length),
        bestRating: "5",
        worstRating: "1",
      },
      review: visible.map((item) => ({
        "@type": "Review",
        author: { "@type": "Person", name: item.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(item.rating),
          bestRating: "5",
          worstRating: "1",
        },
        reviewBody: item.text,
      })),
    });
    document.getElementById(SCHEMA_ID)?.remove();
    document.head.appendChild(script);
    return () => {
      document.getElementById(SCHEMA_ID)?.remove();
    };
  }, []);

  const prev = () => {
    if (!testimonials.length) return;
    setDirection(-1);
    setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  };
  const next = () => {
    if (!testimonials.length) return;
    setDirection(1);
    setCurrent((c) => (c + 1) % testimonials.length);
  };

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0, scale: 0.97 }),
    center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
    exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0, scale: 0.97, transition: { duration: 0.35, ease: [0.4, 0, 1, 1] } }),
  };

  if (testimonials.length === 0) return null;

  const t = testimonials[current];

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden py-16 md:py-24"
      aria-label="המלצות לקוחות"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 via-background to-secondary/30" />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 h-[350px] w-[350px] rounded-full bg-accent/[0.04] blur-[110px]" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        {/* Header */}
        <motion.div
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="nz-eyebrow mb-5">
            מה הלקוחות אומרים
          </p>
          <h2 className="mb-4 text-section-title text-foreground">
            לקוחות מרוצים,{" "}
            <span className="text-gradient-brand">תוצאות מדידות</span>
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground">
            האמון של הלקוחות שלנו הוא הנכס היקר ביותר שיש לנו.
          </p>
        </motion.div>

        {/* Main card */}
        <motion.div
          className="mx-auto max-w-3xl"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-border/40 bg-card/90 p-8 shadow-[0_8px_48px_-12px_hsl(var(--foreground)/0.08)] backdrop-blur-xl md:p-12">
            {/* Quote icon */}
            <div className="absolute left-8 top-8 opacity-10 md:left-10 md:top-10">
              <Quote className="h-14 w-14 rotate-180 text-primary" />
            </div>
            <div className="pointer-events-none absolute inset-[1px] rounded-[2rem] bg-gradient-to-br from-primary/[0.04] via-transparent to-accent/[0.04]" />

            <div className="relative z-10">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="flex flex-col gap-5"
                >
                  <StarRating count={t.rating} />
                  <p className="text-base leading-[1.95] text-foreground/90 md:text-lg md:leading-[2]">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${t.avatar_color}, ${t.avatar_color}cc)` }}
                    >
                      {t.initials}
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-foreground">{t.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {t.role}{t.company ? `, ${t.company}` : ""}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-7 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
                  aria-label={`ביקורת ${i + 1}`}
                />
              ))}
            </div>
            <div className="flex gap-2.5">
              <button onClick={next} className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary" aria-label="הבא">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={prev} className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-card text-muted-foreground transition-all hover:border-primary/30 hover:bg-primary/[0.06] hover:text-primary" aria-label="הקודם">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Mini cards */}
        <motion.div
          className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-3 sm:grid-cols-5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {testimonials.map((item, i) => (
            <button
              key={item.id}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-center transition-all duration-300 ${
                i === current ? "border-primary/30 bg-primary/[0.06] shadow-md" : "border-border/40 bg-card/60 hover:border-primary/20 hover:bg-card"
              }`}
            >
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${item.avatar_color}, ${item.avatar_color}cc)` }}
              >
                {item.initials}
              </div>
              <p className="text-[11px] font-semibold leading-tight text-foreground">{item.name}</p>
            </button>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
