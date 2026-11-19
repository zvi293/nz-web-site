/// <reference types="vite/client" />
/*
 * Types for the TS/TSX code. Deliberately NOT "astro/client": astro.config.mjs resolves image
 * imports from TS/TSX modules as plain URL strings (`?url`), which is what vite/client declares.
 * (.astro files are compiled by Astro itself.)
 */

interface ImportMetaEnv {
  readonly VITE_GA_ID?: string;
  readonly VITE_FB_PIXEL_ID?: string;
  readonly VITE_SITE_URL?: string;
}
