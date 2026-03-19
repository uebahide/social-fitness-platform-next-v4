import { Avatar } from "@/components/Avatar";
import { useUser } from "@/contexts/UserProvider";
import { Message } from "@/types/api/message";
import { useEffect, useRef } from "react";

export const MessageList = ({ messages }: { messages: Message[] }) => {
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
      className="flex h-[calc(100vh-258px)] flex-col gap-4 overflow-y-auto p-4"
    >
      {messages.map((message) => (
        <MessageGroup key={message.id} message={message} />
      ))}
    </div>
  );
};

const MessageGroup = ({ message }: { message: Message }) => {
  const { user } = useUser();
  const isMyMessage = message.user_id === user?.id;
  return (
    <div className="flex flex-col gap-4">
      {isMyMessage ? (
        <section className="flex justify-end">
          <MyMessageBubble message={message} />
        </section>
      ) : (
        <section className="flex items-center justify-start gap-2">
          <Avatar size="xsmall" user={message.user} />
          <OtherMessageBubble message={message} />
        </section>
      )}
    </div>
  );
};

const MyMessageBubble = ({ message }: { message: Message }) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-purple-500 px-4 py-2 font-mono text-sm text-white">
      <div key={message.id} className="whitespace-pre-wrap">
        {message.body}
      </div>
    </div>
  );
};
const OtherMessageBubble = ({ message }: { message: Message }) => {
  return (
    <div className="bg-brand-secondary-100 flex flex-col gap-4 rounded-2xl px-4 py-2 font-mono text-sm">
      <div key={message.id} className="whitespace-pre-wrap">
        {message.body}
      </div>
    </div>
  );
};
