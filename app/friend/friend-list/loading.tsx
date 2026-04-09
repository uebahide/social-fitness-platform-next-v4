import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageGuidePanel } from "@/components/PageGuidePanel";
import { PageContainer } from "@/components/PageContainer";

export default function loading() {
  return (
    <PageContainer
      eyebrow="Connections"
      title="Friend List"
      description="Browse your current connections, review incoming requests, and jump into a conversation or profile view."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[3fr_7fr] gap-4">
        <aside className="bg-card flex h-[calc(100vh-92px)] flex-col gap-4 rounded-sm border border-gray-200 p-3">
          <Input type="text" placeholder="Search" className="w-full" />

          <nav>
            <ul className="flex justify-between gap-2">
              <li>Friend</li>
              <li className="text-gray-500">Request</li>
            </ul>
          </nav>

          <ul className="flex flex-col overflow-y-auto">
            {Array.from({ length: 12 }).map((_, index) => (
              <li
                className="flex items-center justify-between gap-5"
                key={index}
              >
                <div className="flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-50">
                  <Skeleton className="rounded-full h-10 w-10" />
                  <Skeleton className="w-1/3 h-5" />
                </div>
                <Skeleton className="rounded-md h-10 w-18" />
              </li>
            ))}
          </ul>
        </aside>
        <PageGuidePanel
          testId="friend-list-description"
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
