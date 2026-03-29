"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { roomUser } from "@/types/api/roomUser";

type RealtimeSubscribeCallback = NonNullable<
  Parameters<RealtimeChannel["subscribe"]>[0]
>;
type RealtimeSubscribeStatus = Parameters<RealtimeSubscribeCallback>[0];

type BroadcastReadUpdatePayload = {
  payload: {
    record: roomUser;
    old_record: roomUser | null;
  };
  eventType: string;
};

export function useRealtimeReadStatus(
  roomIds: number | number[],
  onReadUpdate: (roomUser: roomUser) => void,
) {
  const handleReadUpdate = useEffectEvent(onReadUpdate);

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
          .channel(`channel:${roomId}:read_status`, {
            config: { private: true },
          })
          .on(
            "broadcast",
            { event: "READ_UPDATE" },
            (payload: BroadcastReadUpdatePayload) => {
              console.log("payload", payload);
              handleReadUpdate(payload.payload.record);
            },
          )
          .subscribe((status: RealtimeSubscribeStatus) => {
            console.log(`Read realtime status [room ${roomId}]:`, status);
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
