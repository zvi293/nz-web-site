import { useEffect, useState, useRef } from "react";
import { fetchLogos, type ClientLogo } from "@/lib/logos-api";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ClientLogosSection = () => {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const scrollerInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLogos(fetchLogos());
  }, []);

  useEffect(() => {
    if (logos.length === 0 || !scrollerRef.current || !scrollerInnerRef.current) return;

    // Remove previously cloned nodes (prevent duplication on re-render)
    const inner = scrollerInnerRef.current;
    const originals = Array.from(inner.querySelectorAll("[data-clone]"));
    originals.forEach((el) => el.remove());

    // Clone all original items for seamless loop
    Array.from(inner.children).forEach((item) => {
      const clone = item.cloneNode(true) as HTMLElement;
      clone.setAttribute("data-clone", "true");
      inner.appendChild(clone);
    });

    const ctx = gsap.context(() => {
      const totalWidth = inner.scrollWidth / 2;

      gsap.fromTo(
        inner,
        { x: 0 },
        {
          x: -totalWidth,
          duration: logos.length * 3,
          ease: "none",
          repeat: -1,
        }
      );

      // Entrance animation
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
            toggleActions: "play none none reset"
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [logos]);

  if (logos.length === 0) return null;

  return (
    <section ref={sectionRef} className="py-20 md:py-28 bg-primary/[0.02] overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10 md:mb-14">
          

          
          

          
        </div>
      </div>

      <div ref={scrollerRef} className="relative w-full">
        <div
          ref={scrollerInnerRef}
          className="flex gap-6 md:gap-8 w-max">
          
          {logos.map((logo) =>
          <div
            key={logo.id}
            className="flex items-center justify-center rounded-xl bg-card border border-border/50 p-5 md:p-6 w-36 md:w-44 h-24 md:h-28 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md hover:border-primary/20 flex-shrink-0">
            
              <img
              src={logo.image}
              alt={`לוגו לקוח – ${logo.name}`}
              className="max-h-10 md:max-h-12 max-w-full object-contain" />
            
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ClientLogosSection;