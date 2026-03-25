import { createClient } from "../supabase/server";
import { getCurrentUserId } from "./getCurrentUserId";

export async function getFriendsCount(userId?: number) {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();
  const targetUserId = userId ?? currentUserId;

  const { data, error } = await supabase
    .from("friends")
    .select("count")
    .eq("user_id", targetUserId);

  if (error) {
    throw new Error(error.message);
  }

  return data?.[0]?.count ?? 0;
}
