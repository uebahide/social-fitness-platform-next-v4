"use client";

import { useEffect, useMemo, useState } from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Message, Room } from "@/types/api/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { createClient } from "@/lib/supabase/client";
import { User } from "@/types/api/user";
import { MessageEditorProvider } from "@/contexts/MessageEditorProvider";

export const MessageClient = ({
  rooms,
  friendId,
}: {
  rooms: Room[];
  friendId?: string;
}) => {
  const supabase = createClient();
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
  const [realtimeMessagesByRoom, setRealtimeMessagesByRoom] = useState<
    Record<number, Message[]>
  >({});
  const [updatedMessage, setUpdatedMessage] = useState<Message | null>(null);
  const realtimeRoomIds = useMemo(
    () => rooms.map((room) => room.id.toString()),
    [rooms],
  );
  const latestMessagesByRoom = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(realtimeMessagesByRoom)
          .map(([roomId, messages]) => [
            roomId,
            messages[messages.length - 1] ?? null,
          ])
          .filter(([, message]) => message !== null),
      ) as Record<number, Message>,
    [realtimeMessagesByRoom],
  );

  useEffect(() => {
    setSelectedRoom((currentRoom) => {
      if (currentRoom && rooms.some((room) => room.id === currentRoom.id)) {
        return currentRoom;
      }

      return preferredRoom;
    });
  }, [preferredRoom, rooms]);

  const onInsert = async (newMessage: Message) => {
    const { data: user, error: userError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", newMessage.user_id)
      .single();
    if (userError) {
      throw new Error(userError.message);
    }
    newMessage.user = user as User;
    setRealtimeMessagesByRoom((prev) => ({
      ...prev,
      [newMessage.room_id]: [...(prev[newMessage.room_id] ?? []), newMessage],
    }));
  };

  const onUpdate = async (message: Message) => {
    setUpdatedMessage(message);
  };

  useRealtimeMessages(realtimeRoomIds, onInsert, onUpdate);

  return (
    <MessageEditorProvider>
      <div className="grid min-w-0 grid-cols-[4fr_9fr]">
        <MessageSidebar
          rooms={rooms}
          setSelectedRoom={setSelectedRoom}
          selectedRoom={selectedRoom}
          latestMessagesByRoom={latestMessagesByRoom}
        />
        <MessagePanel
          selectedRoom={selectedRoom}
          realtimeMessages={
            selectedRoom ? (realtimeMessagesByRoom[selectedRoom.id] ?? []) : []
          }
          updatedMessage={updatedMessage}
          setUpdatedMessage={setUpdatedMessage}
        />
      </div>
    </MessageEditorProvider>
  );
};
