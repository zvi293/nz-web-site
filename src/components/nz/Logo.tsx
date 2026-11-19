import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

/**
 * The identity: the wordmark "NZ-web" set in Frank Ruhl Libre, closed by a small
 * vermilion square — "the cube" from the hero artwork (brushstroke-cube) — sitting
 * on the baseline like a full stop.
 *
 * dir="ltr" is load-bearing: inside an RTL page the bidi algorithm would otherwise
 * render "web-NZ". Keep the wordmark inline (no flex children around the letters).
 */
export const Wordmark = ({ className, style }: { className?: string; style?: CSSProperties }) => (
  <span dir="ltr" className={cn("nz-logo", className)} style={style}>
    <span>NZ-web</span>
    <span className="nz-logo__cube" aria-hidden="true" />
  </span>
);

interface LogoProps {
  /** Link target. Default "/". Pass null to render the wordmark without a link. */
  to?: string | null;
  className?: string;
  onClick?: () => void;
}

/** Wordmark linking home. Size it with font-size (it is set in em). */
export const Logo = ({ to = "/", className, onClick }: LogoProps) =>
  to === null ? (
    <Wordmark className={className} />
  ) : (
    <Link to={to} className={cn("inline-flex items-center", className)} aria-label="NZ-web, לדף הבית" onClick={onClick}>
      <Wordmark />
    </Link>
  );

/**
 * Monogram for favicons / avatars: ink square, bone serif "NZ", the vermilion cube.
 * `logoMarkSvg` is the same mark as a standalone SVG string (e.g. for public/favicon.svg).
 */
export const logoMarkSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="6" fill="#121110"/><text x="29" y="44" text-anchor="middle" font-family="'Frank Ruhl Libre','Times New Roman',serif" font-weight="500" font-size="30" letter-spacing="-1" fill="#EFEAE2">NZ</text><rect x="47" y="38" width="7" height="7" fill="#E0401F"/></svg>`;

export const LogoMark = ({ size = 32, className, title }: { size?: number; className?: string; title?: string }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 64 64"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
    aria-label={title}
  >
    <rect width="64" height="64" rx="6" fill="#121110" />
    <text
      x="29"
      y="44"
      textAnchor="middle"
      fontFamily="'Frank Ruhl Libre','Times New Roman',serif"
      fontWeight={500}
      fontSize={30}
      letterSpacing={-1}
      fill="#EFEAE2"
    >
      NZ
    </text>
    <rect x="47" y="38" width="7" height="7" fill="#E0401F" />
  </svg>
);
