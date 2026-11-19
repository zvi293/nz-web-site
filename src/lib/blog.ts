import { blogPosts } from "@/content/blog";
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

/* ───────────────────────── article content renderer ─────────────────────────
 * Article `content` is a small, safe markdown subset:
 *   ## H2            ### H3
 *   - bullet         1. numbered item
 *   > quote          blank line = new paragraph
 *   **bold**  *italic*  [anchor text](/internal/path/)  [text](https://external)
 * Links: only "/…" (internal, rendered as plain <a>) and "https://…" (external,
 * opens in a new tab with rel="noopener"). Everything else is escaped.
 * Output is unstyled semantic HTML; style it from the page via a wrapper class.
 */

export interface ArticleHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Strip inline markdown to plain text (for headings in a TOC, schema, etc.). */
export function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, "$1")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1");
}

function renderInline(raw: string): string {
  let s = escapeHtml(raw);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, href: string) => {
    const url = href.replace(/&amp;/g, "&");
    if (url.startsWith("/")) return `<a href="${escapeHtml(url)}">${text}</a>`;
    if (url.startsWith("https://"))
      return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${text}</a>`;
    return text;
  });
  s = s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  return s;
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

/** Render article content to HTML (headings get ids "section-1", "section-2", …). */
export function renderArticle(md: string): string {
  const html: string[] = [];
  let para: string[] = [];
  let list: { tag: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];
  let h = 0;

  const flushPara = () => {
    if (para.length) html.push(`<p>${renderInline(para.join(" "))}</p>`);
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
    if (!line) {
      flushAll();
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
  flushAll();
  return html.join("\n");
}

/** Approximate word count of an article (for read time / schema wordCount). */
export function countWords(md: string): number {
  return stripInlineMarkdown(md).replace(/[#>*\-]/g, " ").split(/\s+/).filter(Boolean).length;
}
