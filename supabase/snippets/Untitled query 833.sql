drop trigger if exists handle_room_user_read_update on public.room_user;

create trigger handle_room_user_read_update
after update on public.room_user
for each row
execute function public.room_user_read_broadcast();
