import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as LucideIcons from "lucide-react";

import { fetchServices, type ServiceRow } from "@/lib/services-api";
import { isRenderableAssetUrl, isSafeInlineSvg } from "@/lib/runtime-safety";

import servicePlanning from "@/assets/service-planning.jpg";
import serviceUiux from "@/assets/service-uiux.jpg";
import serviceDev from "@/assets/service-dev.jpg";
import serviceSeo from "@/assets/service-seo.jpg";

gsap.registerPlugin(ScrollTrigger);

const fallbackImagesByOrder: Record<number, string> = {
  1: servicePlanning,
  2: serviceUiux,
  3: serviceDev,
  4: serviceSeo,
};

const getServiceImage = (service: ServiceRow) => {
  return isRenderableAssetUrl(service.image)
    ? service.image
    : fallbackImagesByOrder[service.order] || servicePlanning;
};

const IconRenderer = ({ service }: { service: ServiceRow }) => {
  if (service.iconType === "image" && isRenderableAssetUrl(service.iconImage)) {
    return <img src={service.iconImage} alt={`אייקון שירות ${service.badge}`} className="h-7 w-7 object-contain" />;
  }
  if (service.iconType === "svg" && isSafeInlineSvg(service.iconSvg)) {
    return <div className="h-7 w-7 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: service.iconSvg }} />;
  }
  
  if (service.iconType === "lucide" && service.iconLucideName) {
    // @ts-ignore
    const IconComponent = LucideIcons[service.iconLucideName];
    if (IconComponent) {
      return <IconComponent className="h-7 w-7" />;
    }
  }
  
  // Default fallback
  const DefaultIcon = LucideIcons.Target;
  return <DefaultIcon className="h-7 w-7" />;
};

