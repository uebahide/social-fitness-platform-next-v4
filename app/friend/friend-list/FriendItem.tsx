import { User } from "@/types/api/user";
import Link from "next/link";
import { Avatar } from "@/components/Avatar";
import { Button } from "@/components/buttons/Button";
import { MessageCircleIcon } from "lucide-react";

export const FriendItem = ({ friend }: { friend: User }) => {
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
