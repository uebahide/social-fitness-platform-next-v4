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
      <ul className="h-[740px] overflow-y-auto p-1 space-y-4">
        {friendsActivities.map((activity: ActivityType) => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            showMenu={false}
          />
        ))}
      </ul>
    </section>
  );
};
