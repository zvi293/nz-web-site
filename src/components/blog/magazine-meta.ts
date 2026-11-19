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
 *  typesetText(text)   the same for a plain string (titles, excerpts).
 *    · a one-to-three letter Hebrew prefix never parts from its word ("ב-SEO", "וב-NZ-web"),
 *      nor the halves of a Hebrew compound ("חד-פעמי"): U+2060 WORD JOINER after the hyphen;
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
const WJ = "⁠";
const NBSP = " ";
const HEB = "א-ת";
/* a prefix (1–3 of ב ו ה כ ל מ ש) + hyphen at the start of a token (also right before a tag:
   "ב-<a>Google Search Console</a>", where the text node ends on the hyphen) */
const PREFIX_RE = new RegExp(`(^|[\\s(\\["'״“])([בוהכלמש]{1,3})-(?=[^\\s${WJ}]|$)`, "g");
/* a hyphen inside a word: Hebrew compounds (חד-פעמי) and Latin ones (JSON-LD, NZ-web) */
const COMPOUND_RE = new RegExp(`([${HEB}A-Za-z0-9])-(?=[${HEB}A-Za-z0-9])`, "g");
/* a number (with an optional %) followed by a space and a Hebrew word */
const NUMBER_RE = new RegExp(`(^|[\\s(])(\\d+%?) (?=[${HEB}])`, "g");
/* a run of 2+ Latin words separated by single spaces (letters, digits, . - ' / inside a word) */
const LATIN_RUN_RE = /[A-Za-z][A-Za-z0-9.'’/-]*(?: [A-Za-z0-9][A-Za-z0-9.'’/-]*)+/g;
const LATIN_ONE_LINE = 22;

function bindLatin(run: string): string {
  const words = run.split(" ");
  if (run.length <= LATIN_ONE_LINE) return words.join(NBSP);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += 2) out.push(words.slice(i, i + 2).join(NBSP));
  return out.join(" ");
}

export function typesetText(text: string): string {
  return text
    .replace(PREFIX_RE, `$1$2-${WJ}`)
    .replace(COMPOUND_RE, `$1-${WJ}`)
    .replace(NUMBER_RE, `$1$2${NBSP}`)
    .replace(LATIN_RUN_RE, bindLatin);
}

/** typesetText on the text between tags; tags and the content of <script>/<style>/<svg> stay as they are. */
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
      return skip ? part : typesetText(part);
    })
    .join("");
}

const CHAPTER_NO_RE = /^\s*\d{1,2}[.)]\s+/;
export function stripChapterNumber(s: string): string {
  return s.replace(CHAPTER_NO_RE, "");
}
/** Drops a typed "1. " at the start of every H2 in rendered HTML (the eyebrow numbers chapters). */
export function stripChapterNumbersHtml(html: string): string {
  return html.replace(/(<h2\b[^>]*>)\s*\d{1,2}[.)]\s+/g, "$1");
}
