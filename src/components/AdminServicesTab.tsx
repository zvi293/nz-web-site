import { useState, useEffect, useRef } from "react";
import { Plus, Pencil, Trash2, X, Upload, GripVertical, ChevronDown, ChevronUp, Image, Code2, FileCode, Archive, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchDeletedServices,
  restoreService,
  permanentlyDeleteService,
  type ServiceRow,
  type DeletedServiceRow,
} from "@/lib/services-api";
import { toast } from "sonner";

const lucideIconNames = [
  "Target", "Palette", "Code2", "Search", "Zap", "Shield", "Rocket", 
  "Globe", "Smartphone", "Monitor", "Layout", "PenTool", "Megaphone",
  "BarChart", "TrendingUp", "Users", "Heart", "Star", "Award", "Lightbulb",
  "Settings", "Database", "Cloud", "Lock", "Eye", "Mail", "MessageCircle"
];

const defaultColors = {
  bgGradient: "linear-gradient(135deg, hsl(45 80% 60% / 0.08), hsl(40 85% 60% / 0.12), hsl(45 70% 94%))",
  textColor: "hsl(40 50% 18%)",
  mutedTextColor: "hsl(40 30% 38%)",
  badgeBg: "hsl(45 80% 55% / 0.15)",
  badgeText: "hsl(45 80% 35%)",
  iconBg: "hsl(45 80% 50%)",
  iconShadow: "0 8px 30px -4px hsl(45 80% 50% / 0.4)",
  tagBg: "hsl(45 60% 92%)",
  tagText: "hsl(40 50% 30%)"
};

const colorPresets = [
  { name: "זהב / חום", hue: 45, sat: 80 },
  { name: "סגול", hue: 270, sat: 60 },
  { name: "ירוק / טורקיז", hue: 170, sat: 60 },
  { name: "כחול", hue: 210, sat: 80 },
  { name: "ורוד", hue: 330, sat: 60 },
  { name: "כתום", hue: 25, sat: 80 },
  { name: "אדום", hue: 0, sat: 70 },
];

function generateColorsFromHue(hue: number, sat: number) {
  return {
    bgGradient: `linear-gradient(135deg, hsl(${hue} ${sat}% 60% / 0.08), hsl(${hue - 5} ${sat + 5}% 60% / 0.12), hsl(${hue} ${sat - 10}% 94%))`,
    textColor: `hsl(${hue - 5} 50% 18%)`,
    mutedTextColor: `hsl(${hue - 5} 30% 38%)`,
    badgeBg: `hsl(${hue} ${sat}% 55% / 0.15)`,
    badgeText: `hsl(${hue} ${sat}% 35%)`,
    iconBg: `hsl(${hue} ${sat}% 50%)`,
    iconShadow: `0 8px 30px -4px hsl(${hue} ${sat}% 50% / 0.4)`,
    tagBg: `hsl(${hue} ${sat - 20}% 92%)`,
    tagText: `hsl(${hue - 5} 50% 30%)`
  };
}

const emptyForm: Omit<ServiceRow, "id"> = {
  badge: "",
  title: "",
  body: "",
  image: "",
  video: "",
  iconType: "lucide",
  iconLucideName: "Target",
  iconSvg: "",
  iconImage: "",
  reverse: false,
  tags: [],
  order: 0,
  published: true,
  ...defaultColors,
};

