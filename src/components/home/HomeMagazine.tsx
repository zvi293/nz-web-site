import { Link } from "react-router-dom";
import { Artwork, hasArt } from "@/components/art";
import { Section, Eyebrow, Display, Lede, Button, Reveal } from "@/components/nz";
import { getBlogPosts, formatDate } from "@/lib/blog";
import { magazine } from "@/content/home";

/* Fallback covers when a post has no `art` yet — from the playbook's blog-cover list,
   matched loosely by category, never repeating a piece on the page. */
const CATEGORY_ART: Record<string, string[]> = {
  "קידום אתרים": ["copper-roots", "lighthouse-blueprint"],
  "בניית אתרים": ["book-garden", "chrome-umbrella"],
  פיתוח: ["keycap-hotel", "silver-droplet"],
  עיצוב: ["turquoise-fans", "porcelain-shockwave"],
};
const SPARE_ART = ["ultramarine-spill", "obsidian-tear", "cyanotype-jellyfish", "snowflake-furnace", "sneaker-pool"];

function pickCovers(slugsWanted: (string | undefined)[], categories: string[]): string[] {
  const used = new Set<string>();
  return slugsWanted.map((wanted, i) => {
    const candidates = [wanted, ...(CATEGORY_ART[categories[i]] ?? []), ...SPARE_ART].filter(
      (s): s is string => hasArt(s) && !used.has(s),
    );
    const pick = candidates[0] ?? "zipper-library";
    used.add(pick);
    return pick;
  });
}

const HomeMagazine = () => {
  const posts = getBlogPosts().slice(0, 3);
  const covers = pickCovers(
    posts.map((p) => p.art),
    posts.map((p) => p.category),
  );

  return (
    <Section id="magazine" tone="bone" aria-labelledby="hm-magazine-title" className="hm-magazine">
      <div className="hm-head">
        <Eyebrow index={6} rule>
          {magazine.eyebrow}
        </Eyebrow>
        <Reveal>
          <Display id="hm-magazine-title" size="h2" className="hm-head__title">
            {magazine.title}
          </Display>
        </Reveal>
        <Reveal delay={80}>
          <Lede className="hm-head__lede">{magazine.lede}</Lede>
        </Reveal>
      </div>

      <Reveal as="ul" variant="stagger" className="hm-posts">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link to={`/blog/${post.slug}/`} className="hm-post">
              <Artwork slug={covers[i]} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw" ratio="4 / 3" alt="" />
              <p className="nz-label hm-post__meta">
                <span className="nz-label__index">{post.category}</span>
                <span>{magazine.readTime(post.read_time)}</span>
              </p>
              <h3 className="hm-post__title">{post.title}</h3>
              <p className="hm-post__date">
                <time dateTime={post.published_at.slice(0, 10)}>{formatDate(post.published_at)}</time>
              </p>
            </Link>
          </li>
        ))}
      </Reveal>

      <div className="hm-foot">
        <Button to={magazine.allLink.href} variant="quiet">
          {magazine.allLink.label}
        </Button>
      </div>
    </Section>
  );
};

export default HomeMagazine;
