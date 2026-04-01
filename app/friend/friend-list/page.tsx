import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { FriendList } from "./FriendList";
import { getFriends } from "@/lib/server/getFriends";
import { getReceivedRequests } from "@/lib/server/getReceivedRequests";
import { PageHeader } from "@/components/PageHeader";

export default async function FriendListPage({
  searchParams,
}: {
  searchParams: Promise<{ forceError?: string }>;
}) {
  const { forceError } = await searchParams;
  const userId = await getCurrentUserId();
  const friends = await getFriends();
  const receivedRequests = await getReceivedRequests({ userId });

  if (process.env.APP_ENV === "test" && forceError === "1") {
    throw new Error("Test error");
  }

  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Connections"
        title="Friend List"
        description="Browse your current connections, review incoming requests, and jump into a conversation or profile view."
      />
      <div className="grid grid-cols-[3fr_7fr] gap-4">
        <FriendList friends={friends} requests={receivedRequests} />
        <div className="flex items-center justify-center">
          <p data-testid="friend-list-description">
            Select a friend from the list to view their profile
          </p>
        </div>
      </div>
    </section>
  );
}
