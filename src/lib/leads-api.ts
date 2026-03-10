export type LeadStatus = "pending" | "handled" | "rejected";

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  subject: string;
  sendMethod: "whatsapp" | "email";
  status: LeadStatus;
  createdAt: string;
  notes?: string;
  deletedAt?: string; // soft-delete timestamp
}

const STORAGE_KEY = "site_leads";
const RETENTION_DAYS = 30;

function getAllLeadsRaw(): Lead[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const leads: Lead[] = JSON.parse(raw);
    // Migrate old "new" status to "pending"
    let migrated = false;
    for (const lead of leads) {
      if ((lead.status as string) === "new") {
        lead.status = "pending";
        migrated = true;
      }
    }
    if (migrated) saveLeads(leads);
    return leads;
  } catch {
    return [];
  }
}

function saveLeads(leads: Lead[]) {
  // Purge leads deleted more than 30 days ago
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  const filtered = leads.filter((l) => {
    if (!l.deletedAt) return true;
    return new Date(l.deletedAt) > cutoff;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

function getActiveLeads(): Lead[] {
  return getAllLeadsRaw().filter((l) => !l.deletedAt);
}

export function fetchLeads(): Lead[] {
  return getActiveLeads().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function fetchDeletedLeads(): Lead[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  return getAllLeadsRaw()
    .filter((l) => l.deletedAt && new Date(l.deletedAt) > cutoff)
    .sort((a, b) => new Date(b.deletedAt!).getTime() - new Date(a.deletedAt!).getTime());
}

export function addLead(data: Omit<Lead, "id" | "status" | "createdAt">): Lead {
  const leads = getAllLeadsRaw();
  const newLead: Lead = {
    ...data,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  leads.push(newLead);
  saveLeads(leads);
  return newLead;
}

export function updateLeadStatus(id: string, status: LeadStatus) {
  const leads = getAllLeadsRaw();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx].status = status;
    saveLeads(leads);
  }
}

export function updateLeadNotes(id: string, notes: string) {
  const leads = getAllLeadsRaw();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx].notes = notes;
    saveLeads(leads);
  }
}

// Update lead fields
export function updateLead(id: string, data: Partial<Pick<Lead, "name" | "email" | "phone" | "companyName" | "subject" | "notes" | "status">>) {
  const leads = getAllLeadsRaw();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    Object.assign(leads[idx], data);
    saveLeads(leads);
  }
}


export function deleteLead(id: string) {
  const leads = getAllLeadsRaw();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    leads[idx].deletedAt = new Date().toISOString();
    saveLeads(leads);
  }
}

// Restore from recycle bin
export function restoreLead(id: string) {
  const leads = getAllLeadsRaw();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx !== -1) {
    delete leads[idx].deletedAt;
    saveLeads(leads);
  }
}

// Permanent delete
export function permanentlyDeleteLead(id: string) {
  const leads = getAllLeadsRaw().filter((l) => l.id !== id);
  saveLeads(leads);
}

export function getLeadCounts() {
  const leads = getActiveLeads();
  return {
    total: leads.length,
    pending: leads.filter((l) => l.status === "pending").length,
    handled: leads.filter((l) => l.status === "handled").length,
    rejected: leads.filter((l) => l.status === "rejected").length,
  };
}
