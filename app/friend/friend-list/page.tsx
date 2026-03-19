import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { FriendList } from "./FriendList";
import { createClient } from "@/lib/supabase/server";

export default async function FriendListPage() {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data: friendsData, error: friendsError } = await supabase
    .from("friends")
    .select("*, profile:friend_id(*)")
    .eq("user_id", userId);

  if (friendsError) {
    return <div>Error: {friendsError.message}</div>;
  }

  const { data: receivedRequests, error: receivedRequestsError } =
    await supabase
      .from("friend_requests")
      .select("*, sender:sender_id(*), receiver:receiver_id(*)")
      .eq("status", "pending")
      .eq("receiver_id", userId);

  if (receivedRequestsError) {
    return <div>Error: {receivedRequestsError.message}</div>;
  }

  const friends = friendsData?.map((friend) => friend.profile);
  return (
    <div className="grid grid-cols-[3fr_7fr] gap-4">
      <FriendList friends={friends} requests={receivedRequests} />
      <article>
        <div>Image</div>
        <div>Name</div>
      </article>
    </div>
  );
}
