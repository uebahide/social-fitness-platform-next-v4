alter table "public"."notifications" drop constraint "notifications_friend_request_id_key";

drop index if exists "public"."notifications_friend_request_id_key";

alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('message', 'friend_request', 'friend_request_accepted');

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."notification_type__old_version_to_be_dropped";

CREATE UNIQUE INDEX notifications_friend_request_id_type_key ON public.notifications USING btree (friend_request_id, type) WHERE (friend_request_id IS NOT NULL);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_friend_request_acceptance_notifications()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
declare
  v_actor_display_name text;
  v_actor_image_path text;
begin
  if new.status is not distinct from old.status then
    return null;
  end if;

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

  update public.notifications
  set read_at = now()
  where type = 'friend_request'::public.notification_type
    and friend_request_id = new.id
    and recipient_user_id = new.receiver_id
    and read_at is null;

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
$function$
;

CREATE TRIGGER handle_friend_request_acceptance_notifications AFTER UPDATE ON public.friend_requests FOR EACH ROW EXECUTE FUNCTION public.handle_friend_request_acceptance_notifications();


