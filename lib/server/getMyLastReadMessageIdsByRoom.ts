import { createClient } from "../supabase/server";

export async function getMyLastReadMessageIdsByRoom(
  userId: number,
  roomIds: number[],
) {
  const supabase = await createClient();
  const {
    data: myLastReadMessageIdsByRoom,
    error: myLastReadMessageIdsByRoomError,
  } = await supabase
    .from("room_user")
    .select("room_id, last_read_message_id")
    .in("room_id", roomIds)
    .eq("user_id", userId);

  if (myLastReadMessageIdsByRoomError) {
    throw new Error(
      `Error while fetching my last read message id by room: ${myLastReadMessageIdsByRoomError.message}`,
    );
  }

  return myLastReadMessageIdsByRoom;
}
