import { useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { Message, Room } from "@/types/api/message";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { createClient } from "@/lib/supabase/client";

export const MessagePanel = ({
  selectedRoom,
  realtimeMessage,
}: {
  selectedRoom: Room | null;
  realtimeMessage: Message | null;
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
    if (!selectedRoom || !realtimeMessage) return;
    if (realtimeMessage.room_id !== selectedRoom.id) return;

    setMessages((prev) => {
      const exists = prev.some((message) => message.id === realtimeMessage.id);
      if (exists) return prev;
      return [...prev, realtimeMessage];
    });
  }, [realtimeMessage, selectedRoom]);

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
