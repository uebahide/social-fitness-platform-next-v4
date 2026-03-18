import { createClient } from "@/lib/supabase/server";

export async function getTotalActivityCount() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_activity_total_count");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
