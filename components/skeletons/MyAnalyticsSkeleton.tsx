import { Skeleton } from "../ui/skeleton";

export const MyAnalyticsSkeleton = () => {
  return (
    <div className="space-y-4 mt-4 animate-pulse">
      {/* Title + Select */}
      <div className="flex flex-col gap-4 justify-between items-start">
        <Skeleton className="h-6 w-40 rounded" />
        <Skeleton className="h-8 w-32 rounded-lg" />
      </div>

      {/* Cards */}
      <div className="flex gap-4">
        {/* Chart 1 */}
        <Skeleton className="h-[300px] w-[433px] rounded-xl flex flex-col items-center justify-center">
          <Skeleton className="h-50 w-80 rounded-lg bg-brand-secondary-300" />
        </Skeleton>

        {/* Chart 2 */}
        <Skeleton className="h-[300px] w-[433px] rounded-xl flex flex-col items-center justify-center">
          <Skeleton className="h-55 w-55 rounded-full bg-brand-secondary-300" />
        </Skeleton>

        {/* Summary */}
        <Skeleton className="h-[300px] flex-1 rounded-xl p-6 space-y-4">
          <Skeleton className="h-6 w-24 rounded bg-brand-secondary-300" />
          <Skeleton className="h-6 w-32 rounded bg-brand-secondary-300" />
        </Skeleton>
      </div>
    </div>
  );
};
