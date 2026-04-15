create or replace function public.notifications_broadcast()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  notification_topic text;
begin
  notification_topic := 'notification:' || new.recipient_user_id::text;

  perform realtime.broadcast_changes(
    notification_topic,
    'INSERT',
    'INSERT',
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    null
  );

  return null;
end;
$$;

drop trigger if exists handle_notifications_broadcast on public.notifications;

create trigger handle_notifications_broadcast
after insert on public.notifications
for each row
execute function public.notifications_broadcast();
