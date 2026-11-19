import { blogPosts } from "@/content/blog";
import { renderDiagram } from "@/components/blog/diagrams";
import type { BlogPost } from "@/content/types";

export type { BlogPost };

/** All posts, newest first. */
export const posts: BlogPost[] = [...blogPosts].sort(
  (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
);

export function getBlogPosts(): BlogPost[] {
  return posts;
}

export function getBlogPost(slug: string): BlogPost | null {
  return posts.find((post) => post.slug === slug) ?? null;
}

/** Up to `limit` other posts, preferring the same category. */
export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return [];

  const others = posts.filter((post) => post.slug !== slug);
  const sameCategory = others.filter((post) => post.category === current.category);

  return [...sameCategory, ...others.filter((post) => post.category !== current.category)].slice(0, limit);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** "נובמבר 2026" */
export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", { year: "numeric", month: "long" });
}

/* ───────────────────────── departments (מדורים) ─────────────────────────
 * Every post's `category` is one of these names. `key` is the stable ASCII id used in
 * anchors (#dept-<key>) and the magazine filter; `service` is the hub-and-spoke link
 * an article in that department points to.
 */
export interface Department {
  key: string;
  name: string;
  /** One line under the department name on the magazine hub. */
  blurb: string;
  service: { label: string; href: string };
}

export const DEPARTMENTS: Department[] = [
  {
    key: "build",
    name: "בניית אתרים",
    blurb: "מה לבנות, מה לשאול ומה לבדוק לפני שמתחילים, בלי ז'רגון.",
    service: { label: "בניית אתר תדמית לעסק", href: "/services/business-website/" },
  },
  {
    key: "seo",
    name: "קידום אתרים",
    blurb: "גוגל, מנועי AI ותוכן שעונה על מה שהלקוחות באמת שואלים.",
    service: { label: "שיפור מהירות וקידום טכני", href: "/services/website-performance/" },
  },
  {
    key: "dev",
    name: "פיתוח",
    blurb: "טכנולוגיה, מהירות ומה שקורה מתחת למכסה המנוע.",
    service: { label: "פיתוח אתרים בהתאמה", href: "/services/website-development/" },
  },
  {
    key: "design",
    name: "עיצוב ונגישות",
    blurb: "עיצוב שעובד בשביל הגולש, כולל מי שגולש עם מקלדת או קורא מסך.",
    service: { label: "עיצוב ובניית אתרים", href: "/services/web-development/" },
  },
];

export function getDepartment(category: string): Department {
  return DEPARTMENTS.find((d) => d.name === category) ?? DEPARTMENTS[0];
}

export function departmentCounts(): Record<string, number> {
  const out: Record<string, number> = {};
  for (const d of DEPARTMENTS) out[d.key] = posts.filter((p) => p.category === d.name).length;
  return out;
}

/* Issues (גיליונות) and reading times are computed in src/components/blog/magazine-meta.ts. */

/* ───────────────────────── article content renderer ─────────────────────────
 * Article `content` is a small, safe markdown subset:
 *   ## H2            ### H3
 *   - bullet         1. numbered item
 *   > quote          (a quoted example; a run of "> " lines is one quote)
 *   >> pull quote    (a sentence repeated from the text, set large; hidden from screen readers)
 *   ^ margin note    (side-note on desktop, tap-to-open on mobile)
 *   [[signature]]    where the article's signature component is mounted (see renderArticleSegments)
 *   blank line = new paragraph
 *   **bold**  *italic*  [anchor text](/internal/path/)  [text](https://external)
 *
 * Designed blocks (SITE-PLAYBOOK §8.1) — a fence line ":::<name> [key=value …] [title]", the
 * block's lines, then a line ":::" (blocks do not nest). Use 2–4 different blocks per article.
 *   :::steps [title]        numbered lines "1. **Step:** text" → process steps on a connecting rail
 *   :::compare [title]      "| | col | col |" rows; the first row = column heads, the first cell of
 *                           every row = the row's name → an editorial table (stacked cards < 768px)
 *   :::takeaways [title]    bullets → a "מה לקחת מכאן" card
 *   :::tip [title]          paragraphs / bullets → a tip callout
 *   :::warn [title]         paragraphs / bullets → a warning callout
 *   :::checklist [title]    bullets → a checklist the reader can tick (kept in localStorage, per article)
 *   :::dodont [title]       "- vague" / "+ concrete" lines, paired in order → a do / don't pair
 *   :::split art=<slug> [title]       paragraphs / bullets (set as glazed beads) beside a framed artwork
 *   :::split diagram=<key> [title]    … beside a designed diagram (src/components/blog/diagrams.ts)
 *   :::diagram <key> [title]          a designed diagram on its own
 * Links: only "/…" (internal, rendered as plain <a>) and "https://…" (external,
 * opens in a new tab with rel="noopener"). Everything else is escaped.
 * Output is semantic HTML styled by src/components/blog/article.css (prefix ar-).
 */

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

