"use client";

import { useUser } from "@/contexts/UserProvider";
import { Avatar } from "@/components/Avatar";
import { ActivityType } from "@/types/api/activity";
import { formatDate, getTimeOfDay } from "@/lib/utils";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

export const UserProfileCard = ({
  latestActivity,
  activityCount,
}: {
  latestActivity: ActivityType;
  activityCount: number;
}) => {
  const { user } = useUser();

  const category = latestActivity?.category;
  const date = latestActivity?.created_at;
  return (
    <section className="relative col-span-1 row-span-1">
      <div className="absolute right-1/2 z-2 translate-x-1/2">
        <Avatar size="large" />
      </div>
      <div className="bg-card absolute top-9 right-1/2 h-fit w-full translate-x-1/2 rounded-sm border border-gray-200 p-4">
        <div className="mt-10 space-y-4">
          <p className="text-center text-2xl font-bold">{user?.name}</p>
          <div className="flex items-center justify-between px-4">
            <span className="flex flex-col items-center border-r border-gray-200 pr-6">
              <p>Following</p>
              <p className="font-bold">100</p>
            </span>
            <span className="flex flex-col items-center border-r border-gray-200 pr-6">
              <p>Followers</p>
              <p className="font-bold">100</p>
            </span>
            <span className="flex flex-col items-center">
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
          <div className="flex items-center justify-between px-4">
            {/* to do: get bio from user */}
            <p>Bio</p>
            {/* <p>{user?.bio}</p> */}
          </div>
          <hr />
          <Link href="/activity" className="flex justify-between px-4">
            <span>My Activities</span>
            <span>
              <ArrowRightIcon className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};
