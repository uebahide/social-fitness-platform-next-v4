import { createClient } from "@/lib/supabase/client";
import { User } from "@/types/api/user";

export async function getUserById(id: number) {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();
  if (userError) {
    throw new Error(userError.message);
  }
  return user as User;
}
