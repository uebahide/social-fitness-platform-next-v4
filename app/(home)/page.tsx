import { WeatherCard } from "./WeatherCard";
import { FriendActivity } from "./FriendActivity";
import { UserProfileCard } from "./UserProfileCard";
import { Card } from "@/components/Card";
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
        <Card className="bg-card col-span-1 row-span-1 rounded-sm border border-gray-200 p-4 h-[372px] flex items-center justify-center">
          <p>championships are coming soon</p>
        </Card>
      </div>
    </div>
  );
}
