create or replace function public.messages_broadcast()
returns trigger
security definer
language plpgsql
as $$
declare
  room_topic text;
begin
  if TG_OP = 'INSERT' then
    room_topic := 'channel:' || NEW.room_id::text;

    perform realtime.broadcast_changes(
      room_topic,
      'INSERT',
      'INSERT',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      null
    );

  elsif TG_OP = 'UPDATE' then
    room_topic := 'channel:' || NEW.room_id::text;

    perform realtime.broadcast_changes(
      room_topic,
      'UPDATE',
      'UPDATE',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );

  elsif TG_OP = 'DELETE' then
    room_topic := 'channel:' || OLD.room_id::text;

    perform realtime.broadcast_changes(
      room_topic,
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
