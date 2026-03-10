create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'lead_status'
  ) then
    create type public.lead_status as enum ('pending', 'handled', 'rejected');
  end if;
end $$;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  deleted_at timestamptz null,
  name text not null check (char_length(btrim(name)) between 2 and 50),
  email text not null check (char_length(btrim(email)) <= 100),
  phone text not null check (char_length(btrim(phone)) between 9 and 15),
  company_name text null check (company_name is null or char_length(btrim(company_name)) <= 100),
  subject text not null check (char_length(btrim(subject)) between 5 and 200),
  send_method text not null check (send_method in ('whatsapp', 'email')),
  status public.lead_status not null default 'pending',
  notes text null,
  constraint leads_email_format check (email ~* '^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$'),
  constraint leads_phone_format check (phone ~ '^[0-9\-\+\(\)\s]+$')
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists trg_leads_set_updated_at on public.leads;

create trigger trg_leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

create index if not exists idx_leads_created_at on public.leads (created_at desc);
create index if not exists idx_leads_status on public.leads (status);
create index if not exists idx_leads_deleted_at on public.leads (deleted_at);
create index if not exists idx_leads_active_created_at on public.leads (created_at desc) where deleted_at is null;
create index if not exists idx_leads_deleted_created_at on public.leads (deleted_at desc) where deleted_at is not null;

alter table public.leads enable row level security;

drop policy if exists "Public can insert leads" on public.leads;
create policy "Public can insert leads"
on public.leads
for insert
to anon, authenticated
with check (true);

drop policy if exists "Authenticated admins can read leads" on public.leads;
create policy "Authenticated admins can read leads"
on public.leads
for select
to authenticated
using (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "Authenticated admins can update leads" on public.leads;
create policy "Authenticated admins can update leads"
on public.leads
for update
to authenticated
using (auth.jwt() ->> 'role' = 'admin')
with check (auth.jwt() ->> 'role' = 'admin');

drop policy if exists "Authenticated admins can delete leads" on public.leads;
create policy "Authenticated admins can delete leads"
on public.leads
for delete
to authenticated
using (auth.jwt() ->> 'role' = 'admin');

comment on policy "Authenticated admins can read leads" on public.leads is
'Phase 3 should replace this JWT role check with the project''s real admin auth model.';
