"use client";

import { Avatar } from "@/components/Avatar";
import { Input } from "@/components/ui/input";
import { useUser } from "@/contexts/UserProvider";
import {
  selectLatestMessagesByRoom,
  selectSelectedRoomId,
} from "@/lib/redux/features/message/messageSelector";
import { setSelectedRoom } from "@/lib/redux/features/message/messageSlice";
import { cn } from "@/lib/utils";
import { Room } from "@/types/api/message";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const LATEST_MESSAGE_PREVIEW_LIMIT = 50;

export const MessageSidebar = ({ rooms }: { rooms: Room[] }) => {
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
          <RoomListItem key={room.id} room={room} />
        ))}
      </ul>
    </aside>
  );
};

const RoomListItem = ({ room }: { room: Room }) => {
  const dispatch = useDispatch();
  const { user: currentUser } = useUser();
  const friend = room.users.find((user) => user.id !== currentUser?.id);

  const latestMessagesByRoom = useSelector(selectLatestMessagesByRoom);
  const latestMessage = latestMessagesByRoom[room.id] ?? null;
  const selectedRoomId = useSelector(selectSelectedRoomId);
  const latestMessagePreview = latestMessage?.deleted ? (
    <span className="italic text-[11px]">This message has been unsent</span>
  ) : latestMessage?.body ? (
    latestMessage.body.length > LATEST_MESSAGE_PREVIEW_LIMIT ? (
      `${latestMessage.body.slice(0, LATEST_MESSAGE_PREVIEW_LIMIT)}...`
    ) : (
      latestMessage.body
    )
  ) : (
    `${friend?.display_name} is ready to chat!`
  );
  return (
    <li
      key={room.id}
      className={cn(
        "ml-2 flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-100",
        selectedRoomId === room.id ? "bg-gray-100" : "hover:bg-gray-100",
      )}
      onClick={() => dispatch(setSelectedRoom(room))}
    >
      <Avatar size="small" user={friend} />
      <section className="flex flex-col gap-1">
        <h3 className="text-xs font-medium">{friend?.display_name}</h3>
        <p className="text-xs text-gray-500">{latestMessagePreview}</p>
      </section>
    </li>
  );
};
