import { createClient } from "../supabase/server";
import { FriendRequest } from "@/types/api/user";

export async function getReceivedRequests({
  userId,
}: {
  userId: number;
}): Promise<FriendRequest[]> {
  const supabase = await createClient();
  const { data: receivedRequests, error: receivedRequestsError } =
    await supabase
      .from("friend_requests")
      .select("*, sender:sender_id(*), receiver:receiver_id(*)")
      .eq("status", "pending")
      .eq("receiver_id", userId);

  if (receivedRequestsError) {
    throw new Error(receivedRequestsError.message);
  }

  return receivedRequests as FriendRequest[];
}
