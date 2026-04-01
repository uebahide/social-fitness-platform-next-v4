import { Skeleton } from "../ui/skeleton";

export const MyAnalyticsSkeleton = () => {
  return (
    <div className="mt-4 space-y-5 animate-pulse">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,0.95fr)]">
        <Skeleton className="min-h-[280px] rounded-xl p-5">
          <Skeleton className="h-4 w-28 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-3 h-5 w-44 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-6 h-[200px] w-full rounded-xl bg-brand-secondary-200" />
        </Skeleton>

        <Skeleton className="min-h-[280px] rounded-xl p-5">
          <Skeleton className="h-4 w-28 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-3 h-5 w-44 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-6 h-[200px] w-full rounded-xl bg-brand-secondary-200" />
        </Skeleton>

        <Skeleton className="min-h-[280px] rounded-xl p-5">
          <Skeleton className="h-4 w-28 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-3 h-5 w-44 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-6 h-[200px] w-full rounded-xl bg-brand-secondary-200" />
        </Skeleton>

        <Skeleton className="min-h-[280px] rounded-xl p-5">
          <Skeleton className="h-4 w-28 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-3 h-5 w-44 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-6 h-[200px] w-full rounded-xl bg-brand-secondary-200" />
        </Skeleton>

        <Skeleton className="rounded-xl p-5 xl:row-span-2">
          <Skeleton className="h-4 w-28 rounded bg-brand-secondary-300" />
          <Skeleton className="mt-3 h-5 w-44 rounded bg-brand-secondary-300" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-24 rounded-xl bg-brand-secondary-200"
              />
            ))}
            <Skeleton className="h-24 rounded-xl bg-brand-secondary-200 sm:col-span-2" />
          </div>
        </Skeleton>
      </div>
    </div>
  );
};
