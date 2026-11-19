// @ts-check
/**
 * NZ-web — Astro, static multi-page site (SITE-PLAYBOOK §4).
 *
 * Every URL is a complete HTML document generated at build time (dist/<path>/index.html).
 * Zero JS by default; React only as hydrated islands (client:* directives).
 * URLs keep their trailing slash (SEO equity): /services/ , /blog/<slug>/ …
 */
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import { fileURLToPath } from "node:url";

const src = fileURLToPath(new URL("./src", import.meta.url));

/**
 * In Astro, `import img from "./a.webp"` returns an ImageMetadata OBJECT ({ src, width, … }).
 * All React code here (and src/content/*.ts) expects the plain hashed URL string, exactly what
 * Vite gave before — so image imports from TS/TSX/JS modules under src/ are resolved as
 * "<file>?url" (a string). `.astro` files keep Astro's ImageMetadata behaviour.
 */
const IMAGE_RE = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const imageImportsAsUrl = {
  name: "nz:image-imports-as-url",
  enforce: /** @type {const} */ ("pre"),
  async resolveId(source, importer, options) {
    if (!importer || !IMAGE_RE.test(source)) return null;
    const from = importer.split("?")[0];
    if (!from.startsWith(src) || !/\.(m?[jt]sx?)$/.test(from)) return null;
    const resolved = await this.resolve(`${source}?url`, importer, { ...options, skipSelf: true });
    return resolved ?? null;
  },
};

export default defineConfig({
  site: "https://nz-web.com",
  output: "static",
  trailingSlash: "always",
  build: {
    format: "directory",
    /* Hashed JS/CSS go to /assets/ (netlify.toml caches /assets/* as immutable). */
    assets: "assets",
  },
  /* Internal links are fetched on hover / focus / touchstart so the next page is already in
     cache when it is clicked. Opt out per link with data-astro-prefetch="false". */
  prefetch: { prefetchAll: true, defaultStrategy: "hover" },
  integrations: [react()],
  server: { port: 8080, host: true },
  vite: {
    plugins: [imageImportsAsUrl],
    resolve: {
      alias: {
        "@": src,
      },
    },
    /* Netlify env vars are named VITE_GA_ID / VITE_FB_PIXEL_ID / VITE_SITE_URL (see src/lib/analytics.ts). */
    envPrefix: ["PUBLIC_", "VITE_"],
    build: {
      /* Never inline scripts or assets as data:/inline <script>: everything is an external,
         hashed file under 'self', so the CSP needs no 'unsafe-inline'. The only inline
         scripts left are Astro's island bootstrap + the tiny motion-gate boot script, which
         scripts/postbuild.mjs hashes into dist/_headers. */
      assetsInlineLimit: 0,
    },
  },
});
