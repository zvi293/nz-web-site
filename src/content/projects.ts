import type { Project } from "@/content/types";

import carmitTherapy from "@/assets/projects/carmit-therapy.webp";
import browsStudio from "@/assets/projects/brows-studio.webp";
import jewishCalendar from "@/assets/projects/jewish-calendar.webp";
import sweetEvent from "@/assets/projects/sweet-event.webp";
import mentorMoshe from "@/assets/projects/mentor-moshe.webp";
import sivanEyebrows from "@/assets/projects/sivan-eyebrows.webp";

/** Portfolio projects. Add a new entry here (plus its image in src/assets/projects) to publish one. */
export const projects: Project[] = [
  {
    id: "carmit-therapy",
    title: "קליניקה לטיפול רגשי",
    description: "אתר תדמית מקצועי המשלב מערכת חכמה לאיסוף לידים, שליחת טפסים ומיילים אוטומטיים, יחד עם חיבור מהיר לוואטסאפ ושיחה ישירה.",
    tags: [
      "איסוף לידים חכם",
      "אוטומציית מיילים",
      "אתר תדמית"
    ],
    image: carmitTherapy,
    link: "https://carmit-therapy.netlify.app/",
    featured: true,
    published: true,
    order: 0
  },
  {
    id: "brows-studio",
    title: "סטודיו לעיצוב גבות",
    description: "פיתוח אתר בוטיק הכולל אוטומציה מלאה ליומן תורים, התממשקות למערכות חיצוניות ופאנל ניהול מאובטח.",
    tags: [
      "מערכת קביעת תורים",
      "דשבורד ניהול",
      "עיצוב תדמית"
    ],
    image: browsStudio,
    link: "https://remarkable-capybara-268435.netlify.app/",
    featured: false,
    published: true,
    order: 1
  },
  {
    id: "jewish-calendar",
    title: "לוח שנה שנה עברי",
    description: "לוח שנה עברי וזמני היום",
    tags: [
      "לוח שנה",
      "מועדי ישראל",
      "חגים"
    ],
    image: jewishCalendar,
    link: "https://jewishcalendar.netlify.app/",
    featured: false,
    published: true,
    order: 3
  },
  {
    id: "sweet-event",
    title: "מעצבת אירועים",
    description: "אתר מתוק ומעוצב לאירועים, עוגות וקינוחים בהתאמה אישית עם חוויית גלישה חגיגית ומרשימה.",
    tags: [
      "עיצוב",
      "חתונות",
      "ימי הולדת",
      "אתר תדמית"
    ],
    image: sweetEvent,
    link: "https://sweet-event.netlify.app/",
    featured: false,
    published: true,
    order: 4
  },
  {
    id: "mentor-moshe",
    title: "מנטור והעצמה אישית",
    description: "הרצאות, סדנאות ותוכניות ליווי שמייצרות שינוי אמיתי.",
    tags: [
      "מנטור",
      "העצמה אישית",
      "התפתחות"
    ],
    image: mentorMoshe,
    link: "https://mentor-moshe.netlify.app/",
    featured: true,
    published: true,
    order: 5
  },
  {
    id: "sivan-eyebrows",
    title: "סיון חן — איפור קבוע ואקדמיה",
    description:
      "אתר תדמית לסטודיו ולאקדמיה לאיפור קבוע בפתח תקווה: עמודי טיפולים ומסלולי לימוד, גלריית עבודות ותיאום תורים ישיר בוואטסאפ.",
    tags: [
      "אתר תדמית",
      "גלריית עבודות",
      "אקדמיה וקורסים",
    ],
    image: sivanEyebrows,
    link: "https://sivan-eyebrows.co.il/",
    featured: false,
    published: true,
    order: 6
  },
  {
    // Was hidden (unpublished) in the old CMS, so it is not rendered anywhere.
    // Its screenshot was not part of the public content and was not carried over.
    id: "torah-meira",
    title: "נקודות מתורה מאירה",
    description: "שיעורי תורה מועלים באופן אוטומטי ועם חיבור לחשבון היוטיוב והסושיאל של הפרוייקט",
    tags: [
      "תוכן דינמי",
      "אתר הנצחה"
    ],
    image: "",
    link: "https://torahmeira.com/",
    featured: false,
    published: false,
    order: 2
  }
];

export const publishedProjects = projects
  .filter((project) => project.published)
  .sort((a, b) => a.order - b.order);

export const featuredProjects = publishedProjects.filter((project) => project.featured);
