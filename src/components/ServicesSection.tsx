import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as LucideIcons from "lucide-react";

import { publishedServices } from "@/content/services";
import type { ServiceItem } from "@/content/types";
import { isRenderableAssetUrl, isSafeInlineSvg } from "@/lib/runtime-safety";

import servicePlanning from "@/assets/service-planning.webp";
import serviceUiux from "@/assets/service-uiux.webp";
import serviceDev from "@/assets/service-dev.webp";
import serviceSeo from "@/assets/service-seo.webp";

gsap.registerPlugin(ScrollTrigger);

const fallbackImagesByOrder: Record<number, string> = {
  1: servicePlanning,
  2: serviceUiux,
  3: serviceDev,
  4: serviceSeo,
};

const getServiceImage = (service: ServiceItem) => {
  return isRenderableAssetUrl(service.image)
    ? service.image
    : fallbackImagesByOrder[service.order] || servicePlanning;
};

const IconRenderer = ({ service }: { service: ServiceItem }) => {
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
}: { service: ServiceItem; index: number; }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const floatTweenRef = useRef<gsap.core.Tween | null>(null);
  const shouldPlayRef = useRef(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const hasVideo = Boolean(service.video && isRenderableAssetUrl(service.video) && !videoFailed);
  const posterSrc = getServiceImage(service);

  const clearPlayTimer = () => {
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  const resetVideo = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    clearPlayTimer();
    video.style.opacity = "0";
    video.pause();
    video.currentTime = 0;
  };

  const revealAndPlay = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    clearPlayTimer();
    playTimerRef.current = setTimeout(() => {
      if (!shouldPlayRef.current) {
        return;
      }

      video.style.opacity = "1";
      video.play().catch(() => {});
    }, 120);
  };

  useEffect(() => {
    setVideoSrc(null);
    setVideoFailed(false);
    shouldPlayRef.current = false;
    clearPlayTimer();
  }, [service.id, service.video]);

  useEffect(() => {
    if (!containerRef.current) return;
    const mainEl = containerRef.current.querySelector("[data-main-img]");
    if (mainEl) {
      floatTweenRef.current?.kill();
      floatTweenRef.current = gsap.to(mainEl, {
        y: -16,
        rotation: 1.2,
        duration: 3.2 + index * 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }

    return () => {
      floatTweenRef.current?.kill();
      floatTweenRef.current = null;
    };
  }, [index]);

  // Video playback with mobile-safe visibility rules
  useEffect(() => {
    if (!hasVideo || !videoRef.current || !containerRef.current) return;
    const video = videoRef.current;
    const mm = gsap.matchMedia();

    const ensureVideoSource = () => {
      if (!videoSrc && service.video) {
        setVideoSrc(service.video);
      }
    };

    mm.add("(max-width: 767px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 92%",
        end: "bottom -10%",
        invalidateOnRefresh: true,
        onEnter: () => {
          shouldPlayRef.current = true;
          ensureVideoSource();
          if (video.readyState >= 2) {
            revealAndPlay();
          } else {
            video.load();
          }
        },
        onEnterBack: () => {
          shouldPlayRef.current = true;
          ensureVideoSource();
          if (video.readyState >= 2) {
            revealAndPlay();
          } else {
            video.load();
          }
        },
        onLeave: () => {
          shouldPlayRef.current = false;
          clearPlayTimer();
          video.pause();
        },
        onLeaveBack: () => {
          shouldPlayRef.current = false;
          clearPlayTimer();
          video.pause();
        },
      });

      return () => trigger.kill();
    });

    mm.add("(min-width: 768px)", () => {
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 90%",
        end: "bottom 10%",
        invalidateOnRefresh: true,
        onEnter: () => {
          shouldPlayRef.current = true;
          ensureVideoSource();
          if (video.readyState >= 2) {
            revealAndPlay();
          } else {
            video.style.opacity = "0";
            video.load();
          }
        },
        onLeave: () => {
          shouldPlayRef.current = false;
          resetVideo();
        },
        onEnterBack: () => {
          shouldPlayRef.current = true;
          ensureVideoSource();
          if (video.readyState >= 2) {
            revealAndPlay();
          } else {
            video.style.opacity = "0";
            video.load();
          }
        },
        onLeaveBack: () => {
          shouldPlayRef.current = false;
          resetVideo();
        },
      });

      return () => trigger.kill();
    });

    return () => {
      shouldPlayRef.current = false;
      clearPlayTimer();
      mm.revert();
    };
  }, [hasVideo, service.video, videoSrc]);

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
            className="w-full h-auto object-cover"
            loading="lazy"
            decoding="async" />
          
            <video
            ref={videoRef}
            src={videoSrc ?? undefined}
            muted
            loop
            playsInline
            preload="metadata"
            poster={posterSrc}
            onCanPlay={() => {
              if (shouldPlayRef.current) {
                revealAndPlay();
              }
            }}
            onError={() => setVideoFailed(true)}
            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700" />
          
          </> :

        <img
          src={getServiceImage(service)}
          alt={`שירות ${service.badge} – NZ-web`}
          className="w-full h-auto object-cover"
          loading="lazy"
          decoding="async" />

        }
      </div>
    </div>);

};

const ServicesSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  const services = publishedServices;

  useEffect(() => {
    if (services.length === 0) return;

    rowRefs.current = rowRefs.current.slice(0, services.length);
    blockRefs.current = blockRefs.current.slice(0, services.length);

    const mm = gsap.matchMedia();
    const ctx = gsap.context(() => {

      mm.add("(max-width: 767px)", () => {
        if (headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { y: 56, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headerRef.current,
                start: "top 96%",
                once: true,
                invalidateOnRefresh: true,
              },
              clearProps: "transform,opacity",
            }
          );
        }

        blockRefs.current.forEach((block) => {
          if (!block) return;

          const bgEl = block.querySelector("[data-block-bg]") as HTMLElement | null;
          const textBlock = block.querySelector("[data-text]") as HTMLElement | null;
          const imageBlock = block.querySelector("[data-image]") as HTMLElement | null;

          if (bgEl) {
            gsap.set(bgEl, { opacity: 1, scale: 1, clearProps: "transform,opacity" });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: block,
              start: "top 95%",
              once: true,
              invalidateOnRefresh: true,
            },
          });

          if (bgEl) {
            tl.fromTo(
              bgEl,
              {
                opacity: 0.72,
                scale: 0.985,
              },
              {
                opacity: 1,
                scale: 1,
                duration: 0.55,
                ease: "power2.out",
                clearProps: "transform,opacity",
              },
            );
          }

          if (textBlock) {
            tl.fromTo(
              textBlock,
              {
                y: 42,
                opacity: 0,
              },
              {
                y: 0,
                opacity: 1,
                duration: 0.84,
                ease: "power3.out",
                clearProps: "transform,opacity",
              },
              bgEl ? "-=0.24" : 0,
            );
          }

          if (imageBlock) {
            tl.fromTo(
              imageBlock,
              {
                y: 34,
                opacity: 0,
                scale: 0.945,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.96,
                ease: "power2.out",
                clearProps: "transform,opacity",
              },
              textBlock ? "-=0.58" : bgEl ? "-=0.18" : 0,
            );
          }
        });
      });

      mm.add("(min-width: 768px)", () => {
        if (headerRef.current) {
          gsap.from(headerRef.current, {
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
            },
          });
        }

        blockRefs.current.forEach((block) => {
          if (!block) return;
          const bgEl = block.querySelector("[data-block-bg]") as HTMLElement | null;
          if (!bgEl) return;

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
                toggleActions: "play reverse play reverse",
              },
            }
          );
        });

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
                opacity: 0,
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
                  toggleActions: "play reverse play reverse",
                },
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
                  toggleActions: "play reverse play reverse",
                },
              }
            );
          }
        });
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, [services]);

  /* Content is static — this only happens if every service is unpublished. */
  if (services.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      id="services"
      dir="rtl"
      aria-label="השירותים שלנו"
      className="relative overflow-hidden py-10 md:py-14 lg:py-16"
      style={{ backgroundColor: "hsl(0 0% 100%)" }}>
      
      {/* Background ambient shapes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-primary/[0.03] blur-[140px]" />
        <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-accent/[0.04] blur-[120px]" />
      </div>

      <div className="container relative z-10 mx-auto px-5 md:px-6">
        {/* Section Header */}
        <div ref={headerRef} className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
          <p className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">השירותים שלנו</p>
          <h2 className="mb-6 text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl xl:text-[3.25rem]">
            איך אנחנו ב-<span className="text-gradient-brand">NZ-web</span> עושים את זה?
          </h2>
          <p className="mx-auto max-w-2xl text-base leading-[1.9] text-muted-foreground md:text-lg">
            אנחנו לא סתם בונים אתרים, אנחנו יוצרים נכסים דיגיטליים שמייצרים רווחים.
            החזון שלכם פוגש את הטכנולוגיה והעיצוב שלנו, בדרך למוצר מנצח.
          </p>
        </div>

        {/* Service Rows */}
        <div className="mx-auto flex max-w-6xl flex-col gap-5 md:gap-16 lg:gap-20">
          {services.map((service, i) =>
          <div
            key={service.id}
            ref={(el) => {
              rowRefs.current[i] = el;
              blockRefs.current[i] = el;
            }}
            className="relative rounded-[2rem] p-5 md:p-12 lg:p-16 overflow-hidden">
            
              {/* Dynamic background per block */}
              <div
              data-block-bg
              className="absolute inset-0 rounded-[2rem] -z-0 transition-all duration-700"
              style={{ background: service.bgGradient }} />
            

              <div
              className={`relative z-10 flex flex-col items-center gap-5 md:gap-16 lg:flex-row lg:gap-20 ${
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
                <div data-image className="flex flex-1 items-center justify-center w-full py-2 px-4 sm:py-8 sm:px-0">
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
