import AddActivityButton from "@/components/AddActivityButton";
import { MyActivities } from "./MyActivities";
import { Suspense } from "react";

import { PaginationSimple } from "@/components/Pagination";
import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { PER_PAGE } from "@/constants";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Activity({ searchParams }: PageProps) {
  const { page: pageNumber } = await searchParams;
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
  if (activitiesError) {
    return <div>Error: {activitiesError.message}</div>;
  }

  const formattedActivities = activities.map((a) => ({
    ...a,
    details: a.details?.[0] ?? null,
  }));

  return (
    <section className="grid grid-cols-[9fr_6fr] space-y-6 gap-x-10">
      <main className="space-y-6">
        <header className="flex items-center gap-3">
          <h2 className="">My Activity</h2>
          <AddActivityButton />
        </header>

        <MyActivities activities={formattedActivities ?? []} />
        <PaginationSimple page={page} />
      </main>

      <aside>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <MyAnalytics token={token} /> */}
        </Suspense>
      </aside>
    </section>
  );
}
