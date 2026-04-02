import { Skeleton } from "@/components/ui/skeleton";

export const UserListSkeleton = () => {
  return (
    <li className="space-y-3" data-testid="user-list-skeleton">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between gap-4 p-2"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          <Skeleton className="h-8 w-20 rounded-sm" />
        </div>
      ))}
    </li>
  );
};
