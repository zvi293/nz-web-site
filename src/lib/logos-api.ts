import { createLabeledImageDataUri, normalizeLogoImageUrl } from "@/lib/runtime-safety";
import { getSupabaseClient, reportPublicSupabaseFallback } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

export interface ClientLogo {
  id: string;
  name: string;
  image: string;
  visible: boolean;
  order: number;
}

const defaultLogoNames = ["Google", "Microsoft", "Apple", "Amazon", "Meta", "Netflix", "Spotify", "Adobe", "Stripe", "Shopify"];

const defaultLogos: ClientLogo[] = defaultLogoNames.map((name, index) => ({
  id: `fallback-logo-${index + 1}`,
  name,
  image: createLabeledImageDataUri(name, { background: "#ffffff", foreground: "#0f172a", fontSize: 28 }),
  visible: true,
  order: index,
}));

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
    image: normalizeLogoImageUrl(row.name, row.image_url),
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

    return logos;
  } catch (error) {
    if (options.includeHidden) {
      return wrapLogoError("fetch logos", error);
    }

    reportPublicSupabaseFallback("client logos", error);
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
    const demos: Omit<ClientLogo, "id">[] = defaultLogoNames.map((name) => ({
      name,
      image: createLabeledImageDataUri(name, { background: "#ffffff", foreground: "#0f172a", fontSize: 28 }),
      visible: true,
      order: 0,
    }));

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
