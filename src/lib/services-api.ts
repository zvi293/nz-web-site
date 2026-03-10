export interface ServiceRow {
  id: string;
  badge: string;
  title: string;
  body: string;
  
  // Media
  image: string;
  video?: string;
  
  // Icon
  iconType: 'lucide' | 'svg' | 'image';
  iconLucideName?: string;
  iconSvg?: string;
  iconImage?: string;
  
  // Settings
  reverse: boolean;
  tags: string[];
  
  // Styling
  bgGradient: string;
  textColor: string;
  mutedTextColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconShadow: string;
  tagBg: string;
  tagText: string;
  
  order: number;
}

const API_BASE = "/api/services";
const LS_KEY = "nz-web-services";

const defaultServices: ServiceRow[] = [
  {
    id: "1",
    badge: "אפיון חכם",
    title: "מתכננים להצלחה",
    body: "הכל מתחיל באפיון מדויק. אנחנו צוללים לעומק העסק שלכם, מבינים את קהל היעד ומתכננים מסע משתמש חכם שמוביל לפעולה. בלי ניחושים, רק אסטרטגיה מבוססת נתונים שמכינה את הקרקע להמרות.",
    iconType: "lucide",
    iconLucideName: "Target",
    reverse: false,
    tags: ["אסטרטגיה", "מחקר שוק", "מסע משתמש"],
    image: "",
    video: "/videos/service-planning.mp4",
    bgGradient: "linear-gradient(135deg, hsl(45 80% 60% / 0.08), hsl(40 85% 60% / 0.12), hsl(45 70% 94%))",
    textColor: "hsl(40 50% 18%)",
    mutedTextColor: "hsl(40 30% 38%)",
    badgeBg: "hsl(45 80% 55% / 0.15)",
    badgeText: "hsl(45 80% 35%)",
    iconBg: "hsl(45 80% 50%)",
    iconShadow: "0 8px 30px -4px hsl(45 80% 50% / 0.4)",
    tagBg: "hsl(45 60% 92%)",
    tagText: "hsl(40 50% 30%)",
    order: 1
  },
  {
    id: "2",
    badge: "עיצוב UI/UX",
    title: "כשנראים טוב – מוכרים טוב",
    body: "אנחנו הפסגה של עיצוב חוויות דיגיטליות. עיצוב עוצר נשימה הוא לא רק יופי, הוא כלי מכירתי עוצמתי. אנחנו דואגים שהגולשים יחוו חוויה ייחודית ובלתי נשכחת שתבליט אתכם מעל כל המתחרים.",
    iconType: "lucide",
    iconLucideName: "Palette",
    reverse: true,
    tags: ["עיצוב", "חווית משתמש", "יוקרה"],
    image: "",
    video: "/videos/service-uiux.mp4",
    bgGradient: "linear-gradient(135deg, hsl(270 60% 96%), hsl(300 50% 94% / 0.8), hsl(330 60% 95% / 0.6))",
    textColor: "hsl(270 40% 20%)",
    mutedTextColor: "hsl(270 25% 42%)",
    badgeBg: "hsl(270 60% 60% / 0.15)",
    badgeText: "hsl(270 60% 45%)",
    iconBg: "hsl(270 60% 58%)",
    iconShadow: "0 8px 30px -4px hsl(270 60% 58% / 0.4)",
    tagBg: "hsl(270 40% 93%)",
    tagText: "hsl(270 40% 35%)",
    order: 2
  },
  {
    id: "3",
    badge: "פיתוח ומוצר מוגמר",
    title: "בונים מוצר מוגמר שמביא כסף",
    body: "אנחנו מתרגמים את העיצוב לקוד נקי, מהיר ומתקדם. התוצאה? אתר עובד, יציב ומוכן לקלוט טראפיק ולהפוך אותו ללקוחות משלמים. אתם מקבלים מוצר מוגמר, מא׳ ועד ת׳, שמייצר לכם שקט נפשי והכנסות.",
    iconType: "lucide",
    iconLucideName: "Code2",
    reverse: false,
    tags: ["פיתוח", "ביצועים", "סקיילינג"],
    image: "",
    video: "/videos/service-dev.mp4",
    bgGradient: "linear-gradient(135deg, hsl(160 50% 95%), hsl(170 60% 92% / 0.8), hsl(190 50% 93% / 0.6))",
    textColor: "hsl(170 40% 16%)",
    mutedTextColor: "hsl(170 25% 38%)",
    badgeBg: "hsl(170 60% 45% / 0.15)",
    badgeText: "hsl(170 60% 32%)",
    iconBg: "hsl(170 60% 42%)",
    iconShadow: "0 8px 30px -4px hsl(170 60% 42% / 0.4)",
    tagBg: "hsl(170 40% 92%)",
    tagText: "hsl(170 40% 30%)",
    order: 3
  },
  {
    id: "4",
    badge: "קידום אורגני",
    title: "SEO שמביא תוצאות אמיתיות",
    body: "אנחנו דואגים שהאתר שלכם יופיע בראש תוצאות החיפוש. מחקר מילות מפתח מעמיק, אופטימיזציה טכנית, תוכן ממוקד ובניית קישורים חכמה – הכל כדי שהלקוחות ימצאו אתכם לפני המתחרים.",
    iconType: "lucide",
    iconLucideName: "Search",
    reverse: true,
    tags: ["SEO", "קידום אורגני", "מילות מפתח"],
    image: "",
    video: "/videos/service-seo.mp4",
    bgGradient: "linear-gradient(135deg, hsl(210 90% 94%), hsl(200 85% 90% / 0.8), hsl(220 70% 95% / 0.6))",
    textColor: "hsl(210 50% 18%)",
    mutedTextColor: "hsl(210 30% 40%)",
    badgeBg: "hsl(210 80% 55% / 0.15)",
    badgeText: "hsl(210 80% 40%)",
    iconBg: "hsl(210 80% 52%)",
    iconShadow: "0 8px 30px -4px hsl(210 80% 52% / 0.4)",
    tagBg: "hsl(210 50% 92%)",
    tagText: "hsl(210 50% 30%)",
    order: 4
  }
];

