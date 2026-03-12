import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { fetchProjects, type Project } from "@/lib/projects-api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import gsap from "gsap";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const AllProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);

  useSeoMeta({
    title: "הפרויקטים שלנו | NZ-web – פורטפוליו עיצוב ופיתוח",
    description:
      "צפו בפורטפוליו של NZ-web – אתרים, אפליקציות ומערכות שבנינו ללקוחות. כל פרויקט בנוי עם React, Tailwind, Supabase ועיצוב UI/UX מרהיב.",
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
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }
    );
  }, [projects]);

  return (
    <div dir="rtl" className="min-h-screen bg-background pt-[72px]">
      <Header />
      <BackToHome />
      
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-20">
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16">
          

          
          <h1 className="text-3xl font-black leading-tight text-foreground md:text-4xl lg:text-5xl">
            הפרויקטים שלנו
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            הפרויקטים שבנינו עם אהבה, מקצועיות וחדשנות
          </p>
        </div>

        {/* Projects grid */}
        <div ref={gridRef} className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 md:gap-8">
          {projects.map((project) =>
          <div
            key={project.id}
            data-card
            className="group cursor-pointer overflow-hidden rounded-2xl md:rounded-3xl bg-card shadow-lg shadow-muted/50 transition-transform duration-500 hover:-translate-y-2">
            
              <div className="h-48 md:h-56 overflow-hidden">
                <img
                src={project.image}
                alt={`פרויקט ${project.title} – עיצוב ופיתוח אתר`}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              
              </div>

              <div className="flex flex-col gap-3 p-5 md:p-6">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) =>
                <span
                  key={tag}
                  className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  
                      {tag}
                    </span>
                )}
                </div>

                <h3 className="text-lg md:text-xl font-bold text-foreground leading-snug">
                  {project.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {project.description}
                </p>

                <a
                href={project.link || "#"}
                className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80">
                
                  צפה בפרויקט
                  <ArrowLeft className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>

        {projects.length === 0 &&
        <p className="text-center text-muted-foreground py-20">אין פרויקטים עדיין.</p>
        }

        {/* CTA */}
        <div className="mt-16 md:mt-24 text-center">
          <p className="text-muted-foreground text-lg mb-4">רוצים פרויקט כזה? בואו נדבר.</p>
          <Link
            to="/contact"
            className="inline-block bg-primary text-primary-foreground font-bold text-base px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            צרו קשר
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            מתעניינים בפיתוח React?{" "}
            <Link to="/services/react-development" className="text-primary hover:underline">
              קראו על שירות פיתוח React שלנו
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>);

};

export default AllProjects;