import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { SkeletonPortfolioCard } from "@/components/SkeletonCard";

import { fetchProjects, type Project } from "@/lib/projects-api";
import { createLabeledImageDataUri, isRenderableAssetUrl } from "@/lib/runtime-safety";

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

const ProjectCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 36 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
  >
    <a
      href={project.link || "#"}
      target={project.link ? "_blank" : "_self"}
      rel="noopener noreferrer"
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_4px_24px_-6px_hsl(var(--foreground)/0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_20px_60px_-12px_hsl(var(--primary)/0.15)] block md:rounded-3xl"
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden md:h-60">
        <ProjectCardImage project={project} />

        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex translate-y-4 flex-col items-center gap-3 transition-transform duration-300 group-hover:translate-y-0">
            <span className="flex items-center gap-2 rounded-full bg-white/95 px-5 py-2.5 text-sm font-bold text-slate-900 shadow-lg">
              <ExternalLink className="h-4 w-4" />
              צפה בפרויקט
            </span>
          </div>
        </div>

        {/* Category badge */}
        {project.tags?.[0] && (
          <span className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
            {project.tags[0]}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-2.5 p-4 md:gap-4 md:p-6">
        <div className="hidden flex-wrap gap-2 md:flex">
          {project.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
              {tag}
            </span>
          ))}
        </div>
        <h3 className="text-sm font-bold leading-snug text-foreground md:text-lg">{project.title}</h3>
        <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground md:line-clamp-3 md:text-sm">
          {project.description}
        </p>
        <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary transition-all duration-200 group-hover:gap-3 md:mt-2 md:text-sm">
          צפה בפרויקט
          <ArrowLeft className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-1 md:h-4 md:w-4" />
        </div>
      </div>
    </a>
  </motion.div>
);

const PortfolioSection = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchProjects().then((all) => setProjects(all.filter((p) => p.featured)));
  }, []);

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

  if (projects.length === 0) {
    return (
      <section dir="rtl" className="relative overflow-hidden bg-background py-10 md:py-14">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 h-3 w-28 rounded-full bg-secondary/80" />
            <div className="mx-auto h-8 w-64 rounded-xl bg-secondary/80" />
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:gap-8">
            {[1, 2, 3, 4].map((i) => <SkeletonPortfolioCard key={i} />)}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      dir="rtl"
      className="relative overflow-hidden bg-background py-10 md:py-14"
      aria-label="פרויקטים אחרונים"
    >
      {/* Ambient */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-1/4 top-0 h-[350px] w-[350px] rounded-full bg-primary/[0.03] blur-[110px]" />
        <div className="absolute bottom-0 left-1/4 h-[280px] w-[280px] rounded-full bg-accent/[0.03] blur-[90px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        {/* Header */}
        <div ref={headerRef} className="mb-8 text-center md:mb-12">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            פרויקטים אחרונים
          </p>
          <h2 className="mb-4 text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
            הופכים חזון ל
            <span className="text-gradient-brand">מציאות דיגיטלית</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            כל פרויקט הוא עולם בפני עצמו — עם סיפור, אתגר ופתרון ייחודי.
          </p>
        </div>

        {/* Grid — no filters */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 md:gap-8">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-8 text-center md:mt-12">
          <Link
            to="/projects/"
            className="btn-glow inline-flex items-center gap-2.5 rounded-2xl bg-primary px-10 py-4 text-sm font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl md:text-base"
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
