import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export interface FaqEntry {
  q: string;
  a: string;
}

/**
 * Single collapsible Q&A row — the one accordion used across the site (pricing
 * section, packages page, FAQ page).
 *
 * The answer is ALWAYS in the DOM, collapsed with height: 0 rather than
 * unmounted. That is deliberate and load-bearing:
 *
 *  - the pages are pre-rendered to static HTML, so an unmounted answer is an
 *    answer that Google, Bing and every LLM crawler simply never see;
 *  - Google's structured-data policy requires FAQPage answer text to be present
 *    on the page itself, not only inside the JSON-LD.
 *
 * `aria-hidden` + `inert` keep the collapsed text out of the accessibility tree
 * and out of the tab order, so screen-reader users still hear one question at a
 * time — the markup stays complete, the announcement does not get noisy.
 */
const FaqAccordionItem = ({ faq, index }: { faq: FaqEntry; index?: number }) => {
  const [open, setOpen] = useState(false);
  const reactId = useId();
  const panelId = `faq-panel-${reactId}`;
  const buttonId = `faq-button-${reactId}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-soft transition-shadow duration-300 hover:shadow-elevated">
      <h3 className="m-0">
        <button
          type="button"
          id={buttonId}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-right"
        >
          <span className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors duration-200 group-hover:text-primary md:text-base">
            {typeof index === "number" && (
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-black text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
              >
                {index + 1}
              </span>
            )}
            {faq.q}
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary ${open ? "rotate-180 text-primary" : ""}`}
          />
        </button>
      </h3>
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        {...(open ? {} : { inert: "" })}
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
