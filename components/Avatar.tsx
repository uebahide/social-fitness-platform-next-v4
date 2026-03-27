"use client";

import { User } from "@/types/api/user";
import Image from "next/image";

import { useUser } from "@/contexts/UserProvider";
import { cn } from "@/lib/utils";
import AvatarPlaceholder from "./AvatarPlaceholder";

export const Avatar = ({
  size = "small",
  className,
  user,
}: {
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  className?: string;
  user?: User;
}) => {
  const { user: login_user } = useUser();
  const target_user = user ?? login_user;
  const imagePath = target_user?.image_path ?? "";
  return imagePath ? (
    <div
      className={cn(
        size == "xsmall" && "h-8 w-8",
        size == "small" && "h-10 w-10",
        size == "medium" && "h-12 w-12",
        size == "large" && "h-18 w-18",
        size == "xlarge" && "h-24 w-24",
        size == "xxlarge" && "h-30 w-30",
        "relative overflow-hidden rounded-full",
        className,
      )}
    >
      <Image
        src={imagePath}
        alt="avatar"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  ) : (
    <AvatarPlaceholder size={size} user={target_user ?? null} />
  );
};
