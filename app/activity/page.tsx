import AddActivityButton from "@/components/AddActivityButton";
import { MyActivities } from "./MyActivities";
import { Suspense } from "react";

import { PaginationSimple } from "@/components/Pagination";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { PER_PAGE } from "@/constants";
import { MyAnalytics } from "./MyAnalytics";
import { MyAnalyticsSkeleton } from "@/components/skeletons/MyAnalyticsSkeleton";
import { EmptyState } from "@/components/states/EmptyState";

type PageProps = {
  searchParams: Promise<{
    page?: string;
    forceError?: string;
  }>;
};

export default async function Activity({ searchParams }: PageProps) {
  const { page: pageNumber, forceError } = await searchParams;
  const page: number = parseInt(pageNumber ?? "1") || 1;

  const supabase = await createClient();
  const userId = await getCurrentUserId();
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select(
      "*, user:user_id(*), category:category_id(name), details:activity_details(location, distance, duration)",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(PER_PAGE)
    .range((page - 1) * PER_PAGE, page * PER_PAGE - 1);

  if (process.env.APP_ENV === "test" && forceError === "1") {
    throw new Error("Test error");
  }

  if (activitiesError) {
    throw new Error(activitiesError.message);
  }

  return (
    <section className="flex flex-col gap-6">
      <div>
        <Suspense fallback={<MyAnalyticsSkeleton />}>
          <MyAnalytics />
        </Suspense>
      </div>
      <div className="space-y-6">
        <header className="flex items-center gap-3">
          <h2 data-testid="activity-title">My Activity</h2>
          <AddActivityButton />
        </header>
        {activities && activities.length > 0 ? (
          <MyActivities activities={activities ?? []} />
        ) : (
          <EmptyState
            title="No activities yet"
            description="Start an activity to see your activities here 💪"
          />
        )}
        <PaginationSimple page={page} />
      </div>
    </section>
  );
}
