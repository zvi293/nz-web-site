import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical, Eye, EyeOff, ChevronUp, ChevronDown, RotateCcw, HelpCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { fetchFaqItems, saveFaqItems, getDefaultFaqItems, type FaqItem } from "@/lib/faq-api";

const AdminFaqTab = () => {
  const [items, setItems] = useState<FaqItem[]>(() => getDefaultFaqItems());
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadFaqItems = async () => {
    try {
      setLoading(true);
      const loadedItems = await fetchFaqItems({ includeHidden: true });
      setItems(loadedItems);
      setHasChanges(false);
    } catch (error) {
      console.error(error);
      toast.error("לא ניתן היה לטעון את השאלות הנפוצות כרגע.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadFaqItems();
  }, []);

  const updateItems = (updater: (prev: FaqItem[]) => FaqItem[]) => {
    setItems(prev => {
      const next = updater(prev);
      setHasChanges(true);
      return next;
    });
  };

  const handleSave = async () => {
    const invalidItem = items.find((item) => !item.question.trim() || !item.answer.trim());
    if (invalidItem) {
      const itemIndex = items.findIndex((item) => item.id === invalidItem.id) + 1;
      toast.error(`שאלה ${itemIndex} חייבת לכלול גם שאלה וגם תשובה.`);
      return;
    }

    try {
      setLoading(true);
      const savedItems = await saveFaqItems(items);
      setItems(savedItems);
      setHasChanges(false);
      toast.success("שאלות נפוצות נשמרו בהצלחה!");
    } catch (error) {
      console.error(error);
      toast.error("לא ניתן היה לטעון את השאלות הנפוצות כרגע.");
    } finally {
      setLoading(false);
    }
  };

  const addItem = () => {
    const newItem: FaqItem = {
      id: crypto.randomUUID(),
      question: "",
      answer: "",
      visible: true,
      order: items.length,
    };
    updateItems(prev => [...prev, newItem]);
  };

  const removeItem = (id: string) => {
    if (!window.confirm("למחוק את השאלה מרשימת ה-FAQ?")) return;
    updateItems(prev => prev.filter(item => item.id !== id).map((item, i) => ({ ...item, order: i })));
  };

  const moveItem = (index: number, direction: -1 | 1) => {
    updateItems(prev => {
      const newItems = [...prev];
      const newIndex = index + direction;
      if (newIndex < 0 || newIndex >= newItems.length) return prev;
      [newItems[index], newItems[newIndex]] = [newItems[newIndex], newItems[index]];
      return newItems.map((item, i) => ({ ...item, order: i }));
    });
  };

  const updateField = (id: string, field: keyof FaqItem, value: string | boolean) => {
    updateItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const resetToDefaults = () => {
    if (!window.confirm("לאפס את רשימת ה-FAQ לברירת המחדל?")) return;
    setItems(getDefaultFaqItems());
    setHasChanges(true);
    toast.info("שוחזרו ברירות המחדל – לחץ שמור כדי לעדכן");
  };

  const visibleCount = items.filter(i => i.visible).length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold font-heebo">שאלות נפוצות</h2>
          <Badge variant="secondary" className="text-xs">
            {visibleCount}/{items.length} גלויות
          </Badge>
          {hasChanges && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              שינויים לא שמורים
            </Badge>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={resetToDefaults} disabled={loading}>
            <RotateCcw className="h-3.5 w-3.5 ml-1" />
            ברירת מחדל
          </Button>
          <Button variant="outline" size="sm" onClick={addItem} disabled={loading}>
            <Plus className="h-3.5 w-3.5 ml-1" />
            הוסף שאלה
          </Button>
          <Button size="sm" onClick={() => void handleSave()} disabled={!hasChanges || loading}>
            <Save className="h-3.5 w-3.5 ml-1" />
            שמור
          </Button>
        </div>
      </div>

      {/* FAQ Items */}
      <div className="space-y-3">
        {items.map((item, index) => (
          <Card
            key={item.id}
            className={`transition-all duration-200 ${!item.visible ? "opacity-60 border-dashed" : "border-border"}`}
          >
            <CardContent className="p-4 space-y-3">
              {/* Top row: controls */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <button
                      onClick={() => moveItem(index, -1)}
                      disabled={index === 0 || loading}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => moveItem(index, 1)}
                      disabled={index === items.length - 1 || loading}
                      className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>
                  <Badge variant="outline" className="text-xs font-mono">
                    #{index + 1}
                  </Badge>
                  <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                    {item.question || "שאלה חדשה..."}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {item.visible ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
                    <Switch
                      checked={item.visible}
                      disabled={loading}
                      onCheckedChange={(checked) => updateField(item.id, "visible", checked)}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeItem(item.id)}
                    disabled={loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Question */}
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">שאלה</Label>
                <Input
                  value={item.question}
                  onChange={e => updateField(item.id, "question", e.target.value)}
                  placeholder="הקלד שאלה..."
                  dir="rtl"
                  className="font-heebo"
                  disabled={loading}
                />
              </div>

              {/* Answer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="text-xs text-muted-foreground">תשובה</Label>
                  <span className={`text-[10px] ${item.answer.length > 300 ? "text-amber-500" : "text-muted-foreground"}`}>
                    {item.answer.length} תווים
                  </span>
                </div>
                <Textarea
                  value={item.answer}
                  onChange={e => updateField(item.id, "answer", e.target.value)}
                  placeholder="הקלד תשובה..."
                  dir="rtl"
                  className="font-heebo min-h-[80px] resize-y"
                  rows={3}
                  disabled={loading}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <HelpCircle className="h-10 w-10 mb-3 opacity-40" />
            <p className="text-sm font-heebo">אין שאלות נפוצות עדיין</p>
            <Button variant="outline" size="sm" className="mt-3" onClick={addItem} disabled={loading}>
              <Plus className="h-3.5 w-3.5 ml-1" />
              הוסף שאלה ראשונה
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminFaqTab;
