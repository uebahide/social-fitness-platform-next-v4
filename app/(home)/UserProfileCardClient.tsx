"use client";

import { useUser } from "@/contexts/UserProvider";
import { Avatar } from "@/components/Avatar";
import { ActivityType } from "@/types/api/activity";
import { formatDate, getTimeOfDay } from "@/lib/utils";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/Card";
import { User } from "@/types/api/user";
import Image from "next/image";
import { useActionState, useState } from "react";
import { ErrorMessage } from "@/components/form/ErrorMessage";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { updateImage } from "../profile/action";

export const UserProfileCardClient = ({
  user,
  latestActivity,
  activityCount,
  friendsCount,
  showFrom = true,
  showWebsite = true,
  className,
}: {
  user?: User;
  latestActivity: ActivityType | null;
  activityCount: number;
  friendsCount: number;
  showFrom?: boolean;
  showWebsite?: boolean;
  className?: string;
}) => {
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [state, formAction] = useActionState(updateImage, null);
  const { user: login_user } = useUser();
  const target_user = user ?? login_user;
  const category = latestActivity?.category;
  const date = latestActivity?.created_at;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    // const maxSize = 1 * 1024 * 1024; // 1MB

    // if (file.size > maxSize) {
    //   setError("Image must be 1MB or smaller.");
    //   e.target.value = "";
    //   return;
    // }

    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };
  return (
    <Card className={cn(" col-span-1 row-span-1", className)}>
      <header className="flex flex-col items-center justify-center space-y-4">
        {user ? (
          <Avatar size="large" user={target_user ?? undefined} />
        ) : (
          <form
            action={formAction}
            className="relative flex items-center justify-center gap-5 w-full"
          >
            <label className="cursor-pointer">
              {image ? (
                <div className="relative h-18 w-18 overflow-hidden rounded-full">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="avatar"
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <Avatar size="large" user={target_user ?? undefined} />
              )}
              <ErrorMessage>{error || state?.error || ""}</ErrorMessage>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
                hidden
              />
            </label>
            {image && (
              <SubmitButton
                className="h-10 absolute right-0 bottom-0"
                color="secondary"
              >
                Save Image
              </SubmitButton>
            )}
          </form>
        )}

        <p
          className="text-center text-2xl font-bold"
          data-testid="user-display-name"
        >
          {target_user?.display_name}
        </p>
      </header>
      <main className="mt-2 space-y-4">
        <ul className="flex items-center justify-center px-4">
          {user === undefined ? (
            <>
              <Link
                href="/friend/friend-list"
                className="flex flex-col items-center justify-center border-r border-gray-200 pr-6 w-full"
              >
                <p>Friends</p>
                <p className="font-bold">{friendsCount}</p>
              </Link>
              <Link
                href="/activity"
                className="flex flex-col items-center justify-center w-full"
              >
                <p>Activities</p>
                <p className="font-bold">{activityCount}</p>
              </Link>
            </>
          ) : (
            <>
              <div className="flex flex-col items-center justify-center border-r border-gray-200 pr-6 w-full">
                <p>Friends</p>
                <p className="font-bold">{friendsCount}</p>
              </div>
              <div className="flex flex-col items-center justify-center border-gray-200 pr-6 w-full">
                <p>Activities</p>
                <p className="font-bold">{activityCount}</p>
              </div>
            </>
          )}
        </ul>
        <hr />
        <div className="flex flex-col gap-2 px-4">
          <p className="text-xs">Latest Activity</p>
          {latestActivity ? (
            <p>
              <span className="font-bold">
                {getTimeOfDay(date ?? "")} {category?.name ?? ""}
              </span>{" "}
              - {formatDate(date ?? "")}
            </p>
          ) : (
            <p>No activities yet</p>
          )}
        </div>

        <hr />
        <ul className="flex flex-col gap-2 px-4 items-start">
          {showFrom && (
            <li className="flex justify-between w-full">
              <p>From</p>
              <p className="font-bold">{target_user?.nationality ?? "-"}</p>
            </li>
          )}
          <li className="flex justify-between w-full">
            <p>Member Since</p>
            <p className="font-bold">
              {formatDate(target_user?.created_at ?? "")}
            </p>
          </li>
          {showWebsite && (
            <li className="flex justify-between w-full">
              <p>Website</p>
              <p className="font-bold">{target_user?.website ?? "-"}</p>
            </li>
          )}
        </ul>
      </main>
    </Card>
  );
};
