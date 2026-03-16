import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { fetchLogos, type ClientLogo } from "@/lib/logos-api";
import { createLabeledImageDataUri, isRenderableAssetUrl } from "@/lib/runtime-safety";

gsap.registerPlugin(ScrollTrigger);

const LogoCard = ({ logo }: { logo: ClientLogo }) => {
  const fallbackSrc = createLabeledImageDataUri(logo.name, { background: "#ffffff", foreground: "#0f172a", fontSize: 28 });
  const [src, setSrc] = useState(isRenderableAssetUrl(logo.image) ? logo.image : fallbackSrc);

  useEffect(() => {
    setSrc(isRenderableAssetUrl(logo.image) ? logo.image : fallbackSrc);
  }, [fallbackSrc, logo.image]);

  return (
    <div className="flex h-24 w-36 flex-shrink-0 items-center justify-center rounded-xl border border-border/50 bg-card p-5 grayscale transition-all duration-300 hover:border-primary/20 hover:shadow-md hover:grayscale-0 md:h-28 md:w-44 md:p-6">
      <img
        src={src}
        alt={`לוגו לקוח - ${logo.name}`}
        className="max-h-10 max-w-full object-contain md:max-h-12"
        loading="lazy"
        decoding="async"
        onError={() => setSrc(fallbackSrc)}
      />
    </div>
  );
};

const ClientLogosSection = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [shouldLoad, setShouldLoad] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLDivElement>(null);
  const hasRequestedRef = useRef(false);

  useEffect(() => {
    if (shouldLoad) {
      return;
    }

    if (typeof window === "undefined" || typeof window.IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const target = triggerRef.current;
    if (!target) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "1200px 0px",
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad || hasRequestedRef.current) {
      return;
    }

    hasRequestedRef.current = true;
    let active = true;

    void fetchLogos().then((rows) => {
      if (active) {
        setLogos(rows);
      }
    });

    return () => {
      active = false;
    };
  }, [shouldLoad]);

  const visibleLogos = useMemo(
    () =>
      logos.filter((logo) => {
        return Boolean(logo.name.trim());
      }),
    [logos],
  );

  useEffect(() => {
    if (visibleLogos.length === 0 || !sectionRef.current || !scrollerRef.current || !scrollerInnerRef.current) return;

    const inner = scrollerInnerRef.current;
    const clones = Array.from(inner.querySelectorAll("[data-clone]"));
    clones.forEach((el) => el.remove());

    Array.from(inner.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("data-clone", "true");
      inner.appendChild(clone);
    });

    const totalWidth = inner.scrollWidth / 2;
    if (totalWidth <= 0) {
      return;
    }

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner,
        { x: 0 },
        {
          x: -totalWidth,
          duration: Math.max(visibleLogos.length * 3, 12),
          ease: "none",
          repeat: -1,
        },
      );

      mm.add("(max-width: 767px)", () => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 42, scale: 0.985 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 95%",
              once: true,
              invalidateOnRefresh: true,
            },
            clearProps: "transform,opacity",
          },
        );
      });

      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 85%",
              toggleActions: "play none none reset",
            },
          },
        );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
      Array.from(inner.querySelectorAll("[data-clone]")).forEach((el) => el.remove());
    };
  }, [visibleLogos]);

  if (!shouldLoad) {
    return <div ref={triggerRef} className="h-px w-full" aria-hidden="true" />;
  }

  if (visibleLogos.length === 0) return null;

  return (
    <section ref={sectionRef} className="overflow-hidden bg-primary/[0.02] py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center md:mb-14" />
      </div>

      <div ref={scrollerRef} className="relative w-full">
        <div ref={scrollerInnerRef} className="flex w-max gap-6 md:gap-8">
          {visibleLogos.map((logo) => (
            <LogoCard key={logo.id} logo={logo} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClientLogosSection;
