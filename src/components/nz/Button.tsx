import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { contactInfo, getWhatsAppHref } from "@/lib/contact-utils";
import { ArrowIcon, ExternalIcon, WhatsAppIcon } from "./icons";

type Variant = "primary" | "secondary" | "quiet";
type Icon = "arrow" | "whatsapp" | "external" | "none";

interface CommonProps {
  /** primary = vermilion pill · secondary = outline pill (ink on bone, bone on ink) · quiet = text link with draw-in underline. */
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** Default: "arrow" for quiet, "external" for external quiet links, otherwise none. */
  icon?: Icon;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
  "aria-describedby"?: string;
  onClick?: MouseEventHandler<HTMLElement>;
}

type ButtonProps =
  | (CommonProps & { to: string; href?: never; type?: never; disabled?: never })
  | (CommonProps & { href: string; to?: never; type?: never; disabled?: never; /** force new tab (auto for http/https). */ newTab?: boolean })
  | (CommonProps & { to?: never; href?: never; type?: "button" | "submit"; disabled?: boolean });

/* Literal class names — Tailwind only keeps @layer classes it can find in the source. */
const VARIANT_CLASS = { primary: "nz-btn--primary", secondary: "nz-btn--secondary", quiet: "" } as const;
const SIZE_CLASS = { sm: "nz-btn--sm", md: "", lg: "nz-btn--lg" } as const;

const NEW_TAB_NOTE = " (נפתח בכרטיסייה חדשה)";

function Glyph({ icon }: { icon: Icon }) {
  if (icon === "arrow") return <ArrowIcon className="nz-btn__icon nz-btn__arrow nz-link__arrow" />;
  if (icon === "external") return <ExternalIcon className="nz-btn__icon nz-link__arrow" />;
  if (icon === "whatsapp") return <WhatsAppIcon className="nz-btn__icon" />;
  return null;
}

/**
 * <Button to="/projects/">…</Button>            internal (react-router Link)
 * <Button href="https://…">…</Button>           external — opens in a new tab, rel="noopener noreferrer"
 * <Button onClick={…}>…</Button>                <button type="button">
 */
export const Button = (props: ButtonProps) => {
  const { variant = "primary", size = "md", className, children, onClick } = props;
  const href = "href" in props ? props.href : undefined;
  const to = "to" in props ? props.to : undefined;
  const external = !!href && (/^https?:\/\//.test(href) || ("newTab" in props && !!props.newTab));
  const icon: Icon = props.icon ?? (variant === "quiet" ? (external ? "external" : "arrow") : "none");

  const cls =
    variant === "quiet"
      ? cn("nz-link", className)
      : cn("nz-btn", VARIANT_CLASS[variant], SIZE_CLASS[size], className);

  const content =
    variant === "quiet" ? (
      <>
        <span className="nz-link__text">{children}</span>
        <Glyph icon={icon} />
      </>
    ) : (
      <>
        {icon === "whatsapp" && <Glyph icon={icon} />}
        <span>{children}</span>
        {icon !== "whatsapp" && <Glyph icon={icon} />}
      </>
    );

  const aria = { "aria-label": props["aria-label"], "aria-describedby": props["aria-describedby"] };

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} {...aria}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        {...aria}
      >
        {content}
        {external && !props["aria-label"] && <span className="nz-sr">{NEW_TAB_NOTE}</span>}
      </a>
    );
  }
  const { type = "button", disabled } = props as CommonProps & { type?: "button" | "submit"; disabled?: boolean };
  return (
    <button type={type} disabled={disabled} className={cls} onClick={onClick} {...aria}>
      {content}
    </button>
  );
};

interface WhatsAppCtaProps {
  label?: string;
  /** Pre-filled message. Default: site-settings message. */
  message?: string;
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  /** Show the WhatsApp glyph (default true for pills). */
  glyph?: boolean;
  className?: string;
}

/** The studio's main CTA — WhatsApp chat (wa.me, new tab). Uses src/lib/contact-utils. */
export const WhatsAppCta = ({
  label = "לשיחה בוואטסאפ",
  message,
  variant = "primary",
  size = "md",
  glyph = true,
  className,
}: WhatsAppCtaProps) => (
  <Button
    href={getWhatsAppHref(contactInfo, message ?? contactInfo.whatsappMessage)}
    variant={variant}
    size={size}
    icon={variant === "quiet" ? "external" : glyph ? "whatsapp" : "none"}
    className={className}
  >
    {label}
  </Button>
);
