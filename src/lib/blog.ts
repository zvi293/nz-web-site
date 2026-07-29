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
