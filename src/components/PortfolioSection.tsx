import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft } from "lucide-react";
import { fetchProjects, type Project } from "@/lib/projects-api";

gsap.registerPlugin(ScrollTrigger);

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetchProjects().then((all) => setProjects(all.filter((p) => p.featured)));
  }, []);

  useEffect(() => {
    if (projects.length === 0) return;

    cardsRef.current = cardsRef.current.slice(0, projects.length);

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%"
        }
      });

      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.from(card, {
          y: 50,
          opacity: 0,
          duration: 0.7,
          delay: 0.15 * (i + 1),
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%"
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      id="portfolio"
      dir="rtl"
      className="bg-background py-20 md:py-28 lg:py-36"
    >
      <div className="container mx-auto px-4 md:px-6">
        <div ref={headerRef} className="mb-14 md:mb-20 text-center">
          <p className="mb-4 text-sm font-semibold tracking-widest text-primary uppercase">פרויקטים נבחרים</p>
          <h2 className="text-2xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
            הופכים חזון למציאות דיגיטלית
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:gap-10">
          {projects.map((project, i) => (
            <div
              key={project.id}
              ref={(el) => (cardsRef.current[i] = el)}
              className="group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-card border border-border/40 shadow-[0_4px_24px_-6px_hsl(var(--foreground)/0.06)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_16px_48px_-12px_hsl(var(--primary)/0.12)] hover:border-primary/20"
            >
              <div className="h-36 md:h-64 overflow-hidden">
                <img
                  src={project.image}
                  alt={`פרויקט ${project.title} – בניית אתר מקצועי`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col gap-2.5 md:gap-4 p-4 md:p-7">
                <div className="hidden md:flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-sm md:text-xl font-bold text-foreground leading-snug">
                  {project.title}
                </h3>
                <p className="text-[11px] md:text-sm leading-relaxed text-muted-foreground line-clamp-3 md:line-clamp-none">
                  {project.description}
                </p>

                <a
                  href={project.link || "#"}
                  className="mt-1 md:mt-2 inline-flex items-center gap-1 md:gap-2 text-[11px] md:text-sm font-semibold text-primary transition-all duration-200 hover:gap-3"
                >
                  צפה בפרויקט
                  <ArrowLeft className="h-3 w-3 md:h-4 md:w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 md:mt-20 text-center">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-10 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 btn-glow"
          >
            לכל הפרויקטים
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
