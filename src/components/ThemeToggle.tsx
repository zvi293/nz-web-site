import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check localStorage and system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className="group relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-border/60 bg-secondary/40 transition-all duration-200 hover:scale-105 hover:border-primary/35"
      aria-label={theme === "light" ? "עבור למצב כהה" : "עבור למצב בהיר"}
    >
      {/* brand wash that blooms in on hover */}
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "linear-gradient(135deg, hsl(var(--brand-1) / 0.14), hsl(var(--brand-3) / 0.14))" }}
        aria-hidden="true"
      />
      <AnimatePresence mode="wait" initial={false}>
        {theme === "light" ? (
          <motion.span
            key="moon"
            initial={{ y: 12, opacity: 0, rotate: -35 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -12, opacity: 0, rotate: 35 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Moon className="h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-primary" />
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ y: 12, opacity: 0, rotate: -35 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -12, opacity: 0, rotate: 35 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <Sun className="h-[18px] w-[18px] text-muted-foreground transition-colors group-hover:text-primary" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
};

export default ThemeToggle;
