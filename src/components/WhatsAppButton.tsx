import { useEffect, useRef, useState } from "react";
import "@/components/legal/floating-ui.css";
import { getWhatsAppHref, contactInfo } from "@/lib/contact-utils";
import { WhatsAppIcon } from "@/components/nz/icons";
import { probeCovers, watchWhileScrolling } from "@/components/legal/floating";

/**
 * The floating WhatsApp bead (global chrome).
 *
 * Mount ONCE in BaseLayout, after <AccessibilityWidget>:  <WhatsAppButton client:idle />
 * (Legacy page views still render their own <WhatsAppButton />; only the first bead on a page
 *  stays — any later instance renders nothing, so the global mount never doubles it.)
 *
 *  - Docked bottom-end (bottom-left in RTL), inside the safe-area insets; rides above the
 *    cookie sheet on phones (--nz-sheet-h).
 *  - Springs in once the visitor has scrolled past ~60% of the first screen (an
 *    IntersectionObserver on a sentinel — no scroll-driven animation).
 *  - Politely ducks away while it would cover text, a form field or a tap target: while the
 *    page scrolls it probes the spot ~10×/s with elementsFromPoint, hides at once when covered
 *    and returns only after the spot has been clear for ~200ms (no flicker).
 *  - Reduced motion / the widget's pause: it simply appears and disappears, no spring.
 */
let mounted = 0;

const WhatsAppButton = () => {
  const href = getWhatsAppHref(contactInfo);
  const dockRef = useRef<HTMLDivElement>(null);
  const [primary, setPrimary] = useState(false);
  const [passed, setPassed] = useState(false);
  const [ducked, setDucked] = useState(false);

  /* one bead per page */
  useEffect(() => {
    mounted += 1;
    const first = mounted === 1 && !document.querySelector(".nzc-dock--wa[data-primary]");
    setPrimary(first);
    return () => {
      mounted -= 1;
    };
  }, []);

  /* spring in after ~60% of the first screen */
  useEffect(() => {
    if (!primary) return;
    const sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:60vh;inset-inline-start:0;width:1px;height:1px;pointer-events:none;";
    document.body.appendChild(sentinel);
    if (typeof IntersectionObserver === "undefined") {
      setPassed(true);
      return () => sentinel.remove();
    }
    const io = new IntersectionObserver(([entry]) => {
      setPassed(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    io.observe(sentinel);
    return () => {
      io.disconnect();
      sentinel.remove();
    };
  }, [primary]);

  /* duck while it would cover text / a field / a tap target */
  useEffect(() => {
    if (!primary) return;
    let clear = 0;
    const probe = () => {
      const dock = dockRef.current;
      if (!dock) return;
      const hit = probeCovers(dock.getBoundingClientRect(), ["field", "target", "text"]);
      if (hit) {
        clear = 0;
        setDucked(true);
      } else if (++clear >= 2) {
        setDucked(false);
      }
    };
    const stop = watchWhileScrolling(probe);
    return stop;
  }, [primary]);

  if (!primary) return null;

  const shown = passed && !ducked;

  return (
    <div
      ref={dockRef}
      className="nzc-dock nzc-dock--end nzc-dock--wa"
      data-nz-float=""
      data-a11y-exclude="true"
      data-primary=""
      data-shown={shown ? "" : undefined}
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="nzc-bead nzc-bead--wa"
        aria-label="לשיחה בוואטסאפ (נפתח בכרטיסייה חדשה)"
        tabIndex={shown ? undefined : -1}
        aria-hidden={shown ? undefined : true}
      >
        <WhatsAppIcon className="nzc-bead__glyph" />
      </a>
    </div>
  );
};

export default WhatsAppButton;
