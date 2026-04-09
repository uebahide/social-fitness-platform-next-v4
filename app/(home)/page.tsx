import { WeatherCard } from "./WeatherCard";
import { FriendActivity } from "./FriendActivity";
import { UserProfileCard } from "./UserProfileCard";
import { EventCard } from "./EventCard";
import { PageContainer } from "@/components/PageContainer";
import { Suspense } from "react";
import { FriendActivitySkeleton } from "@/components/skeletons/FriendActivitySkeleton";
import { ChampionshipHubCard } from "./ChampionshipHubCard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your training world, in one place",
  description:
    "Keep an eye on your profile, check what your network has been up to, and stay ready for the week ahead.",
  robots: {
    index: false,
  },
};

export default async function Home() {
  return (
    <PageContainer
      eyebrow="Social Fitness Dashboard"
      title="Your training world, in one place"
      description="Keep an eye on your profile, check what your network has been up to, and stay ready for the week ahead."
      badges={["Profile snapshot", "Friend feed", "Weekly outlook"]}
    >
      {/* desktop view (1200px and above)*/}
      <div className="grid-cols-1 hidden min-[1200px]:grid min-[1200px]:grid-cols-2 min-[1400px]:grid-cols-[3fr_4fr_3fr] gap-6">
        <div className="flex flex-col gap-6">
          <UserProfileCard showWebsite={false} showFrom={false} />
          <EventCard />
        </div>

        <Suspense fallback={<FriendActivitySkeleton />}>
          <FriendActivity />
        </Suspense>

        <div className="flex flex-col gap-6">
          <WeatherCard />
          <ChampionshipHubCard />
        </div>
      </div>

      {/* mobile view (1200px and below)*/}
      <div className="flex flex-col gap-6 min-[1200px]:hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <UserProfileCard showWebsite={false} showFrom={false} />
          <WeatherCard />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EventCard />
          <ChampionshipHubCard />
        </div>
        <Suspense fallback={<FriendActivitySkeleton />}>
          <FriendActivity />
        </Suspense>
      </div>
    </PageContainer>
  );
}
