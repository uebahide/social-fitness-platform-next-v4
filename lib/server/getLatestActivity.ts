import { createClient } from "@/lib/supabase/server";

export async function getLatestActivity() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_latest_activity");

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
