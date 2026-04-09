import { Message } from "@/types/api/message";
import { cn } from "@/lib/utils";
import { MessageMenu } from "./MessageMenu";
import { ReactionMenu } from "./ReactionMenu";
import { ReplyIcon } from "lucide-react";
import { useUser } from "@/contexts/UserProvider";
import { Dispatch, SetStateAction } from "react";

export const MessageSideMenu = ({
  message,
  isSubMenuVisible,
  setIsReactionPickerOpen,
}: {
  message: Message;
  isSubMenuVisible: boolean;
  setIsReactionPickerOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const { user } = useUser();
  const isMyMessage = message.user_id === user?.id;

  return (
    <ul
      className={cn(
        "flex items-center gap-2 transition-opacity",
        isSubMenuVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto",
      )}
    >
      {isMyMessage && (
        <li className="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
          <MessageMenu message={message} />
        </li>
      )}
      <li className="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
        <ReactionMenu
          setIsReactionPickerOpen={setIsReactionPickerOpen}
          message={message}
          isMyMessage={isMyMessage}
        />
      </li>
      <li className="flex items-center justify-center hover:bg-gray-200 rounded-full p-1 w-8 h-8">
        <ReplyIcon className="size-4" />
      </li>
    </ul>
  );
};
