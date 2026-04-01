import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { EmptyState } from "@/components/states/EmptyState";
import { MyActivitiesClient } from "./MyActicitiesClient";
import { CategoryType } from "@/types/api/category";
import { ActivityType } from "@/types/api/activity";
import { getActivitiesByCategory } from "@/lib/server/getActivitiesByCategory";
import { getActivities } from "@/lib/server/getActivities";

export const MyActivities = async ({
  page,
  categoryFilter,
  forceError,
}: {
  page: number;
  categoryFilter: CategoryType | null;
  forceError?: string;
}) => {
  const userId = await getCurrentUserId();
  let activities: ActivityType[];

  if (categoryFilter) {
    activities = await getActivitiesByCategory(
      userId,
      categoryFilter,
      page,
      forceError,
    );
  } else {
    activities = await getActivities(userId, page, forceError);
  }

  if (activities && activities.length > 0) {
    return <MyActivitiesClient activities={activities} />;
  }
  return (
    <EmptyState
      title="No activities yet"
      description="Start an activity to see your activities here 💪"
    />
  );
};
