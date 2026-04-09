import { MessageClient } from "./MessageClient";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { Room } from "@/types/api/message";
import { MessageEditorProvider } from "@/contexts/MessageEditorProvider";
import { getRoomsByUserId } from "@/lib/server/getRooms";
import { getMyLastReadMessageIdsByRoom } from "@/lib/server/getMyLastReadMessageIdsByRoom";
import { getFriendLastReadMessageIdsByRoom } from "@/lib/server/getFriendLastReadMessageIdsByRoom";
import { getLatestMessagesByRoom } from "@/lib/server/getLatestMessagesByRoom";
import { getOrCreatePrivateRoom } from "@/lib/server/getOrCreatePrivateRoom";
import { PageContainer } from "@/components/PageContainer";
import { DeleteMessageActionProvider } from "@/contexts/DeleteMessageActionProvider";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Messages",
  description:
    "Catch up with your conversations, check unread updates, and stay in sync with your training partners.",
  robots: {
    index: false,
  },
};

export default async function MessagePage({
  searchParams,
}: {
  searchParams: Promise<{ friendId?: string; forceError?: string }>;
}) {
  const { friendId, forceError } = await searchParams;
  const currentUserId = await getCurrentUserId();

  // if friendId is provided, create room and room_user intermediary table records for both users
  if (friendId) {
    const parsedFriendId = Number(friendId);
    if (!Number.isInteger(parsedFriendId)) {
      throw new Error(`Invalid friendId: ${friendId}`);
    }

    // create private room for both users if it doesn't exist
    await getOrCreatePrivateRoom(currentUserId, parsedFriendId);
  }

  // get all rooms for the current user
  const rooms = await getRoomsByUserId(currentUserId);

  // get my last read message id for each room
  const roomIds = rooms.map((room) => room.id);
  const myLastReadMessageIdsByRoom = await getMyLastReadMessageIdsByRoom(
    currentUserId,
    roomIds,
  );

  // get friend last read message id for each room
  const friendLastReadMessageIdsByRoom =
    await getFriendLastReadMessageIdsByRoom(currentUserId, roomIds);

  //get latest message for each room
  const latestMessagesByRoom = await getLatestMessagesByRoom(roomIds);

  if (process.env.APP_ENV === "test" && forceError === "1") {
    throw new Error("Test error");
  }

  return (
    <PageContainer
      eyebrow="Communication"
      title="Messages"
      description="Catch up with your conversations, check unread updates, and stay in sync with your training partners."
    >
      <MessageEditorProvider>
        <DeleteMessageActionProvider>
          <MessageClient
            myLastReadMessageIdsByRoom={myLastReadMessageIdsByRoom}
            friendLastReadMessageIdsByRoom={friendLastReadMessageIdsByRoom}
            latestMessagesByRoom={latestMessagesByRoom}
            rooms={rooms as Room[]}
            friendId={friendId}
          />
        </DeleteMessageActionProvider>
      </MessageEditorProvider>
    </PageContainer>
  );
}
