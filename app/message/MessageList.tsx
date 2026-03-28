import { Avatar } from "@/components/Avatar";
import { useUser } from "@/contexts/UserProvider";
import { Message } from "@/types/api/message";
import { FaceIcon } from "@radix-ui/react-icons";
import { ReplyIcon } from "lucide-react";
import { MessageMenu } from "./MessageMenu";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { selectSelectedRoomMessages } from "@/lib/redux/features/message/messageSelector";

export const MessageList = () => {
  const messages = useSelector(selectSelectedRoomMessages);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      el.scrollTop = el.scrollHeight;
      isFirstRender.current = false;
      return;
    }

    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [messages]);

  return (
    <div
      ref={containerRef}
      className="flex h-[calc(100vh-258px)] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4"
    >
      {messages &&
        messages.map((message) => (
          <MessageGroup key={message.id} message={message} />
        ))}
    </div>
  );
};

const MessageGroup = ({ message }: { message: Message }) => {
  const { user } = useUser();
  const isMyMessage = message.user_id === user?.id;
  const isDeleted = message.deleted;
  const isEdited = message.updated_at;

  if (isMyMessage) {
    return (
      <section className="flex flex-col">
        {!isDeleted && isEdited && (
          <p className="text-xs text-gray-500 self-end pr-2">Edited</p>
        )}
        <div className="flex justify-end min-w-0 group gap-4">
          {!isDeleted && (
            <ul className="flex items-center gap-2 opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto">
              <MessageMenu message={message} />
              <li>
                <FaceIcon className="size-6 hover:bg-gray-200 rounded-full p-1 cursor-pointer" />
              </li>
              <li>
                <ReplyIcon className="size-6 hover:bg-gray-200 rounded-full p-1 cursor-pointer" />
              </li>
            </ul>
          )}
          <MyMessage message={message} />
        </div>
      </section>
    );
  }
  return (
    <section className="flex items-end justify-start gap-2 min-w-0 group">
      <Avatar size="xsmall" user={message.user} />
      <OtherMessage message={message} />
    </section>
  );
};

const MyMessage = ({ message }: { message: Message }) => {
  const isDeleted = message.deleted;
  if (isDeleted) {
    return <DeletedMessageBubble message={message} />;
  }
  if (message.type === "image") {
    return <ImageMessageBubble message={message} />;
  }
  return <MyMessageBubble message={message} />;
};

const OtherMessage = ({ message }: { message: Message }) => {
  const isDeleted = message.deleted;
  if (isDeleted) {
    return <DeletedMessageBubble message={message} />;
  }
  if (message.type === "image") {
    return <ImageMessageBubble message={message} />;
  }
  return <OtherMessageBubble message={message} />;
};

const MyMessageBubble = ({ message }: { message: Message }) => {
  return (
    <div className="flex max-w-[min(20rem,100%)] min-w-0 flex-col gap-4 rounded-2xl bg-purple-500 px-4 py-2 font-mono text-sm text-white">
      <div key={message.id} className="break-words whitespace-pre-wrap">
        {message.body}
      </div>
    </div>
  );
};

const OtherMessageBubble = ({ message }: { message: Message }) => {
  const isDeleted = message.deleted;
  if (isDeleted) {
    return <DeletedMessageBubble message={message} />;
  }
  return (
    <div className="bg-brand-secondary-100 flex max-w-[min(20rem,100%)] min-w-0 flex-col gap-4 rounded-2xl px-4 py-2 font-mono text-sm">
      <div key={message.id} className="break-words whitespace-pre-wrap">
        {message.body}
      </div>
    </div>
  );
};

const ImageMessageBubble = ({ message }: { message: Message }) => {
  return (
    <Image
      src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${message.image_path}`}
      alt="image"
      width={200}
      height={200}
      className="rounded-sm"
      unoptimized
    />
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
