import { createClient } from "@/lib/supabase/client";
import { Notification } from "@/types/api/notification";

export const getNotifications = async (userId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export function getUnreadNotificationsCount(
  userId: number,
  data: Notification[],
) {
  return data?.filter((notification) => !notification.read_at).length ?? 0;
}
