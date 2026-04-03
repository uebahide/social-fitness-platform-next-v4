"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";

type SendMessageState = {
  errors: string | Record<string, never>;
  message: string;
  data: Record<string, never>;
  ok: boolean;
};

export async function sendMessage(
  _prevState: SendMessageState,
  formData: FormData,
) {
  const body = formData.get("message") as string;
  const roomId = formData.get("roomId") as string;
  const filePaths = formData.getAll("filePaths") as string[];

  const supabase = await createClient();
  const userId = await getCurrentUserId();

  if (body.trim() !== "") {
    const { error } = await supabase.from("messages").insert({
      body,
      room_id: roomId,
      user_id: userId,
      type: "text",
    });

    if (error) {
      return {
        errors: error.message,
        message: "error while sending message",
        data: {},
        ok: false,
      };
    }
  }

  for (const filePath of filePaths) {
    const { error: imageError } = await supabase.from("messages").insert({
      body: "",
      room_id: roomId,
      user_id: userId,
      type: "image",
      image_path: `messages/${filePath}`,
    });

    if (imageError) {
      return {
        errors: imageError.message,
        message: "error while sending image",
        data: {},
        ok: false,
      };
    }
  }

  return {
    errors: {},
    message: "Message was sent successfully",
    data: {},
    ok: true,
  };
}

export async function editTextMessage(
  _prevState: SendMessageState,
  formData: FormData,
) {
  const supabase = await createClient();
  const body = formData.get("message") as string;
  const messageId = formData.get("messageId") as string;

  const { error } = await supabase
    .from("messages")
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageId);

  if (error) {
    return {
      errors: error.message,
      message: "error while editing message",
      data: {},
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Message was edited successfully",
    data: {},
    ok: true,
  };
}

export async function deleteMessage(
  _prevState: SendMessageState,
  formData: FormData,
) {
  const supabase = await createClient();
  const messageId = formData.get("messageId") as string;

  const { error } = await supabase
    .from("messages")
    .update({
      deleted: true,
    })
    .eq("id", messageId);

  if (error) {
    return {
      errors: error.message,
      message: "error while deleting message",
      data: {},
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Message was deleted successfully",
    data: {},
    ok: true,
  };
}
