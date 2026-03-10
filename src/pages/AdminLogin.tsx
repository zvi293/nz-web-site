import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useSearchParams } from "react-router-dom";
import { LockKeyhole, LogIn, Mail, ShieldAlert } from "lucide-react";

import { useAdminAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function AdminLogin() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { isConfigured, isLoading, isAdmin, signInAdmin } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const reason = searchParams.get("reason");
  const nextPath = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? "/admin/portfolio";

  useEffect(() => {
    if (reason === "unauthorized") {
      toast({
        title: "אין הרשאת מנהל",
        description: "המשתמש התחבר, אבל לא נמצא ברשימת המורשים לניהול.",
        variant: "destructive",
      });
    }
    if (reason === "misconfigured") {
      toast({
        title: "חיבור Supabase חסר",
        description: "יש להגדיר VITE_SUPABASE_URL ו-VITE_SUPABASE_ANON_KEY לפני כניסה לניהול.",
        variant: "destructive",
      });
    }
  }, [reason, toast]);

  if (!isLoading && isAdmin) {
    return <Navigate to={nextPath} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await signInAdmin(email, password);
      toast({
        title: "התחברת בהצלחה",
        description: "מעביר אותך לממשק הניהול.",
      });
    } catch (error) {
      const message =
        error instanceof Error && error.message === "SUPABASE_NOT_CONFIGURED"
          ? "חסרים משתני סביבה של Supabase."
          : error instanceof Error && error.message === "USER_NOT_AUTHORIZED"
            ? "המשתמש הזה לא נמצא ברשימת מנהלי האתר."
            : "בדוק את כתובת האימייל והסיסמה ונסה שוב.";

      toast({
        title: "ההתחברות נכשלה",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main dir="rtl" className="min-h-screen bg-secondary/20 px-4 py-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl space-y-4 text-right">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-2 text-sm text-muted-foreground shadow-sm">
            <LockKeyhole className="h-4 w-4 text-primary" />
            כניסת מנהל מאובטחת עם Supabase Auth
          </div>
          <h1 className="text-4xl font-bold text-foreground">כניסה לממשק הניהול</h1>
          <p className="text-lg text-muted-foreground">
            הגישה לנתוני הלידים ולממשק הניהול זמינה רק למשתמשים שהוגדרו כמנהלים ב-Supabase.
          </p>
          {!isConfigured && (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
              חיבור Supabase לא מוגדר כרגע. יש להוסיף את משתני הסביבה לפני התחברות לממשק הניהול.
            </div>
          )}
          <div className="rounded-2xl border border-border/60 bg-background/80 p-4 shadow-sm">
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <ShieldAlert className="mt-0.5 h-4 w-4 text-primary" />
              אם עדיין לא הוגדרת כמנהל, יש ליצור משתמש ב-Supabase Auth ולהוסיף אותו לטבלת <code>admin_users</code>.
            </p>
          </div>
          <Link to="/" className="inline-flex text-sm font-medium text-primary hover:underline">
            חזרה לאתר
          </Link>
        </div>

        <Card className="w-full max-w-md border-border/60 bg-card/95 shadow-xl">
          <CardHeader className="text-right">
            <CardTitle className="flex items-center justify-end gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              התחברות
            </CardTitle>
            <CardDescription>הזן אימייל וסיסמה של חשבון מנהל מורשה.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email">אימייל</Label>
                <div className="relative">
                  <Input
                    id="admin-email"
                    type="email"
                    dir="ltr"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    required
                    className="pr-10"
                  />
                  <Mail className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">סיסמה</Label>
                <div className="relative">
                  <Input
                    id="admin-password"
                    type="password"
                    dir="ltr"
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    required
                    className="pr-10"
                  />
                  <LockKeyhole className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2" disabled={submitting || !isConfigured}>
                <LogIn className="h-4 w-4" />
                {submitting ? "מתחבר..." : "כניסה למנהל"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
