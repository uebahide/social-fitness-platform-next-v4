import ActivityCard from "@/components/ActivityCard";
import { EmptyState } from "@/components/states/EmptyState";
import { getFriendsActivities } from "@/lib/server/getFriends";
import { ActivityType } from "@/types/api/activity";

export const FriendActivity = async () => {
  const friendsActivities = await getFriendsActivities();
  return (
    <section className="col-span-1 row-span-2">
      <header>
        <h2 className="text-2xl font-bold">Friend Activity</h2>
      </header>
      <ul className="h-[740px] overflow-y-auto p-1 space-y-4">
        {friendsActivities.length === 0 ? (
          <li className="h-full flex items-center justify-center">
            <EmptyState description="No friend activities found" />
          </li>
        ) : (
          friendsActivities.map((activity: ActivityType) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              showMenu={false}
            />
          ))
        )}
      </ul>
    </section>
  );
};
