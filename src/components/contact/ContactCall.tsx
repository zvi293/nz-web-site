// Signature component: השפופרת — turn-taking phone conversation (lift the receiver)
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { WhatsAppIcon } from "@/components/nz";
import { contactInfo, getWhatsAppHref } from "@/lib/contact-utils";
import { motionAllowed } from "@/lib/motion";
import { call as c, type Turn } from "./content";

/**
 * "השפופרת" — the contact brief as a short phone call, not a form. The ceramic receiver
 * rests on its cradle; lifting it (the one big button) starts the call. צבי then asks ONE
 * question per turn (his earpiece pulses while he "types"), the visitor answers once (a
 * reply button or a short text), the answer drops into the line as their bubble, and the
 * next question arrives. After the last turn the conversation is folded into a ready
 * WhatsApp message: send opens wa.me (a real link, new tab), the same text can go by email,
 * and any turn can be taken back ("לשנות את התשובה הקודמת") or the call restarted.
 *
 * Accessibility: the line is an ordered list with role="log" (polite), so every new
 * question is announced once; replies are real buttons grouped in a fieldset whose legend
 * is the question; text turns are labelled inputs; after each answer focus moves to the
 * next turn's first control (without scrolling the page) when the visitor is using the
 * keyboard. Reduced motion / a11y pause: no dialing or typing delays, no lift animation.
 * No JS: the lift button is replaced by a plain WhatsApp button (html:not(.js)) with a
 * general message; the topics list and the direct link are always there.
 */

type Answers = Partial<Record<Turn["id"], string>>;

const turns = c.turns;

function compose(a: Answers): string {
  const pick = (id: Turn["id"]) => {
    const t = turns.find((x) => x.id === id);
    const v = a[id];
    if (!t || !v) return "";
    return t.kind === "choice" ? t.options?.find((o) => o.id === v)?.text ?? "" : v.trim();
  };
  const lines: string[] = ["שלום צבי, הגעתי מהאתר של NZ-web."];
  const who = pick("who");
  if (who) lines.push(`אני ${who}.`);
  const type = pick("type");
  if (type) lines.push(`אשמח לשמוע על ${type}.`);
  const goal = pick("goal");
  if (goal) lines.push(`הכי חשוב לי ${goal}.`);
  const timing = pick("timing");
  if (timing) lines.push(`${timing}.`);
  let text = lines.join(" ");
  const note = pick("note");
  if (note) text += `\n${note}`;
  return `${text}\nאפשר לדבר?`;
}

/** What the visitor's bubble says for an answer. */
function replyLabel(t: Turn, v: string | undefined): string {
  if (!v) return t.skip ?? "";
  return t.kind === "choice" ? t.options?.find((o) => o.id === v)?.label ?? v : v;
}

const nowHHMM = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
};

const Ticks = () => (
  <svg className="ct-ticks" viewBox="0 0 18 10" aria-hidden="true" focusable="false">
    <path d="M1 5.5 4 8.5 10 1.5M7 7.5 8 8.5 14.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
  </svg>
);

type Phase = "idle" | "dialing" | "live" | "done";

