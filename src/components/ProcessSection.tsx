import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { MessageCircle, PencilRuler, Code2, Rocket, Check } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: MessageCircle,
    title: "פגישת ייעוץ חינם",
    description:
      "מתחילים בשיחה פתוחה — מבינים את העסק, הצרכים, הקהל והמטרה. ללא התחייבות.",
    features: ["שיחת גילוי מעמיקה", "הצעת מחיר מותאמת", "ניתוח קהל ומתחרים"],
    accent: "#3b82f6",
    accentRgb: "59,130,246",
    tag: "גילוי",
    side: "right" as const,
  },
  {
    number: "02",
    icon: PencilRuler,
    title: "תכנון ועיצוב",
    description:
      "בונים אסטרטגיה, מעצבים חווית משתמש ויוצרים מקאפ שמייצג את הברנד בצורה מושלמת.",
    features: ["Wireframes & UX", "עיצוב UI מלא", "מקאפ אינטראקטיבי"],
    accent: "#8b5cf6",
    accentRgb: "139,92,246",
    tag: "עיצוב",
    side: "left" as const,
  },
  {
    number: "03",
    icon: Code2,
    title: "פיתוח מלא",
    description:
      "קוד נקי, ביצועים גבוהים, מובייל-פירסט. בונים כל פיקסל לפי העיצוב עם טכנולוגיות מובילות.",
    features: ["React + TypeScript", "מובייל-פירסט 100%", "SEO טכני מובנה"],
    accent: "#10b981",
    accentRgb: "16,185,129",
    tag: "פיתוח",
    side: "right" as const,
  },
  {
    number: "04",
    icon: Rocket,
    title: "השקה ותמיכה",
    description:
      "מעלים לאוויר, מבצעים בדיקות מקיפות ונשארים לצדכם גם לאחר ההשקה.",
    features: ["בדיקות QA מלאות", "הדרכת ניהול", "תמיכה שוטפת"],
    accent: "#f97316",
    accentRgb: "249,115,22",
    tag: "השקה",
    side: "left" as const,
  },
];

