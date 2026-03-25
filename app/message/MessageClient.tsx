"use client";

import { useEffect, useMemo, useState } from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Message, Room } from "@/types/api/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";

export const MessageClient = ({
  rooms,
  friendId,
}: {
  rooms: Room[];
  friendId?: string;
}) => {
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
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(preferredRoom);
  const [latestMessagesByRoom, setLatestMessagesByRoom] = useState<
    Record<number, Message>
  >({});
  const realtimeRoomIds = useMemo(
    () => rooms.map((room) => room.id.toString()),
    [rooms],
  );

  useEffect(() => {
    setSelectedRoom((currentRoom) => {
      if (
        currentRoom &&
        rooms.some((room) => room.id === currentRoom.id)
      ) {
        return currentRoom;
      }

      return preferredRoom;
    });
  }, [preferredRoom, rooms]);

  useRealtimeMessages(
    realtimeRoomIds,
    (newMessage) => {
      setLatestMessagesByRoom((prev) => ({
        ...prev,
        [newMessage.room_id]: newMessage,
      }));
    },
  );

  return (
    <div className="grid grid-cols-[4fr_9fr]">
      <MessageSidebar
        rooms={rooms}
        setSelectedRoom={setSelectedRoom}
        selectedRoom={selectedRoom}
        latestMessagesByRoom={latestMessagesByRoom}
      />
      <MessagePanel
        selectedRoom={selectedRoom}
        realtimeMessage={
          selectedRoom ? latestMessagesByRoom[selectedRoom.id] ?? null : null
        }
      />
    </div>
  );
};
