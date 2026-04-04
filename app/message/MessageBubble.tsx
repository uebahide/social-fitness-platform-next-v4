import { useUser } from "@/contexts/UserProvider";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/message";
import Image from "next/image";

export const MessageBubble = ({
  message,
  isMyMessage,
}: {
  message: Message;
  isMyMessage: boolean;
}) => {
  const isDeleted = message.deleted;
  const isImage = message.type === "image";

  if (isDeleted) {
    return <DeletedMessageBubble message={message} />;
  }
  if (isImage) {
    return <ImageMessageBubble message={message} />;
  }

  return (
    <div
      className={cn(
        "relative max-w-[min(20rem,100%)] min-w-0 rounded-2xl px-4 py-2 font-mono text-sm",
        isMyMessage ? "bg-purple-500 text-white" : "bg-brand-secondary-100",
      )}
    >
      <div key={message.id} className="break-words whitespace-pre-wrap">
        {message.body}
      </div>
      <ReactionBubble message={message} isMyMessage={isMyMessage} />
    </div>
  );
};

const ImageMessageBubble = ({ message }: { message: Message }) => {
  const isMyMessage = message.user_id === useUser().user?.id;
  const withReactions = message.reactions.length > 0;
  return (
    <div className={cn("relative", withReactions && "py-3 pt-0")}>
      <Image
        src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${message.image_path}`}
        alt="image"
        width={200}
        height={200}
        className="rounded-sm "
        unoptimized
      />
      <ReactionBubble
        message={message}
        isMyMessage={isMyMessage}
        className="bottom-0 "
      />
    </div>
  );
};

const DeletedMessageBubble = ({ message }: { message: Message }) => {
  return (
    <div className="flex max-w-[min(20rem,100%)] min-w-0 flex-col gap-4 rounded-2xl bg-gray-200 px-4 py-2 font-mono text-sm text-gray-500">
      <div key={message.id} className="break-words whitespace-pre-wrap">
        <p className="italic text-[11px]">This message has been unsent</p>
      </div>
    </div>
  );
};

const ReactionBubble = ({
  message,
  isMyMessage,
  className,
}: {
  message: Message;
  isMyMessage: boolean;
  className?: string;
}) => {
  const isDeleted = message.deleted;
  const sortedReactions = [...message.reactions].sort((a, b) =>
    a.created_at.localeCompare(b.created_at),
  );
  if (!isDeleted && message.reactions?.length > 0) {
    return (
      <div
        className={cn(
          "absolute flex items-center rounded-full bg-gray-200 px-1 border border-white",
          isMyMessage ? "right-0" : "left-0",
          className,
        )}
      >
        {message.reactions?.length > 0 &&
          sortedReactions.map((reaction) => (
            <div
              key={reaction.id}
              className="flex items-center justify-center "
            >
              <span className="text-xs text-gray-500 ">{reaction.emoji}</span>
            </div>
          ))}
      </div>
    );
  }
  return null;
};
