import ActivityCard from "@/components/ActivityCard";
import { Card } from "@/components/Card";
import { EmptyState } from "@/components/states/EmptyState";
import { getFriendsActivities } from "@/lib/server/getFriends";
import { ActivityType } from "@/types/api/activity";

export const FriendActivity = async () => {
  const friendsActivities = await getFriendsActivities();

  return (
    <Card className="col-span-1 row-span-2 flex h-[812px] flex-col overflow-hidden p-0">
      <header className="border-b border-gray-200 bg-gradient-to-br from-brand-secondary-100 via-white to-brand-secondary-50 px-6 py-5 flex flex-col gap-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-gray-500">
              Home Feed
            </p>
            <div className="space-y-1">
              <h2 className="text-3xl font-semibold tracking-tight">
                Friend Activity
              </h2>
            </div>
          </div>
          <div className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm shrink-0">
            {friendsActivities.length} updates
          </div>
        </div>
        <p className="max-w-md text-sm leading-6 text-gray-500">
          Recent workouts, sessions, and updates shared by your circle.
        </p>
      </header>

      <div className="relative min-h-0 flex-1 bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />

        <ul className="h-full space-y-4 overflow-y-auto px-4 py-4">
          {friendsActivities.length === 0 ? (
            <li className="flex h-full min-h-[520px] items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-brand-secondary-50/40 px-6">
              <EmptyState
                title="No friend activity yet"
                description="When your friends start logging workouts and sessions, their latest updates will appear here."
                containerClassName="max-w-sm text-center"
              />
            </li>
          ) : (
            friendsActivities.map((activity: ActivityType, index: number) => (
              <li key={activity.id} className="space-y-2">
                {index === 0 ? (
                  <div className="flex items-center gap-2 px-1">
                    <span className="h-2 w-2 rounded-full bg-brand-primary-400" />
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                      Latest update
                    </p>
                  </div>
                ) : null}
                <ActivityCard activity={activity} showMenu={false} />
              </li>
            ))
          )}
        </ul>
      </div>
    </Card>
  );
};
