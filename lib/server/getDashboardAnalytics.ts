import { createClient } from "@/lib/supabase/server";

export async function getDashboardAnalytics() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_dashboard_analytics");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
