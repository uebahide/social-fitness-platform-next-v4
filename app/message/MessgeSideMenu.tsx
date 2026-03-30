import { useState } from "react";
import { Message } from "@/types/api/message";
import { cn } from "@/lib/utils";
import { MessageMenu } from "./MessageMenu";
import { ReactionMenu } from "./ReactionMenu";
import { ReplyIcon } from "lucide-react";
import { useUser } from "@/contexts/UserProvider";

export const MessageSideMenu = ({ message }: { message: Message }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const { user } = useUser();

  return (
    <ul
      className={cn(
        "flex items-center gap-2 transition-opacity",
        isSubMenuOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
      )}
    >
      <li className="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
        <MessageMenu message={message} />
      </li>
      <li className="relative flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
        <ReactionMenu
          setIsSubMenuOpen={setIsSubMenuOpen}
          message={message}
          isMyMessage={message.user_id === user?.id}
        />
      </li>
      <li className="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
        <ReplyIcon className="size-4" />
      </li>
    </ul>
  );
};
