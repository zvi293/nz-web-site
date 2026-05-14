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
  /**
   * NOTE: a custom `build.rollupOptions.output.manualChunks` was removed here.
   * It split React into a separate chunk from libraries that call
   * `React.forwardRef` at module-init time, so in the production build those
   * libraries ran before React was defined → "Cannot read properties of
   * undefined (reading 'forwardRef')" → the whole app failed to mount, which
   * broke the SEO pre-render step and every Netlify deploy. Vite's default
   * chunking is safe; bundle-size tuning can be revisited carefully later.
   */
}));
