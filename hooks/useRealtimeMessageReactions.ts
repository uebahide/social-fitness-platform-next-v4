"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { MessageReaction } from "@/types/api/messageReactions";

type RealtimeSubscribeCallback = NonNullable<
  Parameters<RealtimeChannel["subscribe"]>[0]
>;
type RealtimeSubscribeStatus = Parameters<RealtimeSubscribeCallback>[0];

type BroadcastReactionChangedPayload = {
  payload: {
    record: MessageReaction;
    old_record: MessageReaction;
  };
  eventType: "INSERT" | "UPDATE" | "DELETE";
};

export function useRealtimeMessageReactions(
  roomIds: string | string[] | null,
  onReactionInsert: (newReaction: MessageReaction) => void,
  onReactionUpdate: (updatedReaction: MessageReaction) => void,
  onReactionDelete: (deletedReaction: MessageReaction) => void,
) {
  const handleReactionInsert = useEffectEvent(onReactionInsert);
  const handleReactionUpdate = useEffectEvent(onReactionUpdate);
  const handleReactionDelete = useEffectEvent(onReactionDelete);
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
          .channel(`channel:${roomId}:reactions`, {
            config: { private: true },
          })
          .on(
            "broadcast",
            { event: "INSERT" },
            (payload: BroadcastReactionChangedPayload) => {
              console.log("reaction insert", payload);
              handleReactionInsert(payload.payload.record as MessageReaction);
            },
          )
          .on(
            "broadcast",
            { event: "UPDATE" },
            (payload: BroadcastReactionChangedPayload) => {
              console.log("reaction update", payload);
              handleReactionUpdate(payload.payload.record as MessageReaction);
            },
          )
          .on(
            "broadcast",
            { event: "DELETE" },
            (payload: BroadcastReactionChangedPayload) => {
              console.log("reaction delete", payload);
              handleReactionDelete(
                payload.payload.old_record as MessageReaction,
              );
            },
          )
          .subscribe((status: RealtimeSubscribeStatus) => {
            console.log(`Reaction realtime status [room ${roomId}]:`, status);
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
