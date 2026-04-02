import { createClient } from "@/lib/supabase/server";
import { CategoryType } from "@/types/api/category";

export async function getDashboardAnalytics({
  categoryFilter,
}: {
  categoryFilter: CategoryType | null;
}) {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_dashboard_analytics", {
    p_category: categoryFilter,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