function getFromLS(): ServiceRow[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : defaultServices;
  } catch {
    return defaultServices;
  }
}

function saveToLS(services: ServiceRow[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(services));
}

export async function fetchServices(): Promise<ServiceRow[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("API unavailable");
    const data = await res.json();
    return data.sort((a: ServiceRow, b: ServiceRow) => a.order - b.order);
  } catch {
    return getFromLS().sort((a, b) => a.order - b.order);
  }
}

export async function createService(service: Omit<ServiceRow, "id">): Promise<ServiceRow> {
  const newService: ServiceRow = { ...service, id: crypto.randomUUID() };
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newService),
    });
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    const services = getFromLS();
    services.push(newService);
    saveToLS(services);
    return newService;
  }
}

export async function updateService(id: string, data: Partial<ServiceRow>): Promise<ServiceRow> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    const services = getFromLS();
    const idx = services.findIndex((p) => p.id === id);
    if (idx !== -1) services[idx] = { ...services[idx], ...data };
    saveToLS(services);
    return services[idx];
  }
}

export async function deleteService(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("API unavailable");
  } catch {
    const services = getFromLS();
    const deleted = services.find(s => s.id === id);
    if (deleted) {
      // Move to recycle bin
      const bin = getDeletedFromLS();
      bin.push({ ...deleted, deletedAt: Date.now() });
      saveDeletedToLS(bin);
    }
    saveToLS(services.filter((p) => p.id !== id));
  }
}

// Recycle bin
export interface DeletedServiceRow extends ServiceRow {
  deletedAt: number;
}

const DELETED_LS_KEY = "nz-web-services-deleted";
const RETENTION_DAYS = 30;

function getDeletedFromLS(): DeletedServiceRow[] {
  try {
    const raw = localStorage.getItem(DELETED_LS_KEY);
    const items: DeletedServiceRow[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000;
    return items.filter(i => i.deletedAt > cutoff);
  } catch {
    return [];
  }
}

function saveDeletedToLS(items: DeletedServiceRow[]) {
  localStorage.setItem(DELETED_LS_KEY, JSON.stringify(items));
}

export function fetchDeletedServices(): DeletedServiceRow[] {
  return getDeletedFromLS();
}

export function restoreService(id: string): void {
  const bin = getDeletedFromLS();
  const item = bin.find(s => s.id === id);
  if (!item) return;
  const { deletedAt, ...service } = item;
  const services = getFromLS();
  services.push(service);
  saveToLS(services);
  saveDeletedToLS(bin.filter(s => s.id !== id));
}

export function permanentlyDeleteService(id: string): void {
  const bin = getDeletedFromLS().filter(s => s.id !== id);
  saveDeletedToLS(bin);
}
