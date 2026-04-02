"use client";
import { RequestItem } from "@/components/RequestItem";
import { Input } from "@/components/ui/input";
import { FriendRequest, User } from "@/types/api/user";
import { useMemo, useState } from "react";
import { FriendItem } from "./FriendItem";
import { FriendListAndRequestToggle } from "./FrientListAndRequestToggle";
import { EmptyState } from "@/components/states/EmptyState";

export const FriendList = ({
  friends,
  requests,
}: {
  friends: User[];
  requests: FriendRequest[];
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

      <FriendListAndRequestToggle
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        setSearch={setSearch}
      />

      <ul className="flex flex-col overflow-y-auto">
        {currentTab === "friend" &&
          filteredFriends &&
          filteredFriends.length === 0 && (
            <li>
              <EmptyState
                title="No friends"
                description="No friends found"
                data-testid="friend-list-empty-friends-state"
              />
            </li>
          )}
        {currentTab === "friend" &&
          filteredFriends &&
          filteredFriends.length > 0 &&
          filteredFriends.map((friend) => (
            <FriendItem key={friend.id} friend={friend} />
          ))}
        {currentTab === "request" &&
          filteredRequests &&
          filteredRequests.length === 0 && (
            <li>
              <EmptyState
                title="No requests"
                description="No requests found"
                data-testid="friend-list-empty-requests-state"
              />
            </li>
          )}
        {currentTab === "request" &&
          filteredRequests?.map((request) => (
            <RequestItem key={request.id} request={request} />
          ))}
      </ul>
    </aside>
  );
};
