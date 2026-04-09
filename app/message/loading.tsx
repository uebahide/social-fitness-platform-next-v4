import { Input } from "@/components/ui/input";
import { EmptyMessagePanel } from "./MessagePanel";
import { Skeleton } from "@/components/ui/skeleton";
import { PageContainer } from "@/components/PageContainer";

export default function loading() {
  return (
    <PageContainer
      eyebrow="Communication"
      title="Messages"
      description="Catch up with your conversations, check unread updates, and stay in sync with your training partners."
    >
      <div
        className="grid min-w-0 grid-cols-1 lg:grid-cols-[4fr_9fr]"
        data-testid="message-page-skeleton"
      >
        <aside
          className="bg-card flex flex-col gap-4 rounded-l-sm border border-r-0 border-gray-200 p-3"
          data-testid="message-sidebar-skeleton"
        >
          <Input type="text" placeholder="Search" className="w-full" />
          <ul className="flex h-[calc(100vh-200px)] flex-col gap-3 overflow-y-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <li
                key={index}
                className="ml-2 flex cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-100"
              >
                <Skeleton className=" h-10 w-10 rounded-full shrink-0" />
                <div className="flex w-full flex-col gap-3">
                  <Skeleton className=" h-3 w-1/3" />
                  <Skeleton className=" h-2 w-1/2" />
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <div
          className="bg-card hidden lg:flex min-w-0 w-full flex-col rounded-r-sm border border-gray-200"
          data-testid="message-panel-skeleton"
        >
          <EmptyMessagePanel />
        </div>
      </div>
    </PageContainer>
  );
}
