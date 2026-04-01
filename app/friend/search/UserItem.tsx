"use client";
import { FriendRequest, User } from "@/types/api/user";
import { useActionState } from "react";
import { sendFriendRequest } from "../action";
import { RequestItem } from "@/components/RequestItem";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { MessageCircleIcon } from "lucide-react";
import { SubmitButton } from "@/components/buttons/SubmitButton";

export const UserItem = ({
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
