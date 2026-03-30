create or replace function public.message_reactions_broadcast()
returns trigger
security definer
language plpgsql
as $$
declare
  target_room_id bigint;
begin
  select m.room_id
    into target_room_id
  from public.messages m
  where m.id = NEW.message_id;

  if target_room_id is null then
    return null;
  end if;

  perform realtime.broadcast_changes(
    'channel:' || target_room_id::text || ':reactions',
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
