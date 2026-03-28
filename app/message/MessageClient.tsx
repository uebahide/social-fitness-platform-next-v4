"use client";

import { useEffect, useMemo } from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Message, Room } from "@/types/api/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { MessageEditorProvider } from "@/contexts/MessageEditorProvider";
import { useDispatch } from "react-redux";
import {
  insertMessage,
  ensureRoomLoadStatuses,
  setSelectedRoom,
  updateMessage,
} from "@/lib/redux/features/message/messageSlice";
import { getUserById } from "@/lib/client/getUserById";

export const MessageClient = ({
  rooms,
  friendId,
}: {
  rooms: Room[];
  friendId?: string;
}) => {
  const dispatch = useDispatch();

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

  useEffect(() => {
    dispatch(ensureRoomLoadStatuses(roomIds));
  }, [dispatch, roomIds]);

  useEffect(() => {
    if (preferredRoom) {
      dispatch(setSelectedRoom(preferredRoom));
    }
  }, [preferredRoom, rooms, dispatch]);

  const onInsert = async (newMessage: Message) => {
    const user = await getUserById(newMessage.user_id);
    newMessage.user = user;
    dispatch(insertMessage(newMessage));
  };

  const onUpdate = async (message: Message) => {
    dispatch(updateMessage(message));
  };

  useRealtimeMessages(realtimeRoomIds, onInsert, onUpdate);

  return (
    <MessageEditorProvider>
      <div className="grid min-w-0 grid-cols-[4fr_9fr]">
        <MessageSidebar rooms={rooms} />
        <MessagePanel />
      </div>
    </MessageEditorProvider>
  );
};
