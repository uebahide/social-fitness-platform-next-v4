"use client";

import { useUser } from "@/contexts/UserProvider";
import { Avatar } from "@/components/Avatar";
import { ActivityType } from "@/types/api/activity";
import { formatDate, getTimeOfDay } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Card } from "@/components/Card";
import { User } from "@/types/api/user";

export const UserProfileCard = ({
  user,
  latestActivity,
  activityCount,
  showMyActivitiesLink = true,
  showFrom = true,
  showWebsite = true,
  className,
}: {
  user: User;
  latestActivity: ActivityType;
  activityCount: number;
  showMyActivitiesLink?: boolean;
  showFrom?: boolean;
  showWebsite?: boolean;
  className?: string;
}) => {
  const { user: login_user } = useUser();
  const target_user = user ?? login_user;
  const category = latestActivity?.category;
  const date = latestActivity?.created_at;
  return (
    <Card className={cn(" col-span-1 row-span-1", className)}>
      <header className="flex flex-col items-center justify-center space-y-4">
        <Avatar size="large" user={target_user} />
        <p className="text-center text-2xl font-bold">{target_user?.name}</p>
      </header>
      <main className="mt-2 space-y-4">
        <div className="flex items-center justify-center px-4">
          <span className="flex flex-col items-center justify-center border-r border-gray-200 pr-6 w-full">
            <p>Friends</p>
            <p className="font-bold">100</p>
          </span>
          <span className="flex flex-col items-center justify-center w-full">
            <p>Activities</p>
            <p className="font-bold">{activityCount}</p>
          </span>
        </div>
        <hr />
        <div className="flex flex-col gap-2 px-4">
          <p className="text-xs">Latest Activity</p>
          {latestActivity ? (
            <p>
              <span className="font-bold">
                {getTimeOfDay(date)} {category?.name}
              </span>{" "}
              - {formatDate(date)}
            </p>
          ) : (
            <p>No activities yet</p>
          )}
        </div>

        <hr />
        <div className="flex flex-col gap-2 px-4 items-start">
          {showFrom && (
            <span>
              <p>From</p>
              <p className="font-bold"></p>
            </span>
          )}
          <span>
            <p>Member Since</p>
            <p className="font-bold"></p>
          </span>
          {showWebsite && (
            <span>
              <p>Website</p>
              <p className="font-bold"></p>
            </span>
          )}
        </div>
        {showMyActivitiesLink && (
          <>
            <hr />
            <Link href="/activity" className="flex justify-between px-4">
              <span>My Activities</span>
              <span>
                <ArrowRightIcon className="h-4 w-4" />
              </span>
            </Link>
          </>
        )}
      </main>
    </Card>
  );
};
