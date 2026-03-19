"use client";

import React, { useEffect, useState } from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Room } from "@/types/api/message";

export const MessageClient = ({
  rooms,
  friendId,
}: {
  rooms: Room[];
  friendId?: string;
}) => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  useEffect(() => {
    if (friendId) {
      setSelectedRoom(
        rooms.find((room) =>
          room.users.some((user) => user.id === Number(friendId)),
        ) ?? null,
      );
    }
  }, [friendId, rooms]);

  return (
    <div className="grid grid-cols-[4fr_9fr]">
      <MessageSidebar
        rooms={rooms}
        setSelectedRoom={setSelectedRoom}
        selectedRoom={selectedRoom}
      />
      <MessagePanel selectedRoom={selectedRoom} />
    </div>
  );
};
