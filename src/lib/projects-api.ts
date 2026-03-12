import { getSupabaseClient, reportPublicSupabaseFallback } from "@/lib/supabase";
import { formatRepositoryError } from "@/lib/repository-error";
import type { Database } from "@/lib/supabase-types";

export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  featured: boolean;
  published: boolean;
  order: number;
}

const defaultProjects: Project[] = [
  {
    id: "fallback-project-1",
    title: "פדות עמרם - סטודיו לעיצוב גבות",
    description: "פיתוח אתר בוטיק הכולל אוטומציה מלאה ליומן תורים, התממשקות למערכות חיצוניות ופאנל ניהול מאובטח.",
    tags: ["מערכת קביעת תורים", "דשבורד ניהול", "עיצוב תדמית"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    link: "#",
    featured: true,
    published: true,
    order: 0,
  },
  {
    id: "fallback-project-2",
    title: "קליניקה לטיפול רגשי",
    description: "אתר תדמית מקצועי המשלב מערכת חכמה לאיסוף לידים, שליחת טפסים ומיילים אוטומטיים, יחד עם חיבור מהיר לווואטסאפ ושיחה ישירה.",
    tags: ["איסוף לידים חכם", "אוטומציית מיילים", "אתר תדמית"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    link: "#",
    featured: true,
    published: true,
    order: 1,
  },
];

interface FetchProjectsOptions {
  includeUnpublished?: boolean;
}

type ProjectRow = Database["public"]["Tables"]["projects"]["Row"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectUpdate = Database["public"]["Tables"]["projects"]["Update"];

class ProjectRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`Project repository failed to ${action}: ${message}`);
    this.name = "ProjectRepositoryError";
  }
}

function wrapProjectError(action: string, error: unknown): never {
  throw new ProjectRepositoryError(action, formatRepositoryError(error));
}

function mapProjectRow(row: ProjectRow): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    tags: Array.isArray(row.tags) ? row.tags : [],
    image: row.image_url ?? "",
    link: row.project_url ?? "",
    featured: row.is_featured,
    published: row.is_published,
    order: row.display_order,
  };
}

function normalizeTags(tags: string[]): string[] {
  return tags.map((tag) => tag.trim()).filter(Boolean);
}

function getDefaultProjects(): Project[] {
  return [...defaultProjects].sort((a, b) => a.order - b.order);
}

function mapProjectInsert(project: Omit<Project, "id">, displayOrder: number): ProjectInsert {
  return {
    title: project.title.trim(),
    description: project.description.trim(),
    tags: normalizeTags(project.tags),
    image_url: project.image.trim() || null,
    project_url: project.link.trim() || null,
    is_featured: project.featured,
    is_published: project.published,
    display_order: displayOrder,
  };
}

function mapProjectUpdate(data: Partial<Project>): ProjectUpdate {
  const update: ProjectUpdate = {};

  if (data.title !== undefined) update.title = data.title.trim();
  if (data.description !== undefined) update.description = data.description.trim();
  if (data.tags !== undefined) update.tags = normalizeTags(data.tags);
  if (data.image !== undefined) update.image_url = data.image.trim() || null;
  if (data.link !== undefined) update.project_url = data.link.trim() || null;
  if (data.featured !== undefined) update.is_featured = data.featured;
  if (data.published !== undefined) update.is_published = data.published;
  if (data.order !== undefined) update.display_order = data.order;

  return update;
}

async function getNextProjectDisplayOrder(): Promise<number> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.display_order ?? -1) + 1;
}

export async function fetchProjects(options: FetchProjectsOptions = {}): Promise<Project[]> {
  try {
    const supabase = getSupabaseClient();
    let query = supabase
      .from("projects")
      .select("*")
      .order("display_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (!options.includeUnpublished) {
      query = query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapProjectRow);
  } catch (error) {
    if (options.includeUnpublished) {
      return wrapProjectError("fetch projects", error);
    }

    reportPublicSupabaseFallback("projects", error);
    return getDefaultProjects();
  }
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  try {
    const supabase = getSupabaseClient();
    const displayOrder = await getNextProjectDisplayOrder();
    const { data, error } = await supabase
      .from("projects")
      .insert(mapProjectInsert(project, displayOrder))
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapProjectRow(data);
  } catch (error) {
    return wrapProjectError("create a project", error);
  }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  try {
    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("projects")
      .update(mapProjectUpdate(data))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapProjectRow(row);
  } catch (error) {
    return wrapProjectError("update a project", error);
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("projects").delete().eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    return wrapProjectError("delete a project", error);
  }
}
