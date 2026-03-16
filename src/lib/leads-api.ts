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
    const insertPayload = mapLeadInsert(data);
    const { data: row, error } = await supabase
      .from("leads")
      .insert(insertPayload)
      .select("*")
      .single();

    if (error) {
      logLeadRepositoryError("create a lead", error, {
        payload: insertPayload,
      });
      throw error;
    }

    return mapLeadRow(row);
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
