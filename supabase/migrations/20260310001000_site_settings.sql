create table if not exists public.site_settings (
  id text primary key default 'default' check (id = 'default'),
  settings jsonb not null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_site_settings_set_updated_at on public.site_settings;

create trigger trg_site_settings_set_updated_at
before update on public.site_settings
for each row
execute function public.set_updated_at();

alter table public.site_settings enable row level security;

insert into public.site_settings (id, settings)
values (
  'default',
  $${
    "contact": {
      "ownerName": "צבי משה",
      "phone": "058-7292029",
      "email": "zvi293293@gmail.com",
      "whatsappNumber": "972587292029",
      "whatsappMessage": "היי, הגעתי מהאתר של NZ-WEB ואשמח לשמוע פרטים נוספים על שירותי פיתוח ועיצוב 🚀"
    },
    "seo": {
      "siteTitle": "NZ-WEB | פיתוח ועיצוב אתרים מקצועי",
      "siteDescription": "סטודיו לפיתוח אתרים, עיצוב UI/UX ופתרונות דיגיטליים מתקדמים. Perfect in every Pixel.",
      "keywords": "פיתוח אתרים, עיצוב אתרים, UI UX, React, Full Stack, בניית אתרים",
      "ogImage": ""
    },
    "footer": {
      "tagline": "Perfect in every Pixel",
      "copyrightText": "NZ WEB. כל הזכויות שמורות.",
      "showAdminLink": true
    },
    "social": {
      "facebook": "",
      "instagram": "",
      "linkedin": "",
      "twitter": "",
      "github": "",
      "youtube": ""
    },
    "socialVisibility": {
      "facebook": true,
      "instagram": true,
      "linkedin": true,
      "twitter": true,
      "github": true,
      "youtube": true
    },
    "accessibility": {
      "coordinatorName": "צבי משה",
      "coordinatorPhone": "058-7292029",
      "coordinatorEmail": "zvi293293@gmail.com",
      "lastUpdated": "9 במרץ 2026",
      "sections": [
        { "id": "1", "title": "מבוא", "content": "אנו ב-NZ-web רואים חשיבות עליונה בהנגשת השירותים הדיגיטליים שלנו לכלל האוכלוסייה, ובכלל זה לאנשים עם מוגבלויות." },
        { "id": "2", "title": "סטנדרט הנגישות", "content": "אתר זה עומד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע\"ג-2013. ברמת AA ועל פי הנחיות WCAG 2.1." },
        { "id": "3", "title": "סייגים לנגישות", "content": "אנו משקיעים מאמצים רבים בתחזוקת נגישות האתר. עם זאת, ייתכן שיתגלו דפים או חלקים שטרם הונגשו במלואם." }
      ]
    },
    "privacy": {
      "lastUpdated": "9 במרץ 2026",
      "sections": [
        { "id": "1", "title": "כללי", "content": "אנו ב-NZ-web מכבדים את פרטיות המשתמשים באתר שלנו. מדיניות זו מפרטת כיצד אנו אוספים, משתמשים ומגינים על המידע." },
        { "id": "2", "title": "המידע שאנו אוספים", "content": "מידע אישי שנמסר מרצון בעת מילוי טופס צור קשר. מידע טכני אוטומטי על אופן הגלישה." },
        { "id": "3", "title": "השימוש במידע", "content": "המידע משמש למתן מענה לפניות, ניהול נתונים מאובטח ושיפור ביצועי האתר." },
        { "id": "4", "title": "אבטחת מידע", "content": "אנו מיישמים נהלים ומערכות אבטחה מתקדמות כדי להגן על המידע מפני גישה בלתי מורשית." }
      ]
    },
    "terms": {
      "lastUpdated": "9 במרץ 2026",
      "sections": [
        { "id": "1", "title": "כללי והסכמה לתנאים", "content": "הגלישה והשימוש באתר מהווים הסכמה לתנאים המפורטים במסמך זה." },
        { "id": "2", "title": "השירותים המוצעים", "content": "האתר מספק מידע ושירותים בתחומי פיתוח Full-Stack, עיצוב UI/UX והטמעת פתרונות AI." },
        { "id": "3", "title": "קניין רוחני", "content": "כל הזכויות באתר שמורות. אין להעתיק או להפיץ ללא אישור." },
        { "id": "4", "title": "הגבלת אחריות", "content": "מפעיל האתר לא יישא באחריות לנזק ישיר או עקיף מהסתמכות על מידע המופיע באתר." }
      ]
    }
  }$$::jsonb
)
on conflict (id) do nothing;

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
on public.site_settings
for select
to anon, authenticated
using (id = 'default');

drop policy if exists "Allowlisted admins can insert site settings" on public.site_settings;
create policy "Allowlisted admins can insert site settings"
on public.site_settings
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update site settings" on public.site_settings;
create policy "Allowlisted admins can update site settings"
on public.site_settings
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

comment on table public.site_settings is
'Singleton site-wide settings and branding payload for public runtime reads and allowlisted admin updates.';
