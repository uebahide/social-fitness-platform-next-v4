insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('messages', 'messages', true)
on conflict (id) do update
set
  name = excluded.name,
  public = excluded.public;

drop policy if exists "Allow users all actions 1oj01fe_0" on storage.objects;
drop policy if exists "Allow users all actions 1oj01fe_1" on storage.objects;
drop policy if exists "Allow users all actions 1oj01fe_2" on storage.objects;
drop policy if exists "Allow users all actions 1oj01fe_3" on storage.objects;

drop policy if exists "all 1rdzryk_0" on storage.objects;
drop policy if exists "all 1rdzryk_1" on storage.objects;
drop policy if exists "all 1rdzryk_2" on storage.objects;
drop policy if exists "all 1rdzryk_3" on storage.objects;

drop policy if exists "avatars public read" on storage.objects;
drop policy if exists "avatars authenticated insert" on storage.objects;
drop policy if exists "avatars authenticated update" on storage.objects;
drop policy if exists "avatars authenticated delete" on storage.objects;

drop policy if exists "messages public read" on storage.objects;
drop policy if exists "messages authenticated insert" on storage.objects;
drop policy if exists "messages authenticated update" on storage.objects;
drop policy if exists "messages authenticated delete" on storage.objects;

create policy "avatars public read"
on storage.objects
as permissive
for select
to public
using (bucket_id = 'avatars');

create policy "avatars authenticated insert"
on storage.objects
as permissive
for insert
to authenticated
with check (bucket_id = 'avatars');

create policy "avatars authenticated update"
on storage.objects
as permissive
for update
to authenticated
using (bucket_id = 'avatars')
with check (bucket_id = 'avatars');

create policy "avatars authenticated delete"
on storage.objects
as permissive
for delete
to authenticated
using (bucket_id = 'avatars');

create policy "messages public read"
on storage.objects
as permissive
for select
to public
using (bucket_id = 'messages');

create policy "messages authenticated insert"
on storage.objects
as permissive
for insert
to authenticated
with check (bucket_id = 'messages');

create policy "messages authenticated update"
on storage.objects
as permissive
for update
to authenticated
using (bucket_id = 'messages')
with check (bucket_id = 'messages');

create policy "messages authenticated delete"
on storage.objects
as permissive
for delete
to authenticated
using (bucket_id = 'messages');
