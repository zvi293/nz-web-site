import type { Project } from "@/content/types";

// Fresh screenshots of the live sites (shot 2026-11-19): desktop 1440×900 viewport, mobile 390×844.
import ahiaCarsD1600 from "@/assets/projects/ahia-cars-desktop-1600.webp";
import ahiaCarsD960 from "@/assets/projects/ahia-cars-desktop-960.webp";
import ahiaCarsM780 from "@/assets/projects/ahia-cars-mobile-780.webp";
import ahiaCarsM480 from "@/assets/projects/ahia-cars-mobile-480.webp";
import sivanD1600 from "@/assets/projects/sivan-eyebrows-desktop-1600.webp";
import sivanD960 from "@/assets/projects/sivan-eyebrows-desktop-960.webp";
import sivanM780 from "@/assets/projects/sivan-eyebrows-mobile-780.webp";
import sivanM480 from "@/assets/projects/sivan-eyebrows-mobile-480.webp";
import jewishCalendarD1600 from "@/assets/projects/jewish-calendar-desktop-1600.webp";
import jewishCalendarD960 from "@/assets/projects/jewish-calendar-desktop-960.webp";
import jewishCalendarM780 from "@/assets/projects/jewish-calendar-mobile-780.webp";
import jewishCalendarM480 from "@/assets/projects/jewish-calendar-mobile-480.webp";
import carmitD1600 from "@/assets/projects/carmit-therapy-desktop-1600.webp";
import carmitD960 from "@/assets/projects/carmit-therapy-desktop-960.webp";
import carmitM780 from "@/assets/projects/carmit-therapy-mobile-780.webp";
import carmitM480 from "@/assets/projects/carmit-therapy-mobile-480.webp";
import mentorD1600 from "@/assets/projects/mentor-moshe-desktop-1600.webp";
import mentorD960 from "@/assets/projects/mentor-moshe-desktop-960.webp";
import mentorM780 from "@/assets/projects/mentor-moshe-mobile-780.webp";
import mentorM480 from "@/assets/projects/mentor-moshe-mobile-480.webp";
import browsD1600 from "@/assets/projects/brows-studio-desktop-1600.webp";
import browsD960 from "@/assets/projects/brows-studio-desktop-960.webp";
import browsM780 from "@/assets/projects/brows-studio-mobile-780.webp";
import browsM480 from "@/assets/projects/brows-studio-mobile-480.webp";

/** Desktop (16:10) and mobile (390×844) screenshots of a live site, as WebP imports. */
export interface ProjectShots {
  desktop: { src1600: string; src960: string; width: number; height: number };
  mobile: { src780: string; src480: string; width: number; height: number };
}

/** A portfolio entry with the extra fields the gallery uses (museum label + screenshots). */
export interface PortfolioProject extends Project {
  /** תחום: the client's field, shown on the museum label. */
  field: string;
  /** The "medium" line of the museum label, e.g. "אתר תדמית · מערכת תורים". */
  medium: string;
  /** Screenshots; absent for unpublished entries without a current shot. */
  shots?: ProjectShots;
}

const shots = (d1600: string, d960: string, m780: string, m480: string): ProjectShots => ({
  desktop: { src1600: d1600, src960: d960, width: 1600, height: 1000 },
  mobile: { src780: m780, src480: m480, width: 780, height: 1688 },
});

/**
 * Portfolio projects (real, live sites only). Ordered best first.
 * `image` keeps pointing at the desktop 960 shot so code that reads `Project.image` still works.
 */
