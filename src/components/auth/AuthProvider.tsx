import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";

import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase";

interface AdminAuthContextValue {
  isConfigured: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  session: Session | null;
  user: User | null;
  signInAdmin: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshAdminAccess: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

async function checkAdminAccess(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const isConfigured = isSupabaseConfigured();
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const resolveAccess = async (nextSession: Session | null) => {
    setSession(nextSession);

    if (!nextSession?.user) {
      setIsAdmin(false);
      return false;
    }

    const allowed = await checkAdminAccess(nextSession.user.id);
    setIsAdmin(allowed);
    return allowed;
  };

  useEffect(() => {
    if (!isConfigured) {
      setIsLoading(false);
      setSession(null);
      setIsAdmin(false);
      return;
    }

    const supabase = getSupabaseClient();

    const loadSession = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        await resolveAccess(currentSession);
      } finally {
        setIsLoading(false);
      }
    };

    void loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void (async () => {
        try {
          await resolveAccess(nextSession);
        } finally {
          setIsLoading(false);
        }
      })();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isConfigured]);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isConfigured,
      isLoading,
      isAdmin,
      session,
      user: session?.user ?? null,
      async signInAdmin(email: string, password: string) {
        if (!isConfigured) {
          throw new Error("SUPABASE_NOT_CONFIGURED");
        }

        const supabase = getSupabaseClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
          throw error;
        }

        const allowed = await resolveAccess(data.session);

        if (!allowed) {
          await supabase.auth.signOut();
          throw new Error("USER_NOT_AUTHORIZED");
        }
      },
      async signOut() {
        if (!isConfigured) {
          setSession(null);
          setIsAdmin(false);
          return;
        }

        const supabase = getSupabaseClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        setSession(null);
        setIsAdmin(false);
      },
      async refreshAdminAccess() {
        if (!isConfigured) {
          setIsAdmin(false);
          return false;
        }

        if (!session?.user) {
          setIsAdmin(false);
          return false;
        }

        const allowed = await checkAdminAccess(session.user.id);
        setIsAdmin(allowed);
        return allowed;
      },
    }),
    [isAdmin, isConfigured, isLoading, session],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);

  if (!context) {
    throw new Error("useAdminAuth must be used within AuthProvider.");
  }

  return context;
}
