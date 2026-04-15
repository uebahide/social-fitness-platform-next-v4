-- create type public.notification_type as enum (
--   'message',
--   'friend_request',
-- );

alter type public.notification_type
add value if not exists 'friend_request_accepted';
