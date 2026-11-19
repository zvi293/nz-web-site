import "@/components/legal/floating-ui.css";

/**
 * A quiet way back to the lobby (legacy page views render it above their hero).
 * Static markup: a plain link, no client JS needed.
 */
const BackToHome = () => (
  <div className="nz-container nzc-back">
    <a href="/" className="nz-link nzc-back__link">
      <svg className="nzc-back__arrow" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
        <path d="M4 10h11.5M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
      </svg>
      <span className="nz-link__text">חזרה לדף הבית</span>
    </a>
  </div>
);

export default BackToHome;
