"use client";

import { ActivityType } from "@/types/api/activity";
import ActivityCard from "@/components/ActivityCard";

export const MyActivitiesClient = ({
  activities,
}: {
  activities: ActivityType[];
}) => {
  return (
    <div className="max-h-[520px] overflow-y-auto">
      <ActivityList activities={activities} />
    </div>
  );
};

function ActivityList({ activities }: { activities: ActivityType[] }) {
  return (
    <div className="space-y-4" data-testid="activities-list-section">
      {activities &&
        activities.length > 0 &&
        activities.map((activity: ActivityType) => {
          return <ActivityCard activity={activity} key={activity.id} />;
        })}
    </div>
  );
}
