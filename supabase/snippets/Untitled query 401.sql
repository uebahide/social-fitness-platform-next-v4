create or replace function public.create_friend_request_notifications()
returns trigger
security definer
language plpgsql
set search_path = ''
as $$
declare
  v_actor_display_name text;
  v_actor_image_path text;
begin
  if new.status <> 'pending' then
    return null;
  end if;

  select
    p.display_name,
    p.image_path
  into
    v_actor_display_name,
    v_actor_image_path
  from public.profiles p
  where p.id = new.sender_id;

  insert into public.notifications (
    type,
    recipient_user_id,
    actor_user_id,
    friend_request_id,
    actor_display_name,
    actor_image_path,
    message_preview
  )
  values (
    'friend_request'::public.notification_type,
    new.receiver_id,
    new.sender_id,
    new.id,
    coalesce(v_actor_display_name, 'Unknown user'),
    v_actor_image_path,
    'sent you a friend request'
  );

  return null;
end;
$$;

drop trigger if exists handle_friend_request_notifications on public.friend_requests;

create trigger handle_friend_request_notifications
after insert on public.friend_requests
for each row
execute function public.create_friend_request_notifications();

create or replace function public.notifications_broadcast()
returns trigger
security definer
language plpgsql
set search_path = ''
as $$
declare
  notification_topic text;
begin
  if tg_op = 'INSERT' then
    notification_topic := 'notification:' || new.recipient_user_id::text;

    perform realtime.broadcast_changes(
      notification_topic,
      'INSERT',
      'INSERT',
      tg_table_name,
      tg_table_schema,
      new,
      null
    );

  elsif tg_op = 'UPDATE' then
    notification_topic := 'notification:' || new.recipient_user_id::text;

    perform realtime.broadcast_changes(
      notification_topic,
      'UPDATE',
      'UPDATE',
      tg_table_name,
      tg_table_schema,
      new,
      old
    );
  end if;

  return null;
end;
$$;

drop trigger if exists handle_notifications_broadcast on public.notifications;

create trigger handle_notifications_broadcast
after insert or update on public.notifications
for each row
execute function public.notifications_broadcast();
