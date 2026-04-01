import { createClient } from "../supabase/server";
import { getCurrentUserId } from "./getCurrentUserId";
import { User } from "@/types/api/user";

export async function getFriends(): Promise<User[]> {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data: friendsData, error: friendsError } = await supabase
    .from("friends")
    .select("*, profile:friend_id(*, activities(*))")
    .eq("user_id", userId);

  if (friendsError) {
    throw new Error(friendsError.message);
  }

  const friends = friendsData?.map((friend) => friend.profile) as User[];

  return friends as User[];
}

async function getFriendsIds() {
  const supabase = await createClient();
  const userId = await getCurrentUserId();

  const { data: friendsData, error: friendsError } = await supabase
    .from("friends")
    .select("friend_id")
    .eq("user_id", userId);

  if (friendsError) {
    throw new Error(friendsError.message);
  }

  return friendsData?.map((friend) => friend.friend_id);
}

export async function getFriendsActivities() {
  const supabase = await createClient();
  const friendsIds = await getFriendsIds();
  const { data, error } = await supabase
    .from("activities")
    .select(
      "*, user:user_id(*), category:category_id(*), details:activity_details(distance, duration, location)",
    )
    .in("user_id", friendsIds);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
