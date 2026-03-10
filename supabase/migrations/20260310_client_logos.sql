create table if not exists public.client_logos (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text not null,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

drop trigger if exists trg_client_logos_set_updated_at on public.client_logos;

create trigger trg_client_logos_set_updated_at
before update on public.client_logos
for each row
execute function public.set_updated_at();

create index if not exists idx_client_logos_published_order
on public.client_logos (is_published, display_order, created_at);

alter table public.client_logos enable row level security;

insert into public.client_logos (
  id,
  name,
  image_url,
  display_order,
  is_published
)
values
  ('20000000-0000-0000-0000-000000000001', 'Google', 'https://logo.clearbit.com/google.com', 0, true),
  ('20000000-0000-0000-0000-000000000002', 'Microsoft', 'https://logo.clearbit.com/microsoft.com', 1, true),
  ('20000000-0000-0000-0000-000000000003', 'Apple', 'https://logo.clearbit.com/apple.com', 2, true),
  ('20000000-0000-0000-0000-000000000004', 'Amazon', 'https://logo.clearbit.com/amazon.com', 3, true),
  ('20000000-0000-0000-0000-000000000005', 'Meta', 'https://logo.clearbit.com/meta.com', 4, true),
  ('20000000-0000-0000-0000-000000000006', 'Netflix', 'https://logo.clearbit.com/netflix.com', 5, true),
  ('20000000-0000-0000-0000-000000000007', 'Spotify', 'https://logo.clearbit.com/spotify.com', 6, true),
  ('20000000-0000-0000-0000-000000000008', 'Adobe', 'https://logo.clearbit.com/adobe.com', 7, true),
  ('20000000-0000-0000-0000-000000000009', 'Stripe', 'https://logo.clearbit.com/stripe.com', 8, true),
  ('20000000-0000-0000-0000-000000000010', 'Shopify', 'https://logo.clearbit.com/shopify.com', 9, true)
on conflict (id) do nothing;

drop policy if exists "Public can read published client logos" on public.client_logos;
create policy "Public can read published client logos"
on public.client_logos
for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Allowlisted admins can read client logos" on public.client_logos;
create policy "Allowlisted admins can read client logos"
on public.client_logos
for select
to authenticated
using (public.is_admin_user());

drop policy if exists "Allowlisted admins can insert client logos" on public.client_logos;
create policy "Allowlisted admins can insert client logos"
on public.client_logos
for insert
to authenticated
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can update client logos" on public.client_logos;
create policy "Allowlisted admins can update client logos"
on public.client_logos
for update
to authenticated
using (public.is_admin_user())
with check (public.is_admin_user());

drop policy if exists "Allowlisted admins can delete client logos" on public.client_logos;
create policy "Allowlisted admins can delete client logos"
on public.client_logos
for delete
to authenticated
using (public.is_admin_user());

comment on table public.client_logos is
'Client logos shown on the public homepage and managed in the admin portfolio.';