/* ── Animated flowing dot on the spine ── */
const FlowingDot = ({ color, delay }: { color: string; delay: number }) => (
  <motion.div
    className="absolute right-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
    style={{ backgroundColor: color, boxShadow: `0 0 8px 2px ${color}60` }}
    animate={{ y: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
    transition={{ duration: 2.8, delay, repeat: Infinity, ease: "linear" }}
  />
);

/* ── Single step card ── */
const StepCard = ({
  step,
  index,
  isInView,
}: {
  step: (typeof steps)[0];
  index: number;
  isInView: boolean;
}) => {
  const Icon = step.icon;
  const isRight = step.side === "right";

  return (
    <motion.div
      initial={{ opacity: 0, x: isRight ? 40 : -40 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay: index * 0.18 + 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="group relative overflow-hidden rounded-[1.35rem] border p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 md:rounded-[1.75rem] md:p-8"
      style={{
        borderColor: `rgba(${step.accentRgb},0.22)`,
        background: `linear-gradient(135deg, hsl(var(--card)/0.96) 0%, hsl(var(--card)/0.82) 100%)`,
        boxShadow: `0 10px 34px -14px rgba(${step.accentRgb},0.35), 0 2px 10px -4px rgba(${step.accentRgb},0.12)`,
      }}
    >
      {/* Hover glow */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 md:rounded-3xl"
        style={{ background: `radial-gradient(circle at 50% 0%, rgba(${step.accentRgb},0.08), transparent 70%)` }}
      />

      {/* Accent border line — side matches card position */}
      <div
        className={`absolute top-0 ${isRight ? "right-0" : "left-0"} h-full w-[3px] rounded-full`}
        style={{ background: `linear-gradient(to bottom, transparent, ${step.accent}, transparent)` }}
      />

      {/* Top row: tag + icon */}
      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-2xl shadow-lg"
          style={{
            background: `linear-gradient(135deg, rgba(${step.accentRgb},0.2), rgba(${step.accentRgb},0.08))`,
            boxShadow: `0 4px 16px -4px rgba(${step.accentRgb},0.3)`,
          }}
        >
          <Icon className="h-5 w-5" style={{ color: step.accent }} strokeWidth={2} />
        </div>

        <span
          className="rounded-full px-3 py-1 text-xs font-bold tracking-wide"
          style={{ backgroundColor: `rgba(${step.accentRgb},0.12)`, color: step.accent }}
        >
          {step.tag}
        </span>
      </div>

      {/* Ghost number */}
      <span
        className="pointer-events-none absolute bottom-2 left-4 select-none font-black leading-none"
        style={{ fontSize: "5rem", color: `rgba(${step.accentRgb},0.06)` }}
      >
        {step.number}
      </span>

      {/* Title + desc */}
      <div className="relative z-10">
        <h3 className="mb-2.5 text-lg font-black leading-snug text-foreground md:text-xl">
          {step.title}
        </h3>
        <p className="mb-5 text-sm leading-[1.8] text-muted-foreground md:text-base">
          {step.description}
        </p>

        {/* Feature bullets */}
        <ul className="flex flex-col gap-2">
          {step.features.map((f, fi) => (
            <li key={fi} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span
                className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: `rgba(${step.accentRgb},0.15)` }}
              >
                <Check className="h-2.5 w-2.5" style={{ color: step.accent }} strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

/* ── Center node ── */
const StepNode = ({
  step,
  index,
  isLast,
  isInView,
}: {
  step: (typeof steps)[0];
  index: number;
  isLast: boolean;
  isInView: boolean;
}) => (
  <div className="relative flex flex-col items-center">
    {/* Spine line above (except first) */}
    {index > 0 && (
      <div className="w-px flex-none" style={{ height: 0 }} />
    )}

    {/* Node circle */}
    <motion.div
      className="relative z-10 my-2 flex shrink-0 items-center justify-center rounded-full"
      style={{
        width: 72,
        height: 72,
        background: `radial-gradient(circle, rgba(${step.accentRgb},0.18) 0%, rgba(${step.accentRgb},0.06) 100%)`,
        border: `2px solid rgba(${step.accentRgb},0.35)`,
        boxShadow: `0 0 0 6px rgba(${step.accentRgb},0.06), 0 8px 32px -8px rgba(${step.accentRgb},0.3)`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : {}}
      transition={{ delay: index * 0.18, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer pulse */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{ border: `2px solid ${step.accent}` }}
        animate={isInView ? { scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] } : {}}
        transition={{ delay: index * 0.18 + 0.8, duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Number */}
      <span
        className="relative z-10 text-lg font-black tabular-nums"
        style={{ color: step.accent }}
      >
        {step.number}
      </span>
    </motion.div>

    {/* Spine segment below node */}
    {!isLast && (
      <div className="relative flex-1" style={{ minHeight: 140, width: 2 }}>
        {/* Static bg line */}
        <div
          className="absolute inset-0 mx-auto w-px"
          style={{ background: `linear-gradient(to bottom, rgba(${step.accentRgb},0.4), rgba(${steps[index + 1].accentRgb},0.4))` }}
        />
        {/* Animated fill */}
        <motion.div
          className="absolute inset-y-0 mx-auto w-px origin-top"
          style={{
            background: `linear-gradient(to bottom, ${step.accent}, ${steps[index + 1].accent})`,
            boxShadow: `0 0 6px 1px ${step.accent}50`,
          }}
          initial={{ scaleY: 0 }}
          animate={isInView ? { scaleY: 1 } : {}}
          transition={{ delay: index * 0.18 + 0.4, duration: 0.7, ease: "easeOut" }}
        />
        {/* Flowing dot */}
        <FlowingDot color={step.accent} delay={index * 0.5 + 1} />
        <FlowingDot color={steps[index + 1].accent} delay={index * 0.5 + 2.4} />
      </div>
    )}
  </div>
);

const ProcessSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-60px" });
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden bg-surface py-14 md:py-20"
      aria-label="תהליך העבודה שלנו"
    >
      {/* Parallax ambient blobs */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ y: bgY }}>
        <div className="absolute right-[-5%] top-0 h-[600px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[150px]" />
        <div className="absolute left-[-5%] bottom-0 h-[500px] w-[450px] rounded-full bg-orange-500/[0.04] blur-[130px]" />
        <div className="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/[0.03] blur-[120px]" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        {/* Header */}
        <motion.div
          className="mx-auto mb-10 max-w-2xl text-center md:mb-14"
          initial={{ opacity: 0, y: 28 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nz-eyebrow mb-5">איך אנחנו עובדים</span>
          <h2 className="text-section-title mb-5 text-foreground">
            תהליך פשוט,{" "}
            <span className="text-gradient-brand">תוצאות יוצאות דופן</span>
          </h2>
          <p className="text-lede mx-auto max-w-xl text-pretty text-muted-foreground">
            ארבעה שלבים ברורים מהרעיון ועד ההשקה — בלי הפתעות, בלי עיכובים מיותרים.
          </p>
        </motion.div>

        {/* ── Zigzag desktop layout ── */}
        <div className="mx-auto hidden max-w-5xl md:block">
          {steps.map((step, i) => {
            const isRight = step.side === "right";
            const isLast = i === steps.length - 1;

            return (
              <div
                key={i}
                className="grid items-start"
                style={{ gridTemplateColumns: "1fr 80px 1fr" }}
              >
                {/* Col A (visual-right in RTL = col 3 in LTR grid) */}
                <div className={`px-6 py-2 ${isRight ? "" : "invisible"}`}>
                  {isRight && <StepCard step={step} index={i} isInView={isInView} />}
                </div>

                {/* Center spine */}
                <StepNode step={step} index={i} isLast={isLast} isInView={isInView} />

                {/* Col B (visual-left in RTL = col 1 in LTR grid) */}
                <div className={`px-6 py-2 ${!isRight ? "" : "invisible"}`}>
                  {!isRight && <StepCard step={step} index={i} isInView={isInView} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Mobile single-column layout ── */}
        <div className="mx-auto flex max-w-lg flex-col md:hidden">
          {steps.map((step, i) => {
            const isLast = i === steps.length - 1;
            return (
              <div key={i} className="flex gap-4">
                {/* Left spine */}
                <div className="flex flex-col items-center">
                  {/* Node */}
                  <motion.div
                    className="relative z-10 my-1 flex shrink-0 items-center justify-center rounded-full"
                    style={{
                      width: 52,
                      height: 52,
                      background: `radial-gradient(circle, rgba(${step.accentRgb},0.18) 0%, rgba(${step.accentRgb},0.06) 100%)`,
                      border: `2px solid rgba(${step.accentRgb},0.35)`,
                      boxShadow: `0 0 0 4px rgba(${step.accentRgb},0.06)`,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={isInView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: i * 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{ border: `1.5px solid ${step.accent}` }}
                      animate={isInView ? { scale: [1, 1.45, 1], opacity: [0.5, 0, 0.5] } : {}}
                      transition={{ delay: i * 0.15 + 0.6, duration: 2, repeat: Infinity }}
                    />
                    <span className="text-sm font-black" style={{ color: step.accent }}>
                      {step.number}
                    </span>
                  </motion.div>

                  {/* Line segment */}
                  {!isLast && (
                    <div className="relative w-px flex-1" style={{ minHeight: 24 }}>
                      <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(to bottom, rgba(${step.accentRgb},0.4), rgba(${steps[i + 1].accentRgb},0.4))` }}
                      />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className="flex-1 pb-5 pt-1">
                  <StepCard step={step} index={i} isInView={isInView} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
