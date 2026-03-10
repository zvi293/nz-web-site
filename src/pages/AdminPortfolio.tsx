import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ArrowRight, X, Upload, Eye, Image, FolderOpen, Mail, Settings, LayoutGrid, Search, Filter, Clock, CheckCircle2, AlertCircle, XCircle, MessageCircle, Phone, Building2, FileText, ChevronDown, ChevronUp, SortAsc, SortDesc, User, CalendarIcon, RotateCcw, Archive, HelpCircle, LogOut } from "lucide-react";
import { format, isToday, isThisWeek, isThisMonth, isAfter, isBefore, startOfDay, endOfDay } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { useAdminAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  type Project,
} from "@/lib/projects-api";
import {
  fetchLogos,
  addLogo,
  updateLogo,
  deleteLogo,
  deleteAllLogos,
  seedDemoLogos,
  type ClientLogo,
} from "@/lib/logos-api";
import {
  fetchLeads,
  fetchDeletedLeads,
  updateLeadStatus,
  updateLeadNotes,
  updateLead,
  deleteLead,
  restoreLead,
  permanentlyDeleteLead,
  type Lead,
  type LeadStatus,
} from "@/lib/leads-api";
import { Badge } from "@/components/ui/badge";
import AdminServicesTab from "@/components/AdminServicesTab";
import AdminAboutTab from "@/components/AdminAboutTab";
import AdminSiteSettingsTab from "@/components/AdminSiteSettingsTab";
import AdminFaqTab from "@/components/AdminFaqTab";
import { isRenderableAssetUrl } from "@/lib/runtime-safety";
const emptyForm = {
  title: "",
  description: "",
  tags: "",
  image: "",
  link: "",
  featured: true,
  published: true,
  order: 0,
};

