import type { Config } from "tailwindcss";

/**
 * NZ-web — "הגלריה" design tokens (see SITE-PLAYBOOK.md §3).
 *
 *   Colours   bone / bone-2 / paper (walls), ink / ink-2 / ink-3 (night rooms),
 *             graphite (secondary text on bone), ash (secondary text on ink),
 *             vermilion (THE accent) + vermilion-deep (small accent text / pressed)
 *             + vermilion-fill (pill fill that keeps white text ≥ 4.5:1).
 *   Type      font-display (Frank Ruhl Libre) / font-sans (Heebo);
 *             text-display-xl, text-display-l, text-h2, text-h3, text-lede, text-body, text-label.
 *   Layout    max-w-gallery (1440px) — use <Container> from "@/components/nz".
 *
 * The shadcn-style tokens below (background, foreground, primary, muted, …) are
 * LEGACY: they are re-pointed to the gallery palette in src/index.css so pages that
 * are not redesigned yet keep rendering. Do not use them in new code.
 */
export default {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx,astro}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        xs: "420px",
      },
      maxWidth: {
        gallery: "1440px",
      },
      fontFamily: {
        display: ['"Frank Ruhl Libre"', '"Frank Ruhl Fallback"', '"Times New Roman"', "serif"],
        sans: ["Heebo", '"Heebo Fallback"', "Arial", "sans-serif"],
        heebo: ["Heebo", '"Heebo Fallback"', "Arial", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3.5rem, 1.6rem + 7.8vw, 10.5rem)", { lineHeight: "0.98", letterSpacing: "-0.02em" }],
        "display-l": ["clamp(2.75rem, 1.6rem + 4.6vw, 7rem)", { lineHeight: "1", letterSpacing: "-0.018em" }],
        h2: ["clamp(2.125rem, 1.4rem + 3vw, 4.5rem)", { lineHeight: "1.04", letterSpacing: "-0.015em" }],
        h3: ["clamp(1.375rem, 1.15rem + 0.9vw, 2rem)", { lineHeight: "1.18", letterSpacing: "-0.01em" }],
        lede: ["clamp(1.125rem, 1.03rem + 0.4vw, 1.375rem)", { lineHeight: "1.65" }],
        body: ["clamp(1rem, 0.95rem + 0.2vw, 1.125rem)", { lineHeight: "1.75" }],
        label: ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
      },
      colors: {
        /* ── Gallery palette ── */
        bone: { DEFAULT: "#EFEAE2", 2: "#E6DFD4" },
        paper: "#F8F6F2",
        ink: { DEFAULT: "#121110", 2: "#1C1A18", 3: "#2A2724" },
        graphite: "#57524B",
        ash: "#A8A097",
        vermilion: { DEFAULT: "#E0401F", deep: "#B8321A", fill: "#D23A1B" },
        line: "rgba(18, 17, 16, 0.14)",
        "line-ink": "rgba(239, 234, 226, 0.14)",

        /* ── LEGACY (shadcn) — re-pointed in index.css, remove after phase 2 ── */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: {
          DEFAULT: "hsl(var(--surface))",
          2: "hsl(var(--surface-2))",
        },
        brand: {
          1: "hsl(var(--brand-1))",
          2: "hsl(var(--brand-2))",
          3: "hsl(var(--brand-3))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        frame: "2px",
        card: "6px",
        /* LEGACY */
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        /* gallery light: a wall-hung piece casts a soft, long shadow downwards */
        frame: "0 1px 1px rgba(18,17,16,0.06), 0 10px 24px -12px rgba(18,17,16,0.28), 0 38px 70px -34px rgba(18,17,16,0.42)",
        "frame-lift": "0 2px 2px rgba(18,17,16,0.06), 0 18px 34px -14px rgba(18,17,16,0.32), 0 52px 90px -40px rgba(18,17,16,0.48)",
        /* LEGACY */
        soft: "var(--shadow-sm)",
        elevated: "var(--shadow-md)",
        floating: "var(--shadow-lg)",
        brand: "var(--shadow-brand)",
      },
      transitionTimingFunction: {
        gallery: "cubic-bezier(0.2, 0.8, 0.1, 1)",
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [],
} satisfies Config;
