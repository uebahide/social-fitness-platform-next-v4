import { createClient } from "../supabase/server";

export async function getOrCreatePrivateRoom(userId1: number, userId2: number) {
  const supabase = await createClient();
  const { data: roomId, error } = await supabase.rpc(
    "get_or_create_private_room",
    {
      user1_id: userId1,
      user2_id: userId2,
    },
  );

  if (error) {
    throw new Error(error.message);
  }

  return roomId;
}
