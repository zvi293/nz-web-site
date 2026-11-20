/**
 * Magazine metadata + Hebrew typesetting, shared by the hub (/blog/), the article pages and the
 * glossary. Pure functions, build time only.
 *
 *  readMinutes(post)   reading time computed from the text itself (body + FAQ answers, Hebrew
 *                      ≈ 190 words a minute) plus one minute for the interactive exhibit. Never a
 *                      hand-set number, so it cannot drift from the article.
 *  magazineIssue(post) the issue an article belongs to. ONE model everywhere: an issue is a
 *                      publishing month, numbered in order (the oldest month = 01). Every article of
 *                      that month shows the same issue; the hub's "current issue" is the newest one.
 *  typesetHtml(html)   line-break hygiene for rendered HTML (text nodes only, tags untouched):
 *  typesetInline(text) the same for a plain string (titles, excerpts), returned as HTML (set:html);
 *  typesetText(text)   the NBSP part only, for strings that must stay plain text.
 *    · a one-to-three letter Hebrew prefix never parts from its word ("ב-SEO", "וב-NZ-web"),
 *      nor the halves of a compound ("חד-פעמי", "NZ-web"): the token is wrapped in
 *      <span class="nz-nobr"> (white-space: nowrap). Never an invisible control character;
 *    · a short Latin phrase (≤ 22 characters) stays on one line ("Google Search Console"); a longer one breaks
 *      only between pairs of words ("Web Content" / "Accessibility Guidelines"): U+00A0;
 *    · a number stays with the word after it ("4 מאמרים").
 *  stripChapterNumber(s) "1. טיפוגרפיה" → "טיפוגרפיה": the article already numbers its chapters
 *                      (the H2 eyebrow, the TOC, the "מה בפנים" chips), so a typed number doubles it.
 */
import { getBlogPosts, countWords, formatMonth, type BlogPost } from "@/lib/blog";

/* ── reading time ── */
const WPM = 190;
export function readMinutes(post: BlogPost): number {
  const faqWords = (post.faq ?? []).reduce((n, f) => n + countWords(`${f.question} ${f.answer}`), 0);
  const words = countWords(post.content) + faqWords;
  return Math.max(2, Math.ceil(words / WPM) + (post.signature ? 1 : 0));
}

/* ── issues ── */
export interface MagazineIssue {
  number: number;
  /** "03" */
  index: string;
  /** "נובמבר 2026" */
  month: string;
  /** "2026-11" */
  key: string;
}
const monthKey = (iso: string) => iso.slice(0, 7);
const MONTHS = [...new Set(getBlogPosts().map((p) => monthKey(p.published_at)))].sort();

export function magazineIssue(post: BlogPost): MagazineIssue {
  const key = monthKey(post.published_at);
  const number = MONTHS.indexOf(key) + 1 || MONTHS.length + 1;
  return { number, index: String(number).padStart(2, "0"), month: formatMonth(post.published_at), key };
}

/** The newest issue and its articles (newest first). */
export function currentIssue(): { issue: MagazineIssue; posts: BlogPost[] } {
  const posts = getBlogPosts();
  const newest = MONTHS[MONTHS.length - 1];
  const inIssue = posts.filter((p) => monthKey(p.published_at) === newest);
  return { issue: magazineIssue(inIssue[0] ?? posts[0]), posts: inIssue };
}

/* ── typesetting ── */
/* No invisible control characters ever go into the text: they split tokens such as "NZ-web" for
   crawlers, AI fetchers and screen readers. A hyphenated token is kept whole with a nowrap span
   instead (HTML), and Latin phrases / numbers are bound with U+00A0, which is ordinary text. */
