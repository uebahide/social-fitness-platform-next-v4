"use client";

import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Message, Room } from "@/types/api/message";
import { useEffect, useMemo, useState } from "react";

const LATEST_MESSAGE_PREVIEW_LIMIT = 50;

export const MessageSidebar = ({
  rooms,
  setSelectedRoom,
  selectedRoom,
  latestMessagesByRoom,
}: {
  rooms: Room[];
  setSelectedRoom: (room: Room) => void;
  selectedRoom: Room | null;
  latestMessagesByRoom: Record<number, Message | null>;
}) => {
  const { user: currentUser } = useUser();
  const [search, setSearch] = useState("");
  const filteredRooms = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    return rooms.filter((room) => {
      const friend = room.users.find((user) => user.id !== currentUser?.id);

      if (!friend) return false;
      if (!keyword) return true;

      return friend.display_name.toLowerCase().includes(keyword);
    });
  }, [rooms, search, currentUser]);
  return (
    <aside className="bg-card flex flex-col gap-4 rounded-l-sm border border-r-0 border-gray-200 p-3">
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Search"
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <ul className="flex h-[calc(100vh-200px)] flex-col gap-3 overflow-y-auto">
        {filteredRooms.map((room) => (
          <RoomListItem
            key={room.id}
            room={room}
            setSelectedRoom={setSelectedRoom}
            selectedRoom={selectedRoom}
            latestMessageFromRealtime={latestMessagesByRoom[room.id] ?? null}
          />
        ))}
      </ul>
    </aside>
  );
};

const RoomListItem = ({
  room,
  setSelectedRoom,
  selectedRoom,
  latestMessageFromRealtime,
}: {
  room: Room;
  setSelectedRoom: (room: Room) => void;
  selectedRoom: Room | null;
  latestMessageFromRealtime: Message | null;
}) => {
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const { user: currentUser } = useUser();
  const friend = room.users.find((user) => user.id !== currentUser?.id);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      const supabase = createClient();
      const { data: latestMessages, error: latestMessagesError } =
        await supabase
          .from("messages")
          .select("*")
          .eq("room_id", room?.id)
          .order("created_at", { ascending: false })
          .limit(1);
      if (latestMessagesError) {
        throw new Error(latestMessagesError.message);
      }
      setLatestMessage(latestMessages[0] ?? null);
    };
    void fetchLatestMessages();
  }, [room?.id]);

  const displayedLatestMessage = latestMessageFromRealtime ?? latestMessage;
  const latestMessagePreview = displayedLatestMessage?.deleted ? (
    <span className="italic text-[11px]">This message has been unsent</span>
  ) : displayedLatestMessage?.body ? (
    displayedLatestMessage.body.length > LATEST_MESSAGE_PREVIEW_LIMIT ? (
      `${displayedLatestMessage.body.slice(0, LATEST_MESSAGE_PREVIEW_LIMIT)}...`
    ) : (
      displayedLatestMessage.body
    )
  ) : (
    `${friend?.display_name} is ready to chat!`
  );
  return (
    <li
      key={room.id}
      className={cn(
        "ml-2 flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-100",
        selectedRoom?.id === room.id ? "bg-gray-100" : "hover:bg-gray-100",
      )}
      onClick={() => setSelectedRoom(room)}
    >
      <Avatar size="small" user={friend} />
      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-medium">{friend?.display_name}</h3>
        <p className="text-xs text-gray-500">{latestMessagePreview}</p>
      </section>
    </li>
  );
};
