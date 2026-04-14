import { createClient } from "@/lib/supabase/client";

export async function setNotificationReadAtClient(notificationId: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .eq("id", notificationId);
  if (error) {
    throw new Error(error.message);
  }
  return data;
}