const NBSP = "\u00A0";
const HEB = "א-ת";
const NOBR_OPEN = '<span class="nz-nobr">';
/* a prefix (1–3 of ב ו ה כ ל מ ש) + hyphen at the start of a token, followed by the word ("ב-SEO", "וב-NZ-web") */
const PREFIX_TOKEN_RE = new RegExp(`^[(\\["'״“]?[בוהכלמש]{1,3}-[^\\s-]`);
/* a hyphen inside a word: Hebrew compounds (חד-פעמי) and Latin ones (JSON-LD, NZ-web) */
const COMPOUND_TOKEN_RE = new RegExp(`[${HEB}A-Za-z0-9]-[${HEB}A-Za-z0-9]`);
/* a number (with an optional %) followed by a space and a Hebrew word */
const NUMBER_RE = new RegExp(`(^|[\\s(])(\\d+%?) (?=[${HEB}])`, "g");
/* a run of 2+ Latin words separated by single spaces (letters, digits, . - ' / inside a word) */
const LATIN_RUN_RE = /[A-Za-z][A-Za-z0-9.'’/-]*(?: [A-Za-z0-9][A-Za-z0-9.'’/-]*)+/g;
const LATIN_ONE_LINE = 22;
/* a lone prefix ending a text node right before an inline element whose text has no break
   opportunity ("ב-<a href=…>Google Search Console</a>", the run already NBSP-bound) */
const PREFIX_BEFORE_TAG_RE = /(^|[\s>(["'״“[])([בוהכלמש]{1,3}-)(<(a|strong|em|b|i|code|abbr)\b[^>]*>[^<\s]+<\/\4>)/g;

function bindLatin(run: string): string {
  const words = run.split(" ");
  if (run.length <= LATIN_ONE_LINE) return words.join(NBSP);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += 2) out.push(words.slice(i, i + 2).join(NBSP));
  return out.join(" ");
}

const bindSpaces = (text: string) => text.replace(NUMBER_RE, `$1$2${NBSP}`).replace(LATIN_RUN_RE, bindLatin);
/* longer tokens (a URL typed as text) keep their normal break opportunities: a nowrap run that
   long could push a 390px phone into horizontal scroll */
const NOBR_MAX = 26;
const keepsWhole = (token: string) =>
  token.length <= NOBR_MAX && (PREFIX_TOKEN_RE.test(token) || COMPOUND_TOKEN_RE.test(token));

/** Plain-string typesetting (no markup): numbers and short Latin phrases bound with U+00A0. */
export function typesetText(text: string): string {
  return bindSpaces(text);
}

/** typesetText plus nowrap spans around hyphenated tokens, on an already-escaped HTML text run. */
function typesetRun(text: string): string {
  return bindSpaces(text)
    .split(/([ \t\n\r]+)/)
    .map((token) => (token.trim() && keepsWhole(token) ? `${NOBR_OPEN}${token}</span>` : token))
    .join("");
}

/** Typesetting for rendered HTML: text between tags only; tags and <script>/<style>/<svg> content untouched. */
export function typesetHtml(html: string): string {
  const parts = html.split(/(<[^>]+>)/);
  let skip = 0;
  return parts
    .map((part) => {
      if (part.startsWith("<")) {
        if (/^<(script|style|svg)\b/i.test(part)) skip++;
        else if (/^<\/(script|style|svg)>/i.test(part)) skip = Math.max(0, skip - 1);
        return part;
      }
      return skip ? part : typesetRun(part);
    })
    .join("")
    .replace(PREFIX_BEFORE_TAG_RE, `$1${NOBR_OPEN}$2$3</span>`);
}

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** A plain string (title, excerpt, FAQ text) as typeset HTML: render with set:html. */
export function typesetInline(text: string): string {
  return typesetHtml(escapeHtml(text));
}

const CHAPTER_NO_RE = /^\s*\d{1,2}[.)]\s+/;
export function stripChapterNumber(s: string): string {
  return s.replace(CHAPTER_NO_RE, "");
}
/** Drops a typed "1. " at the start of every H2 in rendered HTML (the eyebrow numbers chapters). */
export function stripChapterNumbersHtml(html: string): string {
  return html.replace(/(<h2\b[^>]*>)\s*\d{1,2}[.)]\s+/g, "$1");
}
