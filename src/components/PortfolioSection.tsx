import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import { featuredProjects } from "@/content/projects";
import type { Project } from "@/content/types";
import { createLabeledImageDataUri, isRenderableAssetUrl } from "@/lib/runtime-safety";
import { useSpotlight } from "@/hooks/useSpotlight";

gsap.registerPlugin(ScrollTrigger);

const ProjectCardImage = ({ project }: { project: Project }) => {
  const fallbackSrc = createLabeledImageDataUri(project.title, {
    background: "#eef2ff",
    foreground: "#1e293b",
    fontSize: 22,
  });
  const [src, setSrc] = useState(
    isRenderableAssetUrl(project.image) ? project.image : fallbackSrc,
  );
  useEffect(() => {
    setSrc(isRenderableAssetUrl(project.image) ? project.image : fallbackSrc);
  }, [fallbackSrc, project.image]);

  return (
    <img
      src={src}
      alt={`פרויקט ${project.title} - בניית אתר מקצועי`}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      decoding="async"
      onError={() => setSrc(fallbackSrc)}
    />
  );
};

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const onSpotlight = useSpotlight();
  return (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
  >
    <a
      href={project.link || "#"}
      target={project.link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      onPointerMove={onSpotlight}
      className="spotlight group relative block h-full cursor-pointer overflow-hidden rounded-[1.5rem] border border-border/50 bg-card shadow-soft transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-floating md:rounded-[1.75rem]"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
        <ProjectCardImage project={project} />

        {/* Permanent bottom scrim — keeps the title legible over any artwork */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/25 to-transparent opacity-0 transition-all duration-400 group-hover:opacity-100">
          <span className="flex translate-y-3 items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg transition-transform duration-400 group-hover:translate-y-0">
            <ExternalLink className="h-4 w-4" />
            צפה בפרויקט
          </span>
        </div>

        {/* Category badge */}
        {project.tags?.[0] && (
          <span className="absolute right-3 top-3 rounded-full border border-white/20 bg-background/85 px-3 py-1 text-[11px] font-bold text-foreground backdrop-blur-md md:text-xs">
            {project.tags[0]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="relative flex flex-col gap-2.5 p-4 md:gap-3.5 md:p-6">
        <div className="hidden flex-wrap gap-2 md:flex">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-[14px] font-black leading-snug text-foreground transition-colors duration-300 group-hover:text-primary sm:text-[15px] md:text-lg">
          {project.title}
        </h3>
        <p className="line-clamp-3 text-[11.5px] leading-relaxed text-muted-foreground sm:text-[12px] md:text-sm">
          {project.description}
        </p>
        <div className="mt-0.5 flex items-center gap-1.5 text-[12px] font-bold text-primary transition-all duration-200 group-hover:gap-3 md:mt-1 md:text-sm">
          צפה בפרויקט
          <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-1 md:h-4 md:w-4" />
        </div>
      </div>
    </a>
  </motion.div>
  );
};

const PortfolioSection = () => {
  const projects = featuredProjects;
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projects.length === 0) return;
    const ctx = gsap.context(() => {
      if (headerRef.current && sectionRef.current) {
        gsap.from(headerRef.current, {
          y: 40, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [projects]);

  /* Content is static — this only happens if every project is unpublished. */
  if (projects.length === 0) {
    return null;
  }

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden bg-background py-14 md:py-20"
      aria-label="פרויקטים אחרונים"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-0 h-[350px] w-[350px] rounded-full bg-brand-2/[0.05] blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 h-[280px] w-[280px] rounded-full bg-brand-1/[0.05] blur-[90px]" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Header */}
        <div ref={headerRef} className="mb-9 text-center md:mb-14">
          <span className="nz-eyebrow mb-5">פרויקטים אחרונים</span>
          <h2 className="text-section-title mb-4 text-foreground">
            הופכים חזון ל
            <span className="text-gradient-brand">מציאות דיגיטלית</span>
          </h2>
          <p className="text-lede mx-auto max-w-xl text-pretty text-muted-foreground">
            כל פרויקט הוא עולם בפני עצמו — עם סיפור, אתגר ופתרון ייחודי.
          </p>
        </div>

        {/* Two across on every screen — the projects read as a pair, not a stack */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3.5 sm:gap-5 md:gap-7">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center md:mt-14">
          <Link
            to="/projects/"
            className="btn-brand group inline-flex items-center gap-2.5 rounded-2xl px-10 py-4 text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 md:text-base"
          >
            לכל הפרויקטים
            <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
