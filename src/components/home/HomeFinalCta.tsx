import { useEffect, useRef, useState } from "react";
import { Artwork } from "@/components/art";
import { Eyebrow, Display, WhatsAppCta } from "@/components/nz";
import { contactInfo, getTelHref } from "@/lib/contact-utils";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { finalCta } from "@/content/home";

// Signature component: המסך עולה — scroll-opened curtain
/**
 * "The curtain rises" — the emerald-curtain piece opens from the centre (clip-path)
 * as it scrolls into view; the invitation sits on the dark green side of the work
 * (desktop) or rises over the foot of a tall crop of it (mobile).
 * Client JS: opens the curtain when in view. Without JS / reduced motion it is open.
 */
const HomeFinalCta = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { rootMargin: "0px 0px -20% 0px" });
  /* The closed curtain is a zero-width clip-path, which lazy loading treats as invisible —
     so fetch the piece eagerly once the section is near, and only open the curtain when
     it has loaded (or after a short grace period). */
  const near = useInView(ref, { rootMargin: "120% 0px 120% 0px" });
  const [loaded, setLoaded] = useState(false);
  const [grace, setGrace] = useState(false);
  useEffect(() => {
    if (!inView) return;
    const t = window.setTimeout(() => setGrace(true), 1400);
    return () => window.clearTimeout(t);
  }, [inView]);
  const open = inView && (loaded || grace);

  return (
    <section id="contact" className="nz-section nz-section--space-default hm-final" data-tone="ink" aria-labelledby="hm-final-title">
      <div className="nz-container">
        <div ref={ref} className={cn("hm-final__stage", open && "is-open")}>
          <div className="hm-final__art">
            <Artwork
              slug="emerald-curtain"
              sizes="(min-width: 1440px) 1312px, 100vw"
              eager={near}
              onLoad={() => setLoaded(true)}
            />
          </div>
          <div className="hm-final__text">
            <Eyebrow index={finalCta.room} rule>
              {finalCta.eyebrow}
            </Eyebrow>
            <Display id="hm-final-title" size="h2" className="hm-final__title hm-sd">
              {finalCta.title}
            </Display>
            <p className="hm-final__body hm-sd">{finalCta.body}</p>
            <div className="hm-final__ctas hm-sd">
              <WhatsAppCta size="lg" label={finalCta.cta} message={finalCta.message} />
              <a href={getTelHref(contactInfo.phone)} className="nz-link">
                <span className="nz-link__text">
                  או בטלפון <bdi dir="ltr">{contactInfo.phone}</bdi>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeFinalCta;
