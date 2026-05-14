import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

/**
 * Always use createRoot (NOT hydrateRoot).
 *
 * Pages are pre-rendered to full static HTML for SEO (see scripts/prerender.mjs),
 * but the app fetches all of its content from Supabase on the client. That means
 * React's very first client render never matches the pre-rendered markup (the
 * pre-rendered HTML has the data; the first client render does not, because the
 * fetch hasn't resolved yet). hydrateRoot would therefore throw hydration
 * mismatch errors (React #418 / #423 / #425).
 *
 * createRoot cleanly re-renders over the pre-rendered HTML instead of trying to
 * reconcile with it. SEO is unaffected — Google still receives the full static
 * HTML from the pre-rendered file; only the user's browser re-renders, which is
 * exactly how a pre-rendered SPA is meant to work.
 */
createRoot(rootEl).render(<App />);
