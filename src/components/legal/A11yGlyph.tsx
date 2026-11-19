/** The universal-access figure, drawn (no icon library). */
const A11yGlyph = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
    <circle cx="12" cy="4.6" r="2.1" fill="currentColor" />
    <path
      d="M4.5 8.6c2.4.7 4.9 1.05 7.5 1.05s5.1-.35 7.5-1.05M12 9.7v4.6m0 0-3.1 6.6M12 14.3l3.1 6.6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default A11yGlyph;
