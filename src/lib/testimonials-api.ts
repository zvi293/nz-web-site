import { getSupabaseClient } from "@/lib/supabase";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  text: string;
  rating: number;
  initials: string;
  avatar_color: string;
  sort_order: number;
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await getSupabaseClient()
    .from("testimonials")
    .select("id, name, role, company, text, rating, initials, avatar_color, sort_order")
    .eq("is_visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("fetchTestimonials error:", error.message);
    return [];
  }
  return data ?? [];
}
