import { getSupabaseClient } from "@/lib/supabase";

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  cover_image: string;
  author: string;
  read_time: number;
  published_at: string;
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await getSupabaseClient()
    .from("blog_posts")
    .select("id, title, slug, excerpt, category, cover_image, author, read_time, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  if (error) {
    console.error("fetchBlogPosts error:", error.message);
    return [];
  }
  return data ?? [];
}

export async function fetchBlogPost(slug: string): Promise<BlogPost | null> {
  const { data, error } = await getSupabaseClient()
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error) {
    console.error("fetchBlogPost error:", error.message);
    return null;
  }
  return data;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
