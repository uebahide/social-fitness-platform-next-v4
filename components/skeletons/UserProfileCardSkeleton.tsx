import React from "react";
import { Card } from "../Card";
import { Skeleton } from "../ui/skeleton";

export const UserProfileCardSkeleton = () => {
  return (
    <Card className="col-span-1 row-span-1">
      <header className="flex flex-col items-center justify-center space-y-4">
        <Skeleton className="size-18 rounded-full" />
        <Skeleton
          className="text-center text-2xl font-bold"
          data-testid="user-display-name-skeleton"
        />
      </header>
      <Skeleton className="mt-2 space-y-4 ">
        <Skeleton className="h-55 w-1/2" />
      </Skeleton>
    </Card>
  );
};
