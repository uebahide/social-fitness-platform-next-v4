import { WeatherCard } from "./WeatherCard";
import { FriendActivity } from "./FriendActivity";
import { UserProfileCard } from "./UserProfileCard";
import { Card } from "@/components/Card";
import { EventCard } from "./EventCard";
import { PageHeader } from "@/components/PageHeader";

export default async function Home() {
  return (
    <section className="relative min-h-screen overflow-hidden  pb-8 ">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-secondary-100/60 blur-3xl" />
        <div className="absolute right-16 top-16 h-64 w-64 rounded-full bg-brand-primary-100/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-brand-secondary-50 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-[1560px] flex-col gap-6">
        <PageHeader
          eyebrow="Social Fitness Dashboard"
          title="Your training world, in one place"
          description="Keep an eye on your profile, check what your network has been up to, and stay ready for the week ahead."
          badges={["Profile snapshot", "Friend feed", "Weekly outlook"]}
        />

        <div className="grid grid-cols-[3fr_4fr_3fr] gap-6">
          <div className="flex flex-col gap-6">
            <UserProfileCard showWebsite={false} showFrom={false} />
            <EventCard />
          </div>

          <FriendActivity />

          <div className="flex flex-col gap-6">
            <WeatherCard />
            <Card className="relative flex h-[372px] flex-col justify-between overflow-hidden rounded-[28px] border-white/70 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 text-white shadow-sm">
              <div className="absolute -right-12 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-brand-primary-300/15 blur-2xl" />

              <div className="relative z-10 space-y-3">
                <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/80">
                  Coming Soon
                </span>
                <div className="space-y-2">
                  <h2 className="text-3xl font-semibold tracking-tight">
                    Championship Hub
                  </h2>
                  <p className="max-w-sm text-sm leading-6 text-white/70">
                    Seasonal competitions, leaderboards, and challenge signups
                    will live here soon.
                  </p>
                </div>
              </div>

              <div className="relative z-10 flex items-end justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">
                    Next rollout
                  </p>
                  <p className="text-lg font-medium">Community race season</p>
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-right shrink-0">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">
                    Status
                  </p>
                  <p className="text-sm font-medium ">In planning</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
