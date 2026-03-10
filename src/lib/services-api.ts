import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

export interface ServiceRow {
  id: string;
  badge: string;
  title: string;
  body: string;
  image: string;
  video?: string;
  iconType: "lucide" | "svg" | "image";
  iconLucideName?: string;
  iconSvg?: string;
  iconImage?: string;
  reverse: boolean;
  tags: string[];
  bgGradient: string;
  textColor: string;
  mutedTextColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconShadow: string;
  tagBg: string;
  tagText: string;
  order: number;
  published: boolean;
}

interface FetchServicesOptions {
  includeHidden?: boolean;
}

export interface DeletedServiceRow extends ServiceRow {
  deletedAt: number;
}

type ServiceDbRow = Database["public"]["Tables"]["services"]["Row"];
type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];
type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

class ServiceRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`Service repository failed to ${action}: ${message}`);
    this.name = "ServiceRepositoryError";
  }
}

function wrapServiceError(action: string, error: unknown): never {
  if (error instanceof Error) {
    throw new ServiceRepositoryError(action, error.message);
  }

  throw new ServiceRepositoryError(action, "Unknown error");
}

function normalizeText(value?: string): string | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeTags(tags: string[]): string[] {
  return tags.map((tag) => tag.trim()).filter(Boolean);
}

function mapServiceRow(row: ServiceDbRow): ServiceRow {
  return {
    id: row.id,
    badge: row.badge,
    title: row.title,
    body: row.body,
    image: row.image_url ?? "",
    video: row.video_url ?? undefined,
    iconType: row.icon_type,
    iconLucideName: row.icon_lucide_name ?? undefined,
    iconSvg: row.icon_svg ?? undefined,
    iconImage: row.icon_image_url ?? undefined,
    reverse: row.reverse_layout,
    tags: Array.isArray(row.tags) ? row.tags : [],
    bgGradient: row.bg_gradient,
    textColor: row.text_color,
    mutedTextColor: row.muted_text_color,
    badgeBg: row.badge_bg,
    badgeText: row.badge_text,
    iconBg: row.icon_bg,
    iconShadow: row.icon_shadow,
    tagBg: row.tag_bg,
    tagText: row.tag_text,
    order: row.display_order,
    published: row.is_published,
  };
}

function mapDeletedServiceRow(row: ServiceDbRow): DeletedServiceRow {
  return {
    ...mapServiceRow(row),
    deletedAt: row.deleted_at ? new Date(row.deleted_at).getTime() : Date.now(),
  };
}

function mapServiceInsert(service: Omit<ServiceRow, "id">, displayOrder: number): ServiceInsert {
  return {
    badge: service.badge.trim(),
    title: service.title.trim(),
    body: service.body.trim(),
    image_url: normalizeText(service.image),
    video_url: normalizeText(service.video),
    icon_type: service.iconType,
    icon_lucide_name: normalizeText(service.iconLucideName),
    icon_svg: normalizeText(service.iconSvg),
    icon_image_url: normalizeText(service.iconImage),
    reverse_layout: service.reverse,
    tags: normalizeTags(service.tags),
    bg_gradient: service.bgGradient,
    text_color: service.textColor,
    muted_text_color: service.mutedTextColor,
    badge_bg: service.badgeBg,
    badge_text: service.badgeText,
    icon_bg: service.iconBg,
    icon_shadow: service.iconShadow,
    tag_bg: service.tagBg,
    tag_text: service.tagText,
    display_order: displayOrder,
    is_published: service.published,
  };
}

function mapServiceUpdate(data: Partial<ServiceRow>): ServiceUpdate {
  const update: ServiceUpdate = {};

  if (data.badge !== undefined) update.badge = data.badge.trim();
  if (data.title !== undefined) update.title = data.title.trim();
  if (data.body !== undefined) update.body = data.body.trim();
  if (data.image !== undefined) update.image_url = normalizeText(data.image);
  if (data.video !== undefined) update.video_url = normalizeText(data.video);
  if (data.iconType !== undefined) update.icon_type = data.iconType;
  if (data.iconLucideName !== undefined) update.icon_lucide_name = normalizeText(data.iconLucideName);
  if (data.iconSvg !== undefined) update.icon_svg = normalizeText(data.iconSvg);
  if (data.iconImage !== undefined) update.icon_image_url = normalizeText(data.iconImage);
  if (data.reverse !== undefined) update.reverse_layout = data.reverse;
  if (data.tags !== undefined) update.tags = normalizeTags(data.tags);
  if (data.bgGradient !== undefined) update.bg_gradient = data.bgGradient;
  if (data.textColor !== undefined) update.text_color = data.textColor;
  if (data.mutedTextColor !== undefined) update.muted_text_color = data.mutedTextColor;
  if (data.badgeBg !== undefined) update.badge_bg = data.badgeBg;
  if (data.badgeText !== undefined) update.badge_text = data.badgeText;
  if (data.iconBg !== undefined) update.icon_bg = data.iconBg;
  if (data.iconShadow !== undefined) update.icon_shadow = data.iconShadow;
  if (data.tagBg !== undefined) update.tag_bg = data.tagBg;
  if (data.tagText !== undefined) update.tag_text = data.tagText;
  if (data.order !== undefined) update.display_order = data.order;
  if (data.published !== undefined) update.is_published = data.published;

  return update;
}

async function getNextServiceOrder(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("services")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? 0) + 1;
}

export async function fetchServices(options: FetchServicesOptions = {}): Promise<ServiceRow[]> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("services")
      .select("*")
      .is("deleted_at", null)
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!options.includeHidden) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapServiceRow);
  } catch (error) {
    return wrapServiceError("fetch services", error);
  }
}

export async function fetchDeletedServices(): Promise<DeletedServiceRow[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .not("deleted_at", "is", null)
      .order("deleted_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapDeletedServiceRow);
  } catch (error) {
    return wrapServiceError("fetch deleted services", error);
  }
}

export async function createService(service: Omit<ServiceRow, "id">): Promise<ServiceRow> {
  try {
    const supabase = getSupabaseClient();
    const displayOrder = service.order > 0 ? service.order : await getNextServiceOrder();
    const { data, error } = await supabase
      .from("services")
      .insert(mapServiceInsert(service, displayOrder))
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapServiceRow(data);
  } catch (error) {
    return wrapServiceError("create a service", error);
  }
}

export async function updateService(id: string, data: Partial<ServiceRow>): Promise<ServiceRow> {
  try {
    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("services")
      .update(mapServiceUpdate(data))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapServiceRow(row);
  } catch (error) {
    return wrapServiceError("update a service", error);
  }
}

export async function deleteService(id: string): Promise<DeletedServiceRow> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapDeletedServiceRow(data);
  } catch (error) {
    return wrapServiceError("soft-delete a service", error);
  }
}

export async function restoreService(id: string): Promise<ServiceRow> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("services")
      .update({ deleted_at: null })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapServiceRow(data);
  } catch (error) {
    return wrapServiceError("restore a service", error);
  }
}

export async function permanentlyDeleteService(id: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("services").delete().eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    return wrapServiceError("permanently delete a service", error);
  }
}
