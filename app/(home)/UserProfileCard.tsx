import { UserProfileCardClient } from "./UserProfileCardClient";
import { getFriendsCount } from "@/lib/server/getFriendsCount";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { User } from "@/types/api/user";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";
import { Suspense } from "react";
import { UserProfileCardSkeleton } from "@/components/skeletons/UserProfileCardSkeleton";

export const UserProfileCard = async ({
  user,
  showFrom = true,
  showWebsite = true,
  className,
}: {
  user?: User;
  showFrom?: boolean;
  showWebsite?: boolean;
  className?: string;
}) => {
  return (
    <Suspense fallback={<UserProfileCardSkeleton />}>
      <UserProfileCardServer
        user={user}
        showFrom={showFrom}
        showWebsite={showWebsite}
        className={className}
      />
    </Suspense>
  );
};

export const UserProfileCardServer = async ({
  user,
  showFrom = true,
  showWebsite = true,
  className,
}: {
  user?: User;
  showFrom?: boolean;
  showWebsite?: boolean;
  className?: string;
}) => {
  const latestActivity = await getLatestActivity(user?.id);
  const activityCount = await getTotalActivityCount(user?.id);
  const friendsCount = await getFriendsCount(user?.id);
  return (
    <UserProfileCardClient
      user={user}
      latestActivity={latestActivity}
      activityCount={activityCount}
      friendsCount={friendsCount}
      showFrom={showFrom}
      showWebsite={showWebsite}
      className={className}
    />
  );
};
