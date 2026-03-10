import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

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
      className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors duration-200 group"
      aria-label={theme === "light" ? "עבור למצב כהה" : "עבור למצב בהיר"}
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      ) : (
        <Sun className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
      )}
    </button>
  );
};

export default ThemeToggle;
