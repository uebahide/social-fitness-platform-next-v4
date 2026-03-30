import { useLastReadMessageId } from "@/contexts/FriendLastReadMessageIdProvider";
import { useUser } from "@/contexts/UserProvider";
import { Message } from "@/types/api/message";
import { Avatar } from "@/components/Avatar";
import { MessageSideMenu } from "./MessgeSideMenu";
import { MessageBubble } from "./MessageBubble";

export const MessageGroup = ({ message }: { message: Message }) => {
  const { user } = useUser();
  const { friendLastReadMessageId } = useLastReadMessageId();

  const isMyMessage = message.user_id === user?.id;
  const isDeleted = message.deleted;
  const isEdited = message.updated_at;
  const isSeen =
    friendLastReadMessageId && friendLastReadMessageId >= message.id;

  if (isMyMessage) {
    return (
      <section className="flex flex-col space-y-2">
        {!isDeleted && isEdited && (
          <p className="text-xs text-gray-500 self-end pr-2">Edited</p>
        )}
        <div className="flex justify-end min-w-0 group gap-4">
          {!isDeleted && <MessageSideMenu message={message} />}
          <MessageBubble message={message} isMyMessage />
        </div>
        {!isDeleted && isSeen && (
          <p className="text-[8px] text-gray-500 self-end pr-2">seen</p>
        )}
      </section>
    );
  }
  return (
    <section className="flex items-center justify-start gap-2 min-w-0 group">
      <div className="flex items-end gap-2">
        <Avatar size="xsmall" user={message.user} />
        <MessageBubble message={message} isMyMessage={false} />
      </div>
      {!isDeleted && <MessageSideMenu message={message} />}
    </section>
  );
};
