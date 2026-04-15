create or replace function public.create_message_notifications()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.notifications (
    type,
    recipient_user_id,
    actor_user_id,
    message_id,
    room_id
  )
  select
    'message'::public.notification_type,
    ru.user_id,
    new.user_id,
    new.id,
    new.room_id
  from public.room_user ru
  where ru.room_id = new.room_id
    and ru.user_id <> new.user_id;

  return null;
end;
$$;

create trigger handle_message_notifications
after insert on public.messages
for each row
execute function public.create_message_notifications();
