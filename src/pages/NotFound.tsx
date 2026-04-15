import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, ArrowLeft, MessageCircle } from "lucide-react";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <Header />

      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-6 pt-[72px]">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-0 h-[500px] w-[500px] rounded-full bg-primary/[0.05] blur-[140px]" />
          <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-accent/[0.05] blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Giant 404 */}
          <div className="relative mb-6 select-none">
            <motion.div
              className="text-[8rem] font-black leading-none tracking-tighter text-foreground/[0.06] md:text-[12rem]"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              404
            </motion.div>

            {/* Floating badge over the number */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-3xl border border-border/40 bg-card/90 px-8 py-6 shadow-2xl backdrop-blur-xl">
                <div className="mb-3 flex justify-center">
                  {/* Animated glitch emoji */}
                  <motion.span
                    className="text-5xl"
                    animate={{ rotate: [0, -5, 5, -5, 0] }}
                    transition={{ duration: 0.5, delay: 1, repeat: 3, repeatDelay: 4 }}
                  >
                    🔍
                  </motion.span>
                </div>
                <p className="text-sm font-semibold uppercase tracking-widest text-primary">שגיאה 404</p>
                <h1 className="mt-1 text-xl font-black text-foreground md:text-2xl">הדף לא נמצא</h1>
              </div>
            </motion.div>
          </div>

          {/* Message */}
          <motion.p
            className="mb-8 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4 }}
          >
            נראה שהדף שחיפשתם עבר לדירה חדשה — או שמעולם לא היה קיים.
            <br />
            לא נורא, נעזור לכם למצוא את הדרך חזרה.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-wrap justify-center gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
          >
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-2.5 rounded-2xl bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-200 hover:scale-[1.04] hover:brightness-110 btn-glow"
            >
              <Home className="h-4 w-4" />
              חזרה לדף הבית
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="inline-flex items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all duration-200 hover:border-primary/30 hover:bg-primary/[0.05] hover:scale-[1.04]"
            >
              <MessageCircle className="h-4 w-4 text-primary" />
              צרו קשר
            </button>
          </motion.div>

          {/* Quick nav links */}
          <motion.div
            className="mt-10 flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {[
              { label: "פרויקטים", href: "/projects" },
              { label: "שירותים", href: "/#services" },
              { label: "מי אנחנו", href: "/about" },
              { label: "שאלות נפוצות", href: "/faq" },
            ].map((link) => (
              <button
                key={link.href}
                onClick={() => navigate(link.href)}
                className="group flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                <ArrowLeft className="h-3 w-3 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-0.5" />
                {link.label}
              </button>
            ))}
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;
