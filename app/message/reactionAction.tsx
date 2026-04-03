"use server";

import { MessageReaction } from "@/types/api/messageReactions";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";

export type ReactionActionState = {
  errors: {
    reaction?: string[];
  };
  message: string;
  data: MessageReaction | null;
  ok: boolean;
};

export async function addReaction(
  _prevState: ReactionActionState,
  formData: FormData,
) {
  const supabase = await createClient();
  const messageId = formData.get("messageId") as string;
  const userId = await getCurrentUserId();
  const emoji = formData.get("emoji") as string;

  const { data, error } = await supabase
    .from("message_reactions")
    .insert({
      message_id: messageId,
      user_id: userId,
      emoji: emoji,
    })
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return {
      errors: { reaction: ["error while adding reaction", error.message] },
      message: "",
      data: null,
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Reaction was added successfully",
    data: data as MessageReaction,
    ok: true,
  };
}

export type ReactionUpdateActionState = {
  errors: {
    reaction?: string[];
  };
  message: string;
  data: MessageReaction | null;
  ok: boolean;
  oldEmoji: string;
  snapshotReaction: MessageReaction | null;
};

export async function updateReaction(
  _prevState: ReactionActionState,
  formData: FormData,
) {
  const supabase = await createClient();
  const reactionId = formData.get("reactionId") as string;
  const emoji = formData.get("emoji") as string;

  const { data, error } = await supabase
    .from("message_reactions")
    .update({
      emoji,
    })
    .eq("id", reactionId)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return {
      errors: { reaction: ["error while updating reaction", error.message] },
      message: "",
      data: null,
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Reaction was updated successfully",
    data: data as MessageReaction,
    ok: true,
  };
}

export async function deleteReaction(
  _prevState: ReactionActionState,
  formData: FormData,
) {
  const supabase = await createClient();
  const reactionId = formData.get("reactionId") as string;

  const { data, error } = await supabase
    .from("message_reactions")
    .delete()
    .eq("id", reactionId)
    .select("*")
    .single();

  if (error) {
    console.error(error);
    return {
      errors: { reaction: ["error while deleting reaction", error.message] },
      message: "",
      data: null,
      ok: false,
    };
  }

  return {
    errors: {},
    message: "Reaction was deleted successfully",
    data: data as MessageReaction,
    ok: true,
  };
}
