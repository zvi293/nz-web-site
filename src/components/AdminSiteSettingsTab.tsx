import { useEffect, useRef, useState } from "react";
import {
  Save, RotateCcw, Globe, Phone, Mail, FileText, Shield, Scale, Link as LinkIcon,
  Search, Settings2, Plus, Trash2, MessageCircle, Facebook, Instagram, Linkedin,
  Twitter, Github, Youtube, Palette, Eye, Copy, Check, Download, Upload, Code,
  Monitor, Smartphone, ArrowUp, ArrowDown, ExternalLink, RefreshCw, Clock,
  AlertTriangle, Zap, Type, Image, Hash, BarChart3, MousePointer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  saveSiteSettings,
  getDefaultSettings,
  useSiteSettings,
  type SiteSettings,
  type LegalPageSection,
} from "@/lib/site-settings-api";
import {
  getCanonicalUrl,
  getResolvedOgImageUrl,
  getResolvedSiteUrl,
  isAllowedOgImageUrl,
} from "@/lib/site-url";

const AdminSiteSettingsTab = () => {
  const { settings: storedSettings, isLoading, error } = useSiteSettings();
  const [settings, setSettings] = useState<SiteSettings>(storedSettings);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [seoPreviewDevice, setSeoPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [seoAssets, setSeoAssets] = useState({ robots: false, sitemap: false });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!hasChanges) {
      setSettings(storedSettings);
    }
  }, [hasChanges, storedSettings]);

  useEffect(() => {
    if (error) {
      toast.error("לא ניתן היה לטעון את הגדרות האתר מ-Supabase.");
    }
  }, [error]);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      fetch("/robots.txt", { method: "HEAD" }).then((response) => response.ok).catch(() => false),
      fetch("/sitemap.xml", { method: "HEAD" }).then((response) => response.ok).catch(() => false),
    ]).then(([robots, sitemap]) => {
      if (!isActive) {
        return;
      }

      setSeoAssets({ robots, sitemap });
    });

    return () => {
      isActive = false;
    };
  }, []);

  const updateSettings = (updater: (prev: SiteSettings) => SiteSettings) => {
    setSettings(prev => {
      const next = updater(prev);
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = () => {
    setSaving(true);
    void saveSiteSettings(settings).then(() => {
      setHasChanges(false);
      setLastSaved(new Date().toLocaleTimeString("he-IL"));
      toast.success("ההגדרות נשמרו בהצלחה!");
    }).catch((saveError) => {
      console.error(saveError);
      toast.error("לא ניתן היה לשמור את הגדרות האתר.");
    }).finally(() => {
      setSaving(false);
    });
  };

  const handleReset = () => {
    if (!window.confirm("האם אתה בטוח שברצונך לאפס את כל ההגדרות לברירת המחדל?")) return;
    setSettings(getDefaultSettings());
    setHasChanges(true);
    toast.info("ההגדרות אופסו לברירת המחדל — לחץ שמור כדי להחיל");
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
    toast.success("הועתק ללוח!");
  };

  const resolvedSiteUrl = getResolvedSiteUrl(settings.siteUrl);
  const resolvedCanonicalUrl = getCanonicalUrl("/", settings.siteUrl);
  const resolvedOgImageUrl = getResolvedOgImageUrl(settings.siteUrl, settings.seo.ogImage);
  const ogImageInputValid = !settings.seo.ogImage.trim() || isAllowedOgImageUrl(settings.seo.ogImage);

  // Export settings as JSON
  const handleExport = () => {
    const data = JSON.stringify(settings, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nz-web-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("הקובץ יורד!");
  };

  // Import settings from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string);
        setSettings({ ...getDefaultSettings(), ...imported });
        setHasChanges(true);
        toast.success("ההגדרות יובאו בהצלחה — לחץ שמור כדי להחיל");
      } catch {
        toast.error("הקובץ לא תקין");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // Legal section helpers
  const addLegalSection = (page: "accessibility" | "privacy" | "terms") => {
    const newSection: LegalPageSection = {
      id: crypto.randomUUID(),
      title: "סעיף חדש",
      content: "תוכן הסעיף...",
    };
    updateSettings(prev => ({
      ...prev,
      [page]: { ...prev[page], sections: [...prev[page].sections, newSection] },
    }));
  };

  const updateLegalSection = (page: "accessibility" | "privacy" | "terms", id: string, field: "title" | "content", value: string) => {
    updateSettings(prev => ({
      ...prev,
      [page]: { ...prev[page], sections: prev[page].sections.map(s => s.id === id ? { ...s, [field]: value } : s) },
    }));
  };

  const removeLegalSection = (page: "accessibility" | "privacy" | "terms", id: string) => {
    if (!window.confirm("למחוק את הסעיף?")) return;
    updateSettings(prev => ({
      ...prev,
      [page]: { ...prev[page], sections: prev[page].sections.filter(s => s.id !== id) },
    }));
    toast.success("הסעיף נמחק");
  };

  const moveLegalSection = (page: "accessibility" | "privacy" | "terms", index: number, direction: -1 | 1) => {
    updateSettings(prev => {
      const sections = [...prev[page].sections];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= sections.length) return prev;
      [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
      return { ...prev, [page]: { ...prev[page], sections } };
    });
  };

  // SEO score calculator
  const getSeoScore = () => {
    const titleLen = settings.seo.siteTitle.trim().length;
    const descLen = settings.seo.siteDescription.trim().length;
    const documentScripts = Array.from(document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'))
      .map((script) => script.textContent ?? "")
      .join("\n");
    const internalLinksCount = document.querySelectorAll('a[href^="/"], a[href^="#"]').length;

    const checks = [
      { label: `כותרת (${titleLen}/60)`, pass: titleLen >= 30 && titleLen <= 60 },
      { label: `תיאור מטא (${descLen}/160)`, pass: descLen >= 120 && descLen <= 160 },
      { label: "Canonical קיים", pass: Boolean(resolvedCanonicalUrl) },
      { label: "Canonical תואם לדומיין", pass: resolvedCanonicalUrl.startsWith(resolvedSiteUrl) },
      { label: "OG title", pass: Boolean(settings.seo.siteTitle.trim()) },
      { label: "OG description", pass: Boolean(settings.seo.siteDescription.trim()) },
      { label: "OG image", pass: ogImageInputValid && Boolean(resolvedOgImageUrl) },
      { label: "OG url", pass: Boolean(resolvedSiteUrl) },
      { label: "Twitter card", pass: true },
      { label: "Twitter title", pass: Boolean(settings.seo.siteTitle.trim()) },
      { label: "Twitter description", pass: Boolean(settings.seo.siteDescription.trim()) },
      { label: "Twitter image", pass: ogImageInputValid && Boolean(resolvedOgImageUrl) },
      { label: "JSON-LD ProfessionalService", pass: documentScripts.includes('"@type": "ProfessionalService"') || documentScripts.includes('"@type":"ProfessionalService"') },
      { label: "JSON-LD WebSite", pass: documentScripts.includes('"@type": "WebSite"') || documentScripts.includes('"@type":"WebSite"') },
      { label: "JSON-LD BreadcrumbList", pass: documentScripts.includes('"@type": "BreadcrumbList"') || documentScripts.includes('"@type":"BreadcrumbList"') },
      { label: "robots.txt קיים", pass: seoAssets.robots },
      { label: "sitemap.xml קיים", pass: seoAssets.sitemap },
      { label: "קישורים פנימיים מזוהים", pass: internalLinksCount >= 5 },
    ];

    const passedChecks = checks.filter((check) => check.pass).length;
    const score = Math.round((passedChecks / checks.length) * 100);

    return { score, checks };
  };

  const seo = getSeoScore();

  // Character count helper
  const CharCount = ({ current, max, recommended }: { current: number; max?: number; recommended?: number }) => {
    const target = recommended || max || 0;
    const isGood = recommended ? (current >= recommended * 0.5 && current <= target) : current <= target;
    return (
      <span className={`text-[10px] ${isGood ? "text-green-600" : "text-amber-500"}`}>
        {current}/{target} תווים {recommended ? "(מומלץ)" : ""}
      </span>
    );
  };

  // Render legal page editor
  const renderLegalEditor = (page: "accessibility" | "privacy" | "terms", title: string, icon: React.ReactNode, description: string) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">{icon}{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="text-[10px]">
              {settings[page].sections.length} סעיפים
            </Badge>
            <Button variant="outline" size="sm" onClick={() => addLegalSection(page)} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              הוסף סעיף
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {page === "accessibility" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>שם רכז הנגישות</Label>
                <Input value={settings.accessibility.coordinatorName} onChange={e => updateSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, coordinatorName: e.target.value } }))} />
              </div>
              <div className="space-y-2">
                <Label>תאריך עדכון אחרון</Label>
                <Input value={settings.accessibility.lastUpdated} onChange={e => updateSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, lastUpdated: e.target.value } }))} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>טלפון רכז</Label>
                <Input value={settings.accessibility.coordinatorPhone} onChange={e => updateSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, coordinatorPhone: e.target.value } }))} />
              </div>
              <div className="space-y-2">
                <Label>אימייל רכז</Label>
                <Input value={settings.accessibility.coordinatorEmail} onChange={e => updateSettings(prev => ({ ...prev, accessibility: { ...prev.accessibility, coordinatorEmail: e.target.value } }))} />
              </div>
            </div>
          </>
        )}

        {(page === "privacy" || page === "terms") && (
          <div className="space-y-2">
            <Label>תאריך עדכון אחרון</Label>
            <Input
              value={settings[page].lastUpdated}
              onChange={e => updateSettings(prev => ({ ...prev, [page]: { ...prev[page], lastUpdated: e.target.value } }))}
            />
          </div>
        )}

        <div className="space-y-3 pt-4 border-t border-border">
          <Label className="text-sm font-semibold">סעיפים</Label>
          {settings[page].sections.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">אין סעיפים. לחץ "הוסף סעיף" כדי להתחיל.</p>
          )}
          {settings[page].sections.map((section, i) => (
            <div key={section.id} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{i + 1}</span>
                  <div className="flex gap-0.5">
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === 0} onClick={() => moveLegalSection(page, i, -1)}>
                      <ArrowUp className="h-3 w-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6" disabled={i === settings[page].sections.length - 1} onClick={() => moveLegalSection(page, i, 1)}>
                      <ArrowDown className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={() => removeLegalSection(page, section.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <Input
                value={section.title}
                onChange={e => updateLegalSection(page, section.id, "title", e.target.value)}
                placeholder="כותרת הסעיף"
                className="text-sm font-semibold"
              />
              <Textarea
                value={section.content}
                onChange={e => updateLegalSection(page, section.id, "content", e.target.value)}
                placeholder="תוכן הסעיף"
                rows={3}
                className="text-sm"
              />
              <div className="text-left">
                <CharCount current={section.content.length} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
            <Settings2 className="h-5 w-5 text-primary" />
            הגדרות אתר
            {hasChanges && (
              <Badge variant="outline" className="text-amber-600 border-amber-300 text-[10px] mr-2">
                <AlertTriangle className="h-3 w-3 ml-1" />
                שינויים לא נשמרו
              </Badge>
            )}
          </h2>
          <p className="text-sm text-muted-foreground">
            נהל את כל ההגדרות והתכנים של האתר במקום אחד
            {lastSaved && <span className="text-[10px] mr-2">• נשמר לאחרונה: {lastSaved}</span>}
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5">
            <Download className="h-3.5 w-3.5" />
            ייצוא
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-1.5">
            <Upload className="h-3.5 w-3.5" />
            ייבוא
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            אפס
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving || isLoading} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {saving ? "שומר..." : "שמור הכל"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1.5 p-1.5 bg-muted/50 rounded-xl">
          <TabsTrigger value="general" className="gap-1.5 text-xs rounded-lg"><Globe className="h-3.5 w-3.5" />כללי</TabsTrigger>
          <TabsTrigger value="seo" className="gap-1.5 text-xs rounded-lg"><Search className="h-3.5 w-3.5" />SEO</TabsTrigger>
          <TabsTrigger value="social" className="gap-1.5 text-xs rounded-lg"><LinkIcon className="h-3.5 w-3.5" />רשתות חברתיות</TabsTrigger>
          <TabsTrigger value="accessibility" className="gap-1.5 text-xs rounded-lg"><Eye className="h-3.5 w-3.5" />נגישות</TabsTrigger>
          <TabsTrigger value="privacy" className="gap-1.5 text-xs rounded-lg"><Shield className="h-3.5 w-3.5" />פרטיות</TabsTrigger>
          <TabsTrigger value="terms" className="gap-1.5 text-xs rounded-lg"><Scale className="h-3.5 w-3.5" />תנאי שימוש</TabsTrigger>
          <TabsTrigger value="tools" className="gap-1.5 text-xs rounded-lg"><Zap className="h-3.5 w-3.5" />כלים</TabsTrigger>
        </TabsList>

        {/* ==================== GENERAL ==================== */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" />
                פרטי התקשרות
              </CardTitle>
              <CardDescription>פרטים אלו מופיעים בכל האתר — פוטר, דף צור קשר ועוד</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>כתובת האתר (Site URL)</Label>
                <Input
                  value={settings.siteUrl}
                  onChange={e => updateSettings(prev => ({ ...prev, siteUrl: e.target.value }))}
                  placeholder="https://nz-web.com"
                  dir="ltr"
                  className="text-left"
                />
                <p className="text-xs text-muted-foreground">משמש ל-canonical, כתובות OG, schema ו-preview.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>שם בעל העסק</Label>
                  <Input value={settings.contact.ownerName} onChange={e => updateSettings(prev => ({ ...prev, contact: { ...prev.contact, ownerName: e.target.value } }))} />
                </div>
                <div className="space-y-2">
                  <Label>טלפון</Label>
                  <Input value={settings.contact.phone} onChange={e => updateSettings(prev => ({ ...prev, contact: { ...prev.contact, phone: e.target.value } }))} dir="ltr" className="text-left" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>אימייל</Label>
                <Input type="email" value={settings.contact.email} onChange={e => updateSettings(prev => ({ ...prev, contact: { ...prev.contact, email: e.target.value } }))} dir="ltr" className="text-left" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-primary" />
                WhatsApp
              </CardTitle>
              <CardDescription>הגדרות כפתור וואטסאפ באתר</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>מספר WhatsApp (בפורמט בינלאומי, ללא +)</Label>
                <Input value={settings.contact.whatsappNumber} onChange={e => updateSettings(prev => ({ ...prev, contact: { ...prev.contact, whatsappNumber: e.target.value } }))} placeholder="972587292029" dir="ltr" className="text-left" />
              </div>
              <div className="space-y-2">
                <Label>הודעת ברירת מחדל</Label>
                <Textarea value={settings.contact.whatsappMessage} onChange={e => updateSettings(prev => ({ ...prev, contact: { ...prev.contact, whatsappMessage: e.target.value } }))} rows={2} />
                <CharCount current={settings.contact.whatsappMessage.length} max={500} />
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground mb-1">תצוגה מקדימה של הקישור:</p>
                <code className="text-xs text-primary break-all">
                  https://wa.me/{settings.contact.whatsappNumber}?text={encodeURIComponent(settings.contact.whatsappMessage).slice(0, 50)}...
                </code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Footer (כותרת תחתונה)</CardTitle>
              <CardDescription>טקסטים שמופיעים בתחתית האתר</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>סלוגן</Label>
                  <Input value={settings.footer.tagline} onChange={e => updateSettings(prev => ({ ...prev, footer: { ...prev.footer, tagline: e.target.value } }))} />
                </div>
                <div className="space-y-2">
                  <Label>טקסט זכויות יוצרים</Label>
                  <Input value={settings.footer.copyrightText} onChange={e => updateSettings(prev => ({ ...prev, footer: { ...prev.footer, copyrightText: e.target.value } }))} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SEO ==================== */}
        <TabsContent value="seo" className="space-y-4">
          {/* SEO Score */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-primary" />
                ציון SEO
              </CardTitle>
              <CardDescription>בדוק את מוכנות האתר למנועי חיפוש</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-4">
                <div className={`text-3xl font-bold ${seo.score >= 80 ? "text-green-600" : seo.score >= 50 ? "text-amber-500" : "text-red-500"}`}>
                  {seo.score}%
                </div>
                <div className="flex-1">
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${seo.score >= 80 ? "bg-green-500" : seo.score >= 50 ? "bg-amber-500" : "bg-red-500"}`}
                      style={{ width: `${seo.score}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                {seo.checks.map(({ label, pass }) => (
                  <div key={label} className={`flex items-center gap-2 text-xs rounded-lg px-3 py-2 ${pass ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"}`}>
                    {pass ? <Check className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                הגדרות SEO
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Type className="h-3.5 w-3.5" />
                  כותרת האתר (Title)
                </Label>
                <Input value={settings.seo.siteTitle} onChange={e => updateSettings(prev => ({ ...prev, seo: { ...prev.seo, siteTitle: e.target.value } }))} />
                <CharCount current={settings.seo.siteTitle.length} recommended={60} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5" />
                  תיאור (Meta Description)
                </Label>
                <Textarea value={settings.seo.siteDescription} onChange={e => updateSettings(prev => ({ ...prev, seo: { ...prev.seo, siteDescription: e.target.value } }))} rows={2} />
                <CharCount current={settings.seo.siteDescription.length} recommended={160} />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Hash className="h-3.5 w-3.5" />
                  מילות מפתח (מופרדות בפסיק)
                </Label>
                <Input value={settings.seo.keywords} onChange={e => updateSettings(prev => ({ ...prev, seo: { ...prev.seo, keywords: e.target.value } }))} />
                <div className="flex flex-wrap gap-1 pt-1">
                  {settings.seo.keywords.split(",").filter(k => k.trim()).map((k, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px]">{k.trim()}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Image className="h-3.5 w-3.5" />
                  תמונת OG (לשיתוף ברשתות)
                </Label>
                <Input value={settings.seo.ogImage} onChange={e => updateSettings(prev => ({ ...prev, seo: { ...prev.seo, ogImage: e.target.value } }))} placeholder="https://nz-web.com/og-image.png" dir="ltr" className="text-left" />
                <p className={`text-xs ${ogImageInputValid ? "text-muted-foreground" : "text-destructive"}`}>
                  נתמך: PNG, JPG, WEBP. אם השדה ריק, תתבצע נפילה אוטומטית ל-{resolvedSiteUrl}/og-image.png
                </p>
                <div className="rounded-lg border border-border overflow-hidden mt-2">
                  <img src={resolvedOgImageUrl} alt="OG Preview" className="w-full h-32 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Preview */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-primary" />
                  תצוגה מקדימה בגוגל
                </CardTitle>
                <div className="flex gap-1">
                  <Button variant={seoPreviewDevice === "desktop" ? "default" : "outline"} size="icon" className="h-7 w-7" onClick={() => setSeoPreviewDevice("desktop")}>
                    <Monitor className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant={seoPreviewDevice === "mobile" ? "default" : "outline"} size="icon" className="h-7 w-7" onClick={() => setSeoPreviewDevice("mobile")}>
                    <Smartphone className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`rounded-xl border border-border bg-white p-4 ${seoPreviewDevice === "mobile" ? "max-w-[360px]" : ""}`} dir="ltr">
                <p className="text-xs text-green-700 mb-0.5 truncate">{resolvedSiteUrl}</p>
                <p className="text-lg text-blue-700 font-medium leading-tight truncate hover:underline cursor-pointer">
                  {settings.seo.siteTitle || "כותרת האתר"}
                </p>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {settings.seo.siteDescription || "תיאור האתר..."}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Image className="h-4 w-4 text-primary" />
                תצוגה מקדימה לשיתוף ברשתות
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xl overflow-hidden rounded-xl border border-border bg-card">
                <img src={resolvedOgImageUrl} alt="Social preview" className="h-52 w-full object-cover" />
                <div className="space-y-2 p-4" dir="ltr">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{resolvedSiteUrl.replace(/^https?:\/\//, "")}</p>
                  <p className="line-clamp-2 text-lg font-semibold text-foreground">{settings.seo.siteTitle || "NZ-WEB"}</p>
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {settings.seo.siteDescription || "תיאור האתר יוצג כאן."}
                  </p>
                  <p className="text-sm text-primary">{resolvedCanonicalUrl}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== SOCIAL ==================== */}
        <TabsContent value="social" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">רשתות חברתיות</CardTitle>
              <CardDescription>קישורים שמופיעים אוטומטית בפוטר ובכל האתר</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { key: "facebook", icon: Facebook, label: "Facebook", color: "text-blue-600" },
                { key: "instagram", icon: Instagram, label: "Instagram", color: "text-pink-600" },
                { key: "linkedin", icon: Linkedin, label: "LinkedIn", color: "text-blue-700" },
                { key: "twitter", icon: Twitter, label: "Twitter / X", color: "text-sky-500" },
                { key: "github", icon: Github, label: "GitHub", color: "text-gray-800" },
                { key: "youtube", icon: Youtube, label: "YouTube", color: "text-red-600" },
              ].map(({ key, icon: Icon, label, color }) => {
                const value = (settings.social as any)[key];
                const filled = value && value.trim();
                return (
                  <div key={key} className={`flex items-center gap-3 rounded-xl border p-3 transition-colors ${filled ? "border-primary/30 bg-primary/5" : "border-border"}`}>
                    <Icon className={`h-5 w-5 flex-shrink-0 ${filled ? color : "text-muted-foreground"}`} />
                    <div className="flex-1 space-y-1">
                      <Label className="text-xs">{label}</Label>
                      <Input
                        value={value}
                        onChange={e => updateSettings(prev => ({ ...prev, social: { ...prev.social, [key]: e.target.value } }))}
                        placeholder={`https://${key}.com/...`}
                        dir="ltr"
                        className="text-left text-sm h-8"
                      />
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {filled && (
                        <a href={value} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <div className="flex flex-col items-center gap-0.5">
                        <Switch
                          checked={settings.socialVisibility?.[key as keyof typeof settings.socialVisibility] ?? true}
                          onCheckedChange={(checked) => updateSettings(prev => ({
                            ...prev,
                            socialVisibility: { ...prev.socialVisibility, [key]: checked }
                          }))}
                        />
                        <span className="text-[10px] text-muted-foreground">בפוטר</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Social preview */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">תצוגה מקדימה בפוטר</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3 p-4 bg-muted/50 rounded-xl justify-center">
                {[
                  { key: "facebook", icon: Facebook },
                  { key: "instagram", icon: Instagram },
                  { key: "linkedin", icon: Linkedin },
                  { key: "twitter", icon: Twitter },
                  { key: "github", icon: Github },
                  { key: "youtube", icon: Youtube },
                ].filter(({ key }) => {
                  const val = (settings.social as any)[key];
                  const visible = settings.socialVisibility?.[key as keyof typeof settings.socialVisibility] ?? true;
                  return visible && (key === "facebook" || (val && val.trim()));
                }).map(({ key, icon: Icon }) => (
                  <div key={key} className="flex h-10 w-10 items-center justify-center rounded-full bg-foreground/10 text-foreground/70">
                    <Icon className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ==================== LEGAL PAGES ==================== */}
        <TabsContent value="accessibility" className="space-y-4">
          {renderLegalEditor("accessibility", "הצהרת נגישות", <Eye className="h-4 w-4 text-primary" />, "ערוך את תוכן דף הנגישות")}
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          {renderLegalEditor("privacy", "מדיניות פרטיות", <Shield className="h-4 w-4 text-primary" />, "ערוך את תוכן דף מדיניות הפרטיות")}
        </TabsContent>

        <TabsContent value="terms" className="space-y-4">
          {renderLegalEditor("terms", "תנאי שימוש", <Scale className="h-4 w-4 text-primary" />, "ערוך את תוכן דף תנאי השימוש")}
        </TabsContent>

        {/* ==================== TOOLS ==================== */}
        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Quick Copy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Copy className="h-4 w-4 text-primary" />
                  העתקה מהירה
                </CardTitle>
                <CardDescription>העתק פרטים בלחיצה אחת</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "טלפון", value: settings.contact.phone, key: "phone" },
                  { label: "אימייל", value: settings.contact.email, key: "email" },
                  { label: "WhatsApp", value: `https://wa.me/${settings.contact.whatsappNumber}`, key: "wa" },
                  { label: "כתובת אתר", value: resolvedSiteUrl, key: "url" },
                  { label: "כותרת SEO", value: settings.seo.siteTitle, key: "title" },
                ].map(({ label, value, key }) => (
                  <div key={key} className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5">
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted-foreground">{label}</p>
                      <p className="text-sm font-medium text-foreground truncate">{value}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0" onClick={() => copyToClipboard(value, key)}>
                      {copied === key ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MousePointer className="h-4 w-4 text-primary" />
                  קישורים מהירים
                </CardTitle>
                <CardDescription>גישה ישירה לדפי האתר</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "דף הבית", href: "/", icon: Globe },
                  { label: "מי אנחנו", href: "/about", icon: FileText },
                  { label: "כל הפרויקטים", href: "/projects", icon: FileText },
                  { label: "שאלות נפוצות", href: "/faq", icon: FileText },
                  { label: "הצהרת נגישות", href: "/accessibility", icon: Eye },
                  { label: "מדיניות פרטיות", href: "/privacy", icon: Shield },
                  { label: "תנאי שימוש", href: "/terms", icon: Scale },
                ].map(({ label, href, icon: Icon }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-secondary/30 px-3 py-2.5 text-sm font-medium text-foreground hover:bg-secondary/50 transition-colors group">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-primary" />
                      {label}
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ))}
              </CardContent>
            </Card>

            {/* Site Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Globe className="h-4 w-4 text-primary" />
                  מידע על האתר
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: "כתובת האתר", value: resolvedSiteUrl },
                  { label: "תאריך נוכחי", value: new Date().toLocaleDateString("he-IL") },
                  { label: "סעיפי נגישות", value: `${settings.accessibility.sections.length} סעיפים` },
                  { label: "סעיפי פרטיות", value: `${settings.privacy.sections.length} סעיפים` },
                  { label: "סעיפי תנאי שימוש", value: `${settings.terms.sections.length} סעיפים` },
                  { label: "רשתות חברתיות מחוברות", value: `${Object.values(settings.social).filter(v => v.trim()).length}/6` },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-secondary/30 px-3 py-2.5">
                    <p className="text-[10px] text-muted-foreground">{label}</p>
                    <p className="text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Color Palette */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Palette className="h-4 w-4 text-primary" />
                  פלטת הצבעים
                </CardTitle>
                <CardDescription>צבעי המותג הנוכחיים</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { name: "Primary", class: "bg-primary" },
                    { name: "Secondary", class: "bg-secondary" },
                    { name: "Accent", class: "bg-accent" },
                    { name: "Muted", class: "bg-muted" },
                    { name: "Background", class: "bg-background border" },
                    { name: "Foreground", class: "bg-foreground" },
                    { name: "Destructive", class: "bg-destructive" },
                    { name: "Card", class: "bg-card border" },
                  ].map(({ name, class: bgClass }) => (
                    <div key={name} className="text-center">
                      <div className={`h-12 rounded-xl ${bgClass} border-border shadow-sm`} />
                      <p className="text-[10px] text-muted-foreground mt-1.5 font-medium">{name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Backup & Data */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-primary" />
                  גיבוי ונתונים
                </CardTitle>
                <CardDescription>ייצא, ייבא או אפס את כל הגדרות האתר</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={handleExport}>
                    <Download className="h-5 w-5 text-primary" />
                    <div className="text-center">
                      <p className="text-sm font-medium">ייצוא הגדרות</p>
                      <p className="text-[10px] text-muted-foreground">שמור קובץ JSON לגיבוי</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="gap-2 h-auto py-4 flex-col" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-5 w-5 text-primary" />
                    <div className="text-center">
                      <p className="text-sm font-medium">ייבוא הגדרות</p>
                      <p className="text-[10px] text-muted-foreground">טען קובץ JSON קיים</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="gap-2 h-auto py-4 flex-col text-destructive hover:text-destructive" onClick={handleReset}>
                    <RotateCcw className="h-5 w-5" />
                    <div className="text-center">
                      <p className="text-sm font-medium">אפס הכל</p>
                      <p className="text-[10px] text-muted-foreground">חזור לברירת מחדל</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSiteSettingsTab;

