create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  tags text[] not null default '{}',
  image_url text null,
  project_url text null,
  is_featured boolean not null default false,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_projects_set_updated_at on public.projects;

create trigger trg_projects_set_updated_at
before update on public.projects
for each row
execute function public.set_updated_at();

create index if not exists idx_projects_published_order
on public.projects (is_published, display_order, created_at);

create index if not exists idx_projects_featured_published
on public.projects (is_featured, is_published);

alter table public.projects enable row level security;

insert into public.projects (
  id,
  title,
  description,
  tags,
  image_url,
  project_url,
  is_featured,
  is_published,
  display_order
)
values
(
  '00000000-0000-0000-0000-000000000001',
  'פדות עמרם - סטודיו לעיצוב גבות',
  'פיתוח אתר בוטיק הכולל אוטומציה מלאה ליומן תורים, התממשקות למערכות חיצוניות ופאנל ניהול מאובטח.',
  array['מערכת קביעת תורים', 'דשבורד ניהול', 'עיצוב תדמית'],
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  '#',
  true,
  true,
  0
),
(
  '00000000-0000-0000-0000-000000000002',
  'קליניקה לטיפול רגשי',
  'אתר תדמית מקצועי המשלב מערכת חכמה לאיסוף לידים, שליחת טפסים ומיילים אוטומטיים, יחד עם חיבור מהיר לוואטסאפ ושיחה ישירה.',
  array['איסוף לידים חכם', 'אוטומציית מיילים', 'אתר תדמית'],
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
  '#',
  true,
  true,
  1
)
on conflict (id) do nothing;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Allowlisted admins can insert projects" on public.projects;
create policy "Allowlisted admins can insert projects"
on public.projects
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update projects" on public.projects;
create policy "Allowlisted admins can update projects"
on public.projects
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can delete projects" on public.projects;
create policy "Allowlisted admins can delete projects"
on public.projects
for delete
to authenticated
using (public.is_admin_user());

comment on table public.projects is
'Portfolio projects used by the public site and admin portfolio management.';
