
  create policy "Enable insert for authenticated users only"
  on "public"."faculties"
  as permissive
  for insert
  to authenticated
with check (true);



  create policy "Enable select for authenticated users only"
  on "public"."faculties"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Enable update for authenticated users only"
  on "public"."faculties"
  as permissive
  for update
  to authenticated
using (true);



