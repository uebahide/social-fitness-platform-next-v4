"use client";

import { useEffect, useMemo } from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Message, Room } from "@/types/api/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useDispatch } from "react-redux";
import {
  insertMessage,
  ensureRoomLoadStatuses,
  setSelectedRoom,
  updateMessage,
  setMyLastReadMessageId,
  setFriendLastReadMessageId,
  setLatestMessagesByRoom,
  insertReaction,
  updateReaction,
  deleteReaction,
} from "@/lib/redux/features/message/messageSlice";
import { getUserById } from "@/lib/client/getUserById";
import { roomUser } from "@/types/api/roomUser";
import { useRealtimeReadStatus } from "@/hooks/useRealtimeReadStatus";
import { useUser } from "@/contexts/UserProvider";
import { MessageReaction } from "@/types/api/messageReactions";
import { useRealtimeMessageReactions } from "@/hooks/useRealtimeMessageReactions";

export const MessageClient = ({
  rooms,
  friendId,
  myLastReadMessageIdsByRoom,
  friendLastReadMessageIdsByRoom,
  latestMessagesByRoom,
}: {
  rooms: Room[];
  friendId?: string;
  myLastReadMessageIdsByRoom: {
    room_id: number;
    last_read_message_id: number;
  }[];
  friendLastReadMessageIdsByRoom: {
    room_id: number;
    last_read_message_id: number;
  }[];
  latestMessagesByRoom: Record<number, Message | null>;
}) => {
  const dispatch = useDispatch();
  const user = useUser();
  const roomIds = useMemo(() => rooms.map((room) => room.id), [rooms]);
  const realtimeRoomIds = useMemo(
    () => rooms.map((room) => room.id.toString()),
    [rooms],
  );
  const preferredRoom = useMemo(() => {
    if (friendId) {
      return (
        rooms.find((room) =>
          room.users.some((user) => user.id === Number(friendId)),
        ) ?? null
      );
    }

    if (rooms.length === 1) {
      return rooms[0];
    }

    return null;
  }, [friendId, rooms]);

  // set latest messages by room in redux
  useEffect(() => {
    roomIds.forEach((roomId) => {
      dispatch(
        setLatestMessagesByRoom({
          roomId: roomId,
          message: latestMessagesByRoom[roomId] ?? null,
        }),
      );
    });
  }, [dispatch, latestMessagesByRoom, roomIds]);

  // set my last read message id for each room in redux
  useEffect(() => {
    myLastReadMessageIdsByRoom.forEach((item) => {
      dispatch(
        setMyLastReadMessageId({
          roomId: item.room_id,
          messageId: item.last_read_message_id,
        }),
      );
    });
  }, [dispatch, myLastReadMessageIdsByRoom]);

  // set friend last read message id for each room in redux
  useEffect(() => {
    friendLastReadMessageIdsByRoom.forEach((item) => {
      dispatch(
        setFriendLastReadMessageId({
          roomId: item.room_id,
          messageId: item.last_read_message_id ?? 0,
        }),
      );
    });
  }, [dispatch, friendLastReadMessageIdsByRoom]);

  // ensure room load statuses in redux
  useEffect(() => {
    dispatch(ensureRoomLoadStatuses(roomIds));
  }, [dispatch, roomIds]);

  useEffect(() => {
    if (preferredRoom) {
      dispatch(setSelectedRoom(preferredRoom));
    }
  }, [dispatch, preferredRoom, rooms]);

  // realtime insert message
  const onInsert = async (newMessage: Message) => {
    const user = await getUserById(newMessage.user_id);
    newMessage.user = user;
    newMessage.reactions = [];
    dispatch(insertMessage(newMessage));
  };

  // realtime update message
  const onUpdate = async (message: Message) => {
    const user = await getUserById(message.user_id);
    message.user = user;
    dispatch(updateMessage(message));
  };

  useRealtimeMessages(realtimeRoomIds, onInsert, onUpdate);

  // realtime update read status
  const onReadUpdate = (roomUser: roomUser) => {
    if (roomUser.user_id !== user.user?.id) {
      dispatch(
        setFriendLastReadMessageId({
          roomId: roomUser.room_id,
          messageId: roomUser.last_read_message_id ?? 0,
        }),
      );
    }
  };

  useRealtimeReadStatus(realtimeRoomIds, onReadUpdate);

  // realtime update reaction
  const onReactionInsert = (reaction: MessageReaction) => {
    dispatch(insertReaction(reaction));
  };

  const onReactionUpdate = (reaction: MessageReaction) => {
    dispatch(updateReaction(reaction));
  };

  const onReactionDelete = (reaction: MessageReaction) => {
    dispatch(deleteReaction(reaction));
  };

  useRealtimeMessageReactions(
    realtimeRoomIds,
    onReactionInsert,
    onReactionUpdate,
    onReactionDelete,
  );

  return (
    <div className="grid min-w-0 grid-cols-[4fr_9fr] z-10">
      <MessageSidebar rooms={rooms} />
      <MessagePanel />
    </div>
  );
};
