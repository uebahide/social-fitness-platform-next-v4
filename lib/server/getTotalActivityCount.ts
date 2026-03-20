import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "./getCurrentUserId";

export async function getTotalActivityCount(userId?: string) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();
  const targetUserId = userId ?? currentUserId;

  const { data, error } = await supabase.rpc("get_activity_total_count", {
    p_user_id: targetUserId,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