const ContactCall = () => {
  const [phase, setPhase] = useState<Phase>("idle");
  /** answers given so far, in turn order; a skipped text turn is stored as "" */
  const [given, setGiven] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const [times, setTimes] = useState<string[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLOListElement>(null);
  const timer = useRef<number>();
  const keyboard = useRef(false);

  const turn = given.length; // the turn being asked
  const current: Turn | undefined = turns[turn];
  const answers = useMemo(() => {
    const a: Answers = {};
    given.forEach((v, i) => (a[turns[i].id] = v));
    return a;
  }, [given]);
  const message = useMemo(() => compose(answers), [answers]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  /* Keep the newest message in view inside the line (never scrolls the page). */
  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: motionAllowed() ? "smooth" : "auto" });
  }, [given, typing, phase]);

  /* After a turn changes, hand focus to the next control (keyboard users only). */
  const focusNext = useCallback(() => {
    if (!keyboard.current) return;
    window.requestAnimationFrame(() => {
      const el = rootRef.current?.querySelector<HTMLElement>("[data-ct-first]");
      el?.focus({ preventScroll: true });
    });
  }, []);

  /** צבי "types" for a moment before his next line (instant without motion). */
  const ask = useCallback(
    (after?: () => void) => {
      window.clearTimeout(timer.current);
      if (!motionAllowed()) {
        setTyping(false);
        after?.();
        focusNext();
        return;
      }
      setTyping(true);
      timer.current = window.setTimeout(() => {
        setTyping(false);
        after?.();
        focusNext();
      }, 850);
    },
    [focusNext],
  );

  const lift = () => {
    setGiven([]);
    setTimes([]);
    setDraft("");
    if (!motionAllowed()) {
      setPhase("live");
      focusNext();
      return;
    }
    setPhase("dialing");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      setPhase("live");
      ask();
    }, 700);
  };

  const answer = (v: string) => {
    const next = [...given, v];
    setGiven(next);
    setTimes((t) => [...t, nowHHMM()]);
    setDraft("");
    if (next.length >= turns.length) ask(() => setPhase("done"));
    else ask();
  };

  const back = () => {
    window.clearTimeout(timer.current);
    setTyping(false);
    setPhase("live");
    const prev = given[given.length - 1] ?? "";
    setGiven((g) => g.slice(0, -1));
    setTimes((t) => t.slice(0, -1));
    const prevTurn = turns[given.length - 1];
    setDraft(prevTurn?.kind === "text" ? prev : "");
    focusNext();
  };

  const hangUp = () => {
    window.clearTimeout(timer.current);
    setTyping(false);
    setGiven([]);
    setTimes([]);
    setDraft("");
    setPhase("idle");
    if (keyboard.current) window.requestAnimationFrame(() => rootRef.current?.querySelector<HTMLElement>(".ct-lift")?.focus({ preventScroll: true }));
  };

  const onText = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = draft.trim();
    answer(v);
  };

  const waHref = getWhatsAppHref(contactInfo, message);
  const mailHref = `mailto:zstore.ai295@gmail.com?subject=${encodeURIComponent(c.emailSubject)}&body=${encodeURIComponent(message)}`;
  const directHref = getWhatsAppHref(contactInfo, c.directMessage);
  const onLine = phase === "live" || phase === "done";
  const state =
    phase === "idle" ? c.state.idle : phase === "dialing" ? c.state.dialing : typing ? c.state.typing : phase === "done" ? c.state.done : c.state.live;

  return (
    <div
      ref={rootRef}
      className="ct-call"
      data-phase={phase}
      onKeyDown={() => (keyboard.current = true)}
      onPointerDown={() => (keyboard.current = false)}
    >
      <div className="ct-receiver">
        <div className="ct-receiver__head">
          <span className={`ct-ear${typing || phase === "dialing" ? " is-speaking" : ""}`} aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <span key={i} className="ct-ear__hole" style={{ ["--i" as string]: i }} />
            ))}
          </span>
          <span className="ct-receiver__who">
            <span className="ct-receiver__name">{c.who}</span>
            <span className="ct-receiver__state">
              <span className="ct-receiver__led" aria-hidden="true" />
              {state}
            </span>
          </span>
          {onLine && (
            <button type="button" className="ct-hang" onClick={hangUp}>
              {c.hangUp}
            </button>
          )}
        </div>

        {/* the line: the whole conversation so far */}
        <ol ref={lineRef} className="ct-wire" role="log" aria-live="polite" aria-label="השיחה עם צבי" tabIndex={-1}>
          {phase === "idle" || phase === "dialing" ? (
            <li className="ct-wire__idle">
              <p className="ct-wire__idle-title">על הקו יעלו:</p>
              <ul className="ct-topics">
                {c.idleTopics.map((t, i) => (
                  <li key={t} className="ct-topic">
                    <span className="ct-topic__n" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <p className="ct-wire__note">{c.idleNote}</p>
            </li>
          ) : (
            <>
              {turns.slice(0, Math.min(turn + (typing ? 0 : 1), turns.length)).map((t, i) => (
                <li key={t.id} className="ct-turn">
                  <p className="ct-msg-in">
                    <span className="nz-sr">צבי: </span>
                    {t.q}
                  </p>
                  {i < turn && (
                    <p className={`ct-msg-out${given[i] ? "" : " is-skip"}`}>
                      <span className="nz-sr">אתם: </span>
                      <span className="ct-msg-out__text">{replyLabel(t, given[i])}</span>
                      <span className="ct-msg-out__meta" aria-hidden="true">
                        {times[i] && <bdi dir="ltr">{times[i]}</bdi>}
                        <Ticks />
                      </span>
                    </p>
                  )}
                </li>
              ))}
              {phase === "done" && !typing && (
                <li className="ct-turn ct-turn--draft">
                  <p className="ct-msg-in">
                    <span className="nz-sr">צבי: </span>
                    {c.closing}
                  </p>
                  <figure className="ct-draft">
                    <figcaption className="ct-draft__label">{c.draftLabel}</figcaption>
                    <p className="ct-draft__text">{message}</p>
                  </figure>
                </li>
              )}
              {typing && (
                <li className="ct-typing" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </li>
              )}
            </>
          )}
        </ol>

        {/* the visitor's side of the call: one turn at a time */}
        <div className="ct-keys">
          <div className="ct-keys__main">
          {phase === "idle" || phase === "dialing" ? (
<>
              <button type="button" className="ct-lift" onClick={lift} disabled={phase === "dialing"} aria-describedby="ct-lift-note">
                <span className="ct-lift__cradle" aria-hidden="true" />
                <span>{c.lift}</span>
              </button>
              {/* no JS: the call cannot start, so the receiver offers the plain line instead */}
              <a href={directHref} target="_blank" rel="noopener noreferrer" className="nz-btn nz-btn--primary nz-btn--lg ct-nojs-wa">
                <WhatsAppIcon className="nz-btn__icon" />
                <span>{c.noJsCta}</span>
                <span className="nz-sr"> (נפתח בכרטיסייה חדשה)</span>
              </a>
            </>
          ) : phase === "live" && current && !typing ? (
            current.kind === "choice" ? (
              <fieldset className="ct-replies" key={current.id}>
                <legend className="nz-sr">{current.q}</legend>
                {current.options?.map((o, i) => (
                  <button key={o.id} type="button" className="ct-reply" onClick={() => answer(o.id)} {...(i === 0 ? { "data-ct-first": "" } : {})}>
                    {o.label}
                  </button>
                ))}
              </fieldset>
            ) : (
              <form className="ct-type" onSubmit={onText} key={current.id}>
                <label htmlFor={`ct-in-${current.id}`} className="nz-sr">
                  {current.field?.label}
                </label>
                {current.field?.multiline ? (
                  <textarea
                    id={`ct-in-${current.id}`}
                    className="ct-type__input ct-type__input--area"
                    rows={2}
                    placeholder={current.field.placeholder}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    data-ct-first=""
                  />
                ) : (
                  <input
                    id={`ct-in-${current.id}`}
                    className="ct-type__input"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="send"
                    placeholder={current.field?.placeholder}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    data-ct-first=""
                  />
                )}
                <div className="ct-type__row">
                  <button type="submit" className="ct-reply ct-reply--send" disabled={!draft.trim()}>
                    {c.sendField}
                  </button>
                  <button type="button" className="ct-reply ct-reply--skip" onClick={() => answer("")}>
                    {current.skip}
                  </button>
                </div>
              </form>
            )
          ) : phase === "done" && !typing ? (
            <div className="ct-finish">
              <a href={waHref} target="_blank" rel="noopener noreferrer" className="nz-btn nz-btn--primary nz-btn--lg ct-send" data-ct-first="">
                <WhatsAppIcon className="nz-btn__icon" />
                <span>{c.send}</span>
                <span className="nz-sr"> (נפתח בכרטיסייה חדשה)</span>
              </a>
              <a href={mailHref} className="nz-link ct-mail">
                <span className="nz-link__text">{c.emailInstead}</span>
              </a>
            </div>
          ) : (
            <p className="ct-keys__wait" aria-hidden="true">
              …
            </p>
          )}
          </div>

          {/* always rendered (hidden when unused) so the receiver never changes height */}
          <div className="ct-keys__undo" data-on={onLine && given.length > 0 && !typing ? "" : undefined}>
            <button type="button" className="ct-undo" onClick={back}>
              {c.back}
            </button>
            {phase === "done" && (
              <button type="button" className="ct-undo" onClick={lift}>
                {c.restart}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="ct-call__direct">
        <a href={directHref} target="_blank" rel="noopener noreferrer" className="nz-link">
          <span className="nz-link__text">{c.direct}</span>
          <span className="nz-sr"> (נפתח בכרטיסייה חדשה)</span>
        </a>
      </p>
      <p className="ct-call__privacy" id="ct-lift-note">
        {c.privacy}
      </p>
    </div>
  );
};

export default ContactCall;
