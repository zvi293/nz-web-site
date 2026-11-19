import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { initMotionGate } from "./lib/motion";

/* Open the motion gate (html.nz-motion) before the first render, so entrance
   animations start from their hidden state instead of flashing. See src/lib/motion.ts. */
initMotionGate();

const rootEl = document.getElementById("root")!;

/**
 * Always use createRoot (NOT hydrateRoot).
 *
 * Pages are pre-rendered to full static HTML for SEO (see scripts/prerender.mjs).
 * All content ships inside the bundle (src/content), so the markup matches, but the
 * first client render still differs from the saved HTML in small ways (viewport-
 * dependent UI, image load states), and hydrateRoot would report those as mismatch
 * errors (React #418 / #423 / #425).
 *
 * createRoot cleanly re-renders over the pre-rendered HTML instead of trying to
 * reconcile with it. SEO is unaffected — Google still receives the full static
 * HTML from the pre-rendered file; only the user's browser re-renders, which is
 * exactly how a pre-rendered SPA is meant to work.
 */
createRoot(rootEl).render(<App />);
