import AddActivityButton from "@/components/AddActivityButton";
import { MyActivities } from "./MyActivities";
import { Suspense } from "react";

import { PaginationSimple } from "@/components/Pagination";
import { MyAnalytics } from "./MyAnalytics";
import { MyAnalyticsSkeleton } from "@/components/skeletons/MyAnalyticsSkeleton";
import { MyActivitiesSkeleton } from "@/components/skeletons/MyActivitiesSkeleton";
import { PageContainer } from "@/components/PageContainer";
import { CategoryType } from "@/types/api/category";

import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "My Activity",
  description:
    "Review your recent sessions, track your patterns, and keep your personal training history organized.",
  robots: {
    index: false,
  },
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
    category?: CategoryType;
    forceError?: string;
  }>;
};

export default async function Activity({ searchParams }: PageProps) {
  const { page: pageNumber, category, forceError } = await searchParams;
  const page: number = parseInt(pageNumber ?? "1") || 1;
  const categoryFilter: CategoryType | null = category ?? null;

  return (
    <PageContainer
      eyebrow="Training Log"
      title="My Activity"
      description="Review your recent sessions, track your patterns, and keep your personal training history organized."
    >
      <div className="z-10">
        <Suspense fallback={<MyAnalyticsSkeleton />}>
          <MyAnalytics categoryFilter={categoryFilter} />
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
          <MyActivities
            page={page}
            categoryFilter={categoryFilter}
            forceError={forceError}
          />
        </Suspense>
        <PaginationSimple page={page} categoryFilter={categoryFilter} />
      </div>
    </PageContainer>
  );
}
