create or replace function public.handle_friend_request_acceptance_notifications()
returns trigger
security definer
language plpgsql
set search_path = ''
as $$
declare
  v_actor_display_name text;
  v_actor_image_path text;
begin
  if new.status is not distinct from old.status then
    return null;
  end if;

  update public.notifications
  set read_at = now()
  where type = 'friend_request'::public.notification_type
    and friend_request_id = new.id
    and recipient_user_id = new.receiver_id
    and read_at is null;

  if new.status <> 'accepted' then
    return null;
  end if;

  select
    p.display_name,
    p.image_path
  into
    v_actor_display_name,
    v_actor_image_path
  from public.profiles p
  where p.id = new.receiver_id;

  insert into public.notifications (
    type,
    recipient_user_id,
    actor_user_id,
    friend_request_id,
    actor_display_name,
    actor_image_path,
    message_preview,
    read_at
  )
  values (
    'friend_request_accepted'::public.notification_type,
    new.sender_id,
    new.receiver_id,
    new.id,
    coalesce(v_actor_display_name, 'Unknown user'),
    v_actor_image_path,
    'accepted your friend request',
    null
  )
  on conflict (friend_request_id, type)
  where friend_request_id is not null
  do nothing;

  return null;
end;
$$;
