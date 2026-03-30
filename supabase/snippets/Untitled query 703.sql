create or replace function public.message_reactions_broadcast()
returns trigger
security definer
language plpgsql
as $$
declare
  target_room_id bigint;
begin
  if TG_OP = 'INSERT' then
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

  elsif TG_OP = 'UPDATE' then
    select m.room_id
      into target_room_id
    from public.messages m
    where m.id = NEW.message_id;

    if target_room_id is null then
      return null;
    end if;

    perform realtime.broadcast_changes(
      'channel:' || target_room_id::text || ':reactions',
      'UPDATE',
      'UPDATE',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );

  elsif TG_OP = 'DELETE' then
    select m.room_id
      into target_room_id
    from public.messages m
    where m.id = OLD.message_id;

    if target_room_id is null then
      return null;
    end if;

    perform realtime.broadcast_changes(
      'channel:' || target_room_id::text || ':reactions',
      'DELETE',
      'DELETE',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      null,
      OLD
    );
  end if;

  return null;
end;
$$;
