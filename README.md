# NZ-web

React + Vite + TypeScript frontend for the NZ-web studio site..

## Local development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```

## Deployment

- Static output directory: `dist`
- Netlify SPA routing is configured in `netlify.toml`
- TODO: set the final production domain before publishing

## Notes

- This project is in a cleanup and stabilization phase ahead of a future Supabase migration.
- Editable content still uses the existing local `src/lib/*-api.ts` boundaries in this phase.