export const projects: PortfolioProject[] = [
  {
    id: "ahia-cars",
    title: "יועץ רכב אישי",
    description:
      "אתר ליועץ שמלווה קניית רכב יד 2 מהשיחה הראשונה ועד קבלת המפתח: הסבר על תהליך הליווי בארבעה שלבים, מה נבדק ברכב לפני קנייה, מדריכים ופנייה ישירה.",
    tags: ["אתר תדמית", "תהליך עבודה", "מדריכים"],
    field: "ייעוץ וליווי בקניית רכב",
    medium: "אתר תדמית · תהליך עבודה · מדריכים",
    image: ahiaCarsD960,
    shots: shots(ahiaCarsD1600, ahiaCarsD960, ahiaCarsM780, ahiaCarsM480),
    link: "https://ahia-cars.co.il/",
    featured: true,
    published: true,
    order: 0,
  },
  {
    id: "sivan-eyebrows",
    title: "סיון חן: איפור קבוע ואקדמיה",
    description:
      "אתר תדמית לסטודיו ולאקדמיה לאיפור קבוע בפתח תקווה: עמודי טיפולים ומסלולי לימוד, גלריית עבודות ותיאום תורים ישיר בוואטסאפ.",
    tags: ["אתר תדמית", "גלריית עבודות", "אקדמיה וקורסים"],
    field: "איפור קבוע ועיצוב גבות",
    medium: "אתר תדמית · גלריה · אקדמיה",
    image: sivanD960,
    shots: shots(sivanD1600, sivanD960, sivanM780, sivanM480),
    link: "https://sivan-eyebrows.co.il/",
    featured: true,
    published: true,
    order: 1,
  },
  {
    id: "jewish-calendar",
    title: "הלוח היהודי",
    description:
      "לוח שנה עברי-לועזי עם זמני שבת, זמני היום, מועדים ותפילות, ולצדם לימוד יומי וסדר לימוד אישי. אפשר להתקין אותו למסך הבית.",
    tags: ["אפליקציית רשת", "זמני היום", "לוח שנה"],
    field: "לוח שנה וזמני הלכה",
    medium: "אפליקציית רשת · ניתנת להתקנה",
    image: jewishCalendarD960,
    shots: shots(jewishCalendarD1600, jewishCalendarD960, jewishCalendarM780, jewishCalendarM480),
    link: "https://jewishcalendar.co.il/",
    featured: true,
    published: true,
    order: 2,
  },
  {
    id: "carmit-therapy",
    title: "קליניקה לטיפול רגשי לילדים",
    description:
      "אתר לקליניקה לטיפול רגשי לילדים ולנוער בפתח תקווה: הגישה הטיפולית והשיטות, למי הטיפול מתאים, מאמרים ושאלות נפוצות, וקביעת שיחת היכרות.",
    tags: ["אתר תדמית", "מאמרים", "קביעת שיחה"],
    field: "טיפול רגשי לילדים ונוער",
    medium: "אתר תדמית · מאמרים · שאלות נפוצות",
    image: carmitD960,
    shots: shots(carmitD1600, carmitD960, carmitM780, carmitM480),
    link: "https://carmit-therapy.com/",
    featured: true,
    published: true,
    order: 3,
  },
  {
    id: "mentor-moshe",
    title: "מנטור והעצמה אישית",
    description:
      "אתר למנטור ומרצה בתחום ההתפתחות האישית: הרצאות, סדנאות ותוכניות ליווי, גלריה, ולכל מסלול כפתור וואטסאפ ישיר.",
    tags: ["אתר תדמית", "הרצאות וסדנאות", "וואטסאפ"],
    field: "התפתחות אישית והרצאות",
    medium: "אתר תדמית · מסלולי עבודה · גלריה",
    image: mentorD960,
    shots: shots(mentorD1600, mentorD960, mentorM780, mentorM480),
    link: "https://mentor-moshe.netlify.app/",
    featured: false,
    published: true,
    order: 4,
  },
  {
    id: "brows-studio",
    title: "סטודיו לעיצוב גבות",
    description:
      "אתר למעצבת גבות וטיפוח פנים בראש העין: רשימת שירותים, המלצות לקוחות ופנייה ישירה בוואטסאפ או בחיוג.",
    tags: ["אתר תדמית", "רשימת שירותים", "וואטסאפ"],
    field: "עיצוב גבות וטיפוח פנים",
    medium: "אתר תדמית · שירותים · המלצות",
    image: browsD960,
    shots: shots(browsD1600, browsD960, browsM780, browsM480),
    link: "https://remarkable-capybara-268435.netlify.app/",
    featured: false,
    published: true,
    order: 5,
  },
  {
    // Hidden: the live site (sweet-event.netlify.app) is now in Spanish and its hero is a
    // photo of a child; it does not hold up next to the rest of the collection.
    id: "sweet-event",
    title: "מעצבת אירועים",
    description: "אתר תדמית למעצבת אירועים, עוגות וקינוחים בהתאמה אישית, בעיצוב חגיגי שמציג את העבודות.",
    tags: ["אתר תדמית", "גלריה", "אירועים"],
    field: "עיצוב אירועים",
    medium: "אתר תדמית · גלריה",
    image: "",
    link: "https://sweet-event.netlify.app/",
    featured: false,
    published: false,
    order: 6,
  },
  {
    // Hidden: the domain has expired (torahmeira.com shows "Your domain is expired").
    id: "torah-meira",
    title: "נקודות מתורה מאירה",
    description: "אתר שיעורי תורה שמתעדכן אוטומטית מערוץ היוטיוב והרשתות החברתיות של הפרויקט.",
    tags: ["תוכן דינמי", "אתר הנצחה"],
    field: "שיעורי תורה",
    medium: "אתר תוכן",
    image: "",
    link: "https://torahmeira.com/",
    featured: false,
    published: false,
    order: 7,
  },
];

export const publishedProjects = projects
  .filter((project) => project.published)
  .sort((a, b) => a.order - b.order);

export const featuredProjects = publishedProjects.filter((project) => project.featured);
