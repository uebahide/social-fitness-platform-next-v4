"use client";

import { Avatar } from "@/components/Avatar";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { Input } from "@/components/ui/input";
import { FriendRequest, User } from "@/types/api/user";
import React, { useActionState, useEffect, useState } from "react";

import { useUser } from "@/contexts/UserProvider";
import { RequestItem } from "@/components/RequestItem";
import { sendFriendRequest } from "../action";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { MessageCircleIcon } from "lucide-react";
import { Button } from "@/components/buttons/Button";

export const UserList = () => {
  const { user: currentUser } = useUser();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSearchResult() {
      if (!debouncedSearch) {
        setSearchResult([]);
        return;
      }

      try {
        setLoading(true);

        const supabase = createClient();

        const { data: users, error: usersError } = await supabase
          .from("profiles")
          .select(
            "*, friend_requests_sent:friend_requests!sender_id(id, sender_id, receiver_id, status), friend_requests_received:friend_requests!receiver_id(id, sender_id, receiver_id, status), friends:friends!user_id(id, user_id, friend_id)",
          )
          .not("id", "eq", currentUser?.id.toString())
          .ilike("display_name", `%${debouncedSearch}%`);

        if (usersError) {
          return <div>Error: {usersError.message}</div>;
        }

        setSearchResult(users ?? []);
      } finally {
        setLoading(false);
      }
    }

    fetchSearchResult();
    return () => controller.abort();
  }, [debouncedSearch]);
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

      <ul className="flex flex-col overflow-y-auto">
        {searchResult &&
          searchResult.map((user) => (
            <UserItem key={user.id} user={user} currentUser={currentUser} />
          ))}
      </ul>
    </aside>
  );
};

const UserItem = ({
  user,
  currentUser,
}: {
  user: User;
  currentUser: User | null;
}) => {
  const [state, formAction] = useActionState(sendFriendRequest, {
    message: "",
    error: "",
    ok: false,
    data: {},
  });
  const sentRequest = {
    ...user.friend_requests_sent.find(
      (request) =>
        request.status === "pending" && request.receiver_id === currentUser?.id,
    ),
    sender: user,
  } as FriendRequest;

  const requestHasAlreadyBeenSentByMe =
    user.friend_requests_received.some(
      (request) =>
        request.status === "pending" && request.sender_id === currentUser?.id,
    ) || state.ok;
  const isFriend = user.friends.some(
    (friend) => friend.friend_id === currentUser?.id,
  );
  const requestHasAlreadyBeenSentByHim = user.friend_requests_sent.some(
    (request) =>
      request.status === "pending" && request.receiver_id === currentUser?.id,
  );

  if (requestHasAlreadyBeenSentByHim) {
    return <RequestItem request={sentRequest ?? ({} as FriendRequest)} />;
  }

  return (
    <li className="flex cursor-pointer items-center justify-between gap-5 rounded-sm p-2 ">
      <Link
        href={`/profile/${user.id}`}
        className="flex items-center gap-5 w-full hover:bg-gray-50 rounded-sm p-2"
      >
        <Avatar size="small" user={user} />
        <div>{user.display_name}</div>
      </Link>
      <form className="flex items-center gap-2" action={formAction}>
        <input
          type="hidden"
          name="friendId"
          id="friendId"
          value={user.id.toString()}
        />
        {requestHasAlreadyBeenSentByMe && (
          <div className="text-xs text-gray-500">Request already sent</div>
        )}
        {isFriend && (
          <Link href={`/message?friendId=${user.id}`}>
            <Button color="secondary">
              <MessageCircleIcon className="size-5 cursor-pointer text-gray-500 hover:text-gray-700" />
            </Button>
          </Link>
        )}
        {!requestHasAlreadyBeenSentByMe &&
          !requestHasAlreadyBeenSentByHim &&
          !isFriend && (
            <SubmitButton className="cursor-pointer rounded-sm bg-gray-100 p-2 text-gray-500 hover:bg-gray-200 disabled:bg-gray-50 disabled:text-gray-300">
              Request
            </SubmitButton>
          )}
      </form>
    </li>
  );
};
