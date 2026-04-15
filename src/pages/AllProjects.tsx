import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { fetchProjects, type Project } from "@/lib/projects-api";
import { createLabeledImageDataUri, isRenderableAssetUrl } from "@/lib/runtime-safety";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import gsap from "gsap";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

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
      alt={`פרויקט ${project.title} – עיצוב ופיתוח אתר`}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
      decoding="async"
      onError={() => setSrc(fallbackSrc)}
    />
  );
};

const AllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useSeoMeta({
    title: "פורטפוליו | פרויקטי בניית אתרים ופיתוח | NZ-web",
    description:
      "גלו פרויקטי בניית אתרים ופיתוח אתרים שביצענו ללקוחות בישראל. אתרי תדמית, חנויות אונליין, מערכות ניהול תורים ודפי נחיתה — כל פרויקט עם תוצאות מדידות.",
    keywords: "פורטפוליו בניית אתרים, דוגמאות אתרים, פרויקטי פיתוח, אתרים שבנינו, תיק עבודות בניית אתרים",
  });
  useBreadcrumb({ name: "פרויקטים", path: "/projects" });

  useEffect(() => {
    fetchProjects().then(setProjects);
  }, []);

  useEffect(() => {
    if (!gridRef.current || projects.length === 0) return;
    const cards = gridRef.current.querySelectorAll("[data-card]");
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" },
    );
  }, [projects]);

  return (
    <div dir="rtl" className="min-h-screen bg-background pt-[72px]">
      <Header />
      <BackToHome />

      <div className="container mx-auto px-4 py-12 md:px-6 md:py-20">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
            פורטפוליו
          </p>
          <h1 className="text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
            הפרויקטים שלנו
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            הפרויקטים שבנינו עם אהבה, מקצועיות וחדשנות
          </p>
        </div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:grid-cols-3"
        >
          {projects.map((project) => (
            <a
              key={project.id}
              data-card
              href={project.link || "#"}
              target={project.link ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/40 bg-card shadow-[0_4px_24px_-6px_hsl(var(--foreground)/0.06)] transition-all duration-500 hover:-translate-y-2 hover:border-primary/25 hover:shadow-[0_20px_60px_-12px_hsl(var(--primary)/0.15)] md:rounded-3xl"
            >
              {/* Image with hover overlay */}
              <div className="relative h-44 overflow-hidden md:h-56">
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

                {/* Tag badge */}
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
                    <span
                      key={tag}
                      className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-sm font-bold leading-snug text-foreground md:text-lg">
                  {project.title}
                </h3>
                <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground md:line-clamp-3 md:text-sm">
                  {project.description}
                </p>

                <div className="mt-1 flex items-center gap-1.5 text-[11px] font-semibold text-primary transition-all duration-200 group-hover:gap-3 md:mt-2 md:text-sm">
                  צפה בפרויקט
                  <ArrowLeft className="h-3 w-3 transition-transform duration-200 group-hover:-translate-x-1 md:h-4 md:w-4" />
                </div>
              </div>
            </a>
          ))}
        </div>

        {projects.length === 0 && (
          <p className="py-20 text-center text-muted-foreground">אין פרויקטים עדיין.</p>
        )}

        {/* CTA */}
        <div className="mt-16 text-center md:mt-24">
          <p className="mb-4 text-lg text-muted-foreground">רוצים פרויקט כזה? בואו נדבר.</p>
          <Link
            to="/contact"
            className="inline-block rounded-2xl bg-primary px-10 py-4 text-base font-bold text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl btn-glow"
          >
            צרו קשר
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            מחפשים תהליך פיתוח מסודר לאתר חדש?{" "}
            <Link to="/services/website-development" className="text-primary hover:underline">
              קראו על שירות פיתוח האתרים שלנו
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllProjects;
