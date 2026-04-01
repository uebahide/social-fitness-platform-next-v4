import { Skeleton } from "../ui/skeleton";

export const MyActivitiesSkeleton = () => {
  return (
    <ul className="space-y-4">
      {Array.from({ length: 10 }).map((_, index) => (
        <li key={index}>
          <Skeleton className="h-60 w-full" />
        </li>
      ))}
    </ul>
  );
};
