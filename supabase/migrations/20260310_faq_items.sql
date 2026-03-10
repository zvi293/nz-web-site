create table if not exists public.faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_faq_items_set_updated_at on public.faq_items;

create trigger trg_faq_items_set_updated_at
before update on public.faq_items
for each row
execute function public.set_updated_at();

create index if not exists idx_faq_items_published_order
on public.faq_items (is_published, display_order, created_at);

alter table public.faq_items enable row level security;

insert into public.faq_items (
  id,
  question,
  answer,
  is_published,
  display_order
)
values
(
  '1',
  'כמה זמן לוקח לבנות אתר ממוצע?',
  'זה מאוד תלוי במורכבות, אבל אתר תדמית או דף נחיתה איכותי בדרך כלל מוכן תוך 7-14 ימי עסקים. פרויקטים מורכבים יותר (Full-Stack) דורשים אפיון מדויק, ואנחנו נבנה יחד לוח זמנים שמתאים לכם.',
  true,
  0
),
(
  '2',
  'האם האתר יהיה נגיש ורספונסיבי?',
  'חד משמעית כן. כל אתר של NZ-web נבנה בסטנדרט "Perfect in every Pixel" – הוא ייראה מדהים בנייד, בטאבלט ובמחשב, ויכלול הצהרת נגישות ותפריט נגישות מלא לפי החוק.',
  true,
  1
),
(
  '3',
  'מה זה אומר אוטומציות AI ואיך זה עוזר לעסק שלי?',
  'אנחנו לא רק בונים אתר, אנחנו בונים כלי עבודה. זה יכול להיות צ''אטבוט חכם שעונה ללקוחות ב-WhatsApp, או מערכת שמעדכנת אתכם אוטומטית על כל ליד חדש. המטרה היא לחסוך לכם זמן יקר על פעולות ידניות.',
  true,
  2
),
(
  '4',
  'באילו טכנולוגיות אתם משתמשים?',
  'אנחנו עובדים עם חזית הטכנולוגיה: React ו-Tailwind CSS לנראות מושלמת, ו-Node.js עם Supabase לניהול נתונים מאובטח ומהיר. הכל כדי שהאתר שלכם יהיה מהיר, יציב וניתן להרחבה בעתיד.',
  true,
  3
),
(
  '5',
  'מה קורה אחרי שהאתר באוויר? אתם נעלמים?',
  'ממש לא. אנחנו מאמינים בשותפות לטווח ארוך. אנחנו כאן לכל עדכון, תחזוקה או הדרכה שתצטרכו כדי לתפעל את האתר בקלות.',
  true,
  4
),
(
  '6',
  'איך נראה תהליך העבודה איתך? מאיפה מתחילים?',
  'הכל מתחיל בשיחת אפיון שבה אנחנו מבינים מה המטרות שלכם. משם אנחנו עוברים לעיצוב (UI/UX), פיתוח הקוד, בדיקות איכות קפדניות ולבסוף – העלאה לאוויר וחגיגות.',
  true,
  5
),
(
  '7',
  'האם אוכל לעדכן תוכן באתר בעצמי?',
  'בטח. אנחנו בונים מערכות ניהול תוכן נוחות (מבוססות Supabase), כך שתוכלו לשנות טקסטים, להוסיף מוצרים או להעלות תמונות בקלות, בלי שום ידע בקוד.',
  true,
  6
),
(
  '8',
  'העיצוב הוא ''תבנית'' או משהו מותאם אישית?',
  'אנחנו לא מאמינים בתבניות משוכפלות. כל אתר ב-NZ-web מקבל טיפול ויזואלי ייחודי לפי עקרונות העיצוב המתקדמים של Styler, כדי לוודא שהמותג שלכם בולט מעל כולם.',
  true,
  7
),
(
  '9',
  'האם האתר יהיה בבעלותי המלאה?',
  'ב-100%. כל הקוד, חשבונות האחסון ומסדי הנתונים הם שלכם. אנחנו רק עוזרים לכם לבנות ולנהל אותם בצורה המקצועית ביותר.',
  true,
  8
),
(
  '10',
  'מה לגבי אבטחת מידע? המידע שלי ושל הלקוחות בטוח?',
  'אבטחה היא בראש סדר העדיפויות שלנו. שימוש בטכנולוגיות כמו Supabase מאפשר לנו להטמיע פרוטוקולי אבטחה מחמירים, ניהול הרשאות והצפנת נתונים ברמה הגבוהה ביותר.',
  true,
  9
),
(
  '11',
  'מה אם בעתיד ארצה להוסיף אפליקציה או חנות לאתר?',
  'זו בדיוק הסיבה שאנחנו עובדים עם React. האתר שלכם נבנה בצורה מודולרית, מה שמאפשר לנו להרחיב אותו בכל רגע נתון – מחנות דיגיטלית ועד למערכת ניהול מורכבת – בלי להרוס את מה שכבר נבנה.',
  true,
  10
)
on conflict (id) do nothing;

drop policy if exists "Public can read published FAQ items" on public.faq_items;
create policy "Public can read published FAQ items"
on public.faq_items
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Allowlisted admins can read FAQ items" on public.faq_items;
create policy "Allowlisted admins can read FAQ items"
on public.faq_items
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Allowlisted admins can insert FAQ items" on public.faq_items;
create policy "Allowlisted admins can insert FAQ items"
on public.faq_items
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update FAQ items" on public.faq_items;
create policy "Allowlisted admins can update FAQ items"
on public.faq_items
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can delete FAQ items" on public.faq_items;
create policy "Allowlisted admins can delete FAQ items"
on public.faq_items
for delete
to authenticated
using (public.is_admin_user());

comment on table public.faq_items is
'Frequently asked questions shown on the public FAQ page and managed through the admin FAQ tab.';
