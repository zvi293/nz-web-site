import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

export interface ClientLogo {
  id: string;
  name: string;
  image: string;
  visible: boolean;
  order: number;
}

const defaultLogos: ClientLogo[] = [
  { id: "fallback-logo-1", name: "Google", image: "https://logo.clearbit.com/google.com", visible: true, order: 0 },
  { id: "fallback-logo-2", name: "Microsoft", image: "https://logo.clearbit.com/microsoft.com", visible: true, order: 1 },
  { id: "fallback-logo-3", name: "Apple", image: "https://logo.clearbit.com/apple.com", visible: true, order: 2 },
  { id: "fallback-logo-4", name: "Amazon", image: "https://logo.clearbit.com/amazon.com", visible: true, order: 3 },
  { id: "fallback-logo-5", name: "Meta", image: "https://logo.clearbit.com/meta.com", visible: true, order: 4 },
  { id: "fallback-logo-6", name: "Netflix", image: "https://logo.clearbit.com/netflix.com", visible: true, order: 5 },
  { id: "fallback-logo-7", name: "Spotify", image: "https://logo.clearbit.com/spotify.com", visible: true, order: 6 },
  { id: "fallback-logo-8", name: "Adobe", image: "https://logo.clearbit.com/adobe.com", visible: true, order: 7 },
  { id: "fallback-logo-9", name: "Stripe", image: "https://logo.clearbit.com/stripe.com", visible: true, order: 8 },
  { id: "fallback-logo-10", name: "Shopify", image: "https://logo.clearbit.com/shopify.com", visible: true, order: 9 },
];

interface FetchLogosOptions {
  includeHidden?: boolean;
}

type ClientLogoRow = Database["public"]["Tables"]["client_logos"]["Row"];
type ClientLogoInsert = Database["public"]["Tables"]["client_logos"]["Insert"];

class ClientLogoRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`Client logo repository failed to ${action}: ${message}`);
    this.name = "ClientLogoRepositoryError";
  }
}

function wrapLogoError(action: string, error: unknown): never {
  if (error instanceof Error) {
    throw new ClientLogoRepositoryError(action, error.message);
  }

  throw new ClientLogoRepositoryError(action, "Unknown error");
}

function mapLogoRow(row: ClientLogoRow): ClientLogo {
  return {
    id: row.id,
    name: row.name,
    image: row.image_url,
    visible: row.is_published,
    order: row.display_order,
  };
}

function mapLogoInsert(logo: Omit<ClientLogo, "id">, displayOrder: number): ClientLogoInsert {
  return {
    name: logo.name.trim() || "לוגו",
    image_url: logo.image.trim(),
    display_order: displayOrder,
    is_published: logo.visible,
  };
}

function getDefaultLogos(): ClientLogo[] {
  return [...defaultLogos].sort((a, b) => a.order - b.order);
}

async function getNextLogoDisplayOrder(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("client_logos")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? -1) + 1;
}

export async function fetchLogos(options: FetchLogosOptions = {}): Promise<ClientLogo[]> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("client_logos")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!options.includeHidden) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    const logos = (data ?? []).map(mapLogoRow);

    if (logos.length === 0 && !options.includeHidden) {
      console.warn("Client logos fallback activated: Supabase returned no published logos.");
      return getDefaultLogos();
    }

    return logos;
  } catch (error) {
    if (options.includeHidden) {
      return wrapLogoError("fetch logos", error);
    }

    console.warn("Client logos fallback activated: Supabase fetch failed.", error);
    return getDefaultLogos();
  }
}

export async function addLogo(logo: Omit<ClientLogo, "id">): Promise<ClientLogo> {
  try {
    const supabase = getSupabaseClient();
    const displayOrder = await getNextLogoDisplayOrder();
    const { data, error } = await supabase
      .from("client_logos")
      .insert(mapLogoInsert(logo, displayOrder))
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapLogoRow(data);
  } catch (error) {
    return wrapLogoError("create a logo", error);
  }
}

export async function updateLogo(id: string, data: Partial<Omit<ClientLogo, "id">>): Promise<ClientLogo> {
  try {
    const update: Database["public"]["Tables"]["client_logos"]["Update"] = {};

    if (data.name !== undefined) {
      update.name = data.name.trim() || "לוגו";
    }

    if (data.image !== undefined) {
      update.image_url = data.image.trim();
    }

    if (data.visible !== undefined) {
      update.is_published = data.visible;
    }

    if (data.order !== undefined) {
      update.display_order = data.order;
    }

    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("client_logos")
      .update(update)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapLogoRow(row);
  } catch (error) {
    return wrapLogoError("update a logo", error);
  }
}

export async function deleteLogo(id: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("client_logos").delete().eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    return wrapLogoError("delete a logo", error);
  }
}

export async function deleteAllLogos(): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("client_logos").delete().not("id", "is", null);

    if (error) {
      throw error;
    }
  } catch (error) {
    return wrapLogoError("delete all logos", error);
  }
}

export async function seedDemoLogos(): Promise<ClientLogo[]> {
  try {
    const demos: Omit<ClientLogo, "id">[] = [
      { name: "Google", image: "https://logo.clearbit.com/google.com", visible: true, order: 0 },
      { name: "Microsoft", image: "https://logo.clearbit.com/microsoft.com", visible: true, order: 0 },
      { name: "Apple", image: "https://logo.clearbit.com/apple.com", visible: true, order: 0 },
      { name: "Amazon", image: "https://logo.clearbit.com/amazon.com", visible: true, order: 0 },
      { name: "Meta", image: "https://logo.clearbit.com/meta.com", visible: true, order: 0 },
      { name: "Netflix", image: "https://logo.clearbit.com/netflix.com", visible: true, order: 0 },
      { name: "Spotify", image: "https://logo.clearbit.com/spotify.com", visible: true, order: 0 },
      { name: "Adobe", image: "https://logo.clearbit.com/adobe.com", visible: true, order: 0 },
      { name: "Stripe", image: "https://logo.clearbit.com/stripe.com", visible: true, order: 0 },
      { name: "Shopify", image: "https://logo.clearbit.com/shopify.com", visible: true, order: 0 },
    ];

    const startOrder = await getNextLogoDisplayOrder();
    const supabase = getSupabaseClient();
    const { error } = await supabase
      .from("client_logos")
      .insert(demos.map((logo, index) => mapLogoInsert(logo, startOrder + index)));

    if (error) {
      throw error;
    }

    return fetchLogos();
  } catch (error) {
    return wrapLogoError("seed demo logos", error);
  }
}
