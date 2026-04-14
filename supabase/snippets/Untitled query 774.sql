create policy "users can receive own notification broadcasts"
on realtime.messages
for select
to authenticated
using (
  realtime.messages.extension = 'broadcast'
  and exists (
    select 1
    from public.profiles p
    where p.user_id = auth.uid()
      and ('notification:' || p.id::text) = realtime.topic()
  )
);