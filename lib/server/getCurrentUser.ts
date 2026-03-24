import { createClient } from "../supabase/server";

// lib/server/getCurrentProfileId.ts
export async function getCurrentUser() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) {
    throw new Error("Unauthorized");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", userData.user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("Profile not found");
  }

  return profile;
}