const AdminPortfolio = () => {
  const { signOut, user } = useAdminAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Logos state
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [logoName, setLogoName] = useState("");
  const [logoImage, setLogoImage] = useState("");
  const [logoLoading, setLogoLoading] = useState(false);

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadFilter, setLeadFilter] = useState<LeadStatus | "all">("all");
  const [leadSearch, setLeadSearch] = useState("");
  const [leadSort, setLeadSort] = useState<"newest" | "oldest">("newest");
  const [leadTimePeriod, setLeadTimePeriod] = useState<"all" | "today" | "week" | "month">("all");
  const [leadDateFrom, setLeadDateFrom] = useState<Date | undefined>(undefined);
  const [leadDateTo, setLeadDateTo] = useState<Date | undefined>(undefined);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState("");
  const [expandedLeadId, setExpandedLeadId] = useState<string | null>(null);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [deletedLeads, setDeletedLeads] = useState<Lead[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", companyName: "", subject: "", notes: "" });

  const refreshLeads = async () => {
    const [activeLeads, recycledLeads] = await Promise.all([fetchLeads(), fetchDeletedLeads()]);
    setLeads(activeLeads);
    setDeletedLeads(recycledLeads);
    return activeLeads;
  };

  const runLeadTask = async <T,>(task: () => Promise<T>, title: string): Promise<T | null> => {
    try {
      return await task();
    } catch (error) {
      console.error(error);
      toast({
        title,
        description: "אין אפשרות להשלים את פעולת הפניות כרגע.",
        variant: "destructive",
      });
      return null;
    }
  };

  const runLogoTask = async <T,>(task: () => Promise<T>, title: string): Promise<T | null> => {
    try {
      return await task();
    } catch (error) {
      console.error(error);
      toast({
        title,
        description: "לא ניתן היה להשלים את פעולת הלוגואים כרגע.",
        variant: "destructive",
      });
      return null;
    }
  };

  const load = async () => {
    const [projectData, logoData] = await Promise.all([
      runProjectTask(() => fetchProjects({ includeUnpublished: true }), "שגיאה בטעינת הפרויקטים"),
      runLogoTask(() => fetchLogos({ includeHidden: true }), "שגיאה בטעינת הלוגואים"),
    ]);

    if (projectData) {
      setProjects(projectData);
    }

    if (logoData) {
      setLogos(logoData);
    }

    await runLeadTask(refreshLeads, "שגיאה בטעינת הפניות");
  };

  const runProjectTask = async <T,>(task: () => Promise<T>, title: string): Promise<T | null> => {
    try {
      return await task();
    } catch (error) {
      console.error(error);
      toast({
        title,
        description: "לא ניתן היה להשלים את פעולת הפרויקטים כרגע.",
        variant: "destructive",
      });
      return null;
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const isAllowedExternalUrl = (value: string) => {
    if (!value || value.startsWith("data:")) {
      return true;
    }

    try {
      const parsed = new URL(value);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const isAllowedImageUrl = (value: string) => {
    if (!value) {
      return false;
    }

    return isRenderableAssetUrl(value);
  };

  const validateProjectForm = () => {
    if (!form.title.trim()) return "יש להזין שם פרויקט.";
    if (!form.description.trim() || form.description.trim().length < 10) return "יש להזין תיאור משמעותי לפרויקט.";
    if (!form.tags.split(",").map((tag) => tag.trim()).filter(Boolean).length) return "יש להזין לפחות תגית אחת.";
    if (!form.image.trim()) return "יש להזין תמונת פרויקט או להעלות קובץ.";
    if (!isAllowedImageUrl(form.image.trim())) return "קישור תמונת הפרויקט אינו תקין.";
    if (form.link.trim() && !isAllowedExternalUrl(form.link.trim())) return "קישור הפרויקט אינו תקין.";
    return null;
  };

  const validateLogoForm = () => {
    if (!logoName.trim()) return "יש להזין שם לקוח.";
    if (!logoImage.trim()) return "יש להזין תמונת לוגו או להעלות קובץ.";
    if (!isAllowedImageUrl(logoImage.trim())) return "קישור הלוגו אינו תקין.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateProjectForm();
    if (validationError) {
      toast({
        title: "לא ניתן לשמור את הפרויקט",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        image: form.image,
        link: form.link,
        featured: form.featured,
        published: form.published,
        order: form.order,
      };

      const saved = await runProjectTask(
        () => (editingId ? updateProject(editingId, payload) : createProject(payload)),
        editingId ? "שגיאה בעדכון הפרויקט" : "שגיאה ביצירת הפרויקט",
      );

      if (!saved) {
        return;
      }

      setForm(emptyForm);
      setEditingId(null);
      await load();
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      tags: project.tags.join(", "),
      image: project.image,
      link: project.link,
      featured: project.featured,
      published: project.published,
      order: project.order,
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("למחוק את הפרויקט לצמיתות?")) return;
    const deleted = await runProjectTask(() => deleteProject(id), "שגיאה במחיקת הפרויקט");
    if (!deleted) {
      return;
    }

    await load();
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleAddLogo = async () => {
    const validationError = validateLogoForm();
    if (validationError) {
      toast({
        title: "לא ניתן לשמור את הלוגו",
        description: validationError,
        variant: "destructive",
      });
      return;
    }

    setLogoLoading(true);
    try {
      const created = await runLogoTask(
        () => addLogo({ name: logoName.trim(), image: logoImage.trim(), visible: true, order: logos.length }),
        "שגיאה בהוספת הלוגו",
      );

      if (!created) {
        return;
      }

      setLogoName("");
      setLogoImage("");
      const updated = await runLogoTask(() => fetchLogos({ includeHidden: true }), "שגיאה ברענון הלוגואים");
      if (updated) {
        setLogos(updated);
      }
    } finally {
      setLogoLoading(false);
    }
  };

  const handleDeleteLogo = async (id: string) => {
    if (!window.confirm("למחוק את הלוגו לצמיתות?")) return;
    setLogoLoading(true);
    try {
      const deleted = await runLogoTask(() => deleteLogo(id), "שגיאה במחיקת לוגו");
      if (deleted === null) {
        return;
      }

      const updated = await runLogoTask(() => fetchLogos({ includeHidden: true }), "שגיאה ברענון הלוגואים");
      if (updated) {
        setLogos(updated);
      }
    } finally {
      setLogoLoading(false);
    }
  };

  const handleDeleteAllLogos = async () => {
    if (!window.confirm("למחוק את כל הלוגואים לצמיתות?")) return;
    setLogoLoading(true);
    try {
      const deleted = await runLogoTask(deleteAllLogos, "שגיאה במחיקת כל הלוגואים");
      if (deleted === null) {
        return;
      }

      setLogos([]);
    } finally {
      setLogoLoading(false);
    }
  };

  const handleSeedDemos = async () => {
    setLogoLoading(true);
    try {
      const all = await runLogoTask(seedDemoLogos, "שגיאה בטעינת לוגואים לדוגמה");
      if (all) {
        setLogos(all);
      }
    } finally {
      setLogoLoading(false);
    }
  };

  const moveProject = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= projects.length) return;

    const current = projects[index];
    const target = projects[swapIndex];

    const updated = await runProjectTask(async () => {
      await updateProject(current.id, { order: target.order });
      await updateProject(target.id, { order: current.order });
      return load();
    }, "שגיאה בעדכון סדר הפרויקטים");

    if (!updated) return;
  };

  const moveLogo = async (index: number, direction: "up" | "down") => {
    const swapIndex = direction === "up" ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= logos.length) return;

    const current = logos[index];
    const target = logos[swapIndex];

    setLogoLoading(true);
    try {
      const moved = await runLogoTask(async () => {
        await updateLogo(current.id, { order: target.order });
        await updateLogo(target.id, { order: current.order });
        return fetchLogos({ includeHidden: true });
      }, "שגיאה בעדכון סדר הלוגואים");

      if (moved) {
        setLogos(moved);
      }
    } finally {
      setLogoLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "התנתקת בהצלחה",
        description: "ממשק הניהול נסגר.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "שגיאה בהתנתקות",
        description: "לא ניתן היה לנתק את הסשן כרגע.",
        variant: "destructive",
      });
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-secondary/30">
      {/* Top bar */}
      <header className="border-b border-border bg-background px-6 py-4 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">לוח בקרה</h1>
          </div>
          <div className="flex items-center gap-2">
            {user?.email && <span className="hidden text-sm text-muted-foreground md:inline">{user.email}</span>}
            <Button variant="outline" size="sm" className="gap-2" onClick={() => void handleLogout()}>
              <LogOut className="h-4 w-4" />
              התנתקות
            </Button>
            <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              חזרה לאתר
              <ArrowRight className="h-4 w-4" />
            </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto max-w-6xl px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <FolderOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{projects.length}</p>
                <p className="text-xs text-muted-foreground">פרויקטים</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Eye className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{projects.filter(p => p.featured).length}</p>
                <p className="text-xs text-muted-foreground">מוצגים</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Image className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{logos.length}</p>
                <p className="text-xs text-muted-foreground">לוגואים</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{leads.filter(l => l.status === "pending").length}</p>
                <p className="text-xs text-muted-foreground">פניות ממתינות</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="projects" className="space-y-6">
          <TabsList className="flex flex-wrap h-auto gap-2 p-2 bg-muted/50 rounded-2xl border border-border/50 shadow-sm">
            <TabsTrigger value="projects" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <FolderOpen className="h-4 w-4" />
              פרויקטים
            </TabsTrigger>
            <TabsTrigger value="services" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <LayoutGrid className="h-4 w-4" />
              שירותים
            </TabsTrigger>
            <TabsTrigger value="about" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <User className="h-4 w-4" />
              מי אנחנו
            </TabsTrigger>
            <TabsTrigger value="logos" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <Image className="h-4 w-4" />
              לוגואים
            </TabsTrigger>
            <TabsTrigger value="contact" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <Mail className="h-4 w-4" />
              פניות
              {leads.filter(l => l.status === "pending").length > 0 && (
                <span className="rounded-full bg-amber-500 text-white text-[10px] px-1.5 py-0.5 font-bold min-w-[18px] text-center">
                  {leads.filter(l => l.status === "pending").length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="faq" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <HelpCircle className="h-4 w-4" />
              שאלות נפוצות
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 px-5 py-2.5 rounded-xl text-sm font-medium data-[state=active]:shadow-md transition-all">
              <Settings className="h-4 w-4" />
              הגדרות אתר
            </TabsTrigger>
          </TabsList>

          {/* Services Tab */}
          <TabsContent value="services">
            <AdminServicesTab />
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about">
            <AdminAboutTab />
          </TabsContent>

          {/* Site Settings Tab */}
          <TabsContent value="settings">
            <AdminSiteSettingsTab />
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <AdminFaqTab />
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add/Edit Project Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    {editingId ? "עריכת פרויקט" : "הוספת פרויקט חדש"}
                  </CardTitle>
                  <CardDescription>
                    {editingId ? "ערוך את פרטי הפרויקט" : "מלא את הפרטים להוספת פרויקט חדש"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">שם הפרויקט</Label>
                      <Input id="title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="לדוגמה: סטודיו לעיצוב גבות" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="tags">תגיות (מופרדות בפסיק)</Label>
                      <Input id="tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} required placeholder="עיצוב, פיתוח, אוטומציה" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">תיאור</Label>
                      <Textarea id="description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} placeholder="תיאור קצר של הפרויקט..." />
                    </div>
                    <div className="space-y-2">
                      <Label>תמונת הפרויקט</Label>
                      <label
                        htmlFor="image-upload"
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5"
                      >
                        <Upload className="h-5 w-5" />
                        <span>לחץ להעלאת תמונה</span>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              setForm({ ...form, image: ev.target?.result as string });
                            };
                            reader.readAsDataURL(file);
                            e.target.value = "";
                          }}
                        />
                      </label>
                      <Input
                        value={form.image.startsWith("data:") ? "" : form.image}
                        onChange={(e) => setForm({ ...form, image: e.target.value })}
                        placeholder="או הדבק קישור לתמונה..."
                      />
                      {form.image && (
                        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                          <img src={form.image} alt="תצוגה מקדימה" className="h-full w-full object-cover" />
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, image: "" })}
                            className="absolute top-2 left-2 rounded-full bg-foreground/70 p-1 text-background hover:bg-foreground"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="link">קישור לאתר</Label>
                      <Input id="link" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
                    </div>
                    <div className="flex flex-wrap gap-6 rounded-lg border border-border bg-secondary/20 px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Switch checked={form.featured} onCheckedChange={(checked) => setForm({ ...form, featured: checked })} />
                        <Label>הצג גם בדף הבית</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={form.published} onCheckedChange={(checked) => setForm({ ...form, published: checked })} />
                        <Label>פרסם באתר</Label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? "שומר..." : editingId ? "עדכן פרויקט" : "הוסף פרויקט"}
                      </Button>
                      {editingId && (
                        <Button type="button" variant="outline" onClick={cancelEdit}>
                          ביטול
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Projects List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>פרויקטים קיימים</span>
                    <span className="text-sm font-normal text-muted-foreground">({projects.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
                  {projects.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">אין פרויקטים עדיין. הוסף את הפרויקט הראשון!</p>
                  )}
                  {projects.map((project, index) => (
                    <div
                      key={project.id}
                      className={`flex items-center gap-3 rounded-xl border p-3 transition-shadow hover:shadow-md ${project.featured ? 'border-primary/30 bg-primary/5' : 'border-border bg-card'} ${!project.published ? "opacity-70 border-dashed" : ""}`}
                    >
                      <div className="flex flex-col gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === 0 || loading} onClick={() => void moveProject(index, "up")}>
                          <ChevronUp className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" disabled={index === projects.length - 1 || loading} onClick={() => void moveProject(index, "down")}>
                          <ChevronDown className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <img
                        src={project.image}
                        alt={project.title}
                        className="h-14 w-20 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-foreground truncate text-sm">{project.title}</h3>
                          {project.featured && (
                            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">מוצג</span>
                          )}
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${project.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                            {project.published ? "מפורסם" : "מוסתר"}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <Select
                          value={project.featured ? "featured" : "projects-only"}
                          onValueChange={async (value) => {
                            await runProjectTask(async () => {
                              await updateProject(project.id, { featured: value === "featured" });
                              await load();
                            }, "שגיאה בעדכון התצוגה בדף הבית");
                          }}
                        >
                          <SelectTrigger className="h-8 w-32 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="featured">דף ראשי</SelectItem>
                            <SelectItem value="projects-only">פרויקטים בלבד</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select
                          value={project.published ? "published" : "hidden"}
                          onValueChange={async (value) => {
                            await runProjectTask(async () => {
                              await updateProject(project.id, { published: value === "published" });
                              await load();
                            }, "שגיאה בעדכון מצב הפרסום");
                          }}
                        >
                          <SelectTrigger className="h-8 w-28 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="published">מפורסם</SelectItem>
                            <SelectItem value="hidden">מוסתר</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleEdit(project)} disabled={loading}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => void handleDelete(project.id)} disabled={loading}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Logos Tab */}
          <TabsContent value="logos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Add Logo Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    הוספת לוגו חדש
                  </CardTitle>
                  <CardDescription>הוסף לוגו של לקוח להצגה באתר</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>שם הלקוח</Label>
                    <Input value={logoName} onChange={(e) => setLogoName(e.target.value)} placeholder="לדוגמה: חברת ABC" />
                  </div>
                  <div className="space-y-2">
                    <Label>תמונת הלוגו</Label>
                    <label
                      htmlFor="logo-upload"
                      className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-4 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5"
                    >
                      <Upload className="h-4 w-4" />
                      <span>העלה לוגו</span>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setLogoImage(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <Input
                      value={logoImage.startsWith("data:") ? "" : logoImage}
                      onChange={(e) => setLogoImage(e.target.value)}
                      placeholder="או הדבק קישור לתמונה..."
                    />
                  </div>
                  {logoImage && (
                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-background flex items-center justify-center mx-auto">
                      <img src={logoImage} alt="תצוגה" className="max-h-full max-w-full object-contain p-2" />
                      <button
                        type="button"
                        onClick={() => setLogoImage("")}
                        className="absolute top-1 left-1 rounded-full bg-foreground/70 p-0.5 text-background hover:bg-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <Button type="button" onClick={() => void handleAddLogo()} disabled={!logoImage || !logoName.trim() || logoLoading} className="w-full">
                    <Plus className="h-4 w-4 ml-1" />
                    {logoLoading ? "שומר..." : "הוסף לוגו"}
                  </Button>
                </CardContent>
              </Card>

              {/* Logos List */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>לוגואים קיימים</span>
                    <span className="text-sm font-normal text-muted-foreground">({logos.length})</span>
                  </CardTitle>
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" onClick={() => void handleSeedDemos()} disabled={logoLoading}>
                      <Plus className="h-3.5 w-3.5 ml-1" />
                      הוסף 10 לדוגמה
                    </Button>
                    {logos.length > 0 && (
                      <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={() => void handleDeleteAllLogos()} disabled={logoLoading}>
                        <Trash2 className="h-3.5 w-3.5 ml-1" />
                        מחק הכל
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {logos.length === 0 && (
                    <p className="text-muted-foreground text-sm text-center py-8">אין לוגואים עדיין. הוסף את הלוגו הראשון!</p>
                  )}
                  <div className="grid grid-cols-3 gap-3 max-h-[400px] overflow-y-auto">
                    {logos.map((logo, index) => (
                      <div key={logo.id} className={`group relative rounded-xl border bg-card p-3 flex flex-col items-center gap-2 ${logo.visible ? "border-border" : "border-dashed opacity-70"}`}>
                        <div className="absolute top-1 right-1 flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => void moveLogo(index, "up")}
                            disabled={index === 0 || logoLoading}
                            className="rounded bg-background/90 p-0.5 text-foreground shadow disabled:opacity-30"
                          >
                            <ChevronUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => void moveLogo(index, "down")}
                            disabled={index === logos.length - 1 || logoLoading}
                            className="rounded bg-background/90 p-0.5 text-foreground shadow disabled:opacity-30"
                          >
                            <ChevronDown className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="h-12 w-full flex items-center justify-center">
                          <img src={logo.image} alt={logo.name} className="max-h-full max-w-full object-contain" />
                        </div>
                        <span className="text-[10px] text-muted-foreground truncate max-w-full">{logo.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-muted-foreground">{logo.visible ? "גלוי" : "מוסתר"}</span>
                          <Switch
                            checked={logo.visible}
                            disabled={logoLoading}
                            onCheckedChange={async (checked) => {
                              setLogoLoading(true);
                              try {
                                const updated = await runLogoTask(async () => {
                                  await updateLogo(logo.id, { visible: checked });
                                  return fetchLogos({ includeHidden: true });
                                }, "שגיאה בעדכון מצב הלוגו");
                                if (updated) {
                                  setLogos(updated);
                                }
                              } finally {
                                setLogoLoading(false);
                              }
                            }}
                          />
                        </div>
                        <button
                          onClick={() => void handleDeleteLogo(logo.id)}
                          disabled={logoLoading}
                          className="absolute top-1 left-1 rounded-full bg-destructive/80 p-1 text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Leads Tab */}
          <TabsContent value="contact" className="space-y-6">
            {/* Lead Stats */}
            {(() => {
              const counts = {
                total: leads.length,
                pending: leads.filter((lead) => lead.status === "pending").length,
                handled: leads.filter((lead) => lead.status === "handled").length,
                rejected: leads.filter((lead) => lead.status === "rejected").length,
              };
              return (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <button onClick={() => setLeadFilter("all")} className={`rounded-xl border p-3 text-center transition-colors ${leadFilter === "all" ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-secondary/50"}`}>
                    <p className="text-xl font-bold text-foreground">{counts.total}</p>
                    <p className="text-xs text-muted-foreground">סה״כ</p>
                  </button>
                  <button onClick={() => setLeadFilter("pending")} className={`rounded-xl border p-3 text-center transition-colors ${leadFilter === "pending" ? "border-amber-500 bg-amber-50" : "border-border bg-card hover:bg-secondary/50"}`}>
                    <p className="text-xl font-bold text-amber-600">{counts.pending}</p>
                    <p className="text-xs text-muted-foreground">ממתינים</p>
                  </button>
                  <button onClick={() => setLeadFilter("handled")} className={`rounded-xl border p-3 text-center transition-colors ${leadFilter === "handled" ? "border-emerald-500 bg-emerald-50" : "border-border bg-card hover:bg-secondary/50"}`}>
                    <p className="text-xl font-bold text-emerald-600">{counts.handled}</p>
                    <p className="text-xs text-muted-foreground">טופלו</p>
                  </button>
                  <button onClick={() => setLeadFilter("rejected")} className={`rounded-xl border p-3 text-center transition-colors ${leadFilter === "rejected" ? "border-red-500 bg-red-50" : "border-border bg-card hover:bg-secondary/50"}`}>
                    <p className="text-xl font-bold text-red-600">{counts.rejected}</p>
                    <p className="text-xs text-muted-foreground">נדחו</p>
                  </button>
                </div>
              );
            })()}

            {/* Search & Sort Bar */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={leadSearch}
                      onChange={(e) => setLeadSearch(e.target.value)}
                      placeholder="חיפוש לפי שם, אימייל, טלפון..."
                      className="pr-10"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={() => setLeadSort(leadSort === "newest" ? "oldest" : "newest")}
                  >
                    {leadSort === "newest" ? <SortDesc className="h-4 w-4" /> : <SortAsc className="h-4 w-4" />}
                    {leadSort === "newest" ? "חדש → ישן" : "ישן → חדש"}
                  </Button>
                  <Button
                    variant={showRecycleBin ? "default" : "outline"}
                    size="sm"
                    className="gap-2"
                    onClick={() => setShowRecycleBin(!showRecycleBin)}
                  >
                    <Archive className="h-4 w-4" />
                    סל מחזור
                    {deletedLeads.length > 0 && (
                      <span className="rounded-full bg-muted text-muted-foreground text-[10px] px-1.5 py-0.5 font-bold">
                        {deletedLeads.length}
                      </span>
                    )}
                  </Button>
                </div>

                {/* Time period & date range filters */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <div className="flex gap-1.5 flex-wrap">
                    {(() => {
                      const baseFiltered = leadFilter !== "all" ? leads.filter(l => l.status === leadFilter) : leads;
                      const searched = leadSearch.trim() ? baseFiltered.filter(l => {
                        const q = leadSearch.trim().toLowerCase();
                        return l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.phone.includes(q) || (l.companyName && l.companyName.toLowerCase().includes(q)) || l.subject.toLowerCase().includes(q);
                      }) : baseFiltered;
                      const countAll = searched.length;
                      const countToday = searched.filter(l => isToday(new Date(l.createdAt))).length;
                      const countWeek = searched.filter(l => isThisWeek(new Date(l.createdAt))).length;
                      const countMonth = searched.filter(l => isThisMonth(new Date(l.createdAt))).length;
                      return ([
                        { value: "all" as const, label: "הכל", count: countAll },
                        { value: "today" as const, label: "היום", count: countToday },
                        { value: "week" as const, label: "השבוע", count: countWeek },
                        { value: "month" as const, label: "החודש", count: countMonth },
                      ]).map(({ value, label, count }) => (
                        <Button
                          key={value}
                          variant={leadTimePeriod === value ? "default" : "outline"}
                          size="sm"
                          className="h-7 text-xs px-3 gap-1.5"
                          onClick={() => {
                            setLeadTimePeriod(value);
                            if (value !== "all") {
                              setLeadDateFrom(undefined);
                              setLeadDateTo(undefined);
                            }
                          }}
                        >
                          {label}
                          <span className={cn("rounded-full text-[10px] px-1.5 py-0.5 font-bold min-w-[18px] text-center", leadTimePeriod === value ? "bg-background/20 text-primary-foreground" : "bg-muted text-muted-foreground")}>{count}</span>
                        </Button>
                      ));
                    })()}
                  </div>

                  <div className="flex gap-2 items-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("h-7 text-xs gap-1.5 px-3", leadDateFrom && "text-primary border-primary")}>
                          <CalendarIcon className="h-3 w-3" />
                          {leadDateFrom ? format(leadDateFrom, "dd/MM/yy") : "מתאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={leadDateFrom}
                          onSelect={(d) => { setLeadDateFrom(d); setLeadTimePeriod("all"); }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <span className="text-xs text-muted-foreground">עד</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className={cn("h-7 text-xs gap-1.5 px-3", leadDateTo && "text-primary border-primary")}>
                          <CalendarIcon className="h-3 w-3" />
                          {leadDateTo ? format(leadDateTo, "dd/MM/yy") : "עד תאריך"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={leadDateTo}
                          onSelect={(d) => { setLeadDateTo(d); setLeadTimePeriod("all"); }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {(leadDateFrom || leadDateTo) && (
                      <Button variant="ghost" size="sm" className="h-7 text-xs px-2" onClick={() => { setLeadDateFrom(undefined); setLeadDateTo(undefined); }}>
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leads List */}
            <div className="space-y-3">
              {(() => {
                let filtered = leads;
                if (leadFilter !== "all") filtered = filtered.filter(l => l.status === leadFilter);
                if (leadSearch.trim()) {
                  const q = leadSearch.trim().toLowerCase();
                  filtered = filtered.filter(l =>
                    l.name.toLowerCase().includes(q) ||
                    l.email.toLowerCase().includes(q) ||
                    l.phone.includes(q) ||
                    (l.companyName && l.companyName.toLowerCase().includes(q)) ||
                    l.subject.toLowerCase().includes(q)
                  );
                }
                // Time period filter
                if (leadTimePeriod === "today") {
                  filtered = filtered.filter(l => isToday(new Date(l.createdAt)));
                } else if (leadTimePeriod === "week") {
                  filtered = filtered.filter(l => isThisWeek(new Date(l.createdAt)));
                } else if (leadTimePeriod === "month") {
                  filtered = filtered.filter(l => isThisMonth(new Date(l.createdAt)));
                }
                // Date range filter
                if (leadDateFrom) {
                  filtered = filtered.filter(l => isAfter(new Date(l.createdAt), startOfDay(leadDateFrom)));
                }
                if (leadDateTo) {
                  filtered = filtered.filter(l => isBefore(new Date(l.createdAt), endOfDay(leadDateTo)));
                }
                if (leadSort === "oldest") filtered = [...filtered].reverse();

                if (filtered.length === 0) {
                  return (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Mail className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                        <p className="text-muted-foreground">
                          {leads.length === 0 ? "אין פניות עדיין. פניות חדשות מטופס צור קשר יופיעו כאן." : "אין תוצאות לחיפוש הנוכחי."}
                        </p>
                      </CardContent>
                    </Card>
                  );
                }

                const statusConfig: Record<LeadStatus, { label: string; color: string; icon: React.ReactNode }> = {
                  pending: { label: "ממתין", color: "bg-amber-100 text-amber-700 border-amber-200", icon: <Clock className="h-3.5 w-3.5" /> },
                  handled: { label: "טופל", color: "bg-emerald-100 text-emerald-700 border-emerald-200", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
                  rejected: { label: "נדחה", color: "bg-red-100 text-red-700 border-red-200", icon: <XCircle className="h-3.5 w-3.5" /> },
                };

                return filtered.map((lead) => {
                  // Migrate old "new" status to "pending"
                  const effectiveStatus: LeadStatus = (lead.status as string) === "new" ? "pending" : lead.status;
                  const sc = statusConfig[effectiveStatus] || statusConfig.pending;
                  const isExpanded = expandedLeadId === lead.id;

                  return (
                    <Card key={lead.id} className={`transition-all hover:shadow-md cursor-pointer ${lead.status === "pending" ? "border-amber-300 border-r-4 border-r-amber-500 bg-amber-50/40 shadow-sm ring-1 ring-amber-100" : ""}`}
                      onClick={() => { setSelectedLead(lead); setIsEditing(false); }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          {/* Main info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              {lead.status === "pending" && (
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                                </span>
                              )}
                              <h3 className={`font-bold text-foreground ${lead.status === "pending" ? "text-amber-900" : ""}`}>{lead.name}</h3>
                              <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium ${sc.color}`}>
                                {sc.icon} {sc.label}
                              </span>
                              {lead.sendMethod === "whatsapp" ? (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><MessageCircle className="h-3 w-3" /> וואטסאפ</span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground"><Mail className="h-3 w-3" /> אימייל</span>
                              )}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-sm text-muted-foreground mb-2">
                              <span className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> {lead.email}</span>
                              <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> {lead.phone}</span>
                              {lead.companyName && <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> {lead.companyName}</span>}
                            </div>
                            <p className="text-sm text-foreground/80 line-clamp-2">{lead.subject}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(lead.createdAt).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                            <Select
                              value={lead.status}
                              onValueChange={async (val) => {
                                await runLeadTask(async () => {
                                  await updateLeadStatus(lead.id, val as LeadStatus);
                                  await refreshLeads();
                                }, "שגיאה בעדכון סטטוס");
                              }}
                            >
                              <SelectTrigger className="h-8 w-28 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">ממתין</SelectItem>
                                <SelectItem value="handled">טופל</SelectItem>
                                <SelectItem value="rejected">נדחה</SelectItem>
                              </SelectContent>
                            </Select>
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  if (isExpanded) {
                                    setExpandedLeadId(null);
                                    setEditingNoteId(null);
                                  } else {
                                    setExpandedLeadId(lead.id);
                                    setEditingNoteId(lead.id);
                                    setNoteText(lead.notes || "");
                                  }
                                }}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                onClick={async () => {
                                  await runLeadTask(async () => {
                                    await deleteLead(lead.id);
                                    await refreshLeads();
                                  }, "שגיאה במחיקת פניה");
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded notes area */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-border">
                            <Label className="text-xs font-medium mb-1 block">הערות:</Label>
                            <Textarea
                              value={noteText}
                              onChange={(e) => setNoteText(e.target.value)}
                              placeholder="הוסף הערה לפניה..."
                              rows={2}
                              className="text-sm"
                            />
                            <div className="flex gap-2 mt-2">
                              <Button
                                size="sm"
                                onClick={async () => {
                                  const updated = await runLeadTask(async () => {
                                    await updateLeadNotes(lead.id, noteText);
                                    return refreshLeads();
                                  }, "שגיאה בשמירת הערה");
                                  if (!updated) return;
                                  setExpandedLeadId(null);
                                  setEditingNoteId(null);
                                }}
                              >
                                שמור הערה
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => { setExpandedLeadId(null); setEditingNoteId(null); }}>
                                ביטול
                              </Button>
                            </div>
                            {lead.notes && (
                              <p className="text-xs text-muted-foreground mt-2 bg-secondary/50 rounded-lg p-2">{lead.notes}</p>
                            )}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                });
              })()}
            </div>

            {/* Recycle Bin */}
            {showRecycleBin && (
              <div className="space-y-3 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <Archive className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-bold text-foreground">סל מחזור</h3>
                  <span className="text-xs text-muted-foreground">(פניות שנמחקו נשמרות עד 30 יום)</span>
                </div>

                {deletedLeads.length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center">
                      <Archive className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
                      <p className="text-muted-foreground text-sm">סל המחזור ריק</p>
                    </CardContent>
                  </Card>
                ) : (
                  deletedLeads.map((lead) => (
                    <Card key={lead.id} className="border-dashed opacity-70 hover:opacity-100 transition-opacity">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <h3 className="font-semibold text-foreground">{lead.name}</h3>
                              <span className="text-xs text-muted-foreground">
                                {lead.email} ֲ· {lead.phone}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-1">{lead.subject}</p>
                            <p className="text-xs text-destructive/70 mt-1">
                              נמחק ב: {new Date(lead.deletedAt!).toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1.5 text-primary"
                              onClick={async () => {
                                await runLeadTask(async () => {
                                  await restoreLead(lead.id);
                                  await refreshLeads();
                                }, "שגיאה בשחזור פניה");
                              }}
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              שחזר
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                              onClick={async () => {
                                await runLeadTask(async () => {
                                  await permanentlyDeleteLead(lead.id);
                                  await refreshLeads();
                                }, "שגיאה במחיקה סופית");
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Lead Detail Dialog */}
      <Dialog open={!!selectedLead} onOpenChange={(open) => { if (!open) { setSelectedLead(null); setIsEditing(false); } }}>
        <DialogContent className="max-w-lg" dir="rtl">
          {selectedLead && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {isEditing ? "עריכת פניה" : "פרטי פניה"}
                </DialogTitle>
              </DialogHeader>

              {!isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">שם מלא</p>
                      <p className="font-medium text-foreground">{selectedLead.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">סטטוס</p>
                      <Select
                        value={selectedLead.status}
                        onValueChange={async (val) => {
                          const updated = await runLeadTask(async () => {
                            await updateLeadStatus(selectedLead.id, val as LeadStatus);
                            return refreshLeads();
                          }, "שגיאה בעדכון סטטוס");
                          if (!updated) return;
                          setSelectedLead(updated.find((lead) => lead.id === selectedLead.id) || null);
                        }}
                      >
                        <SelectTrigger className="h-8 w-full text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">ממתין</SelectItem>
                          <SelectItem value="handled">טופל</SelectItem>
                          <SelectItem value="rejected">נדחה</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Mail className="h-3 w-3" /> אימייל</p>
                      <p className="text-sm text-foreground">{selectedLead.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Phone className="h-3 w-3" /> טלפון</p>
                      <p className="text-sm text-foreground">{selectedLead.phone}</p>
                    </div>
                  </div>

                  {selectedLead.companyName && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><Building2 className="h-3 w-3" /> חברה</p>
                      <p className="text-sm text-foreground">{selectedLead.companyName}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1"><FileText className="h-3 w-3" /> נושא הפניה</p>
                    <p className="text-sm text-foreground bg-secondary/50 rounded-lg p-3">{selectedLead.subject}</p>
                  </div>

                  {selectedLead.notes && (
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">הערות</p>
                      <p className="text-sm text-foreground bg-secondary/50 rounded-lg p-3">{selectedLead.notes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(selectedLead.createdAt).toLocaleDateString("he-IL", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    <span>ֲ·</span>
                    {selectedLead.sendMethod === "whatsapp" ? <><MessageCircle className="h-3 w-3" /> וואטסאפ</> : <><Mail className="h-3 w-3" /> אימייל</>}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 gap-2" onClick={() => {
                      setIsEditing(true);
                      setEditForm({
                        name: selectedLead.name,
                        email: selectedLead.email,
                        phone: selectedLead.phone,
                        companyName: selectedLead.companyName || "",
                        subject: selectedLead.subject,
                        notes: selectedLead.notes || "",
                      });
                    }}>
                      <Pencil className="h-4 w-4" />
                      ערוך פניה
                    </Button>
                    <Button variant="outline" className="gap-2 text-destructive hover:bg-destructive hover:text-destructive-foreground" onClick={async () => {
                      const deleted = await runLeadTask(async () => {
                        await deleteLead(selectedLead.id);
                        await refreshLeads();
                        return true;
                      }, "שגיאה במחיקת פניה");
                      if (!deleted) return;
                      setSelectedLead(null);
                    }}>
                      <Trash2 className="h-4 w-4" />
                      מחק
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">שם מלא</Label>
                      <Input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">אימייל</Label>
                      <Input value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-xs">טלפון</Label>
                      <Input value={editForm.phone} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">חברה</Label>
                      <Input value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">נושא הפניה</Label>
                    <Textarea value={editForm.subject} onChange={(e) => setEditForm({ ...editForm, subject: e.target.value })} rows={3} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">הערות</Label>
                    <Textarea value={editForm.notes} onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })} rows={2} />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1" onClick={async () => {
                      const updated = await runLeadTask(async () => {
                        await updateLead(selectedLead.id, editForm);
                        return refreshLeads();
                      }, "שגיאה בשמירת הפניה");
                      if (!updated) return;
                      setSelectedLead(updated.find((lead) => lead.id === selectedLead.id) || null);
                      setIsEditing(false);
                    }}>
                      שמור שינויים
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      ביטול
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortfolio;


