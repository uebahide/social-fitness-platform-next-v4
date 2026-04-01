import { PER_PAGE } from "@/constants";
import { createClient } from "@/lib/supabase/server";

export async function getActivities(
  userId: string,
  page: number,
  forceError?: string,
) {
  const supabase = await createClient();
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

  return activities;
}
