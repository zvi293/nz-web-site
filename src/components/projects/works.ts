/**
 * /projects/ data: the published works (src/content/projects.ts) as plain, serialisable objects
 * (strings + numbers only — safe as island props), plus the salon-hang layout shared by the wall
 * (SalonWall), the printed wall key and the catalogue mini-keys.
 */
import { publishedProjects } from "@/content/projects";

/** An image import is a URL string under the astro.config plugin, an { src } object otherwise. */
type ImgRef = string | { src: string } | undefined | null;
const url = (x: ImgRef): string => (typeof x === "string" ? x : x?.src ?? "");

export interface WorkShot {
  src: string;
  srcSet: string;
  width: number;
  height: number;
}

export interface Work {
  id: string;
  /** 1-based exhibit number (order on the wall = order in the catalogue). */
  n: number;
  title: string;
  field: string;
  medium: string;
  description: string;
  link: string;
  /** Host shown on the outbound link, e.g. "ahia-cars.co.il" — empty for temporary *.netlify.app addresses. */
  host: string;
  /** The service page that builds this kind of site (contextual internal link). */
  service: { label: string; href: string };
  desktop: WorkShot;
  mobile: WorkShot;
}

/** Which of our service pages each work belongs to (descriptive internal links). */
const SERVICE_OF: Record<string, { label: string; href: string }> = {
  "ahia-cars": { label: "אתר תדמית ליועץ ומאמן", href: "/services/business-website/consultant/" },
  "sivan-eyebrows": { label: "אתר לעסק יופי", href: "/services/business-website/beauty/" },
  "jewish-calendar": { label: "פיתוח אתרים ואפליקציות רשת", href: "/services/web-development/" },
  "carmit-therapy": { label: "אתר תדמית לקליניקה", href: "/services/business-website/clinic/" },
  "mentor-moshe": { label: "אתר תדמית לעסק", href: "/services/business-website/" },
  "brows-studio": { label: "בניית אתרים לעסקים", href: "/services/website-development/" },
};
const DEFAULT_SERVICE = { label: "כל השירותים", href: "/services/" };

export const works: Work[] = publishedProjects
  .filter((p) => p.shots)
  .map((p, i) => {
    const d = p.shots!.desktop;
    const m = p.shots!.mobile;
    return {
      id: p.id,
      n: i + 1,
      title: p.title,
      field: p.field,
      medium: p.medium,
      description: p.description,
      link: p.link,
      host: /\.netlify\.app\/?$/.test(p.link) ? "" : p.link.replace(/^https?:\/\//, "").replace(/\/$/, ""),
      service: SERVICE_OF[p.id] ?? DEFAULT_SERVICE,
      desktop: {
        src: url(d.src960 as ImgRef),
        srcSet: `${url(d.src960 as ImgRef)} 960w, ${url(d.src1600 as ImgRef)} 1600w`,
        width: d.width,
        height: d.height,
      },
      mobile: {
        src: url(m.src480 as ImgRef),
        srcSet: `${url(m.src480 as ImgRef)} 480w, ${url(m.src780 as ImgRef)} 780w`,
        width: m.width,
        height: m.height,
      },
    };
  });

/* ── The salon hang ────────────────────────────────────────────────────────
 * Desktop: three rows hung around a centre line, the best work largest in the middle row, an
 * empty "reserved" frame closing the bottom row. Widths are % of the wall. Each work hangs as a
 * pair: its desktop screenshot and, beside it, its phone screenshot (order dm = desktop first in
 * reading order, i.e. on the right in RTL). Works beyond the plan fall back to a default size. */
export interface Hang {
  /** index into `works`, or -1 for the reserved frame */
  w: number;
  /** desktop-shot frame width / phone-shot frame width, % of the wall (≥ 1024px) */
  d: number;
  m: number;
  o: "dm" | "md";
}

export const WALL_ROWS: Hang[][] = [
  [
    { w: 1, d: 21, m: 6.4, o: "dm" },
    { w: 3, d: 21, m: 6.4, o: "md" },
  ],
  [
    { w: 4, d: 15.5, m: 4.9, o: "md" },
    { w: 0, d: 31, m: 9.6, o: "dm" },
    { w: 2, d: 15.5, m: 4.9, o: "dm" },
  ],
  [
    { w: 5, d: 21, m: 6.4, o: "dm" },
    { w: -1, d: 11, m: 0, o: "dm" },
  ],
];

/** Phones (< 1024px): one work per row, sizes and alignment cycling so the wall stays irregular. */
export const PHONE_CYCLE = [
  { d: 64, m: 21, j: "center" },
  { d: 54, m: 18, j: "start" },
  { d: 58, m: 19, j: "end" },
] as const;

/** Frame aspect ratios incl. moulding + mat (used by the wall key). */
export const DESKTOP_FRAME_RATIO = 1.5;
export const PHONE_FRAME_RATIO = 0.5;

export interface KeyRect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** works index, -1 = reserved frame */
  work: number;
  kind: "desktop" | "mobile" | "reserved";
}

/** The hang as rectangles in a 1000-wide coordinate space (for the printed wall key). */
export function wallKey(rows: Hang[][] = WALL_ROWS): { rects: KeyRect[]; height: number } {
  const W = 1000;
  const gapPair = 12;
  const gapHang = 34;
  const gapRow = 40;
  const rects: KeyRect[] = [];
  let y = 0;
  for (const row of rows) {
    const items = row.map((h) => {
      const parts: { kind: KeyRect["kind"]; w: number; h: number }[] = [];
      if (h.w < 0) {
        const wd = (h.d / 100) * W;
        parts.push({ kind: "reserved", w: wd, h: wd / 0.8 });
      } else {
        const wd = (h.d / 100) * W;
        const wm = (h.m / 100) * W;
        const desk = { kind: "desktop" as const, w: wd, h: wd / DESKTOP_FRAME_RATIO };
        const phone = { kind: "mobile" as const, w: wm, h: wm / PHONE_FRAME_RATIO };
        parts.push(...(h.o === "dm" ? [desk, phone] : [phone, desk]));
      }
      const width = parts.reduce((s, p) => s + p.w, 0) + gapPair * (parts.length - 1);
      const height = Math.max(...parts.map((p) => p.h));
      return { h, parts, width, height };
    });
    const rowW = items.reduce((s, it) => s + it.width, 0) + gapHang * (items.length - 1);
    const rowH = Math.max(...items.map((it) => it.height));
    /* RTL: the first item hangs on the right */
    let x = (W + rowW) / 2;
    for (const it of items) {
      let px = x;
      for (const p of it.parts) {
        px -= p.w;
        rects.push({ x: px, y: y + (rowH - p.h) / 2, w: p.w, h: p.h, work: it.h.w, kind: p.kind });
        px -= gapPair;
      }
      x -= it.width + gapHang;
    }
    y += rowH + gapRow;
  }
  return { rects, height: y - gapRow };
}
