import { useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import MuseumLabel, { type MuseumLabelProps } from "./MuseumLabel";

export interface FramedImageProps {
  src: string;
  /** Intrinsic size of the file (for width/height → no CLS). */
  width: number;
  height: number;
  alt: string;
  /** Crop to a ratio (default "16/10" — good for site screenshots). */
  ratio?: string;
  /** object-position (default "top" — screenshots read from the top). */
  position?: string;
  frame?: boolean;
  hover?: boolean;
  /** Placeholder colour under the image. */
  color?: string;
  label?: Omit<MuseumLabelProps, "as">;
  sizes?: string;
  className?: string;
  style?: CSSProperties;
}

/**
 * Same gallery treatment as <Artwork>, for images that are not in the art collection
 * (project screenshots, client images). Lazy, fades in on load under the motion gate.
 */
const FramedImage = ({
  src,
  width,
  height,
  alt,
  ratio = "16/10",
  position = "top",
  frame = true,
  hover = false,
  color = "var(--bone-2)",
  label,
  sizes,
  className,
  style,
}: FramedImageProps) => {
  const ref = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const img = ref.current;
    if (img && img.complete && img.naturalWidth > 0) setLoaded(true);
  }, [src]);

  const Tag = label ? "figure" : "div";
  const canvas = (
    <div className="nz-art__canvas" style={{ aspectRatio: ratio, ["--art-color" as string]: color }}>
      <img
        ref={ref}
        className="nz-art__img"
        src={src}
        width={width}
        height={height}
        alt={alt}
        sizes={sizes}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        style={{ objectPosition: position }}
      />
    </div>
  );

  return (
    <Tag
      className={cn("nz-art", frame && "nz-art--frame", hover && "nz-art--hover", loaded && "is-loaded", className)}
      style={style}
      /* global.ts marks a loaded image's wrapper .is-loaded before hydration (so static art un-blurs
         without React); the class then matches once the effect below sees img.complete. */
      suppressHydrationWarning
    >
      {frame ? <div className="nz-art__frame">{canvas}</div> : canvas}
      {label && <MuseumLabel as="figcaption" {...label} />}
    </Tag>
  );
};

export default FramedImage;
