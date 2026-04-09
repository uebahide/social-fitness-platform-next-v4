import { createClient } from "@/lib/supabase/client";
import { User } from "@/types/api/user";

export async function searchUsers(
  currentUser: User,
  debouncedSearch: string,
  signal: AbortSignal,
  forceError?: string,
) {
  const supabase = createClient();
  const { data: users, error } = await supabase
    .from("profiles")
    .select(
      "*, friend_requests_sent:friend_requests!sender_id(id, sender_id, receiver_id, status), friend_requests_received:friend_requests!receiver_id(id, sender_id, receiver_id, status), friends:friends!user_id(id, user_id, friend_id)",
    )
    .not("id", "eq", currentUser?.id.toString())
    .ilike("display_name", `%${debouncedSearch}%`)
    .abortSignal(signal);

  if (forceError === "1") {
    throw new Error("Force error");
  }

  if (error) {
    throw new Error(error.message);
  }

  return users ?? [];
}
