import { createClient } from "../supabase/server";

export async function getFriendLastReadMessageIdsByRoom(
  userId: number,
  roomIds: number[],
) {
  const supabase = await createClient();
  const {
    data: friendLastReadMessageIdsByRoom,
    error: friendLastReadMessageIdsByRoomError,
  } = await supabase
    .from("room_user")
    .select("room_id, last_read_message_id")
    .in("room_id", roomIds)
    .neq("user_id", userId);

  if (friendLastReadMessageIdsByRoomError) {
    throw new Error(
      `Error while fetching friend last read message id by room: ${friendLastReadMessageIdsByRoomError.message}`,
    );
  }

  return friendLastReadMessageIdsByRoom;
}
