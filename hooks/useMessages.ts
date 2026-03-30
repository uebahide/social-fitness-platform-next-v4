import { createClient } from "@/lib/supabase/client";
import { Message, Room } from "@/types/api/message";
import { startTransition, useEffect, useState } from "react";

export const useMessages = (selectedRoom: Room | null) => {
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!selectedRoom) {
      startTransition(() => {
        setMessages([]);
      });
      return;
    }

    let isActive = true;

    const fetchMessages = async () => {
      const { data: messages, error: messagesError } = await supabase
        .from("messages")
        .select("*, user:user_id(*)")
        .eq("room_id", selectedRoom.id)
        .order("created_at", { ascending: true });

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

    startTransition(() => {
      setMessages([]);
    });
    void fetchMessages();

    return () => {
      isActive = false;
    };
  }, [selectedRoom, supabase]);

  return { messages, setMessages };
};
