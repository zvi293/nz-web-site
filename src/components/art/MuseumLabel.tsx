import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatIndex } from "./format";

export interface MuseumLabelProps {
  /** Exhibit number — numbers are zero-padded to two digits ("01"). */
  index?: number | string;
  /** Word before the index, e.g. "מוצג" / "עבודה" / "שלב". */
  prefix?: string;
  /** The work's title (Artwork passes the manifest title by default). */
  title: ReactNode;
  /** The quiet "medium" / caption line under the title. */
  medium?: ReactNode;
  as?: ElementType;
  className?: string;
  id?: string;
}


/**
 * The wall card next to a piece: a hairline, a vermilion index, the title in the
 * display serif and one quiet line of medium/caption. Tone-aware (bone / ink).
 */
const MuseumLabel = ({ index, prefix = "מוצג", title, medium, as: Tag = "div", className, id }: MuseumLabelProps) => (
  <Tag className={cn("nz-museum", className)} id={id}>
    <span className="nz-museum__head">
      {index !== undefined && (
        <span className="nz-museum__index">
          {prefix ? `${prefix} ` : ""}
          {formatIndex(index)}
        </span>
      )}
      <span className="nz-museum__title">{title}</span>
    </span>
    {medium && <span className="nz-museum__medium">{medium}</span>}
  </Tag>
);

export default MuseumLabel;
