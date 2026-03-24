"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/api/message";
import { RealtimeChannel } from "@supabase/supabase-js";

type BroadcastInsertPayload = {
  payload: {
    record: Message;
  };
};

export function useRealtimeMessages(
  roomId: string | null,
  onInsert: (newMessage: Message) => void,
) {
  useEffect(() => {
    if (!roomId) return;

    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const setup = async () => {
      await supabase.realtime.setAuth();

      if (cancelled) return;

      channel = supabase
        .channel(`channel:${roomId}`, {
          config: { private: true },
        })
        .on("broadcast", { event: "INSERT" }, (payload: BroadcastInsertPayload) => {
          console.log("broadcast payload", payload);
          onInsert(payload.payload.record as Message);
        })
        .subscribe((status) => {
          console.log("Realtime status:", status);
        });
    };

    setup();

    return () => {
      cancelled = true;

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [roomId, onInsert]);
}
