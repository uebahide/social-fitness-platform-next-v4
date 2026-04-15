create or replace function public.mark_message_notifications_as_read()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.last_read_message_id is null then
    return null;
  end if;

  if new.last_read_message_id is not distinct from old.last_read_message_id then
    return null;
  end if;

  update public.notifications
  set read_at = now()
  where type = 'message'::public.notification_type
    and recipient_user_id = new.user_id
    and room_id = new.room_id
    and read_at is null
    and message_id is not null
    and message_id <= new.last_read_message_id;

  return null;
end;
$function$;

drop trigger if exists handle_room_user_message_notifications_read on public.room_user;

create trigger handle_room_user_message_notifications_read
after update on public.room_user
for each row
execute function public.mark_message_notifications_as_read();
