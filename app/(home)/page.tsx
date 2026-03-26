import { WeatherCard } from "./WeatherCard";
import { FriendActivity } from "./FriendActivity";
import { UserProfileCard } from "./UserProfileCard";
import { EventCard } from "./EventCard";

export default async function Home() {
  return (
    <div className="grid grid-cols-[3fr_4fr_3fr] gap-4 ">
      <div className="flex flex-col gap-4">
        <UserProfileCard
          showWebsite={false}
          showFrom={false}
          className="mt-9"
        />
        <EventCard />
      </div>
      <FriendActivity />
      <div className="flex flex-col gap-4">
        <WeatherCard />
        <section className="bg-card col-span-1 row-span-1 rounded-sm border border-gray-200 p-4">
          events are coming soon
        </section>
      </div>
    </div>
  );
}
