import AddActivityButton from "@/components/AddActivityButton";
import { MyActivities } from "./MyActivities";
import { Suspense } from "react";

import { PaginationSimple } from "@/components/Pagination";
import { MyAnalytics } from "./MyAnalytics";
import { MyAnalyticsSkeleton } from "@/components/skeletons/MyAnalyticsSkeleton";
import { MyActivitiesSkeleton } from "@/components/skeletons/MyActivitiesSkeleton";
import { PageContainer } from "@/components/PageContainer";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    forceError?: string;
  }>;
};

export default async function Activity({ searchParams }: PageProps) {
  const { page: pageNumber, forceError } = await searchParams;
  const page: number = parseInt(pageNumber ?? "1") || 1;

  return (
    <PageContainer
      eyebrow="Training Log"
      title="My Activity"
      description="Review your recent sessions, track your patterns, and keep your personal training history organized."
    >
      <div className="z-10">
        <Suspense fallback={<MyAnalyticsSkeleton />}>
          <MyAnalytics />
        </Suspense>
      </div>
      <div className="space-y-6">
        <header className="flex items-center gap-3">
          <h2 data-testid="activity-title" className="text-lg font-semibold">
            Activity Feed
          </h2>
          <AddActivityButton />
        </header>
        <Suspense fallback={<MyActivitiesSkeleton />}>
          <MyActivities page={page} forceError={forceError} />
        </Suspense>
        <PaginationSimple page={page} />
      </div>
    </PageContainer>
  );
}
