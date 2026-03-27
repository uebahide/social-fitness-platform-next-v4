"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { Message } from "@/types/api/message";
import { RealtimeChannel } from "@supabase/supabase-js";

type RealtimeSubscribeCallback = NonNullable<
  Parameters<RealtimeChannel["subscribe"]>[0]
>;
type RealtimeSubscribeStatus = Parameters<RealtimeSubscribeCallback>[0];

type BroadcastInsertPayload = {
  payload: {
    record: Message;
  };
  eventType: string;
};

export function useRealtimeMessages(
  roomIds: string | string[] | null,
  onInsert: (newMessage: Message) => void,
  onUpdate: (updatedMessage: Message) => void,
) {
  const handleInsert = useEffectEvent(onInsert);
  const handleUpdate = useEffectEvent(onUpdate);

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
              console.log("payload", payload);
              console.log("payload event type", payload.eventType);
              console.log("broadcast payload record", payload.payload.record);
              handleInsert(payload.payload.record as Message);
            },
          )
          .on(
            "broadcast",
            { event: "UPDATE" },
            (payload: BroadcastInsertPayload) => {
              handleUpdate(payload.payload.record as Message);
            },
          )
          .on(
            "broadcast",
            { event: "DELETE" },
            (payload: BroadcastInsertPayload) => {
              handleUpdate(payload.payload.record as Message);
            },
          )
          .subscribe((status: RealtimeSubscribeStatus) => {
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
