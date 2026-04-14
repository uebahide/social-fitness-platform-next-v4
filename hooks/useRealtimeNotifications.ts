"use client";

import { useEffect, useEffectEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import { Notification } from "@/types/api/notification";

type RealtimeSubscribeCallback = NonNullable<
  Parameters<RealtimeChannel["subscribe"]>[0]
>;
type RealtimeSubscribeStatus = Parameters<RealtimeSubscribeCallback>[0];

type BroadcastInsertPayload = {
  payload: {
    record: Notification;
  };
  eventType: string;
};

type BroadcastUpdatePayload = {
  payload: {
    record: Notification;
  };
  eventType: string;
};

export function useRealtimeNotifications(
  recipientUserId: number | null | undefined,
  onInsert: (notification: Notification) => void,
  onUpdate: (notification: Notification) => void,
) {
  const handleInsert = useEffectEvent(onInsert);
  const handleUpdate = useEffectEvent(onUpdate);

  useEffect(() => {
    if (!recipientUserId) return;

    const supabase = createClient();
    let channel: RealtimeChannel | null = null;
    let cancelled = false;

    const setup = async () => {
      await supabase.realtime.setAuth();

      if (cancelled) return;

      channel = supabase
        .channel(`notification:${recipientUserId}`, {
          config: { private: true },
        })
        .on(
          "broadcast",
          { event: "INSERT" },
          (payload: BroadcastInsertPayload) => {
            handleInsert(payload.payload.record);
          },
        )
        .on(
          "broadcast",
          { event: "UPDATE" },
          (payload: BroadcastUpdatePayload) => {
            handleUpdate(payload.payload.record);
          },
        )
        .subscribe((status: RealtimeSubscribeStatus) => {
          console.log(
            `Notification realtime status [${recipientUserId}]:`,
            status,
          );
        });
    };

    void setup();

    return () => {
      cancelled = true;

      if (channel) {
        void channel.unsubscribe();
        void supabase.removeChannel(channel);
      }
    };
  }, [recipientUserId]);
}
