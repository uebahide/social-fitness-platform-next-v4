import { createClient } from "../supabase/server";

export async function getNotifications(userId: number) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_user_id", userId)
    .is("read_at", null)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
