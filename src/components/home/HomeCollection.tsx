import { Button, ExternalIcon } from "@/components/nz";
import { projects } from "@/content/projects";
import { collection } from "@/content/home";

/* ── data ─────────────────────────────────────────────────────────────── */

/** An image import is a URL string under Vite, an { src, width, height } object under Astro. */
type ImgRef = string | { src: string; width?: number; height?: number } | undefined | null;
const url = (x: ImgRef): string => (typeof x === "string" ? x : x?.src ?? "");

interface Shot {
  src: string;
  srcSet?: string;
  width: number;
  height: number;
}
interface Work {
  id: string;
  title: string;
  link: string;
  field?: string;
  medium: string;
  desktop: Shot;
  mobile?: Shot;
}

type ProjectLike = (typeof projects)[number] & {
  field?: string;
  medium?: string;
  shots?: {
    desktop?: { src1600?: ImgRef; src960?: ImgRef; width?: number; height?: number };
    mobile?: { src780?: ImgRef; src480?: ImgRef; width?: number; height?: number };
  };
};

function toWork(p: ProjectLike): Work | null {
  const d = p.shots?.desktop;
  const m = p.shots?.mobile;
  const d960 = url(d?.src960);
  const d1600 = url(d?.src1600);
  const desktop: Shot | null = d960 || d1600
    ? {
        src: d960 || d1600,
        srcSet: [d960 && `${d960} 960w`, d1600 && `${d1600} 1600w`].filter(Boolean).join(", "),
        width: d?.width ?? 1600,
        height: d?.height ?? 1000,
      }
    : url(p.image as ImgRef)
      ? { src: url(p.image as ImgRef), width: 1200, height: 750 }
      : null;
  if (!desktop) return null;
  const m480 = url(m?.src480);
  const m780 = url(m?.src780);
  const mobile: Shot | undefined = m480 || m780
    ? {
        src: m480 || m780,
        srcSet: [m480 && `${m480} 480w`, m780 && `${m780} 780w`].filter(Boolean).join(", "),
        width: m?.width ?? 780,
        height: m?.height ?? 1688,
      }
    : undefined;
  return {
    id: p.id,
    title: p.title,
    link: p.link,
    field: p.field,
    medium: p.medium ?? p.tags.join(" · "),
    desktop,
    mobile,
  };
}

/** The portfolio is ordered best first (`order`); only published works with a screenshot. */
const works: Work[] = (projects as ProjectLike[])
  .filter((p) => p.published)
  .sort((a, b) => a.order - b.order)
  .map(toWork)
  .filter((w): w is Work => !!w)
  .slice(0, 4);

/* ── view ─────────────────────────────────────────────────────────────── */

/** A screenshot hung like a print: dark moulding, warm mat. Plain <img> (no JS gate). */
const ShotFrame = ({ shot, sizes, kind }: { shot: Shot; sizes: string; kind: "desktop" | "mobile" }) => (
  <span className={`hm-shot hm-shot--${kind}`}>
    <span className="hm-shot__mat">
      <img
        className="hm-shot__img"
        src={shot.src}
        srcSet={shot.srcSet || undefined}
        sizes={sizes}
        width={shot.width}
        height={shot.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    </span>
  </span>
);

/**
 * "The collection" — real client sites hung as a pair: the desktop screenshot framed
 * on the wall, the phone screenshot in a smaller portrait frame overlapping its corner.
 * Each work has a museum label (field, medium) and an outbound link. Static (no client JS).
 */
const HomeCollection = () => (
  <section id="portfolio" className="nz-section nz-section--space-default hm-collection" data-tone="bone" aria-labelledby="hm-collection-title">
    <div className="nz-container">
      <header className="hm-index-head hm-sd">
        <p className="hm-index-head__room nz-label">
          <span className="nz-label__index">{collection.room}</span>
          <span>{collection.eyebrow}</span>
        </p>
        <h2 id="hm-collection-title" className="nz-display nz-display--h2 hm-index-head__title">
          {collection.title}
        </h2>
        <p className="hm-index-head__lede">{collection.lede}</p>
        <p className="hm-index-head__count" aria-hidden="true">
          <span>01</span>
          <span className="hm-index-head__dash" />
          <span>{String(works.length).padStart(2, "0")}</span>
        </p>
      </header>

      <ol className="hm-works">
        {works.map((w, i) => (
          <li key={w.id} className={`hm-work hm-work--${i + 1}${w.mobile ? " has-pair" : ""}`}>
            <a
              href={w.link}
              target="_blank"
              rel="noopener"
              className="hm-work__hang hm-sd"
              tabIndex={-1}
              aria-hidden="true"
            >
              <ShotFrame shot={w.desktop} kind="desktop" sizes="(min-width: 1024px) 50vw, 92vw" />
              {w.mobile && <ShotFrame shot={w.mobile} kind="mobile" sizes="(min-width: 1024px) 12vw, 30vw" />}
            </a>
            <div className="hm-work__meta hm-sd">
              <div className="nz-museum hm-work__label">
                <span className="nz-museum__head">
                  <span className="nz-museum__index">עבודה {String(i + 1).padStart(2, "0")}</span>
                  <h3 className="nz-museum__title hm-work__title">{w.title}</h3>
                </span>
                {w.field && (
                  <span className="hm-work__field">
                    {collection.fieldLabel}: {w.field}
                  </span>
                )}
                <span className="nz-museum__medium">
                  {w.medium}
                  {w.mobile && <> · {collection.pairNote}</>}
                </span>
              </div>
              <a
                href={w.link}
                target="_blank"
                rel="noopener"
                className="nz-link hm-work__visit"
                aria-label={`${w.title}: ${collection.visit} (נפתח בכרטיסייה חדשה)`}
              >
                <span className="nz-link__text">{collection.visit}</span>
                <ExternalIcon className="nz-link__arrow" />
              </a>
            </div>
          </li>
        ))}
      </ol>

      <div className="hm-foot hm-foot--center">
        <Button href={collection.allLink.href} variant="secondary">
          {collection.allLink.label}
        </Button>
      </div>
    </div>
  </section>
);

export default HomeCollection;
