import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FaqEntry {
  q: string;
  a: string;
}

/** Single collapsible Q&A row — shared by the pricing section and the packages page. */
const FaqAccordionItem = ({ faq }: { faq: FaqEntry }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-border/40 bg-card">
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
      >
        <span className="text-sm font-bold text-foreground md:text-base">{faq.q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="overflow-hidden"
      >
        <p className="px-5 pb-4 text-sm leading-relaxed text-muted-foreground">{faq.a}</p>
      </motion.div>
    </div>
  );
};

export default FaqAccordionItem;
