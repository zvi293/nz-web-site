import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase-types";
import { reportDevNoticeOnce } from "@/lib/runtime-safety";

let supabaseClient: SupabaseClient<Database> | null = null;

export class SupabaseConfigurationError extends Error {
  constructor() {
    super("Missing Supabase environment variables. Expected VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.");
    this.name = "SupabaseConfigurationError";
  }
}

function getSupabaseEnv() {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (!url || !anonKey) {
    throw new SupabaseConfigurationError();
  }

  return { url, anonKey };
}

export function isSupabaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL?.trim() && import.meta.env.VITE_SUPABASE_ANON_KEY?.trim());
}

export function isSupabaseConfigurationError(error: unknown): error is SupabaseConfigurationError {
  return error instanceof SupabaseConfigurationError;
}

export function reportPublicSupabaseFallback(scope: string, error: unknown) {
  if (isSupabaseConfigurationError(error)) {
    reportDevNoticeOnce(
      "supabase-public-missing-env",
      "Supabase env is missing. Public homepage sections are using built-in fallback data; admin flows remain disabled until VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set.",
    );
    return;
  }

  reportDevNoticeOnce(
    `supabase-public-fallback:${scope}`,
    `Public ${scope} data could not be loaded from Supabase. Using built-in fallback content during development.`,
    error,
  );
}

export function getSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseClient) {
    const { url, anonKey } = getSupabaseEnv();

    supabaseClient = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return supabaseClient;
}
