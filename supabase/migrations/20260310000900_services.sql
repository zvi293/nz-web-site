create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  badge text not null,
  title text not null,
  body text not null,
  image_url text null,
  video_url text null,
  icon_type text not null check (icon_type in ('lucide', 'svg', 'image')),
  icon_lucide_name text null,
  icon_svg text null,
  icon_image_url text null,
  reverse_layout boolean not null default false,
  tags text[] not null default '{}',
  bg_gradient text not null,
  text_color text not null,
  muted_text_color text not null,
  badge_bg text not null,
  badge_text text not null,
  icon_bg text not null,
  icon_shadow text not null,
  tag_bg text not null,
  tag_text text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  deleted_at timestamptz null,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_services_set_updated_at on public.services;

create trigger trg_services_set_updated_at
before update on public.services
for each row
execute function public.set_updated_at();

create index if not exists idx_services_public_order
on public.services (is_published, deleted_at, display_order, created_at);

create index if not exists idx_services_deleted_at
on public.services (deleted_at);

alter table public.services enable row level security;

insert into public.services (
  id,
  badge,
  title,
  body,
  image_url,
  video_url,
  icon_type,
  icon_lucide_name,
  icon_svg,
  icon_image_url,
  reverse_layout,
  tags,
  bg_gradient,
  text_color,
  muted_text_color,
  badge_bg,
  badge_text,
  icon_bg,
  icon_shadow,
  tag_bg,
  tag_text,
  display_order,
  is_published
)
values
(
  '10000000-0000-0000-0000-000000000001',
  'אפיון חכם',
  'מתכננים להצלחה',
  'הכל מתחיל באפיון מדויק. אנחנו צוללים לעומק העסק שלכם, מבינים את קהל היעד ומתכננים מסע משתמש חכם שמוביל לפעולה. בלי ניחושים, רק אסטרטגיה מבוססת נתונים שמכינה את הקרקע להמרות.',
  null,
  '/videos/service-planning.mp4',
  'lucide',
  'Target',
  null,
  null,
  false,
  array['אסטרטגיה', 'מחקר שוק', 'מסע משתמש'],
  'linear-gradient(135deg, hsl(45 80% 60% / 0.08), hsl(40 85% 60% / 0.12), hsl(45 70% 94%))',
  'hsl(40 50% 18%)',
  'hsl(40 30% 38%)',
  'hsl(45 80% 55% / 0.15)',
  'hsl(45 80% 35%)',
  'hsl(45 80% 50%)',
  '0 8px 30px -4px hsl(45 80% 50% / 0.4)',
  'hsl(45 60% 92%)',
  'hsl(40 50% 30%)',
  1,
  true
),
(
  '10000000-0000-0000-0000-000000000002',
  'עיצוב UI/UX',
  'כשנראים טוב - מוכרים טוב',
  'אנחנו הפסגה של עיצוב חוויות דיגיטליות. עיצוב עוצר נשימה הוא לא רק יופי, הוא כלי מכירתי עוצמתי. אנחנו דואגים שהגולשים יחוו חוויה ייחודית ובלתי נשכחת שתבליט אתכם מעל כל המתחרים.',
  null,
  '/videos/service-uiux.mp4',
  'lucide',
  'Palette',
  null,
  null,
  true,
  array['עיצוב', 'חווית משתמש', 'יוקרה'],
  'linear-gradient(135deg, hsl(270 60% 96%), hsl(300 50% 94% / 0.8), hsl(330 60% 95% / 0.6))',
  'hsl(270 40% 20%)',
  'hsl(270 25% 42%)',
  'hsl(270 60% 60% / 0.15)',
  'hsl(270 60% 45%)',
  'hsl(270 60% 58%)',
  '0 8px 30px -4px hsl(270 60% 58% / 0.4)',
  'hsl(270 40% 93%)',
  'hsl(270 40% 35%)',
  2,
  true
),
(
  '10000000-0000-0000-0000-000000000003',
  'פיתוח ומוצר מוגמר',
  'בונים מוצר מוגמר שמביא כסף',
  'אנחנו מתרגמים את העיצוב לקוד נקי, מהיר ומתקדם. התוצאה? אתר עובד, יציב ומוכן לקלוט טראפיק ולהפוך אותו ללקוחות משלמים. אתם מקבלים מוצר מוגמר, מא׳ ועד ת׳, שמייצר לכם שקט נפשי והכנסות.',
  null,
  '/videos/service-dev.mp4',
  'lucide',
  'Code2',
  null,
  null,
  false,
  array['פיתוח', 'ביצועים', 'סקיילינג'],
  'linear-gradient(135deg, hsl(160 50% 95%), hsl(170 60% 92% / 0.8), hsl(190 50% 93% / 0.6))',
  'hsl(170 40% 16%)',
  'hsl(170 25% 38%)',
  'hsl(170 60% 45% / 0.15)',
  'hsl(170 60% 32%)',
  'hsl(170 60% 42%)',
  '0 8px 30px -4px hsl(170 60% 42% / 0.4)',
  'hsl(170 40% 92%)',
  'hsl(170 40% 30%)',
  3,
  true
),
(
  '10000000-0000-0000-0000-000000000004',
  'קידום אורגני',
  'SEO שמביא תוצאות אמיתיות',
  'אנחנו דואגים שהאתר שלכם יופיע בראש תוצאות החיפוש. מחקר מילות מפתח מעמיק, אופטימיזציה טכנית, תוכן ממוקד ובניית קישורים חכמה - הכל כדי שהלקוחות ימצאו אתכם לפני המתחרים.',
  null,
  '/videos/service-seo.mp4',
  'lucide',
  'Search',
  null,
  null,
  true,
  array['SEO', 'קידום אורגני', 'מילות מפתח'],
  'linear-gradient(135deg, hsl(210 90% 94%), hsl(200 85% 90% / 0.8), hsl(220 70% 95% / 0.6))',
  'hsl(210 50% 18%)',
  'hsl(210 30% 40%)',
  'hsl(210 80% 55% / 0.15)',
  'hsl(210 80% 40%)',
  'hsl(210 80% 52%)',
  '0 8px 30px -4px hsl(210 80% 52% / 0.4)',
  'hsl(210 50% 92%)',
  'hsl(210 50% 30%)',
  4,
  true
)
on conflict (id) do nothing;

drop policy if exists "Public can read published services" on public.services;
create policy "Public can read published services"
on public.services
for select
to anon, authenticated
using (is_published = true and deleted_at is null);

drop policy if exists "Allowlisted admins can read all services" on public.services;
create policy "Allowlisted admins can read all services"
on public.services
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Allowlisted admins can insert services" on public.services;
create policy "Allowlisted admins can insert services"
on public.services
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update services" on public.services;
create policy "Allowlisted admins can update services"
on public.services
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can delete services" on public.services;
create policy "Allowlisted admins can delete services"
on public.services
for delete
to authenticated
using (public.is_admin_user());

comment on table public.services is
'Services shown on the public site and managed through the admin services tab.';
