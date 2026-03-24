"use client";

import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { RequestItem } from "@/components/RequestItem";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FriendRequest, User } from "@/types/api/user";
import { MessageCircleIcon } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

export const FriendList = ({
  friends,
  requests,
}: {
  friends: User[] | null;
  requests: FriendRequest[] | null;
}) => {
  const [search, setSearch] = useState("");
  const [currentTab, setCurrentTab] = useState<"friend" | "request">("friend");
  const filteredFriends = useMemo(() => {
    return friends?.filter((friend) =>
      friend?.display_name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [friends, search]);
  const filteredRequests = useMemo(() => {
    return requests?.filter((request) =>
      request.sender?.display_name
        ?.toLowerCase()
        .includes(search.toLowerCase()),
    );
  }, [requests, search]);

  return (
    <aside className="bg-card flex h-[calc(100vh-92px)] flex-col gap-4 rounded-sm border border-gray-200 p-3">
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Search"
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <nav>
        <ul className="flex justify-between gap-2">
          <li
            onClick={() => {
              setCurrentTab("friend");
              setSearch("");
            }}
            className={cn(
              currentTab === "friend" ? "text-black" : "text-gray-500",
              "cursor-pointer select-none",
            )}
          >
            Friend
          </li>
          <li
            onClick={() => {
              setCurrentTab("request");
              setSearch("");
            }}
            className={cn(
              currentTab === "request" ? "text-black" : "text-gray-500",
              "cursor-pointer select-none",
            )}
          >
            Request
          </li>
        </ul>
      </nav>
      <ul className="flex flex-col overflow-y-auto">
        {currentTab === "friend"
          ? filteredFriends?.map((friend) => (
              <FriendItem key={friend.id} friend={friend} />
            ))
          : filteredRequests?.map((request) => (
              <RequestItem key={request.id} request={request} />
            ))}
      </ul>
    </aside>
  );
};

const FriendItem = ({ friend }: { friend: User }) => {
  return (
    <li className="flex items-center justify-between gap-5">
      <Link
        href={`/profile/${friend.id}`}
        className="flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-50"
      >
        <Avatar size="small" user={friend ?? null} />
        <div>{friend.display_name}</div>
      </Link>
      <Link href={`/message?friendId=${friend.id}`}>
        <Button color="secondary">
          <MessageCircleIcon className="size-5 cursor-pointer text-gray-500 hover:text-gray-700" />
        </Button>
      </Link>
    </li>
  );
};