const ServiceVisual = ({
  service,
  index
}: { service: ServiceRow; index: number; }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const hasVideo = Boolean(service.video && isRenderableAssetUrl(service.video) && !videoFailed);

  useEffect(() => {
    if (!containerRef.current) return;
    const mainEl = containerRef.current.querySelector("[data-main-img]");
    if (mainEl) {
      gsap.to(mainEl, {
        y: -16,
        rotation: 1.2,
        duration: 3.2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }
  }, [index]);

  // Video playback with delay
  useEffect(() => {
    if (!hasVideo || !videoRef.current || !containerRef.current) return;
    const video = videoRef.current;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 90%",
      end: "bottom 10%",
      onEnter: () => {
        video.style.opacity = "0";
        video.pause();
        video.currentTime = 0;
        timer = setTimeout(() => {
          video.style.opacity = "1";
          video.play().catch(() => {});
        }, 400);
      },
      onLeave: () => {
        if (timer) clearTimeout(timer);
        video.style.opacity = "0";
        video.pause();
        video.currentTime = 0;
      },
      onEnterBack: () => {
        video.style.opacity = "0";
        video.pause();
        video.currentTime = 0;
        timer = setTimeout(() => {
          video.style.opacity = "1";
          video.play().catch(() => {});
        }, 400);
      },
      onLeaveBack: () => {
        if (timer) clearTimeout(timer);
        video.style.opacity = "0";
        video.pause();
        video.currentTime = 0;
      }
    });

    return () => {
      if (timer) clearTimeout(timer);
      st.kill();
    };
  }, [hasVideo]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] mx-auto sm:max-w-md md:max-w-lg">
      
      <div
        data-main-img
        className="relative rounded-3xl overflow-hidden shadow-2xl"
        style={{
          boxShadow:
          "0 20px 60px -12px hsl(220 20% 14% / 0.18), 0 8px 24px -8px hsl(217 91% 60% / 0.12)"
        }}>
        
        {hasVideo ?
        <>
            <img
            src={getServiceImage(service)}
            alt={`שירות ${service.badge} – NZ-web`}
            className="w-full h-auto object-cover" />
          
            <video
            ref={videoRef}
            src={service.video}
            muted
            loop
            playsInline
            preload="auto"
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700" />
          
          </> :

        <img
          src={getServiceImage(service)}
          alt={`שירות ${service.badge} – NZ-web`}
          className="w-full h-auto object-cover" />

        }
      </div>
    </div>);

};

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const [services, setServices] = useState<ServiceRow[]>([]);
  
  useEffect(() => {
    fetchServices().then(data => setServices(data));
  }, []);

  useEffect(() => {
    if (services.length === 0) return;
    
    const ctx = gsap.context(() => {
      // Header entrance
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          y: 60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%"
          }
        });
      }

      // Per-block background color transitions
      blockRefs.current.forEach((block, i) => {
        if (!block) return;
        const bgEl = block.querySelector("[data-block-bg]") as HTMLElement;
        if (bgEl) {
          gsap.fromTo(
            bgEl,
            { opacity: 0, scale: 0.97 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.6,
              ease: "power2.out",
              scrollTrigger: {
                trigger: block,
                start: "top 80%",
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });

      // Row entrance animations — images always visible, slide in gently
      rowRefs.current.forEach((row, i) => {
        if (!row) return;

        const textBlock = row.querySelector("[data-text]");
        const imageBlock = row.querySelector("[data-image]");

        if (textBlock) {
          gsap.fromTo(
            textBlock,
            {
              x: services[i].reverse ? -40 : 40,
              y: 30,
              opacity: 0
            },
            {
              x: 0,
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: row,
                start: "top 85%",
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }

        if (imageBlock) {
          gsap.fromTo(
            imageBlock,
            { x: -30, opacity: 0, scale: 0.97 },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: row,
                start: "top 88%",
                end: "bottom 15%",
                toggleActions: "play reverse play reverse"
              }
            }
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [services]);

  return (
    <section
      ref={sectionRef}
      id="services"
      dir="rtl"
      aria-label="השירותים שלנו"
      className="relative overflow-hidden py-24 md:py-32 lg:py-40"
      style={{ backgroundColor: "hsl(0 0% 100%)" }}>
      
      {/* Background ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mx-auto mb-20 max-w-3xl text-center md:mb-28">
          <p className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">השירותים שלנו</p>
          <h2 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl xl:text-[3.25rem]">
            איך אנחנו ב-<span className="text-gradient-brand">NZ-WEB</span> עושים את זה?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.9] text-muted-foreground md:text-lg">
            אנחנו לא סתם בונים אתרים, אנחנו יוצרים נכסים דיגיטליים שמייצרים רווחים.
            החזון שלכם פוגש את הטכנולוגיה והעיצוב שלנו, בדרך למוצר מנצח.
          </p>
        </div>

        {/* Service Rows */}
        <div className="mx-auto flex max-w-6xl flex-col gap-12 md:gap-16 lg:gap-20">
          {services.map((service, i) =>
          <div
            key={service.id}
            ref={(el) => {
              rowRefs.current[i] = el;
              blockRefs.current[i] = el;
            }}
            className="relative rounded-[2rem] p-8 md:p-12 lg:p-16 overflow-hidden">
            
              {/* Dynamic background per block */}
              <div
              data-block-bg
              className="absolute inset-0 rounded-[2rem] -z-0 transition-all duration-700"
              style={{ background: service.bgGradient }} />
            

              <div
              className={`relative z-10 flex flex-col items-center gap-12 md:gap-16 lg:flex-row lg:gap-20 ${
              service.reverse ? "lg:flex-row-reverse" : ""}`
              }>
              
                {/* Text Block */}
                <div data-text className="flex flex-1 flex-col gap-5 text-right">
                  <div
                  className="flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-xl"
                  style={{
                    backgroundColor: service.iconBg,
                    boxShadow: service.iconShadow
                  }}>
                  
                    <IconRenderer service={service} />
                  </div>

                  <span
                  className="inline-block w-fit rounded-full px-5 py-2 text-xs font-bold tracking-wide"
                  style={{
                    backgroundColor: service.badgeBg,
                    color: service.badgeText
                  }}>
                  
                    {service.badge}
                  </span>

                  <h3
                  className="text-2xl font-black leading-snug md:text-3xl lg:text-4xl"
                  style={{ color: service.textColor }}>
                  
                    {service.title}
                  </h3>

                  <p
                  className="max-w-lg text-base leading-[1.9] md:text-[17px]"
                  style={{ color: service.mutedTextColor }}>
                  
                    {service.body}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {service.tags.map((tag, ti) =>
                  <span
                    key={ti}
                    className="rounded-full px-4 py-1.5 text-xs font-medium"
                    style={{
                      backgroundColor: service.tagBg,
                      color: service.tagText
                    }}>
                    
                        {tag}
                      </span>
                  )}
                  </div>
                </div>

                {/* Visual Block */}
                <div data-image className="flex flex-1 items-center justify-center w-full py-8 px-4 sm:px-0">
                  <ServiceVisual service={service} index={i} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

};

export default ServicesSection;
