import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowLeft, ArrowRight, User } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import { getBlogPost, getRelatedPosts, formatDate } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";
import { getAbsoluteAssetUrl } from "@/lib/site-url";

/* Simple Markdown-to-HTML renderer (no external dep) */
function renderMarkdown(md: string): string {
  return md
    .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-black text-foreground mt-8 mb-4">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 class="text-xl font-bold text-foreground mt-6 mb-3">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^- (.+)$/gm, '<li class="flex gap-2"><span class="text-primary mt-1 shrink-0">•</span><span>$1</span></li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul class="space-y-2 my-4">$&</ul>')
    .replace(/\n\n/g, '</p><p class="text-base leading-[1.95] text-muted-foreground my-4">')
    .replace(/^(?!<[h|u|l])(.+)$/gm, (m) => m.startsWith('<') ? m : `<p class="text-base leading-[1.95] text-muted-foreground my-4">${m}</p>`);
}

/* Maps each blog category to the most relevant service page for internal linking. */
const CATEGORY_SERVICE: Record<string, { label: string; href: string }> = {
  "בניית אתרים": { label: "בניית אתרים מקצועיים", href: "/services/web-development/" },
  "קידום אתרים": { label: "שיפור מהירות וקידום אתרים", href: "/services/website-performance/" },
  "פיתוח": { label: "פיתוח אתרים מתקדם", href: "/services/website-development/" },
  "עיצוב": { label: "בניית אתר תדמית לעסקים", href: "/services/business-website/" },
  "AI & אוטומציה": { label: "מערכת ניהול תורים", href: "/services/appointment-system/" },
  "כללי": { label: "כל השירותים שלנו", href: "/services/" },
};
const DEFAULT_SERVICE = { label: "כל השירותים שלנו", href: "/services/" };

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? getBlogPost(slug) : null;
  const related = slug ? getRelatedPosts(slug) : [];

  /* Bundled assets resolve to a root-relative hashed path ("/assets/x.webp").
     Schema.org and Open Graph both require an ABSOLUTE url, so the cover is
     promoted to one here — otherwise Google drops the image and social cards
     fall back to the generic site image. */
  const coverUrl = getAbsoluteAssetUrl(post?.cover_image);
  const postUrl = post ? `https://nz-web.com/blog/${post.slug}/` : "";

  /* Memoised: useSeoMeta compares `schema` by reference, so a literal rebuilt on
     every render would re-inject the <script> on every render. */
  const articleSchema = useMemo(
    () =>
      post
        ? {
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "@id": `${postUrl}#article`,
            headline: post.title,
            description: post.excerpt,
            image: coverUrl || "https://nz-web.com/og-image.png",
            url: postUrl,
            datePublished: post.published_at,
            dateModified: post.published_at,
            inLanguage: "he",
            author: {
              "@type": "Person",
              "@id": "https://nz-web.com/#founder",
              name: post.author || "צבי משה",
              url: "https://nz-web.com/about/",
            },
            publisher: { "@id": "https://nz-web.com/#organization" },
            mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
            articleSection: post.category,
            wordCount: post.content ? post.content.split(/\s+/).length : undefined,
            timeRequired: `PT${post.read_time}M`,
            keywords: post.category,
            isPartOf: { "@type": "Blog", "@id": "https://nz-web.com/blog/" },
          }
        : undefined,
    [post, postUrl, coverUrl],
  );

  useSeoMeta({
    title: post ? `${post.title} | NZ-web בלוג` : "מאמר לא נמצא | NZ-web",
    description: post?.excerpt ?? "",
    /* A slug that resolves to no post (e.g. a stale link, or a path served via
       the /blog/* SPA fallback) must not be indexed as a thin/empty page. */
    noindex: !post,
    ogImage: coverUrl || undefined,
    schema: articleSchema,
  });

  const relatedService = post ? CATEGORY_SERVICE[post.category] ?? DEFAULT_SERVICE : DEFAULT_SERVICE;

  useBreadcrumb({
    name: post?.title ?? "מאמר",
    path: post ? `/blog/${post.slug}` : "/blog",
    parent: { name: "בלוג", path: "/blog" },
  });

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background gap-4 pt-[68px] md:pt-[84px]" dir="rtl">
        <Header />
        <main id="page-content" className="flex flex-col items-center gap-4">
          <p className="text-xl font-bold text-foreground">המאמר לא נמצא</p>
          <Link to="/blog/" className="text-primary hover:underline">חזרה לבלוג</Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <AmbientShapes />
      <Header />

      <main id="page-content">

      {/* Back */}
      <div className="container mx-auto max-w-3xl px-5 pt-6 md:px-6">
        <Breadcrumbs items={[{ label: "בלוג", href: "/blog/" }, { label: post.title }]} />
        <Link to="/blog/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
          <ArrowRight aria-hidden="true" className="h-4 w-4" />
          חזרה לבלוג
        </Link>
      </div>

      {/* Article */}
      <article className="container mx-auto max-w-3xl px-5 py-10 md:px-6">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          {/* Category + meta */}
          <div className="mb-5 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{post.category}</span>
            <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />{formatDate(post.published_at)}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{post.read_time} דקות קריאה</span>
            <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{post.author}</span>
          </div>

          {/* Title */}
          <h1 className="text-display mb-6 text-balance text-foreground" style={{ fontFamily: "'Heebo', sans-serif" }}>
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="mb-8 text-lg font-medium leading-relaxed text-muted-foreground md:text-xl border-r-4 border-primary pr-5">
            {post.excerpt}
          </p>

          {/* Cover image */}
          {post.cover_image && (
            <div className="mb-10 overflow-hidden rounded-3xl">
              {/* fetchpriority is spread in lowercase — React 18 only forwards
                  the DOM attribute in this spelling (camelCase lands in React 19). */}
              <img
                src={post.cover_image}
                alt={`${post.title} – NZ-web`}
                width={post.cover_width}
                height={post.cover_height}
                className="h-auto w-full object-cover"
                {...{ fetchpriority: "high" }}
                decoding="async"
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose-custom text-right"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </motion.div>

        {/* Related service — contextual internal link */}
        <motion.div
          className="mt-12 flex flex-col gap-3 rounded-3xl border border-border/50 bg-card p-6 text-right sm:flex-row sm:items-center sm:justify-between"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div>
            <p className="text-sm font-semibold text-primary">קשור למאמר הזה</p>
            <p className="text-base font-bold text-foreground">{relatedService.label}</p>
          </div>
          <Link
            to={relatedService.href}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl border border-primary/30 bg-primary/[0.06] px-6 py-3 text-sm font-bold text-primary transition-all hover:bg-primary/10"
          >
            קראו על השירות
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-6 rounded-3xl border border-primary/20 bg-primary/[0.04] p-8 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <p className="nz-eyebrow mb-3">מוכנים להתחיל?</p>
          <h3 className="mb-4 text-xl font-black text-foreground md:text-2xl">יש לכם פרויקט בראש?</h3>
          <Link to="/contact/" className="btn-brand inline-flex items-center gap-2 rounded-2xl px-8 py-3.5 font-bold transition-all hover:scale-[1.04]">
            בואו נדבר
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </motion.div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-border/30 bg-secondary/30 py-14" dir="rtl">
          <div className="container mx-auto max-w-5xl px-5 md:px-6">
            <h2 className="mb-8 text-center text-2xl font-black text-foreground">מאמרים נוספים</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
              {/* Real <Link>s, not buttons: a crawler cannot follow an onClick,
                  and these are the only internal links between blog posts. */}
              {related.map((r) => (
                <Link key={r.id} to={`/blog/${r.slug}/`} className="group flex flex-col gap-3 rounded-2xl border border-border/40 bg-card p-5 text-right transition-all hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary w-fit">{r.category}</span>
                  <h3 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors">{r.title}</h3>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default BlogPost;
