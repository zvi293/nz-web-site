alter table public.leads
add column if not exists inquiry_type text null
check (inquiry_type is null or char_length(btrim(inquiry_type)) <= 80);
