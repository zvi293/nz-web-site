import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Calendar, ArrowLeft, BookOpen, Tag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToHome from "@/components/BackToHome";
import WhatsAppButton from "@/components/WhatsAppButton";
import BackToTopButton from "@/components/BackToTopButton";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import AmbientShapes from "@/components/AmbientShapes";
import { getBlogPosts, formatDate, type BlogPost } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useSeoMeta } from "@/hooks/useSeoMeta";
import { useBreadcrumb } from "@/hooks/useBreadcrumb";

const CATEGORIES = ["הכל", "בניית אתרים", "קידום אתרים", "פיתוח", "עיצוב", "AI & אוטומציה"];

const categoryColors: Record<string, string> = {
  "בניית אתרים": "#3b82f6",
  "קידום אתרים": "#10b981",
  "פיתוח": "#8b5cf6",
  "עיצוב": "#ec4899",
  "AI & אוטומציה": "#f97316",
  "כללי": "#64748b",
};

const PostCard = ({ post, index }: { post: BlogPost; index: number }) => {
  const color = categoryColors[post.category] ?? "#3b82f6";

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="spotlight group flex flex-col overflow-hidden rounded-[1.75rem] border border-border/50 bg-card shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-xl"
    >
      {/* One real <Link> covers the whole card (crawlable + keyboard-reachable);
          the previous onClick-on-<article> was invisible to both crawlers and
          the Tab key. */}
      <Link to={`/blog/${post.slug}/`} className="flex flex-1 flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40">
        {/* Cover image / placeholder */}
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-secondary to-secondary/50">
          {post.cover_image ? (
            <img
              src={post.cover_image}
              alt={`תמונת שער למאמר: ${post.title}`}
              width={post.cover_width}
              height={post.cover_height}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <BookOpen aria-hidden="true" className="h-12 w-12 text-muted-foreground/30" />
            </div>
          )}
          {/* Category badge */}
          <span
            className="absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-bold text-white shadow-md"
            style={{ backgroundColor: color }}
          >
            {post.category}
          </span>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
              {formatDate(post.published_at)}
            </span>
            <span className="flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {post.read_time} דקות קריאה
            </span>
          </div>

          <h2 className="text-lg font-black leading-snug text-foreground transition-colors group-hover:text-primary md:text-xl">
            {post.title}
          </h2>
          <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>

          <div className="flex items-center gap-1.5 text-sm font-semibold transition-all duration-200 group-hover:gap-3" style={{ color }}>
            קרא עוד
            <ArrowLeft aria-hidden="true" className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
};

const Blog = () => {
  const posts = getBlogPosts();
  const [activeCategory, setActiveCategory] = useState("הכל");

  /* Blog entity + the post list as machine-readable entries. */
  const blogSchema = useMemo(
    () => ({
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": "https://nz-web.com/blog/",
      name: "הבלוג של NZ-web",
      description:
        "מדריכים, טיפים ותובנות מקצועיות על בניית אתרים, פיתוח אתרים, עיצוב UI/UX וקידום SEO בישראל.",
      url: "https://nz-web.com/blog/",
      inLanguage: "he",
      publisher: { "@id": "https://nz-web.com/#organization" },
      blogPost: posts.map((p) => ({
        "@type": "BlogPosting",
        "@id": `https://nz-web.com/blog/${p.slug}/#article`,
        headline: p.title,
        description: p.excerpt,
        url: `https://nz-web.com/blog/${p.slug}/`,
        datePublished: p.published_at,
        author: { "@id": "https://nz-web.com/#founder" },
      })),
    }),
    [posts],
  );

  useSeoMeta({
    title: "בלוג בניית אתרים | מדריכים ו-SEO | NZ-web",
    description: "מדריכים, טיפים ותובנות מקצועיות על בניית אתרים, פיתוח אתרים, עיצוב UI/UX וקידום SEO בישראל. תוכן מניסיון אמיתי מהשטח.",
    keywords: "בלוג בניית אתרים, מדריך פיתוח אתרים, טיפים SEO, מאמרים עיצוב אתרים, כמה עולה אתר, React WordPress השוואה",
    schema: blogSchema,
  });
  useBreadcrumb({ name: "בלוג", path: "/blog" });

  const filtered = activeCategory === "הכל" ? posts : posts.filter((p) => p.category === activeCategory);
  const availableCategories = CATEGORIES.filter((c) => c === "הכל" || posts.some((p) => p.category === c));

  return (
    <div className="relative bg-background pt-[68px] md:pt-[84px]" dir="rtl">
      <AmbientShapes />
      <Header />
      <BackToHome />

      <main id="page-content">

      <div className="container mx-auto px-5 pt-6 md:px-6">
        <Breadcrumbs items={[{ label: "בלוג" }]} className="mb-0" />
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden py-16 md:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-1/4 top-0 h-[400px] w-[400px] rounded-full bg-primary/[0.04] blur-[130px]" />
        </div>
        <div className="container relative z-10 mx-auto max-w-3xl px-6 text-center">
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="nz-eyebrow mb-5">
            הבלוג שלנו
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-5 text-4xl font-black leading-tight text-foreground md:text-6xl" style={{ fontFamily: "'Heebo', sans-serif" }}>
            ידע שמביא{" "}
            <span className="text-gradient-brand">תוצאות אמיתיות</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mx-auto max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            מדריכים, טיפים ותובנות מקצועיות על פיתוח אתרים, עיצוב ו-SEO — מניסיון אמיתי מהשטח.
          </motion.p>
        </div>
      </section>

      {/* Category filter */}
      <section className="pb-8">
        <div className="container mx-auto px-5 md:px-6">
          <div className="flex flex-wrap justify-center gap-2">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "border border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
              >
                {cat !== "הכל" && <Tag className="h-3.5 w-3.5" />}
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="pb-20 md:pb-28">
        <div className="container mx-auto px-5 md:px-6">
          {filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground">אין מאמרים בקטגוריה זו.</div>
          ) : (
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((post, i) => (
                <PostCard key={post.id} post={post} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/30 bg-secondary/30 py-14 md:py-20">
        <div className="container mx-auto max-w-2xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-black text-foreground md:text-3xl">
            יש לכם שאלה שלא ענינו עליה?
          </h2>
          <p className="mb-8 text-muted-foreground">נשמח לדבר — שיחת ייעוץ ראשונית ללא עלות.</p>
          <Link to="/contact/" className="btn-brand inline-flex items-center gap-2 rounded-2xl px-8 py-4 font-bold transition-all hover:scale-[1.04]">
            צרו קשר
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </section>

      </main>

      <Footer />
      <WhatsAppButton />
      <BackToTopButton />
      <AccessibilityWidget />
    </div>
  );
};

export default Blog;
