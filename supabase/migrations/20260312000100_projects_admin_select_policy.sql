drop policy if exists "Allowlisted admins can read all projects" on public.projects;

create policy "Allowlisted admins can read all projects"
on public.projects
for select
to authenticated
using (public.is_admin_user());
