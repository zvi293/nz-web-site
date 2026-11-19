// Signature component: השערים — portal tunnel (walk through receding gates)
import { useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { ArrowIcon } from "@/components/nz";
import { notFoundCopy } from "./copy";

const g = notFoundCopy.gates;
const ROOMS = g.rooms;
const TOTAL = ROOMS.length;
/** How many gates are visible behind the front one. */
const DEPTH = 4;

/**
 * "השערים" — the gates (signature of the 404 page).
 * Ceramic portals recede into a night desert, one behind the other; each is the door to a real
 * room of the site, its name on the lintel. The room card under the scene names the front gate's
 * room (one line, "enter" link). Walk deeper ("next gate", ↑ / ← keys, or tap the gate behind
 * it — nothing covers it): the front gate flies past you and the next one comes forward. aria-live names the gate in front. The full list of rooms is
 * always rendered as plain links underneath (no-JS and screen-reader path).
 * Reduced motion: the gates change instantly (no flight).
 */
const PortalTunnel = () => {
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);

  const go = (i: number) => {
    const n = ((i % TOTAL) + TOTAL) % TOTAL;
    setActive(n);
    setAnnounce(g.announce(n + 1, TOTAL, ROOMS[n].name));
  };

  const onKey = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(active + 1);
    } else if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(active - 1);
    }
  };

  return (
    <div className="nf-tunnel">
      <div
        ref={stageRef}
        className="nf-stage"
        role="group"
        aria-roledescription="מנהרת שערים"
        aria-label={g.hint}
        tabIndex={0}
        onKeyDown={onKey}
      >
        <span className="nf-stage__sky" aria-hidden="true" />
        <span className="nf-stage__sand" aria-hidden="true" />
        {ROOMS.map((room, i) => {
          /* depth from the front: 0 = front gate, < 0 = already walked through */
          const d = i - active;
          const visible = d >= 0 && d <= DEPTH;
          const state = d < 0 ? "past" : d === 0 ? "front" : visible ? "far" : "hidden";
          return (
            <div
              key={room.href}
              className={`nf-gate nf-gate--${state}`}
              style={{ "--s": d < 0 ? 1.9 : Math.pow(0.52, Math.min(d, DEPTH + 1)), zIndex: 20 - d } as CSSProperties}
              aria-hidden={state !== "front"}
            >
              <span className="nf-gate__arch">
                <span className="nf-gate__depth" />
              </span>
              <span className="nf-gate__plate">
                <span className="nf-gate__n">{String(i + 1).padStart(2, "0")}</span>
                {room.name}
              </span>
              {d === 1 && (
                <button type="button" className="nf-gate__hit" tabIndex={-1} onClick={() => go(i)}>
                  <span className="nz-sr">{room.name}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div key={active} className="nf-room">
        <p className="nf-room__n">
          {g.gateLabel} {String(active + 1).padStart(2, "0")}
        </p>
        <p className="nf-room__name">{ROOMS[active].name}</p>
        <p className="nf-room__line">{ROOMS[active].line}</p>
        <a href={ROOMS[active].href} className="nf-room__enter">
          <span>{g.enter(ROOMS[active].name)}</span>
          <ArrowIcon className="nf-room__arrow" />
        </a>
      </div>

      <div className="nf-controls">
        <button type="button" className="nf-btn" onClick={() => go(active - 1)} aria-label={g.back}>
          <ArrowIcon className="nf-btn__arrow nf-btn__arrow--back" />
        </button>
        <p className="nf-controls__pos" aria-hidden="true">
          <span className="nf-controls__n">{String(active + 1).padStart(2, "0")}</span>
          <span className="nf-controls__track">
            {ROOMS.map((r, i) => (
              <span key={r.href} className={i === active ? "is-on" : i < active ? "is-past" : undefined} />
            ))}
          </span>
          <span>{String(TOTAL).padStart(2, "0")}</span>
        </p>
        <button type="button" className="nf-btn nf-btn--deeper" onClick={() => go(active + 1)}>
          <span>{g.deeper}</span>
          <ArrowIcon className="nf-btn__arrow" />
        </button>
      </div>
      <p className="nz-sr" aria-live="polite">
        {announce}
      </p>

      <nav className="nf-list" aria-labelledby="nf-list-title">
        <h3 id="nf-list-title" className="nf-list__title">
          {g.listTitle}
        </h3>
        <ol>
          {ROOMS.map((r, i) => (
            <li key={r.href} className={i === active ? "is-active" : undefined}>
              <a href={r.href}>
                <span className="nf-list__n">{String(i + 1).padStart(2, "0")}</span>
                <span className="nf-list__name">{r.name}</span>
                <span className="nf-list__line">{r.line}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};

export default PortalTunnel;
