drop trigger if exists handle_messages_change on public.messages;
drop trigger if exists handle_messages_insert on public.messages;

create trigger handle_messages_change
after insert or update or delete on public.messages
for each row
execute function public.messages_broadcast();
