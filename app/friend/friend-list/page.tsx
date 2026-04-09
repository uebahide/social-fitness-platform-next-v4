import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { FriendList } from "./FriendList";
import { getFriends } from "@/lib/server/getFriends";
import { getReceivedRequests } from "@/lib/server/getReceivedRequests";
import { PageGuidePanel } from "@/components/PageGuidePanel";
import { PageContainer } from "@/components/PageContainer";

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
    <PageContainer
      eyebrow="Connections"
      title="Friend List"
      description="Browse your current connections, review incoming requests, and jump into a conversation or profile view."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-4">
        <FriendList friends={friends} requests={receivedRequests} />
        <PageGuidePanel
          testId="friend-list-guide-panel"
          eyebrow="Network Guide"
          title="Your circle, organized"
          description="Use the left panel to explore your current friends, review pending requests, and jump straight into the next action."
          highlights={[
            "Select a friend to open their profile and review their latest public activity.",
            "Switch to the request tab to accept or review new connection requests.",
            "Start a message directly from the list when you are ready to chat.",
          ]}
          primaryAction={{
            href: "/friend/search",
            label: "Search for more people",
          }}
          secondaryAction={{
            href: "/message",
            label: "Open messages",
          }}
        />
      </div>
    </PageContainer>
  );
}
