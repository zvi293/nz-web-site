export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  link: string;
  featured: boolean;
}

const API_BASE = "/api/projects";
const LS_KEY = "nz-web-projects";

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "פדות עמרם - סטודיו לעיצוב גבות",
    description: "פיתוח אתר בוטיק הכולל אוטומציה מלאה ליומן תורים, התממשקות למערכות חיצוניות ופאנל ניהול מאובטח.",
    tags: ["מערכת קביעת תורים", "דשבורד ניהול", "עיצוב תדמית"],
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    link: "#",
    featured: true,
  },
  {
    id: "2",
    title: "קליניקה לטיפול רגשי",
    description: "אתר תדמית מקצועי המשלב מערכת חכמה לאיסוף לידים, שליחת טפסים ומיילים אוטומטיים, יחד עם חיבור מהיר לוואטסאפ ושיחה ישירה.",
    tags: ["איסוף לידים חכם", "אוטומציית מיילים", "אתר תדמית"],
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800",
    link: "#",
    featured: true,
  },
];

function getFromLS(): Project[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : defaultProjects;
  } catch {
    return defaultProjects;
  }
}

function saveToLS(projects: Project[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(projects));
}

export async function fetchProjects(): Promise<Project[]> {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    return getFromLS();
  }
}

export async function createProject(project: Omit<Project, "id">): Promise<Project> {
  const newProject: Project = { ...project, id: crypto.randomUUID() };
  try {
    const res = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProject),
    });
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    const projects = getFromLS();
    projects.push(newProject);
    saveToLS(projects);
    return newProject;
  }
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("API unavailable");
    return await res.json();
  } catch {
    const projects = getFromLS();
    const idx = projects.findIndex((p) => p.id === id);
    if (idx !== -1) projects[idx] = { ...projects[idx], ...data };
    saveToLS(projects);
    return projects[idx];
  }
}

export async function deleteProject(id: string): Promise<void> {
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("API unavailable");
  } catch {
    const projects = getFromLS().filter((p) => p.id !== id);
    saveToLS(projects);
  }
}
