"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";

export async function sendFriendRequest(prevState: any, formData: FormData) {
  const friendId = formData.get("friendId");

  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase.from("friend_requests").insert({
    sender_id: userId,
    receiver_id: friendId,
    status: "pending",
  });

  if (error) {
    return {
      message: error.message,
      error: error.message,
      ok: false,
      data: {},
    };
  }

  revalidatePath("/friend/list", "page");
  revalidatePath("/friend/search", "page");

  return {
    message: "Friend request sent successfully",
    error: "",
    ok: true,
    data: {},
  };
}

export async function acceptFriendRequest(prevState: any, formData: FormData) {
  const requestId = formData.get("request_id");
  const supabase = await createClient();

  const userId = await getCurrentUserId();
  const requestSenderId = formData.get("requestSenderId");

  // create a new friend record
  const { data: friendData, error: createFriendError } = await supabase
    .from("friends")
    .insert([
      {
        user_id: userId,
        friend_id: requestSenderId,
      },
      {
        user_id: requestSenderId,
        friend_id: userId,
      },
    ]);

  if (createFriendError) {
    return {
      message: createFriendError.message,
      error: createFriendError.message,
      ok: false,
      data: {},
    };
  }

  const { data, error } = await supabase
    .from("friend_requests")
    .update({
      status: "accepted",
    })
    .eq("id", requestId);

  if (error) {
    return {
      message: error.message,
      error: error.message,
      ok: false,
      data: {},
    };
  }

  revalidatePath("/friend/list", "page");
  revalidatePath("/friend/search", "page");

  return {
    message: "Friend request accepted successfully",
    error: "",
    ok: true,
    data: {},
  };
}

export async function rejectFriendRequest(prevState: any, formData: FormData) {
  const requestId = formData.get("request_id");
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("friend_requests")
    .update({
      status: "rejected",
    })
    .eq("id", requestId);

  if (error) {
    return {
      message: error.message,
      error: error.message,
      ok: false,
      data: {},
    };
  }

  revalidatePath("/friend/list", "page");
  revalidatePath("/friend/search", "page");

  return {
    message: "Friend request rejected",
    error: "",
    ok: true,
    data: {},
  };
}
