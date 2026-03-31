import { createClient } from "../supabase/server";

export async function getRoomsByUserId(userId: number) {
  const supabase = await createClient();
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(
      "*, users:room_user(...profiles(id, display_name, email, image_path, created_at)), my_filter:room_user!inner()",
    )
    .eq("my_filter.user_id", userId);

  if (roomsError) {
    throw new Error(`Error while fetching rooms: ${roomsError.message}`);
  }

  return rooms;
}
