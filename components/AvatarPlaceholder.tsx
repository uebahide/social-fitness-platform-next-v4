"use client";

import { useUser } from "@/contexts/UserProvider";
import { cn } from "@/lib/utils";
import { User } from "@/types/api/user";

export default function AvatarPlaceholder({
  size,
  className,
  user,
}: {
  size?: "xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge";
  className?: string;
  user?: User | null;
}) {
  const { user: login_user } = useUser();
  const target_user = user ?? login_user;
  return (
    <div
      className={cn(
        size == "xsmall" && "h-8 w-8",
        size == "small" && "h-10 w-10",
        size == "medium" && "h-12 w-12",
        size == "large" && "h-18 w-18",
        size == "xlarge" && "h-24 w-24",
        size == "xxlarge" && "h-30 w-30",
        "flex items-center justify-center rounded-full bg-amber-200",
        className,
      )}
    >
      {target_user?.display_name?.slice(0, 2).toUpperCase()}
    </div>
  );
}
