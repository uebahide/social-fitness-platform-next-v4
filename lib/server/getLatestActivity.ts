import { createClient } from "@/lib/supabase/server";
import { ActivityType } from "@/types/api/activity";
import { getCurrentUserId } from "./getCurrentUserId";

export async function getLatestActivity(
  userId?: number,
): Promise<ActivityType | null> {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();
  const targetUserId = userId ?? currentUserId;

  const { data, error } = await supabase.rpc("get_latest_activity", {
    p_user_id: targetUserId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data?.id == null ? null : (data as ActivityType);
}
