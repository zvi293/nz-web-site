create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text null,
  created_at timestamptz not null default timezone('utc', now())
);

create unique index if not exists idx_admin_users_email_unique
on public.admin_users (lower(email))
where email is not null;

alter table public.admin_users enable row level security;

create or replace function public.is_admin_user(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = coalesce(check_user_id, auth.uid())
  );
$$;

drop policy if exists "Allow users to read own admin record" on public.admin_users;
create policy "Allow users to read own admin record"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated admins can read leads" on public.leads;
drop policy if exists "Authenticated admins can update leads" on public.leads;
drop policy if exists "Authenticated admins can delete leads" on public.leads;

create policy "Allowlisted admins can read leads"
on public.leads
for select
to authenticated
using (public.is_admin_user());

create policy "Allowlisted admins can update leads"
on public.leads
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

create policy "Allowlisted admins can delete leads"
on public.leads
for delete
to authenticated
using (public.is_admin_user());

comment on table public.admin_users is
'Allowlist of Supabase Auth users permitted to access the admin surface.';

comment on function public.is_admin_user(uuid) is
'Checks whether the current authenticated user or the provided user id belongs to public.admin_users.';
