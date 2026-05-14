import { getSupabaseClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase-types";

export type LeadStatus = Database["public"]["Tables"]["leads"]["Row"]["status"];
export type LeadSendMethod = Database["public"]["Tables"]["leads"]["Row"]["send_method"];

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone: string;
  companyName?: string;
  inquiryType?: string;
  subject: string;
  sendMethod: LeadSendMethod;
  status: LeadStatus;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
  deletedAt?: string;
}

type LeadRow = Database["public"]["Tables"]["leads"]["Row"];
type LeadInsert = Database["public"]["Tables"]["leads"]["Insert"];
type LeadUpdate = Database["public"]["Tables"]["leads"]["Update"];

const RETENTION_DAYS = 30;

class LeadRepositoryError extends Error {
  constructor(action: string, message: string) {
    super(`Lead repository failed to ${action}: ${message}`);
    this.name = "LeadRepositoryError";
  }
}

function getLeadErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "object" && error !== null) {
    const message = "message" in error && typeof error.message === "string" ? error.message : null;
    const details = "details" in error && typeof error.details === "string" ? error.details : null;
    const hint = "hint" in error && typeof error.hint === "string" ? error.hint : null;
    const code = "code" in error && typeof error.code === "string" ? error.code : null;

    return [message, details, hint, code ? `code=${code}` : null].filter(Boolean).join(" | ") || "Unknown error";
  }

  return "Unknown error";
}

function logLeadRepositoryError(action: string, error: unknown, context?: Record<string, unknown>) {
  if (typeof console === "undefined") {
    return;
  }

  const payload = {
    action,
    message: getLeadErrorMessage(error),
    raw: error,
    ...(context ? { context } : {}),
  };

  console.error("Lead repository error", payload);
}

function mapLeadRow(row: LeadRow): Lead {
  return {
    id: row.id,
    name: row.name,
    email: row.email ?? undefined,
    phone: row.phone,
    companyName: row.company_name ?? undefined,
    inquiryType: row.inquiry_type ?? undefined,
    subject: row.subject,
    sendMethod: row.send_method,
    status: row.status === "pending" || row.status === "handled" || row.status === "rejected" ? row.status : "pending",
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    notes: row.notes ?? undefined,
    deletedAt: row.deleted_at ?? undefined,
  };
}

