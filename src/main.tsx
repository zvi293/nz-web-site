import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootEl = document.getElementById("root")!;

/**
 * Pre-rendered pages (see scripts/prerender.mjs) ship with real HTML already
 * inside #root, so we hydrate that markup instead of throwing it away.
 * On a normal/dev load #root is empty, so we create a fresh root.
 */
if (rootEl.childElementCount > 0) {
  hydrateRoot(rootEl, <App />);
} else {
  createRoot(rootEl).render(<App />);
}
