import { useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { Message, Room } from "@/types/api/message";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { createClient } from "@/lib/supabase/client";

export const MessagePanel = ({
  selectedRoom,
  realtimeMessages,
}: {
  selectedRoom: Room | null;
  realtimeMessages: Message[];
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      return;
    }

    let isActive = true;

    const fetchMessages = async () => {
      const supabase = createClient();
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", selectedRoom.id);

      if (messagesError) {
        throw new Error(
          `Error while fetching messages: ${messagesError.message}`,
        );
      }

      if (!isActive) return;

      setMessages((prev) => {
        const merged = [...(messages ?? [])];

        prev.forEach((message) => {
          if (!merged.some((item) => item.id === message.id)) {
            merged.push(message);
          }
        });

        return merged;
      });
    };

    setMessages([]);
    void fetchMessages();

    return () => {
      isActive = false;
    };
  }, [selectedRoom]);

  useEffect(() => {
    if (!selectedRoom || realtimeMessages.length === 0) return;

    setMessages((prev) => {
      const newMessages = realtimeMessages.filter(
        (message) =>
          message.room_id === selectedRoom.id &&
          !prev.some((prevMessage) => prevMessage.id === message.id),
      );

      if (newMessages.length === 0) return prev;
      return [...prev, ...newMessages];
    });
  }, [realtimeMessages, selectedRoom]);

  return (
    <div className="bg-card flex w-full flex-col rounded-r-sm border border-gray-200">
      {!selectedRoom ? (
        <div className="flex h-[calc(100vh-95px)] flex-col items-center justify-center gap-4">
          <h1 className="text-center text-sm font-medium text-gray-500">
            Select a message room to start chatting
          </h1>
        </div>
      ) : (
        <>
          <ChatHeader room={selectedRoom} />
          <MessageList messages={messages} />
          <MessageInput selectedRoom={selectedRoom} />
        </>
      )}
    </div>
  );
};
