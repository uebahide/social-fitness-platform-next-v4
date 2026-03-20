import { UserProfileCard } from "@/app/(home)/UserProfileCard";
import { FormRow } from "@/components/form/FormRow";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";
import { Card } from "@/components/Card";
import { Input } from "@/components/form/Input";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { createClient } from "@/lib/supabase/server";
import ActivityCard from "@/components/ActivityCard";

export default async function OtherUserProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const latestActivity = await getLatestActivity(userId);
  const activityCount = await getTotalActivityCount(userId);
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (userError) {
    return <div>Error: {userError.message}</div>;
  }

  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select(
      "*, details:activity_details(distance, duration, location), user:user_id(*), category:category_id(*)",
    )
    .eq("user_id", userId);

  if (activitiesError) {
    return <div>Error: {activitiesError.message}</div>;
  }

  return (
    <div className="grid grid-cols-[2fr_4fr] gap-4">
      <div className="flex flex-col gap-4">
        <UserProfileCard
          latestActivity={latestActivity}
          activityCount={activityCount}
          showMyActivitiesLink={false}
          user={user}
        />
        <Card>
          <FormRow>
            <p>About this user</p>
            <textarea
              value={user.about ?? ""}
              readOnly
              placeholder="No about this user yet"
              className="w-full h-[150px] border border-gray-200 rounded-sm p-2 resize-none disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-0"
            />
          </FormRow>
        </Card>
      </div>

      <ul className="flex flex-col gap-4 h-[740px] overflow-y-auto">
        {activities.length === 0 ? (
          <li className="flex flex-col items-center justify-center h-full">
            <p className="text-gray-500">No activities found</p>
          </li>
        ) : (
          <>
            {activities.map((activity) => (
              <li key={activity.id}>
                <ActivityCard activity={activity} showMenu={false} />
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}
