import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { getArt, preloadArt } from "@/lib/art";
import { cn } from "@/lib/utils";
import MuseumLabel, { type MuseumLabelProps } from "./MuseumLabel";

export interface ArtworkProps {
  slug: string;
  /** `sizes` for the srcset — be honest, it decides which file is downloaded. Default "100vw". */
  sizes?: string;
  /** LCP image: eager + fetchpriority=high + a <link rel=preload> baked into the pre-rendered HTML. */
  priority?: boolean;
  /** Load now (no lazy) without the LCP treatment — e.g. a piece about to be revealed under a clip-path,
   *  which a lazy image would never "see" (lazy loading ignores fully clipped elements). */
  eager?: boolean;
  /** Hang it: dark moulding, warm mat, real shadow. */
  frame?: boolean;
  /** A soft gallery spot-light on the wall above the piece. */
  lit?: boolean;
  /** Frame lifts 4px with a deeper shadow on hover (also when the parent <a> is hovered). */
  hover?: boolean;
  /** Crop to an aspect ratio, e.g. "4/5" or "3/2". Default: the work's own proportions. */
  ratio?: string;
  /** object-position when cropped, e.g. "30% 50%". */
  position?: string;
  /** Override the manifest alt (Hebrew). Pass "" for a purely decorative use. */
  alt?: string;
  /** Museum label under the piece. `true` = manifest title only; an object adds index/prefix/medium. */
  label?: boolean | (Partial<Omit<MuseumLabelProps, "as">> & { title?: MuseumLabelProps["title"] });
  className?: string;
  canvasClassName?: string;
  imgClassName?: string;
  style?: CSSProperties;
  onLoad?: () => void;
}

/**
 * <Artwork slug="brushstroke-cube" sizes="(min-width:1024px) 50vw, 100vw" frame label={{ index: 1 }} />
 *
 * AVIF + WebP <picture> (640/1080/1600w), width/height from the manifest (no CLS),
 * LQIP blur + dominant colour underneath that fade out on load, lazy by default.
 */
const Artwork = ({
  slug,
  sizes = "100vw",
  priority = false,
  eager = false,
  frame = false,
  lit = false,
  hover = false,
  ratio,
  position,
  alt,
  label,
  className,
  canvasClassName,
  imgClassName,
  style,
  onLoad,
}: ArtworkProps) => {
  const art = getArt(slug);
  const imgRef = useRef<HTMLImageElement>(null);
  const [loaded, setLoaded] = useState(false);

  const handleLoad = useCallback(() => {
    setLoaded(true);
    onLoad?.();
  }, [onLoad]);

  useEffect(() => {
    setLoaded(false);
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) handleLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [art.slug]);

  useEffect(() => {
    if (priority) preloadArt(art.slug, sizes);
  }, [priority, art.slug, sizes]);

  const labelProps =
    label === true ? { title: art.title } : label ? { ...label, title: label.title ?? art.title } : null;
  const Tag = labelProps ? "figure" : "div";

  const canvasStyle: CSSProperties & Record<string, string> = {
    "--art-color": art.color,
    "--art-lqip": `url("${art.lqip}")`,
    aspectRatio: ratio ?? `${art.width} / ${art.height}`,
  };

  const priorityAttrs = priority
    ? ({ loading: "eager", fetchpriority: "high" } as Record<string, string>)
    : ({ loading: eager ? "eager" : "lazy" } as Record<string, string>);

  const canvas = (
    <div className={cn("nz-art__canvas", canvasClassName)} style={canvasStyle}>
      <picture>
        <source type="image/avif" srcSet={art.avifSrcSet} sizes={sizes} />
        <source type="image/webp" srcSet={art.webpSrcSet} sizes={sizes} />
        <img
          ref={imgRef}
          className={cn("nz-art__img", imgClassName)}
          src={art.src}
          width={art.width}
          height={art.height}
          alt={alt ?? art.alt}
          decoding="async"
          onLoad={handleLoad}
          style={position ? { objectPosition: position } : undefined}
          {...priorityAttrs}
        />
      </picture>
    </div>
  );

  return (
    <Tag
      className={cn(
        "nz-art",
        frame && "nz-art--frame",
        lit && "nz-art--lit",
        hover && "nz-art--hover",
        priority && "is-priority",
        loaded && "is-loaded",
        className,
      )}
      style={style}
      data-art={art.slug}
    >
      {frame ? <div className="nz-art__frame">{canvas}</div> : canvas}
      {labelProps && <MuseumLabel as="figcaption" {...labelProps} />}
    </Tag>
  );
};

export default Artwork;
