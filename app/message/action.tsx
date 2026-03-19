"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";

export async function sendMessage(prevState: any, formData: FormData) {
  const body = formData.get("message") as string;
  const roomId = formData.get("roomId") as string;
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase.from("messages").insert({
    body,
    room_id: roomId,
    user_id: userId,
  });

  if (error) {
    return {
      errors: error.message,
      message: "error while sending message",
      data: {},
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Message was sent successfully",
    data: {},
    ok: true,
  };
}
