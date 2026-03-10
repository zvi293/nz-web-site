import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Save, RotateCcw, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  fetchAboutData,
  saveAboutData,
  fetchDeletedAboutItems,
  addDeletedAboutItem,
  permanentlyDeleteAboutItem,
  getDeletedAboutItem,
  type AboutPageData,
  type AboutColumn,
  type DeletedAboutItem,
} from "@/lib/about-api";

const AdminAboutTab = () => {
  const [data, setData] = useState<AboutPageData>(fetchAboutData());
  const [deletedItems, setDeletedItems] = useState<DeletedAboutItem[]>(fetchDeletedAboutItems());
  const [showRecycleBin, setShowRecycleBin] = useState(false);
  const [saving, setSaving] = useState(false);

  const reloadDeleted = () => setDeletedItems(fetchDeletedAboutItems());

  const handleSave = () => {
    setSaving(true);
    saveAboutData(data);
    setTimeout(() => {
      setSaving(false);
      toast.success("הדף נשמר בהצלחה!");
    }, 300);
  };

  const updateColumn = (colIndex: number, updates: Partial<AboutColumn>) => {
    setData(prev => {
      const columns = [...prev.columns] as [AboutColumn, AboutColumn, AboutColumn];
      columns[colIndex] = { ...columns[colIndex], ...updates };
      return { ...prev, columns };
    });
  };

  const addItem = (colIndex: number) => {
    setData(prev => {
      const columns = [...prev.columns] as [AboutColumn, AboutColumn, AboutColumn];
      columns[colIndex] = {
        ...columns[colIndex],
        items: [...columns[colIndex].items, { title: "פריט חדש", desc: "תיאור הפריט" }],
      };
      return { ...prev, columns };
    });
  };

  const removeItem = (colIndex: number, itemIndex: number) => {
    const item = data.columns[colIndex].items[itemIndex];
    addDeletedAboutItem({
      type: "column-item",
      label: `${data.columns[colIndex].title} → ${item.title}`,
      data: { colIndex, item },
    });
    reloadDeleted();
    toast.success(`"${item.title}" הועבר לסל המחזור`);
    setData(prev => {
      const columns = [...prev.columns] as [AboutColumn, AboutColumn, AboutColumn];
      columns[colIndex] = {
        ...columns[colIndex],
        items: columns[colIndex].items.filter((_, i) => i !== itemIndex),
      };
      return { ...prev, columns };
    });
  };

  const updateItem = (colIndex: number, itemIndex: number, field: "title" | "desc", value: string) => {
    setData(prev => {
      const columns = [...prev.columns] as [AboutColumn, AboutColumn, AboutColumn];
      const items = [...columns[colIndex].items];
      items[itemIndex] = { ...items[itemIndex], [field]: value };
      columns[colIndex] = { ...columns[colIndex], items };
      return { ...prev, columns };
    });
  };

  const addVisionParagraph = () => {
    setData(prev => ({
      ...prev,
      visionParagraphs: [...prev.visionParagraphs, "פסקה חדשה..."],
    }));
  };

  const removeVisionParagraph = (index: number) => {
    const paragraph = data.visionParagraphs[index];
    addDeletedAboutItem({
      type: "vision-paragraph",
      label: paragraph.substring(0, 50) + (paragraph.length > 50 ? "..." : ""),
      data: { paragraph },
    });
    reloadDeleted();
    toast.success("הפסקה הועברה לסל המחזור");
    setData(prev => ({
      ...prev,
      visionParagraphs: prev.visionParagraphs.filter((_, i) => i !== index),
    }));
  };

  const handleRestoreAboutItem = (id: string) => {
    const item = getDeletedAboutItem(id);
    if (!item) return;

    if (item.type === "column-item") {
      const { colIndex, item: accItem } = item.data;
      setData(prev => {
        const columns = [...prev.columns] as [AboutColumn, AboutColumn, AboutColumn];
        if (columns[colIndex]) {
          columns[colIndex] = {
            ...columns[colIndex],
            items: [...columns[colIndex].items, accItem],
          };
        }
        return { ...prev, columns };
      });
    } else if (item.type === "vision-paragraph") {
      setData(prev => ({
        ...prev,
        visionParagraphs: [...prev.visionParagraphs, item.data.paragraph],
      }));
    }

    permanentlyDeleteAboutItem(id);
    reloadDeleted();
    toast.success("הפריט שוחזר בהצלחה");
  };

  const handlePermanentDeleteAboutItem = (id: string) => {
    permanentlyDeleteAboutItem(id);
    reloadDeleted();
    toast.success("הפריט נמחק לצמיתות");
  };

  return (
    <div className="space-y-6">
      {/* Save bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">עריכת דף ״מי אנחנו״</h2>
          <p className="text-sm text-muted-foreground">ערוך את כל התוכן בדף</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowRecycleBin(true)} className="gap-1.5">
            <Archive className="h-3.5 w-3.5" />
            סל מחזור
            {deletedItems.length > 0 && (
              <span className="rounded-full bg-destructive/15 text-destructive text-[10px] px-1.5 py-0.5 font-bold">
                {deletedItems.length}
              </span>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setData(fetchAboutData())} className="gap-1.5">
            <RotateCcw className="h-3.5 w-3.5" />
            בטל שינויים
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
            <Save className="h-3.5 w-3.5" />
            {saving ? "שומר..." : "שמור הכל"}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 h-10">
          <TabsTrigger value="hero" className="text-xs">Hero</TabsTrigger>
          <TabsTrigger value="services" className="text-xs">שירותים</TabsTrigger>
          <TabsTrigger value="vision" className="text-xs">חזון</TabsTrigger>
          <TabsTrigger value="cta" className="text-xs">CTA</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">סקשן Hero</CardTitle>
              <CardDescription>כותרת ראשית, תת-כותרת, תיאור וציטוט</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>תת-כותרת</Label>
                  <Input
                    value={data.heroSubtitle}
                    onChange={e => setData(prev => ({ ...prev, heroSubtitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>כותרת ראשית</Label>
                  <Input
                    value={data.heroTitle}
                    onChange={e => setData(prev => ({ ...prev, heroTitle: e.target.value }))}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>תיאור</Label>
                <Textarea
                  value={data.heroDescription}
                  onChange={e => setData(prev => ({ ...prev, heroDescription: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>ציטוט</Label>
                <Textarea
                  value={data.heroQuote}
                  onChange={e => setData(prev => ({ ...prev, heroQuote: e.target.value }))}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Services Section */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">כותרת סקשן השירותים</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                value={data.servicesTitle}
                onChange={e => setData(prev => ({ ...prev, servicesTitle: e.target.value }))}
              />
            </CardContent>
          </Card>

          {data.columns.map((col, colIdx) => (
            <Card key={colIdx}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">עמודה {colIdx + 1}</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => addItem(colIdx)} className="gap-1.5">
                    <Plus className="h-3.5 w-3.5" />
                    הוסף פריט
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>כותרת עמודה</Label>
                  <Input
                    value={col.title}
                    onChange={e => updateColumn(colIdx, { title: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  {col.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="rounded-xl border border-border bg-secondary/20 p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">פריט {itemIdx + 1}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive hover:bg-destructive/10"
                          onClick={() => removeItem(colIdx, itemIdx)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                      <Input
                        value={item.title}
                        onChange={e => updateItem(colIdx, itemIdx, "title", e.target.value)}
                        placeholder="כותרת"
                        className="text-sm"
                      />
                      <Textarea
                        value={item.desc}
                        onChange={e => updateItem(colIdx, itemIdx, "desc", e.target.value)}
                        placeholder="תיאור"
                        rows={2}
                        className="text-sm"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Vision Section */}
        <TabsContent value="vision" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">סקשן חזון</CardTitle>
                  <CardDescription>כותרת ופסקאות</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={addVisionParagraph} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" />
                  הוסף פסקה
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>כותרת</Label>
                <Input
                  value={data.visionTitle}
                  onChange={e => setData(prev => ({ ...prev, visionTitle: e.target.value }))}
                />
              </div>

              {data.visionParagraphs.map((p, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">פסקה {i + 1}</Label>
                    {data.visionParagraphs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive"
                        onClick={() => removeVisionParagraph(i)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={p}
                    onChange={e => {
                      const updated = [...data.visionParagraphs];
                      updated[i] = e.target.value;
                      setData(prev => ({ ...prev, visionParagraphs: updated }));
                    }}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CTA Section */}
        <TabsContent value="cta" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">סקשן CTA</CardTitle>
              <CardDescription>קריאה לפעולה בתחתית הדף</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>כותרת</Label>
                  <Input
                    value={data.ctaTitle}
                    onChange={e => setData(prev => ({ ...prev, ctaTitle: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>תת-כותרת</Label>
                  <Input
                    value={data.ctaSubtitle}
                    onChange={e => setData(prev => ({ ...prev, ctaSubtitle: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>טקסט כפתור</Label>
                  <Input
                    value={data.ctaButtonText}
                    onChange={e => setData(prev => ({ ...prev, ctaButtonText: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>קישור כפתור</Label>
                  <Input
                    value={data.ctaButtonLink}
                    onChange={e => setData(prev => ({ ...prev, ctaButtonLink: e.target.value }))}
                  />
                </div>
              </div>

              {/* Live CTA Preview */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">תצוגה מקדימה</Label>
                <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-blue-950 to-emerald-950 p-8 text-center">
                  <h4 className="text-2xl font-black text-white mb-2" style={{ fontFamily: "'Heebo', sans-serif" }}>
                    {data.ctaTitle || "כותרת"}
                  </h4>
                  <p className="text-primary/90 text-sm mb-4">{data.ctaSubtitle || "תת-כותרת"}</p>
                  <span className="inline-block bg-primary text-primary-foreground font-bold text-sm px-6 py-2.5 rounded-full">
                    {data.ctaButtonText || "כפתור"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recycle Bin Dialog */}
      <Dialog open={showRecycleBin} onOpenChange={setShowRecycleBin}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              סל מחזור – מי אנחנו
            </DialogTitle>
            <DialogDescription>פריטים שנמחקו נשמרים כאן 30 יום לפני מחיקה סופית</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {deletedItems.length === 0 ? (
              <p className="text-muted-foreground text-sm text-center py-8">סל המחזור ריק</p>
            ) : (
              deletedItems.map(item => {
                const daysLeft = Math.ceil((item.deletedAt + 30 * 24 * 60 * 60 * 1000 - Date.now()) / (24 * 60 * 60 * 1000));
                return (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border p-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm truncate">{item.label}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {item.type === "column-item" ? "פריט שירות" : "פסקה"} · יימחק בעוד {daysLeft} ימים
                      </p>
                    </div>
                    <div className="flex gap-1.5">
                      <Button variant="outline" size="sm" onClick={() => handleRestoreAboutItem(item.id)} className="gap-1 h-7 text-xs">
                        <RotateCcw className="h-3 w-3" />
                        שחזר
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => handlePermanentDeleteAboutItem(item.id)}
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
    </div>
  );
};

export default AdminAboutTab;
