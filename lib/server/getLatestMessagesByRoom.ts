import { createClient } from "../supabase/server";
import { Message } from "@/types/api/message";

export async function getLatestMessagesByRoom(roomIds: number[]) {
  const supabase = await createClient();
  const latestMessageEntries = await Promise.all(
    roomIds.map(async (roomId) => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "*, user:profiles(id, display_name, email, image_path, created_at)",
        )
        .eq("room_id", roomId)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        throw new Error(
          `Error while fetching latest message by room: ${error.message}`,
        );
      }

      return [roomId, (data?.[0] ?? null) as Message | null] as const;
    }),
  );
  const latestMessagesByRoom = Object.fromEntries(latestMessageEntries);

  return latestMessagesByRoom;
}
