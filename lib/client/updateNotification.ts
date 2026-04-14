import { createClient } from "../supabase/client";

export const markAllNotificationsAsRead = async (userId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({
      read_at: new Date().toISOString(),
    })
    .eq("recipient_user_id", userId)
    .is("read_at", null);

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
