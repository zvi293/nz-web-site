create table if not exists public.about_content (
  id text primary key default 'default' check (id = 'default'),
  content jsonb not null,
  deleted_items jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_about_content_set_updated_at on public.about_content;

create trigger trg_about_content_set_updated_at
before update on public.about_content
for each row
execute function public.set_updated_at();

alter table public.about_content enable row level security;

insert into public.about_content (id, content, deleted_items)
values (
  'default',
  $about${
  "heroSubtitle": "הסיפור שלנו",
  "heroTitle": "מי אנחנו?",
  "heroDescription": "אנחנו לא סתם בונים אתרים — אנחנו יוצרים נכסים דיגיטליים שמייצרים תוצאות.\nהחזון שלכם פוגש את הטכנולוגיה והעיצוב שלנו, בדרך למוצר מנצח.",
  "heroQuote": "בכל פרויקט שאנחנו בונים, אנחנו משאירים חלק מעצמנו. העיצוב הוא השפה שדרכה אנחנו מספרים לעולם מה באמת חשוב לנו, בלי לומר מילה.",
  "servicesTitle": "השירותים שלנו",
  "columns": [
    {
      "title": "פיתוח ופתרונות טכנולוגיים",
      "items": [
        {
          "title": "פיתוח אתרי Full-Stack",
          "desc": "בניית אפליקציות ווב מקצה לקצה בטכנולוגיות המתקדמות ביותר (React, Node.js)."
        },
        {
          "title": "מערכות ניהול ו-Dashboard",
          "desc": "פיתוח ממשקי ניהול חכמים (Admin Panels) המחוברים למסדי נתונים מתקדמים כמו Supabase."
        },
        {
          "title": "דפי נחיתה ממירים",
          "desc": "עיצוב ובנייה של דפי נחיתה בסטנדרט גבוה, מותאמים לקידום ושיווק דיגיטלי."
        },
        {
          "title": "אינטגרציות API",
          "desc": "חיבור האתר לשירותים חיצוניים, מערכות תשלומים וכלים אוטומטיים לניהול העסק."
        }
      ]
    },
    {
      "title": "עיצוב חוויית משתמש (UX/UI)",
      "items": [
        {
          "title": "עיצוב ממשק משתמש (UI)",
          "desc": "יצירת שפה ויזואלית ייחודית, נקייה ומודרנית שתואמת את ערכי המותג."
        },
        {
          "title": "אפיון חווית משתמש (UX)",
          "desc": "תכנון מסלול לקוח אינטואיטיבי שממקסם המרות ושומר על פשטות תפעולית."
        },
        {
          "title": "התאמה רספונסיבית מלאה",
          "desc": "הבטחה שהאתר ייראה ויעבוד מושלם בכל מכשיר - ממחשב שולחני ועד לסמארטפון."
        },
        {
          "title": "עיצוב אב-טיפוס (Prototyping)",
          "desc": "המחשה ויזואלית של הפרויקט עוד לפני שלב הקוד כדי להבטיח דיוק בציפיות."
        }
      ]
    },
    {
      "title": "פתרונות חכמים ואוטומציות AI",
      "items": [
        {
          "title": "הטמעת צ'אטבוטים מבוססי AI",
          "desc": "שילוב עוזרים חכמים באתר שנותנים מענה ללקוחות 24/7, מבוססים על המידע של העסק שלך."
        },
        {
          "title": "אוטומציה של תהליכי עבודה",
          "desc": "חיבור האתר למערכות חיצוניות (כמו CRM או Google Sheets) כדי לחסוך זמן יקר על משימות ידניות."
        },
        {
          "title": "יצירת תוכן חכם ב-AI",
          "desc": "פיתוח כלים פנימיים המאפשרים לייצר פוסטים, תיאורי מוצרים או מאמרים בלחיצת כפתור אחת."
        },
        {
          "title": "ניהול נתונים מתקדם (Supabase)",
          "desc": "הקמת מסדי נתונים מאובטחים המאפשרים ניהול משתמשים, הרשאות ומידע עסקי רגיש בצורה יעילה."
        },
        {
          "title": "אופטימיזציה למנועי חיפוש (SEO)",
          "desc": "הגדרה טכנית מתקדמת (Indexing) כדי לוודא שהאתר שלך יופיע בתוצאות הראשונות בגוגל."
        },
        {
          "title": "מערכות Dashboards ודוחות",
          "desc": "בניית ממשקים ויזואליים המציגים נתונים בזמן אמת על ביצועי העסק והמכירות."
        }
      ]
    }
  ],
  "visionTitle": "החזון שלכם ראוי לביטוי המדויק ביותר.",
  "visionParagraphs": [
    "אתם חיים את המותג שלכם יום-יום. אתם יודעים בדיוק מה הערך שאתם מביאים לעולם ומכירים את הקהל שלכם הכי טוב שיש. אבל בתוך עומס העשייה, לפעמים קשה לעצור ולזקק את כל זה למשהו ויזואלי, חד ומשכנע. זה טבעי – למי יש זמן לרדת לרמת הפיקסל כשיש עסק לנהל?",
    "ובשביל זה NZ WEB כאן. אנחנו לא רק מעצבים או בונים אתרים; אנחנו חושבים יחד אתכם. אנחנו הופכים רעיונות מורכבים לתוצרים חכמים עם נוכחות – מאתרים וממשקי משתמש ועד למצגות שסוגרות עסקאות. אנחנו כאן כדי לוודא שכל מה שיוצא תחת הידיים שלכם ייראה וידבר בדיוק בשפה שלכם."
  ],
  "ctaTitle": "מוכנים להתחיל?",
  "ctaSubtitle": "צרו איתנו קשר ונבנה יחד משהו שיזכרו",
  "ctaButtonText": "צור קשר",
  "ctaButtonLink": "/contact"
}$about$::jsonb,
  '[]'::jsonb
)
on conflict (id) do nothing;

drop policy if exists "Public can read About content" on public.about_content;
create policy "Public can read About content"
on public.about_content
for select
to anon, authenticated
using (id = 'default');

drop policy if exists "Allowlisted admins can read About content" on public.about_content;
create policy "Allowlisted admins can read About content"
on public.about_content
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Allowlisted admins can insert About content" on public.about_content;
create policy "Allowlisted admins can insert About content"
on public.about_content
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update About content" on public.about_content;
create policy "Allowlisted admins can update About content"
on public.about_content
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

comment on table public.about_content is
'Singleton About / company profile content used by the public About page and admin editor.';
