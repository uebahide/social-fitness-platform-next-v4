drop trigger if exists handle_message_reactions_change on public.message_reactions;
drop trigger if exists handle_message_reactions_insert on public.message_reactions;

create trigger handle_message_reactions_change
after insert or update or delete on public.message_reactions
for each row
execute function public.message_reactions_broadcast();
