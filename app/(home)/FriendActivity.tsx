import ActivityCard from "@/components/ActivityCard";
import { getFriendsActivities } from "@/lib/server/getFriends";
import { ActivityType } from "@/types/api/activity";

export const FriendActivity = async () => {
  const friendsActivities = await getFriendsActivities();
  console.log("friendsActivities", friendsActivities);
  return (
    <section className="col-span-1 row-span-2">
      <header>
        <h2 className="text-2xl font-bold">Friend Activity</h2>
      </header>
      <div className="h-[calc(100%-4rem)] overflow-y-auto p-1">
        <ul className="space-y-4">
          {friendsActivities.map((activity: ActivityType) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </ul>
      </div>
    </section>
  );
};
