"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { Message } from "@/types/api/message";

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

export type EditMessageState = {
  error: string;
  message: string;
  data: Message | null;
  ok: boolean;
  snapshotSelectedMessage: Message;
};

//update message
export async function editTextMessage(
  _prevState: EditMessageState,
  formData: FormData,
) {
  const supabase = await createClient();
  const body = formData.get("message") as string;
  const messageId = formData.get("messageId") as string;
  const snapshotSelectedMessageRaw = formData.get("snapshotSelectedMessage");
  if (typeof snapshotSelectedMessageRaw !== "string") {
    throw new Error("snapshotSelectedMessage is required");
  }
  const snapshotSelectedMessage = JSON.parse(
    snapshotSelectedMessageRaw,
  ) as Message;

  const { data, error } = await supabase
    .from("messages")
    .update({
      body,
      updated_at: new Date().toISOString(),
    })
    .eq("id", messageId)
    .select(
      "*, user:profiles(id, display_name, email, image_path, created_at), reactions:message_reactions(*)",
    )
    .single();

  if (error) {
    console.error(error);
    return {
      error: `updating mesage failed: ${error.message}`,
      message: "",
      data: null,
      ok: false,
      snapshotSelectedMessage,
    };
  }

  return {
    error: "",
    message: "Message was edited successfully",
    data: data,
    ok: true,
    snapshotSelectedMessage,
  };
}

export type DeleteMessageState = {
  error: string;
  message: string;
  ok: boolean;
};

//delete message
export async function deleteMessage(
  _prevState: DeleteMessageState,
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
      error: "error while deleting message",
      message: "",
      ok: false,
    };
  }
  return {
    error: "",
    message: "Message was deleted successfully",
    ok: true,
  };
}
