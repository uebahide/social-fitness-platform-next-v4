create or replace function public.create_message_notifications()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
declare
  v_actor_display_name text;
  v_actor_image_path text;
  v_message_preview text;
begin
  select
    p.display_name,
    p.image_path
  into
    v_actor_display_name,
    v_actor_image_path
  from public.profiles p
  where p.id = new.user_id;

  v_message_preview :=
    case
      when new.type = 'text' then left(coalesce(new.body, ''), 80)
      when new.type = 'image' then 'Sent an image'
      when new.type = 'emoji' then left(coalesce(new.body, ''), 80)
      else null
    end;

  insert into public.notifications (
    type,
    recipient_user_id,
    actor_user_id,
    message_id,
    room_id,
    actor_display_name,
    actor_image_path,
    message_preview,
    message_type
  )
  select
    'message'::public.notification_type,
    ru.user_id,
    new.user_id,
    new.id,
    new.room_id,
    coalesce(v_actor_display_name, 'Unknown user'),
    v_actor_image_path,
    v_message_preview,
    new.type
  from public.room_user ru
  where ru.room_id = new.room_id
    and ru.user_id <> new.user_id;

  return null;
end;
$function$;

create or replace function public.notifications_broadcast()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
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
    new,
    null
  );

  return null;
end;
$function$;

drop trigger if exists handle_message_notifications on public.messages;
create trigger handle_message_notifications
after insert on public.messages
for each row
execute function public.create_message_notifications();

drop trigger if exists handle_notifications_broadcast on public.notifications;
create trigger handle_notifications_broadcast
after insert on public.notifications
for each row
execute function public.notifications_broadcast();