/** A piece of the rendered article: HTML, the signature slot, or an artwork slot (rendered by the page). */
export type ArticleSegment =
  | { kind: "html"; html: string }
  | { kind: "signature" }
  | { kind: "art"; slug: string; alt?: string };

const SIGNATURE_MARKER = "[[signature]]";
const SUMMARY_RE = /^\*\*בקצרה:\*\*\s*/;
const FENCE_RE = /^:::([a-z]+)(?:\s+(.*))?$/;

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Strip inline markdown to plain text (for headings in a TOC, schema, etc.). */
export function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1");
}

export function renderInline(raw: string): string {
  let s = escapeHtml(raw);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, href: string) => {
    const url = href.replace(/&amp;/g, "&");
    if (url.startsWith("/glossary/")) return `<a href="${escapeHtml(url)}" class="ar-term">${text}</a>`;
    if (url.startsWith("/")) return `<a href="${escapeHtml(url)}">${text}</a>`;
    if (url.startsWith("https://"))
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${text}<span class="nz-sr"> (נפתח בכרטיסייה חדשה)</span></a>`;
    return text;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  return s;
}

/**
 * Splits the answer-first summary ("**בקצרה:** …", the first paragraph) from the body.
 * `summary` is inline markdown without the "בקצרה:" label; `body` is the rest.
 */
export function splitSummary(md: string): { summary: string | null; body: string } {
  const text = md.replace(/\r\n?/g, "\n").trimStart();
  const end = text.indexOf("\n\n");
  const first = end === -1 ? text : text.slice(0, end);
  if (!SUMMARY_RE.test(first)) return { summary: null, body: text };
  return {
    summary: first.replace(SUMMARY_RE, "").replace(/\n/g, " ").trim(),
    body: end === -1 ? "" : text.slice(end + 2),
  };
}

/** Headings of an article, in order, with the ids `renderArticle` gives them. */
export function getArticleHeadings(md: string): ArticleHeading[] {
  const out: ArticleHeading[] = [];
  let n = 0;
  for (const line of md.split("\n")) {
    const m = /^(##|###) (.+)$/.exec(line.trim());
    if (!m) continue;
    n += 1;
    out.push({ id: `section-${n}`, text: stripInlineMarkdown(m[2]), level: m[1] === "##" ? 2 : 3 });
  }
  return out;
}

const SLOT = "\u0000";
const SIGNATURE_SLOT = `${SLOT}signature${SLOT}`;
const artSlot = (slug: string) => `${SLOT}art:${slug}${SLOT}`;

/* ── plain flow (paragraphs, lists, quotes) — the body text and the inside of blocks ── */
interface FlowOptions {
  /** class on <ul>/<ol> (e.g. glazed beads inside a split) */
  listClass?: string;
}
function renderFlow(lines: string[], opts: FlowOptions = {}): string {
  const html: string[] = [];
  let para: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;
  const listAttr = opts.listClass ? ` class="${opts.listClass}"` : "";
  const flushPara = () => {
    if (para.length) html.push(`<p>${renderInline(para.join(" "))}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list)
      html.push(`<${list.tag}${listAttr}>${list.items.map((i) => `<li>${renderInline(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    const bullet = /^[-•] (.+)$/.exec(line);
    const numbered = /^\d+[.)] (.+)$/.exec(line);
    if (bullet || numbered) {
      flushPara();
      const tag = bullet ? "ul" : "ol";
      if (!list || list.tag !== tag) {
        flushList();
        list = { tag, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    flushList();
    para.push(line.replace(/^> /, ""));
  }
  flushPara();
  flushList();
  return html.join("");
}

/** "**Title:** rest" → [title, rest]; otherwise [null, text]. */
function splitLead(item: string): [string | null, string] {
  const m = /^\*\*(.+?)\*\*[:.]?\s*(.*)$/.exec(item);
  if (!m) return [null, item];
  return [m[1].replace(/[:.,]$/, ""), m[2]];
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const items = (lines: string[], re = /^(?:[-•+]|\d+[.)]) (.+)$/) =>
  lines.map((l) => re.exec(l.trim())?.[1]).filter((x): x is string => !!x);

const blockHead = (label: string, title: string, extra = "") =>
  `<header class="ar-b__head"><p class="ar-b__label"><span class="ar-cube" aria-hidden="true"></span>${label}</p>${
    title ? `<p class="ar-b__title">${renderInline(title)}</p>` : ""
  }${extra}</header>`;

interface BlockContext {
  checklists: number;
}

function renderBlock(name: string, args: Record<string, string>, title: string, lines: string[], ctx: BlockContext): string {
  switch (name) {
    case "steps": {
      const list = items(lines);
      return `<section class="ar-b ar-steps"${title ? ` aria-label="${escapeHtml(stripInlineMarkdown(title))}"` : ""}>${blockHead(
        "שלב אחר שלב",
        title,
      )}<ol class="ar-steps__list">${list
        .map((it, i) => {
          const [t, rest] = splitLead(it);
          return `<li class="ar-step"><span class="ar-step__n" aria-hidden="true">${pad2(i + 1)}</span><div class="ar-step__body">${
            t ? `<p class="ar-step__title">${renderInline(t)}</p>` : ""
          }${rest ? `<p class="ar-step__text">${renderInline(rest)}</p>` : ""}</div></li>`;
        })
        .join("")}</ol></section>`;
    }
    case "compare": {
      const rows = lines
        .map((l) => l.trim())
        .filter((l) => l.startsWith("|"))
        .map((l) =>
          l
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim()),
        );
      const [head, ...body] = rows;
      if (!head) return "";
      const cols = head.slice(1);
      return `<section class="ar-b ar-compare">${blockHead("השוואה", title)}<div class="ar-compare__scroll"><table class="ar-compare__table">${
        title ? `<caption class="nz-sr">${renderInline(title)}</caption>` : ""
      }<thead><tr><td class="ar-compare__corner">${renderInline(head[0] ?? "")}</td>${cols
        .map((c, i) => `<th scope="col" class="ar-compare__col ar-compare__col--${i + 1}">${renderInline(c)}</th>`)
        .join("")}</tr></thead><tbody>${body
        .map(
          (r) =>
            `<tr><th scope="row">${renderInline(r[0] ?? "")}</th>${cols
              .map(
                (c, i) =>
                  `<td class="ar-compare__cell--${i + 1}" data-col="${escapeHtml(stripInlineMarkdown(c))}">${renderInline(r[i + 1] ?? "")}</td>`,
              )
              .join("")}</tr>`,
        )
        .join("")}</tbody></table></div></section>`;
    }
    case "takeaways":
      return `<aside class="ar-b ar-take" aria-label="${escapeHtml(stripInlineMarkdown(title || "מה לקחת מכאן"))}">${blockHead(
        "מה לקחת מכאן",
        title,
      )}${renderFlow(lines, { listClass: "ar-take__list" })}</aside>`;
    case "tip":
    case "warn": {
      const label = name === "tip" ? "טיפ מהסטודיו" : "שימו לב";
      return `<aside class="ar-b ar-callout ar-callout--${name}" aria-label="${label}"><span class="ar-callout__glyph" aria-hidden="true">${
        name === "tip" ? "✳" : "!"
      }</span><div class="ar-callout__body">${blockHead(label, title)}${renderFlow(lines)}</div></aside>`;
    }
    case "checklist": {
      ctx.checklists += 1;
      const list = items(lines);
      const n = list.length;
      return `<section class="ar-b ar-check" data-ar-check="${ctx.checklists}" style="--ar-done: 0" aria-label="${escapeHtml(
        stripInlineMarkdown(title || "צ'קליסט"),
      )}">${blockHead(
        "צ'קליסט לסימון",
        title,
        `<p class="ar-check__meter"><span class="ar-check__count">סומנו <span data-ar-check-count>0</span> מתוך ${n}</span><span class="ar-check__bar" aria-hidden="true"><span></span></span></p>`,
      )}<ul class="ar-check__list">${list
        .map(
          (it) =>
            `<li><label class="ar-check__item"><input type="checkbox" class="ar-check__box"><span class="ar-check__mark" aria-hidden="true"></span><span class="ar-check__text">${renderInline(
              it,
            )}</span></label></li>`,
        )
        .join(
          "",
        )}</ul><p class="ar-check__foot"><span>הסימונים נשמרים רק בדפדפן הזה.</span><button type="button" class="ar-check__reset" data-ar-check-reset hidden>ניקוי הסימונים</button></p><p class="nz-sr" aria-live="polite" data-ar-check-live></p></section>`;
    }
    case "dodont": {
      const donts: string[] = [];
      const dos: string[] = [];
      for (const l of lines) {
        const m = /^([+-]) (.+)$/.exec(l.trim());
        if (m) (m[1] === "+" ? dos : donts).push(m[2]);
      }
      const pairs = Math.max(dos.length, donts.length);
      return `<section class="ar-b ar-dd">${blockHead("לפני ואחרי", title)}<ol class="ar-dd__pairs">${Array.from(
        { length: pairs },
        (_, i) =>
          `<li class="ar-dd__pair">${
            donts[i]
              ? `<p class="ar-dd__side ar-dd__side--dont"><span class="ar-dd__tag">לא כך</span><span class="ar-dd__text">${renderInline(donts[i])}</span></p>`
              : ""
          }${
            dos[i]
              ? `<p class="ar-dd__side ar-dd__side--do"><span class="ar-dd__tag">כך</span><span class="ar-dd__text">${renderInline(dos[i])}</span></p>`
              : ""
          }</li>`,
      ).join("")}</ol></section>`;
    }
    case "split": {
      const fig = args.art
        ? artSlot(args.art)
        : args.diagram
          ? renderDiagram(args.diagram)
          : "";
      return `<section class="ar-b ar-split${args.art ? " ar-split--art" : " ar-split--diagram"}">${
        title ? blockHead("במבט אחד", title) : ""
      }<div class="ar-split__grid"><div class="ar-split__text">${renderFlow(lines, { listClass: "ar-beads" })}</div><figure class="ar-split__fig">${fig}</figure></div></section>`;
    }
    case "diagram":
      return `<figure class="ar-b ar-diagram">${renderDiagram(args.key ?? "")}${
        title ? `<figcaption class="ar-diagram__cap">${renderInline(title)}</figcaption>` : ""
      }</figure>`;
    default:
      return renderFlow(lines);
  }
}

function parseFence(rest: string | undefined, name: string): { args: Record<string, string>; title: string } {
  const args: Record<string, string> = {};
  const words: string[] = [];
  for (const w of (rest ?? "").split(/\s+/).filter(Boolean)) {
    const m = /^([a-z]+)=([a-z0-9-]+)$/.exec(w);
    if (m) args[m[1]] = m[2];
    else words.push(w);
  }
  if (name === "diagram" && !args.key && words.length) args.key = words.shift()!;
  return { args, title: words.join(" ") };
}

/** Render article content to HTML (headings get ids "section-1", "section-2", …). */
export function renderArticle(md: string): string {
  const html: string[] = [];
  let para: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];
  let block: { name: string; args: Record<string, string>; title: string; lines: string[] } | null = null;
  const ctx: BlockContext = { checklists: 0 };
  let h = 0;
  let firstPara = true;

  const flushPara = () => {
    if (para.length) {
      html.push(`<p${firstPara ? ' class="ar-dropcap"' : ""}>${renderInline(para.join(" "))}</p>`);
      firstPara = false;
    }
    para = [];
  };
  const flushList = () => {
    if (list) html.push(`<${list.tag}>${list.items.map((i) => `<li>${renderInline(i)}</li>`).join("")}</${list.tag}>`);
    list = null;
  };
  const flushQuote = () => {
    if (quote.length) html.push(`<blockquote><p>${renderInline(quote.join(" "))}</p></blockquote>`);
    quote = [];
  };
  const flushAll = () => {
    flushPara();
    flushList();
    flushQuote();
  };

  for (const rawLine of md.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trim();
    if (block) {
      if (line === ":::") {
        html.push(renderBlock(block.name, block.args, block.title, block.lines, ctx));
        block = null;
      } else block.lines.push(rawLine);
      continue;
    }
    if (!line) {
      flushAll();
      continue;
    }
    const fence = FENCE_RE.exec(line);
    if (fence) {
      flushAll();
      block = { name: fence[1], ...parseFence(fence[2], fence[1]), lines: [] };
      continue;
    }
    if (line === SIGNATURE_MARKER) {
      flushAll();
      html.push(SIGNATURE_SLOT);
      continue;
    }
    const heading = /^(##|###) (.+)$/.exec(line);
    if (heading) {
      flushAll();
      h += 1;
      const tag = heading[1] === "##" ? "h2" : "h3";
      html.push(`<${tag} id="section-${h}">${renderInline(heading[2])}</${tag}>`);
      continue;
    }
    if (line.startsWith(">> ")) {
      flushAll();
      html.push(`<aside class="ar-pull" aria-hidden="true"><p>${renderInline(line.slice(3))}</p></aside>`);
      continue;
    }
    if (line.startsWith("^ ")) {
      flushAll();
      html.push(
        `<details class="ar-note"><summary><span class="ar-note__mark" aria-hidden="true">*</span>הערת שוליים</summary><p>${renderInline(line.slice(2))}</p></details>`,
      );
      continue;
    }
    const bullet = /^[-•] (.+)$/.exec(line);
    const numbered = /^\d+[.)] (.+)$/.exec(line);
    if (bullet || numbered) {
      flushPara();
      flushQuote();
      const tag = bullet ? "ul" : "ol";
      if (!list || list.tag !== tag) {
        flushList();
        list = { tag, items: [] };
      }
      list.items.push((bullet ?? numbered)![1]);
      continue;
    }
    if (line.startsWith("> ")) {
      flushPara();
      flushList();
      quote.push(line.slice(2));
      continue;
    }
    flushList();
    flushQuote();
    para.push(line);
  }
  if (block) html.push(renderBlock(block.name, block.args, block.title, block.lines, ctx));
  flushAll();
  return html.join("\n");
}

/**
 * The article body as segments: HTML, the signature slot and artwork slots (from ":::split art=").
 * The signature slot is the "[[signature]]" line; without one (and `withSignature`), the component
 * goes at the end of the 2nd H2 section (right before the 3rd H2), or at the end of the body.
 * Without a signature, the marker is dropped. Segments may split an HTML element (an artwork slot
 * sits inside its split block); the page prints them back to back, so the markup stays whole.
 */
export function renderArticleSegments(md: string, withSignature: boolean): ArticleSegment[] {
  let html = renderArticle(md);
  if (!withSignature) html = html.split(SIGNATURE_SLOT).join("");
  else if (!html.includes(SIGNATURE_SLOT)) {
    let seen = 0;
    const at = html.replace(/<h2 /g, (m) => (++seen === 3 ? `${SIGNATURE_SLOT}\n${m}` : m));
    html = at.includes(SIGNATURE_SLOT) ? at : `${html}\n${SIGNATURE_SLOT}`;
  } else {
    /* only the first marker counts */
    const i = html.indexOf(SIGNATURE_SLOT) + SIGNATURE_SLOT.length;
    html = html.slice(0, i) + html.slice(i).split(SIGNATURE_SLOT).join("");
  }
  const parts = html.split(new RegExp(`${SLOT}(signature|art:[a-z0-9-]+)${SLOT}`));
  const out: ArticleSegment[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 0) {
      if (part) out.push({ kind: "html", html: part });
    } else if (part === "signature") out.push({ kind: "signature" });
    else out.push({ kind: "art", slug: part.slice(4) });
  });
  return out;
}

/** Approximate word count of an article (for read time / schema wordCount). */
export function countWords(md: string): number {
  return stripInlineMarkdown(md.split(SIGNATURE_MARKER).join(" ").replace(/^:::.*$/gm, " "))
    .replace(/[#>*^|+-]/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
}
