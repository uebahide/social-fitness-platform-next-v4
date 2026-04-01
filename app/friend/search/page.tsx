import { UserList } from "./UserList";
import { PageGuidePanel } from "@/components/PageGuidePanel";
import { PageContainer } from "@/components/PageContainer";

export default async function SearchPage() {
  return (
    <PageContainer
      eyebrow="Connections"
      title="Search People"
      description="Look up other members by name, send requests, and discover new training partners."
    >
      <div className="grid grid-cols-[3fr_7fr] gap-4">
        <UserList />
        <PageGuidePanel
          eyebrow="Search Tips"
          title="Find your next training partner"
          description="Look up members by display name, then decide whether to connect, view their profile, or start chatting if you are already friends."
          highlights={[
            "Search works best with display names, so even partial matches can help you find someone quickly.",
            "If you are already connected, you can jump straight into a message from the result list.",
            "If you are not connected yet, send a request and come back later to continue the conversation.",
          ]}
          primaryAction={{
            href: "/friend/friend-list",
            label: "View friend list",
          }}
          secondaryAction={{
            href: "/message",
            label: "Go to messages",
          }}
        />
      </div>
    </PageContainer>
  );
}
