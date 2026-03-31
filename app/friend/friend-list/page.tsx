import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { FriendList } from "./FriendList";
import { createClient } from "@/lib/supabase/server";
import { getFriends } from "@/lib/server/getFriends";

export default async function FriendListPage({
  searchParams,
}: {
  searchParams: Promise<{ forceError?: string }>;
}) {
  const { forceError } = await searchParams;
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const friends = await getFriends();
  const { data: receivedRequests, error: receivedRequestsError } =
    await supabase
      .from("friend_requests")
      .select("*, sender:sender_id(*), receiver:receiver_id(*)")
      .eq("status", "pending")
      .eq("receiver_id", userId);

  if (process.env.APP_ENV === "test" && forceError === "1") {
    throw new Error("Test error");
  }

  if (receivedRequestsError) {
    throw new Error(receivedRequestsError.message);
  }

  return (
    <div className="grid grid-cols-[3fr_7fr] gap-4">
      <FriendList friends={friends} requests={receivedRequests} />
      <article className="flex justify-center items-center">
        <p data-testid="friend-list-description">
          Select a friend from the list to view their profile
        </p>
      </article>
    </div>
  );
}
