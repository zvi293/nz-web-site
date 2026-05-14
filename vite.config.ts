import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    /**
     * Split heavy vendor libraries into their own cached chunks instead of one
     * giant main bundle. This parallelises the initial download and lets the
     * browser cache vendor code across deploys — app updates no longer force a
     * re-download of React / animation / Supabase code.
     */
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          if (
            id.includes("react-dom") ||
            id.includes("react-router") ||
            id.includes("/react/") ||
            id.includes("scheduler")
          ) {
            return "react-vendor";
          }
          if (id.includes("framer-motion") || id.includes("gsap")) return "animation-vendor";
          if (id.includes("@supabase")) return "supabase-vendor";
          if (id.includes("recharts") || id.includes("/d3-") || id.includes("victory")) {
            return "charts-vendor";
          }
          if (id.includes("@radix-ui")) return "radix-vendor";
          return "vendor";
        },
      },
    },
  },
}));
