import { motion } from "framer-motion";

export const SkeletonPortfolioCard = () => (
  <div className="overflow-hidden rounded-2xl border border-border/40 bg-card md:rounded-3xl">
    <div className="relative h-48 overflow-hidden bg-secondary/60 md:h-60">
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
        animate={{ translateX: ["−100%", "200%"] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "linear", repeatDelay: 0.3 }}
      />
    </div>
    <div className="flex flex-col gap-3 p-4 md:p-6">
      <div className="h-3 w-20 rounded-full bg-secondary/80" />
      <div className="h-4 w-3/4 rounded-full bg-secondary/80" />
      <div className="h-3 w-full rounded-full bg-secondary/60" />
      <div className="h-3 w-5/6 rounded-full bg-secondary/60" />
      <div className="mt-1 h-3 w-24 rounded-full bg-primary/20" />
    </div>
  </div>
);

export const SkeletonServiceBlock = () => (
  <div className="relative overflow-hidden rounded-[2rem] border border-border/30 bg-secondary/30 p-8 md:p-12">
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent"
      animate={{ translateX: ["-100%", "200%"] }}
      transition={{ duration: 1.6, repeat: Infinity, ease: "linear", repeatDelay: 0.5 }}
    />
    <div className="flex flex-col gap-5 lg:flex-row lg:gap-16">
      <div className="flex flex-1 flex-col gap-4">
        <div className="h-14 w-14 rounded-2xl bg-secondary" />
        <div className="h-5 w-24 rounded-full bg-secondary" />
        <div className="h-8 w-3/4 rounded-xl bg-secondary" />
        <div className="h-4 w-full rounded-full bg-secondary/70" />
        <div className="h-4 w-5/6 rounded-full bg-secondary/70" />
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="h-48 w-full max-w-sm rounded-3xl bg-secondary" />
      </div>
    </div>
  </div>
);
