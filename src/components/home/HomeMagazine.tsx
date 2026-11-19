import { Artwork, hasArt } from "@/components/art";
import { Button, ArrowIcon } from "@/components/nz";
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
const SPARE_ART = ["ultramarine-spill", "cyanotype-jellyfish", "snowflake-furnace", "sneaker-pool"];

function pickCovers(slugsWanted: (string | undefined)[], categories: string[]): string[] {
  const used = new Set<string>();
  return slugsWanted.map((wanted, i) => {
    const candidates = [wanted, ...(CATEGORY_ART[categories[i]] ?? []), ...SPARE_ART].filter(
      (s): s is string => !!s && hasArt(s) && !used.has(s),
    );
    const pick = candidates[0] ?? "zipper-library";
    used.add(pick);
    return pick;
  });
}

/**
 * "From the magazine" — set like the front page of a printed magazine: a masthead with
 * a double rule, the newest article as the lead story (large cover, serif headline),
 * three more as a column of briefs. Read times are not shown here (the article pages
 * carry them); the lead shows its date, the briefs their category. Static (no client JS).
 */
const HomeMagazine = () => {
  const posts = getBlogPosts().slice(0, 4);
  const covers = pickCovers(
    posts.map((p) => p.art),
    posts.map((p) => p.category),
  );
  const [lead, ...briefs] = posts;

  return (
    <section id="magazine" className="nz-section nz-section--space-default hm-magazine" data-tone="bone" aria-labelledby="hm-magazine-title">
      <div className="nz-container">
        <header className="hm-masthead hm-sd">
          <p className="hm-masthead__top nz-label">
            <span className="nz-label__index">{magazine.room}</span>
            <span>{magazine.masthead}</span>
          </p>
          <h2 id="hm-magazine-title" className="hm-masthead__title">
            {magazine.title}
          </h2>
          <p className="hm-masthead__lede">{magazine.lede}</p>
        </header>

        {lead && (
          <div className="hm-press">
            <article className="hm-lead hm-sd">
              <a href={`/blog/${lead.slug}/`} className="hm-lead__link">
                <span className="hm-lead__cover" aria-hidden="true">
                  <Artwork slug={covers[0]} sizes="(min-width: 1024px) 56vw, 92vw" ratio="3 / 2" alt="" className="hm-static-art" />
                </span>
                <span className="hm-lead__body">
                  <span className="nz-label hm-lead__meta">
                    <span className="nz-label__index">{magazine.leadLabel}</span>
                    <span>{lead.category}</span>
                  </span>
                  <h3 className="hm-lead__title">{lead.title}</h3>
                  {lead.excerpt && <span className="hm-lead__excerpt">{lead.excerpt}</span>}
                  <span className="hm-lead__foot">
                    <time dateTime={lead.published_at.slice(0, 10)}>{formatDate(lead.published_at)}</time>
                  </span>
                  <span className="nz-link hm-lead__more" aria-hidden="true">
                    <span className="nz-link__text">{magazine.readMore}</span>
                    <ArrowIcon className="nz-link__arrow" />
                  </span>
                </span>
              </a>
            </article>

            <ol className="hm-briefs">
              {briefs.map((post, i) => (
                <li key={post.slug} className="hm-sd">
                  <a href={`/blog/${post.slug}/`} className="hm-brief">
                    <span className="hm-brief__thumb" aria-hidden="true">
                      <Artwork slug={covers[i + 1]} sizes="(min-width: 1024px) 14vw, 30vw" ratio="1 / 1" alt="" className="hm-static-art" />
                    </span>
                    <span className="hm-brief__body">
                      <span className="nz-label hm-brief__meta">
                        <span className="nz-label__index">{post.category}</span>
                      </span>
                      <h3 className="hm-brief__title">{post.title}</h3>
                    </span>
                  </a>
                </li>
              ))}
              <li className="hm-briefs__all">
                <Button href={magazine.allLink.href} variant="quiet">
                  {magazine.allLink.label}
                </Button>
              </li>
            </ol>
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeMagazine;
