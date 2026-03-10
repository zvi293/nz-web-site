import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useAdminAuth } from "@/components/auth/AuthProvider";

export default function AdminRouteGuard() {
  const location = useLocation();
  const { isConfigured, isLoading, session, isAdmin } = useAdminAuth();

  if (!isConfigured) {
    return <Navigate to="/admin/login?reason=misconfigured" replace state={{ from: location }} />;
  }

  if (isLoading) {
    return (
      <div dir="rtl" className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <p className="text-lg font-semibold text-foreground">טוען גישת מנהל...</p>
          <p className="mt-2 text-sm text-muted-foreground">בודק את ההרשאות שלך מול Supabase.</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login?reason=unauthorized" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