const AdminServicesTab = () => {
  const [services, setServices] = useState<ServiceRow[]>([]);
  const [deletedServices, setDeletedServices] = useState<DeletedServiceRow[]>([]);
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<ServiceRow, "id">>(emptyForm);
  const [tagsInput, setTagsInput] = useState("");
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const iconImageInputRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    const [activeServices, recycledServices] = await Promise.all([
      fetchServices({ includeHidden: true }),
      fetchDeletedServices(),
    ]);
    setServices(activeServices);
    setDeletedServices(recycledServices);
  };

  useEffect(() => {
    void load();
  }, []);

  const runServiceTask = async <T,>(task: () => Promise<T>, errorMessage: string): Promise<T | null> => {
    try {
      return await task();
    } catch (error) {
      console.error(error);
      toast.error(errorMessage);
      return null;
    }
  };

  const openNew = () => {
    setEditingId(null);
    setForm({ ...emptyForm, order: services.length + 1, published: true });
    setTagsInput("");
    setDialogOpen(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditingId(s.id);
    setForm({ ...s });
    setTagsInput(s.tags.join(", "));
    setDialogOpen(true);
  };

  const validateServiceForm = () => {
    if (!form.badge.trim()) return "יש להזין תגית לשירות.";
    if (!form.title.trim()) return "יש להזין כותרת לשירות.";
    if (!form.body.trim() || form.body.trim().length < 10) return "יש להזין תיאור משמעותי של השירות.";
    if (form.iconType === "image" && !form.iconImage?.trim()) return "יש להזין תמונת אייקון או להעלות קובץ.";
    if (form.iconType === "svg" && !form.iconSvg?.trim()) return "יש להזין קוד SVG תקין.";

    for (const [value, label] of [
      [form.image, "קישור תמונת השירות"],
      [form.video, "קישור הווידאו"],
      [form.iconImage, "קישור תמונת האייקון"],
    ] as const) {
      if (value && !value.startsWith("data:")) {
        try {
          new URL(value);
        } catch {
          return `${label} אינו תקין.`;
        }
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateServiceForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        tags: tagsInput.split(",").map(t => t.trim()).filter(Boolean),
      };

      const saved = await runServiceTask(async () => {
        if (editingId) {
          await updateService(editingId, payload);
        } else {
          await createService(payload);
        }

        await load();
        return true;
      }, "לא ניתן היה לשמור את השירות כרגע.");

      if (saved) {
        setDialogOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("להעביר את השירות לסל המחזור?")) return;
    const service = services.find((s) => s.id === id);
    const deleted = await runServiceTask(async () => {
      await deleteService(id);
      await load();
      return true;
    }, "לא ניתן היה להעביר את השירות לסל המחזור.");

    if (deleted) {
      toast.success(`"${service?.title}" הועבר לסל המחזור`);
    }
  };

  const handleRestore = async (id: string) => {
    const restored = await runServiceTask(async () => {
      await restoreService(id);
      await load();
      return true;
    }, "לא ניתן היה לשחזר את השירות כרגע.");

    if (restored) {
      toast.success("השירות שוחזר בהצלחה");
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (!window.confirm("למחוק את השירות לצמיתות?")) return;
    const deleted = await runServiceTask(async () => {
      await permanentlyDeleteService(id);
      await load();
      return true;
    }, "לא ניתן היה למחוק את השירות לצמיתות כרגע.");

    if (deleted) {
      toast.success("השירות נמחק לצמיתות");
    }
  };

  const moveService = async (index: number, direction: "up" | "down") => {
    const newServices = [...services];
    const swapIdx = direction === "up" ? index - 1 : index + 1;
    if (swapIdx < 0 || swapIdx >= newServices.length) return;
    
    const tempOrder = newServices[index].order;
    newServices[index].order = newServices[swapIdx].order;
    newServices[swapIdx].order = tempOrder;
    
    await runServiceTask(async () => {
      await updateService(newServices[index].id, { order: newServices[index].order });
      await updateService(newServices[swapIdx].id, { order: newServices[swapIdx].order });
      await load();
      return true;
    }, "לא ניתן היה לעדכן את סדר השירותים כרגע.");
  };

  const handleFileUpload = (field: "image" | "video" | "iconImage", file: File) => {
    if (field === "video") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({ ...prev, video: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    } else if (field === "iconImage") {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({ ...prev, iconImage: ev.target?.result as string, iconType: "image" }));
      };
      reader.readAsDataURL(file);
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setForm(prev => ({ ...prev, image: ev.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const applyColorPreset = (hue: number, sat: number) => {
    const colors = generateColorsFromHue(hue, sat);
    setForm(prev => ({ ...prev, ...colors }));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ניהול שירותים</CardTitle>
              <CardDescription>ערוך, הוסף והסר כרטיסי שירות מהאתר</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowRecycleBin(true)} className="gap-2">
                <Archive className="h-4 w-4" />
                סל מחזור
                {deletedServices.length > 0 && (
                  <span className="rounded-full bg-destructive/15 text-destructive text-[10px] px-1.5 py-0.5 font-bold">
                    {deletedServices.length}
                  </span>
                )}
              </Button>
              <Button onClick={openNew} className="gap-2">
                <Plus className="h-4 w-4" />
                הוסף שירות
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {services.length === 0 && (
            <p className="text-muted-foreground text-sm text-center py-8">אין שירותים עדיין.</p>
          )}
          {services.map((service, i) => (
            <div
              key={service.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              {/* Reorder */}
              <div className="flex flex-col gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={i === 0 || loading}
                  onClick={() => void moveService(i, "up")}
                >
                  <ChevronUp className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  disabled={i === services.length - 1 || loading}
                  onClick={() => void moveService(i, "down")}
                >
                  <ChevronDown className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Preview color swatch */}
              <div
                className="h-12 w-12 rounded-xl flex-shrink-0 flex items-center justify-center text-white"
                style={{ backgroundColor: service.iconBg }}
              >
                <span className="text-lg font-bold">{i + 1}</span>
              </div>

              {/* Image preview */}
              {service.image && (
                <img
                  src={service.image}
                  alt={service.badge}
                  className="h-12 w-16 rounded-lg object-cover flex-shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground text-sm truncate">{service.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                    style={{ backgroundColor: service.badgeBg, color: service.badgeText }}
                  >
                    {service.badge}
                  </span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${service.published ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                    {service.published ? "מפורסם" : "מוסתר"}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {service.reverse ? "הפוך" : "רגיל"} · {service.tags.length} תגיות
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className="text-[10px] text-muted-foreground">{service.published ? "גלוי" : "מוסתר"}</span>
                  <Switch
                    checked={service.published}
                    disabled={loading}
                    onCheckedChange={async (checked) => {
                      const updated = await runServiceTask(async () => {
                        await updateService(service.id, { published: checked });
                        await load();
                        return true;
                      }, "לא ניתן היה לעדכן את מצב הפרסום כרגע.");

                      if (updated) {
                        toast.success(checked ? "השירות פורסם" : "השירות הוסתר");
                      }
                    }}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => openEdit(service)} disabled={loading}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => void handleDelete(service.id)}
                  disabled={loading}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recycle Bin Dialog */}
      <Dialog open={showRecycleBin} onOpenChange={setShowRecycleBin}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              סל מחזור – שירותים
            </DialogTitle>
            <DialogDescription>פריטים שנמחקו נשמרים כאן 30 יום לפני מחיקה סופית</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {deletedServices.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">סל המחזור ריק</p>
            ) : (
              deletedServices.map(ds => {
                const daysLeft = Math.ceil((ds.deletedAt + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));
                return (
                  <div key={ds.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div
                      className="h-10 w-10 rounded-lg flex-shrink-0 flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: ds.iconBg }}
                    >
                      ✕
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{ds.title}</p>
                      <p className="text-[10px] text-muted-foreground">{ds.badge} · יימחק בעוד {daysLeft} ימים</p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => handleRestore(ds.id)} className="gap-1 h-7 text-xs">
                        <RotateCcw className="h-3 w-3" />
                        שחזר
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handlePermanentDelete(ds.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Add Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>{editingId ? "עריכת שירות" : "הוספת שירות חדש"}</DialogTitle>
            <DialogDescription>מלא את כל הפרטים של כרטיס השירות</DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 h-10">
              <TabsTrigger value="content" className="text-xs">תוכן</TabsTrigger>
              <TabsTrigger value="media" className="text-xs">מדיה ואייקון</TabsTrigger>
              <TabsTrigger value="style" className="text-xs">צבעים ועיצוב</TabsTrigger>
            </TabsList>

            {/* Content Tab */}
            <TabsContent value="content" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>תגית (Badge)</Label>
                  <Input
                    value={form.badge}
                    onChange={(e) => setForm(prev => ({ ...prev, badge: e.target.value }))}
                    placeholder="לדוגמה: אפיון חכם"
                  />
                </div>
                <div className="space-y-2">
                  <Label>כותרת</Label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="לדוגמה: מתכננים להצלחה"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>תיאור</Label>
                <Textarea
                  value={form.body}
                  onChange={(e) => setForm(prev => ({ ...prev, body: e.target.value }))}
                  rows={4}
                  placeholder="תיאור מפורט של השירות..."
                />
              </div>

              <div className="space-y-2">
                <Label>תגיות (מופרדות בפסיק)</Label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="אסטרטגיה, מחקר שוק, מסע משתמש"
                />
              </div>

              <div className="flex items-center gap-3">
                <Switch
                  checked={form.reverse}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, reverse: v }))}
                />
                <Label>לייאוט הפוך (תמונה בצד שמאל)</Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) => setForm(prev => ({ ...prev, published: v }))}
                />
                <Label>הצג את השירות באתר</Label>
              </div>
            </TabsContent>

            {/* Media Tab */}
            <TabsContent value="media" className="space-y-6">
              {/* Main Image */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">תמונה ראשית</Label>
                <div className="flex gap-3">
                  <label className="flex-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5">
                    <Upload className="h-5 w-5" />
                    <span>העלאת תמונה מהמחשב</span>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload("image", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <Input
                  value={form.image?.startsWith("data:") ? "" : form.image}
                  onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="או הדבק קישור לתמונה..."
                />
                {form.image && (
                  <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border">
                    <img src={form.image} alt="תצוגה מקדימה" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: "" }))}
                      className="absolute top-2 left-2 rounded-full bg-foreground/70 p-1 text-background hover:bg-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Video */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">סרטון (אופציונלי)</Label>
                <div className="flex gap-3">
                  <label className="flex-1 flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5">
                    <Upload className="h-5 w-5" />
                    <span>העלאת סרטון מהמחשב</span>
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload("video", file);
                        e.target.value = "";
                      }}
                    />
                  </label>
                </div>
                <Input
                  value={form.video?.startsWith("data:") ? "" : (form.video || "")}
                  onChange={(e) => setForm(prev => ({ ...prev, video: e.target.value }))}
                  placeholder="או הדבק קישור לסרטון..."
                />
                {form.video && (
                  <div className="relative flex items-center gap-2 rounded-lg border border-border p-2">
                    <span className="text-xs text-muted-foreground truncate flex-1">
                      {form.video.startsWith("data:") ? "סרטון הועלה ✓" : form.video}
                    </span>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, video: "" }))}
                      className="rounded-full bg-foreground/70 p-1 text-background hover:bg-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Icon */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">אייקון</Label>
                <div className="flex gap-2">
                  <Button
                    variant={form.iconType === "lucide" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, iconType: "lucide" }))}
                    className="gap-1.5"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    אייקון מוכן
                  </Button>
                  <Button
                    variant={form.iconType === "image" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, iconType: "image" }))}
                    className="gap-1.5"
                  >
                    <Image className="h-3.5 w-3.5" />
                    תמונה
                  </Button>
                  <Button
                    variant={form.iconType === "svg" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, iconType: "svg" }))}
                    className="gap-1.5"
                  >
                    <FileCode className="h-3.5 w-3.5" />
                    קוד SVG
                  </Button>
                </div>

                {form.iconType === "lucide" && (
                  <Select
                    value={form.iconLucideName || "Target"}
                    onValueChange={(v) => setForm(prev => ({ ...prev, iconLucideName: v }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {lucideIconNames.map(name => (
                        <SelectItem key={name} value={name}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}

                {form.iconType === "image" && (
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:bg-primary/5">
                      <Upload className="h-5 w-5" />
                      <span>העלאת תמונת אייקון</span>
                      <input
                        ref={iconImageInputRef}
                        type="file"
                        accept="image/*,.svg"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload("iconImage", file);
                          e.target.value = "";
                        }}
                      />
                    </label>
                    <Input
                      value={form.iconImage?.startsWith("data:") ? "" : (form.iconImage || "")}
                      onChange={(e) => setForm(prev => ({ ...prev, iconImage: e.target.value }))}
                      placeholder="או הדבק קישור לתמונת אייקון..."
                    />
                    {form.iconImage && (
                      <div className="flex items-center gap-2">
                        <img src={form.iconImage} alt="icon preview" className="h-10 w-10 object-contain rounded-lg border border-border p-1" />
                        <button
                          type="button"
                          onClick={() => setForm(prev => ({ ...prev, iconImage: "" }))}
                          className="text-destructive text-xs hover:underline"
                        >
                          הסר
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {form.iconType === "svg" && (
                  <div className="space-y-2">
                    <Textarea
                      value={form.iconSvg || ""}
                      onChange={(e) => setForm(prev => ({ ...prev, iconSvg: e.target.value }))}
                      placeholder='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">...</svg>'
                      rows={4}
                      className="font-mono text-xs"
                    />
                    {form.iconSvg && (
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg border border-border p-1 flex items-center justify-center" dangerouslySetInnerHTML={{ __html: form.iconSvg }} />
                        <span className="text-xs text-muted-foreground">תצוגה מקדימה</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Style Tab */}
            <TabsContent value="style" className="space-y-4">
              {/* Quick Presets */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">ערכות צבע מוכנות</Label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map(preset => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => applyColorPreset(preset.hue, preset.sat)}
                      className="flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
                    >
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: `hsl(${preset.hue} ${preset.sat}% 50%)` }}
                      />
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Manual Color Inputs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs">רקע (Gradient)</Label>
                  <Input
                    value={form.bgGradient}
                    onChange={(e) => setForm(prev => ({ ...prev, bgGradient: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">צבע טקסט ראשי</Label>
                  <Input
                    value={form.textColor}
                    onChange={(e) => setForm(prev => ({ ...prev, textColor: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">צבע טקסט משני</Label>
                  <Input
                    value={form.mutedTextColor}
                    onChange={(e) => setForm(prev => ({ ...prev, mutedTextColor: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">רקע אייקון</Label>
                  <Input
                    value={form.iconBg}
                    onChange={(e) => setForm(prev => ({ ...prev, iconBg: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">רקע Badge</Label>
                  <Input
                    value={form.badgeBg}
                    onChange={(e) => setForm(prev => ({ ...prev, badgeBg: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">צבע Badge</Label>
                  <Input
                    value={form.badgeText}
                    onChange={(e) => setForm(prev => ({ ...prev, badgeText: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">רקע תגיות</Label>
                  <Input
                    value={form.tagBg}
                    onChange={(e) => setForm(prev => ({ ...prev, tagBg: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">צבע תגיות</Label>
                  <Input
                    value={form.tagText}
                    onChange={(e) => setForm(prev => ({ ...prev, tagText: e.target.value }))}
                    className="font-mono text-[10px]"
                  />
                </div>
              </div>

              {/* Live Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">תצוגה מקדימה</Label>
                <div
                  className="rounded-2xl p-6 relative overflow-hidden"
                  style={{ background: form.bgGradient }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: form.iconBg, boxShadow: form.iconShadow }}
                    >
                      ★
                    </div>
                    <span
                      className="rounded-full px-3 py-1 text-xs font-bold"
                      style={{ backgroundColor: form.badgeBg, color: form.badgeText }}
                    >
                      {form.badge || "תגית"}
                    </span>
                  </div>
                  <h4 className="text-lg font-black mb-1" style={{ color: form.textColor }}>
                    {form.title || "כותרת השירות"}
                  </h4>
                  <p className="text-sm" style={{ color: form.mutedTextColor }}>
                    טקסט לדוגמה לתצוגה מקדימה של הצבעים...
                  </p>
                  <div className="flex gap-1.5 mt-3">
                    {(tagsInput ? tagsInput.split(",").slice(0, 3) : ["תגית 1", "תגית 2"]).map((tag, i) => (
                      <span
                        key={i}
                        className="rounded-full px-3 py-1 text-[10px] font-medium"
                        style={{ backgroundColor: form.tagBg, color: form.tagText }}
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleSubmit} disabled={loading || !form.title || !form.badge} className="flex-1">
              {loading ? "שומר..." : editingId ? "עדכן שירות" : "הוסף שירות"}
            </Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>ביטול</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServicesTab;
