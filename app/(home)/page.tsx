import { UserProfileCard } from "./UserProfileCard";
import { WeatherCard } from "./WeatherCard";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { FriendActivity } from "./FriendActivity";

export default async function Home() {
  const latestActivity = await getLatestActivity();
  const activityCount = await getTotalActivityCount();

  return (
    <div className="grid grid-cols-[3fr_4fr_3fr] grid-rows-2 h-screen gap-2">
      <UserProfileCard
        latestActivity={latestActivity}
        activityCount={activityCount}
        showWebsite={false}
        showFrom={false}
      />
      <FriendActivity />
      <WeatherCard />
      <section className="bg-card col-span-1 row-span-1 rounded-sm border border-gray-200 p-4">
        championships are coming soon
      </section>
      <section className="bg-card col-span-1 row-span-1 rounded-sm border border-gray-200 p-4">
        events are coming soon
      </section>
    </div>
  );
}
