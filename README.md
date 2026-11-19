# NZ-web

Static multi-page site (Astro + React islands + TypeScript + Tailwind) for the NZ-web studio.
Every URL is a complete HTML page generated at build time; React runs only in interactive
"islands". Architecture and rules: `SITE-PLAYBOOK.md` §4.

**Frontend only.** There is no backend, no database and no API keys — every piece
of content (text, images, projects, blog posts, settings) ships inside the bundle.

## Local development

```sh
npm install
npm run dev        # astro dev on http://localhost:8080
```

## Build

```sh
npm run build
```

`npm run build` = `astro build` (every page → `dist/<path>/index.html`) + `scripts/postbuild.mjs`
(`dist/sitemap.xml` with image entries, and `dist/_headers` with the CSP incl. inline-script
hashes). `npm run preview` serves `dist/` on http://localhost:8080.

## Editing content

All content lives in `src/content/` — edit the file, rebuild, deploy:

| File | What it holds |
| --- | --- |
| `site-settings.ts` | phone / email / WhatsApp, SEO defaults, footer, privacy, terms, accessibility |
| `projects.ts` | portfolio projects (images in `src/assets/projects`) |
| `services.ts` | homepage service blocks (videos in `public/videos`) |
| `testimonials.ts` | client testimonials |
| `faq.ts` | FAQ page questions |
| `about.ts` | the About page |
| `blog.ts` | blog posts (covers in `src/assets/blog`) |
| `client-logos.ts` | client logo strip (empty → the section hides itself) |
| `types.ts` | the types for all of the above |

Images: add the file under `src/assets/…`, `import` it in the content file and
reference the imported variable. Vite hashes and serves it from `dist/assets`.

## Contact form

The form has no server side: on submit it opens WhatsApp with the visitor's
details pre-composed (`https://wa.me/…`). The number and default message come
from `site-settings.ts`.

## Deployment

- Static output directory: `dist`
- Netlify redirects, headers and caching are configured in `netlify.toml`
- Only optional env vars: `VITE_SITE_URL`, `VITE_GA_ID`, `VITE_FB_PIXEL_ID`
