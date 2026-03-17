import RunIcon from "./icons/Run";
import CycleIcon from "./icons/Cycle";
import SwimIcon from "./icons/Swim";
import WalkIcon from "./icons/Walk";
import BarbellIcon from "./icons/Barbell";
import { YogaIcon } from "./icons/Yoga";
import { TrekkingIcon } from "./icons/Trekking";
import { BoxingIcon } from "./icons/Boxing";
import { cn } from "@/lib/utils";

export const CategoryIcon = ({
  category,
  className,
  size = "medium",
}: {
  category: string;
  className?: string;
  size?: "small" | "medium" | "large";
}) => {
  return (
    <div
      className={cn("flex h-10 w-10 items-center justify-center", className)}
    >
      {category === "running" && (
        <RunIcon
          className={cn(
            "text-amber-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "cycling" && (
        <CycleIcon
          className={cn(
            "text-green-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "swimming" && (
        <SwimIcon
          className={cn(
            "text-blue-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "walking" && (
        <WalkIcon
          className={cn(
            "text-purple-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "gym" && (
        <BarbellIcon
          className={cn(
            "text-orange-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "yoga" && (
        <YogaIcon
          className={cn(
            "text-pink-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "hiking" && (
        <TrekkingIcon
          className={cn(
            "text-cyan-600",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
      {category === "boxing" && (
        <BoxingIcon
          className={cn(
            "text-black",
            size === "small"
              ? "h-6 w-6"
              : size === "medium"
                ? "h-10 w-10"
                : "h-12 w-12",
          )}
        />
      )}
    </div>
  );
};
