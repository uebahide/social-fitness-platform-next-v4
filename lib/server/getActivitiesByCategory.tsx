import { PER_PAGE } from "@/constants";
import { createClient } from "@/lib/supabase/server";
import { CategoryType } from "@/types/api/category";
import { getCategoryIdByName } from "./getCategoryIdByName";

export async function getActivitiesByCategory(
  userId: string,
  categoryFilter: CategoryType,
  page: number,
  forceError?: string,
) {
  const supabase = await createClient();
  const categoryId = await getCategoryIdByName(categoryFilter);
  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select(
      "*, user:user_id(*), category:category_id(name), details:activity_details(location, distance, duration)",
    )
    .eq("user_id", userId)
    .eq("category_id", categoryId)
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
