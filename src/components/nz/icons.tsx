/* Minimal inline icons for the kit. Decorative — always aria-hidden. */

/** Arrow pointing to the reading direction's "forward" (left in RTL). */
export const ArrowIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
    <path d="M16 10H4.5M9 5 4 10l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

/** Outbound arrow (opens another site). */
export const ExternalIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
    <path d="M14 6 5.5 14.5M7 5.5h7.5V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
  </svg>
);

export const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" focusable="false">
    <path d="M12.04 2.5c-5.24 0-9.5 4.24-9.5 9.47 0 1.67.44 3.3 1.27 4.74L2.5 21.5l4.92-1.29a9.5 9.5 0 0 0 4.62 1.18c5.24 0 9.5-4.24 9.5-9.47 0-2.53-.99-4.9-2.79-6.69a9.45 9.45 0 0 0-6.71-2.73Zm0 17.29a7.9 7.9 0 0 1-4.02-1.1l-.29-.17-2.92.76.78-2.84-.19-.29a7.82 7.82 0 0 1-1.21-4.18c0-4.35 3.55-7.88 7.86-7.88 2.1 0 4.08.82 5.56 2.3a7.8 7.8 0 0 1 2.3 5.57c0 4.35-3.54 7.83-7.87 7.83Zm4.32-5.89c-.24-.12-1.4-.69-1.62-.77-.22-.08-.38-.12-.54.12-.16.24-.62.77-.76.93-.14.16-.28.18-.52.06-.24-.12-1-.37-1.91-1.18-.7-.63-1.18-1.4-1.32-1.64-.14-.24-.01-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.32.98 2.48c.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.51.58.18 1.1.16 1.51.1.46-.07 1.4-.57 1.6-1.12.2-.55.2-1.02.14-1.12-.06-.1-.22-.16-.46-.28Z" />
  </svg>
);
