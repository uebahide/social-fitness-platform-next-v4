import { useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { Message, Room } from "@/types/api/message";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { createClient } from "@/lib/supabase/client";

export const MessagePanel = ({
  selectedRoom,
}: {
  selectedRoom: Room | null;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const supabase = createClient();
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*")
        .eq("room_id", selectedRoom?.id);

      if (messagesError) {
        throw new Error(
          `Error while fetching messages: ${messagesError.message}`,
        );
      }

      setMessages(messages ?? []);
    };

    if (selectedRoom) {
      fetchMessages();
    }
  }, [selectedRoom]);
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
          <MessageInput
            setMessages={setMessages}
            messages={messages}
            selectedRoom={selectedRoom}
          />
        </>
      )}
    </div>
  );
};
