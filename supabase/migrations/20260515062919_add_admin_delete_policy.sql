create policy "Admins can delete users"
  on public.users
  for delete
  to authenticated
  using (public.is_admin());
