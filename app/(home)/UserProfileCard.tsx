import { UserProfileCardClient } from "./UserProfileCardClient";
import { getFriendsCount } from "@/lib/server/getFriendsCount";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { User } from "@/types/api/user";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";

export const UserProfileCard = async ({
  user,
  showMyActivitiesLink = true,
  showFrom = true,
  showWebsite = true,
  className,
}: {
  user?: User;
  showMyActivitiesLink?: boolean;
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
      showMyActivitiesLink={showMyActivitiesLink}
      showFrom={showFrom}
      showWebsite={showWebsite}
      className={className}
    />
  );
};
