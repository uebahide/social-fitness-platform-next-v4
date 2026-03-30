create or replace function public.room_user_read_broadcast()
returns trigger
security definer
language plpgsql
as $$
begin
  if NEW.last_read_message_id is distinct from OLD.last_read_message_id then
    perform realtime.broadcast_changes(
      'channel:' || NEW.room_id::text || ':read_status',
      'READ_UPDATE',
      'UPDATE',
      TG_TABLE_NAME,
      TG_TABLE_SCHEMA,
      NEW,
      OLD
    );
  end if;

  return null;
end;
$$;
