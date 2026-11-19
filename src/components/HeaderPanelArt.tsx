import { Artwork, MuseumLabel, getArt } from "@/components/art";
import { serviceNav } from "@/components/nz/nav";

/**
 * The services panel's hanging art + museum label (Header.tsx → ServicesPanel).
 *
 * Its own chunk, loaded with React.lazy the first time the panel opens (or is about to:
 * pointer over / focus on the "שירותים" trigger). This is what keeps the art manifest
 * (src/lib/art → art-manifest.json, ~45KB of chunk) out of every page that does not hang art
 * itself — the header ships on all pages, the panel art is seen by few.
 */
const HeaderPanelArt = ({ active, seen }: { active: number; seen: ReadonlySet<number> }) => {
  const current = serviceNav[active];
  return (
    <>
      <div className="nz-mega__stack">
        {serviceNav.map((svc, i) =>
          seen.has(i) ? (
            <div key={svc.art} aria-hidden={i !== active ? "true" : undefined}>
              <Artwork slug={svc.art} sizes="(min-width: 1440px) 520px, 36vw" frame alt="" />
            </div>
          ) : null,
        )}
      </div>
      <MuseumLabel index={active + 1} prefix="מוצג" title={current.label} medium={`מתוך האוסף: ${getArt(current.art).title}`} />
    </>
  );
};

export default HeaderPanelArt;