function toNullableText(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function mapLeadInsert(data: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">): LeadInsert {
  const normalizedSubject = data.subject.trim() || "ללא נושא";

  return {
    name: data.name.trim(),
    email: toNullableText(data.email),
    phone: data.phone.trim(),
    company_name: toNullableText(data.companyName),
    inquiry_type: toNullableText(data.inquiryType),
    subject: normalizedSubject,
    send_method: data.sendMethod,
    notes: toNullableText(data.notes),
  };
}

/**
 * Generates a UUID v4.
 * `crypto.randomUUID()` is only available in secure contexts (HTTPS / localhost).
 * On a plain-HTTP origin (e.g. the dev server opened via a LAN IP) it is undefined,
 * which previously crashed lead creation. This falls back to `crypto.getRandomValues`
 * (available in non-secure contexts) and finally to a Math.random-based id.
 */
function generateUuid(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = crypto.getRandomValues(new Uint8Array(16));
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0"));
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10, 16).join("")}`;
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function createLocalLead(data: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">): Lead {
  const now = new Date().toISOString();

  return {
    id: generateUuid(),
    name: data.name.trim(),
    email: toNullableText(data.email) ?? undefined,
    phone: data.phone.trim(),
    companyName: toNullableText(data.companyName) ?? undefined,
    inquiryType: toNullableText(data.inquiryType) ?? undefined,
    subject: data.subject.trim() || "ללא נושא",
    sendMethod: data.sendMethod,
    status: "pending",
    createdAt: now,
    updatedAt: now,
    notes: toNullableText(data.notes) ?? undefined,
  };
}

function mapLeadUpdate(
  data: Partial<Pick<Lead, "name" | "email" | "phone" | "companyName" | "inquiryType" | "subject" | "notes" | "status">>,
): LeadUpdate {
  const update: LeadUpdate = {};

  if (data.name !== undefined) update.name = data.name.trim();
  if (data.email !== undefined) update.email = toNullableText(data.email);
  if (data.phone !== undefined) update.phone = data.phone.trim();
  if (data.companyName !== undefined) update.company_name = toNullableText(data.companyName);
  if (data.inquiryType !== undefined) update.inquiry_type = toNullableText(data.inquiryType);
  if (data.subject !== undefined) update.subject = data.subject.trim();
  if (data.notes !== undefined) update.notes = toNullableText(data.notes);
  if (data.status !== undefined) update.status = data.status;

  return update;
}

function getRecycleBinCutoffIso(): string {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  return cutoff.toISOString();
}

function wrapLeadError(action: string, error: unknown): never {
  logLeadRepositoryError(action, error);
  throw new LeadRepositoryError(action, getLeadErrorMessage(error));
}

export async function fetchLeads(): Promise<Lead[]> {
  try {
    const supabase = getSupabaseClient();
    // Phase 1 keeps public lead creation open, but read access still depends on future admin auth claims.
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .is("deleted_at", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapLeadRow);
  } catch (error) {
    return wrapLeadError("fetch active leads", error);
  }
}

export async function fetchDeletedLeads(): Promise<Lead[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .not("deleted_at", "is", null)
      .gte("deleted_at", getRecycleBinCutoffIso())
      .order("deleted_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []).map(mapLeadRow);
  } catch (error) {
    return wrapLeadError("fetch deleted leads", error);
  }
}

export async function addLead(data: Omit<Lead, "id" | "status" | "createdAt" | "updatedAt">): Promise<Lead> {
  try {
    const supabase = getSupabaseClient();
    const lead = createLocalLead(data);
    const insertPayload: LeadInsert = {
      ...mapLeadInsert(data),
      id: lead.id,
      created_at: lead.createdAt,
      updated_at: lead.updatedAt,
      status: lead.status,
    };
    const { error } = await supabase
      .from("leads")
      .insert(insertPayload)

    if (error) {
      logLeadRepositoryError("create a lead", error, {
        payload: insertPayload,
      });
      throw error;
    }

    return lead;
  } catch (error) {
    return wrapLeadError("create a lead", error);
  }
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<Lead> {
  return updateLead(id, { status });
}

export async function updateLeadNotes(id: string, notes: string): Promise<Lead> {
  return updateLead(id, { notes });
}

export async function updateLead(
  id: string,
  data: Partial<Pick<Lead, "name" | "email" | "phone" | "companyName" | "inquiryType" | "subject" | "notes" | "status">>,
): Promise<Lead> {
  try {
    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("leads")
      .update(mapLeadUpdate(data))
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapLeadRow(row);
  } catch (error) {
    return wrapLeadError("update a lead", error);
  }
}

export async function deleteLead(id: string): Promise<Lead> {
  try {
    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("leads")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapLeadRow(row);
  } catch (error) {
    return wrapLeadError("soft-delete a lead", error);
  }
}

export async function restoreLead(id: string): Promise<Lead> {
  try {
    const supabase = getSupabaseClient();
    const { data: row, error } = await supabase
      .from("leads")
      .update({ deleted_at: null })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw error;
    }

    return mapLeadRow(row);
  } catch (error) {
    return wrapLeadError("restore a lead", error);
  }
}

export async function permanentlyDeleteLead(id: string): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const { error } = await supabase.from("leads").delete().eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    return wrapLeadError("permanently delete a lead", error);
  }
}

export async function getLeadCounts() {
  const leads = await fetchLeads();

  return {
    total: leads.length,
    pending: leads.filter((lead) => lead.status === "pending").length,
    handled: leads.filter((lead) => lead.status === "handled").length,
    rejected: leads.filter((lead) => lead.status === "rejected").length,
  };
}
