import { MessageClient } from "./MessageClient";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { Message, Room } from "@/types/api/message";
import { MessageEditorProvider } from "@/contexts/MessageEditorProvider";

export default async function MessagePage({
  searchParams,
}: {
  searchParams: Promise<{ friendId?: string }>;
}) {
  const { friendId } = await searchParams;
  const currentUserId = await getCurrentUserId();
  const supabase = await createClient();

  if (friendId) {
    const parsedFriendId = Number(friendId);
    if (!Number.isInteger(parsedFriendId)) {
      throw new Error(`Invalid friendId: ${friendId}`);
    }

    // check if room with both users (current user id and friend id) exists
    const { data: isRoomExists, error: isRoomExistsError } = await supabase.rpc(
      "are_users_in_same_room",
      {
        user1_id: currentUserId,
        user2_id: parsedFriendId,
      },
    );

    if (isRoomExistsError) {
      throw new Error(
        `Error while checking if room exists: ${isRoomExistsError.message}`,
      );
    }

    // if room does not exist, create it
    if (!isRoomExists) {
      const { data: room, error: roomError } = await supabase
        .from("rooms")
        .insert({
          type: "private",
        })
        .select()
        .single();

      if (roomError) {
        throw new Error(`Error while creating room: ${roomError.message}`);
      }

      // create room_user intermediary table records for both users
      const newRoomId = room?.id;
      const { error: createRoomError } = await supabase
        .from("room_user")
        .insert([
          {
            room_id: newRoomId,
            user_id: currentUserId,
          },
          {
            room_id: newRoomId,
            user_id: parsedFriendId,
          },
        ]);

      if (createRoomError) {
        throw new Error(
          `Error while creating room user: ${createRoomError.message}`,
        );
      }
    }
  }

  // get all rooms for the current user
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(
      "*, users:room_user(...profiles(id, display_name, email, image_path, created_at)), my_filter:room_user!inner()",
    )
    .eq("my_filter.user_id", currentUserId);

  if (roomsError) {
    throw new Error(`Error while fetching rooms: ${roomsError.message}`);
  }

  // get my last read message id for each room
  const {
    data: myLastReadMessageIdsByRoom,
    error: myLastReadMessageIdsByRoomError,
  } = await supabase
    .from("room_user")
    .select("room_id, last_read_message_id")
    .in(
      "room_id",
      rooms.map((room) => room.id),
    )
    .eq("user_id", currentUserId);

  if (myLastReadMessageIdsByRoomError) {
    throw new Error(
      `Error while fetching my last read message id by room: ${myLastReadMessageIdsByRoomError.message}`,
    );
  }

  // get friend last read message id for each room
  const {
    data: friendLastReadMessageIdsByRoom,
    error: friendLastReadMessageIdsByRoomError,
  } = await supabase
    .from("room_user")
    .select("room_id, last_read_message_id")
    .in(
      "room_id",
      rooms.map((room) => room.id),
    )
    .neq("user_id", currentUserId);

  if (friendLastReadMessageIdsByRoomError) {
    throw new Error(
      `Error while fetching friend last read message id by room: ${friendLastReadMessageIdsByRoomError.message}`,
    );
  }

  //get latest message for each room
  const roomIds = rooms.map((room) => room.id);
  const latestMessageEntries = await Promise.all(
    roomIds.map(async (roomId) => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "*, user:profiles(id, display_name, email, image_path, created_at)",
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(
          `Error while fetching latest message by room: ${error.message}`,
        );
      }

      return [roomId, data?.[0] as Message] as const;
    }),
  );
  const latestMessagesByRoom = Object.fromEntries(latestMessageEntries);

  return (
    <MessageEditorProvider>
      <MessageClient
        myLastReadMessageIdsByRoom={myLastReadMessageIdsByRoom}
        friendLastReadMessageIdsByRoom={friendLastReadMessageIdsByRoom}
        latestMessagesByRoom={latestMessagesByRoom}
        rooms={rooms as Room[]}
        friendId={friendId}
      />
    </MessageEditorProvider>
  );
}
