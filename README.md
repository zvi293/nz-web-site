# NZ-web

React + Vite + TypeScript frontend for the NZ-web studio site.

**Frontend only.** There is no backend, no database and no API keys — every piece
of content (text, images, projects, blog posts, settings) ships inside the bundle.

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

`npm run build` also pre-renders every route to static HTML for SEO
(`scripts/prerender.mjs`) and regenerates `dist/sitemap.xml`.

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
