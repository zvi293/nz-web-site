do $$
declare
  constraint_name text;
begin
  select con.conname
  into constraint_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  join pg_namespace nsp on nsp.oid = con.connamespace
  where nsp.nspname = 'public'
    and rel.relname = 'leads'
    and pg_get_constraintdef(con.oid) like '%char_length(btrim(subject)) between 5 and 200%';

  if constraint_name is not null then
    execute format('alter table public.leads drop constraint %I', constraint_name);
  end if;
end $$;

do $$
begin
  if not exists (
    select 1
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace nsp on nsp.oid = con.connamespace
    where nsp.nspname = 'public'
      and rel.relname = 'leads'
      and con.conname = 'leads_subject_max_length_check'
  ) then
    alter table public.leads
    add constraint leads_subject_max_length_check
    check (char_length(btrim(subject)) <= 200);
  end if;
end $$;
