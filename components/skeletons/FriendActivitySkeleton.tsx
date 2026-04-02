import { Card } from "../Card";
import { Skeleton } from "../ui/skeleton";

export const FriendActivitySkeleton = () => {
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
          <Skeleton className="rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-xs font-medium text-gray-600 shadow-sm shrink-0" />
        </div>
        <p className="max-w-md text-sm leading-6 text-gray-500">
          Recent workouts, sessions, and updates shared by your circle.
        </p>
      </header>

      <div className="relative min-h-0 flex-1 bg-white">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-white to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-white to-transparent" />

        <ul className="h-full space-y-4 overflow-y-auto px-4 py-4">
          <li className="space-y-2">
            <div className="flex items-center gap-2 px-1">
              <span className="h-2 w-2 rounded-full bg-brand-primary-400" />
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
                Latest update
              </p>
            </div>
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-10 rounded-full" />
            ))}
          </li>
        </ul>
      </div>
    </Card>
  );
};
