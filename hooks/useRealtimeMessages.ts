"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/api/message";
import {
  RealtimeChannel,
  RealtimeChannelStatus,
} from "@supabase/supabase-js";

type BroadcastInsertPayload = {
  payload: {
    record: Message;
  };
};

export function useRealtimeMessages(
  roomIds: string | string[] | null,
  onInsert: (newMessage: Message) => void,
) {
  const handleInsert = useEffectEvent(onInsert);

  useEffect(() => {
    const normalizedRoomIds = Array.isArray(roomIds)
      ? roomIds.filter(Boolean)
      : roomIds
        ? [roomIds]
        : [];

    if (normalizedRoomIds.length === 0) return;

    const supabase = createClient();
    const channels: RealtimeChannel[] = [];
    let cancelled = false;

    const setup = async () => {
      await supabase.realtime.setAuth();

      if (cancelled) return;

      normalizedRoomIds.forEach((roomId) => {
        const channel = supabase
          .channel(`channel:${roomId}`, {
            config: { private: true },
          })
          .on(
            "broadcast",
            { event: "INSERT" },
            (payload: BroadcastInsertPayload) => {
              console.log("broadcast payload", payload);
              handleInsert(payload.payload.record as Message);
            },
          )
          .subscribe((status: RealtimeChannelStatus) => {
            console.log(`Realtime status [room ${roomId}]:`, status);
          });

        channels.push(channel);
      });
    };

    void setup();

    return () => {
      cancelled = true;

      channels.forEach((channel) => {
        void channel.unsubscribe();
        void supabase.removeChannel(channel);
      });
    };
  }, [roomIds]);
}
