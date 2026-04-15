import { cn } from "@/lib/utils";
import React from "react";

export const BaseBadge = ({
  color,
  className,
}: {
  color: string;
  className?: string;
}) => {
  const colorClass = `bg-${color}-500`;
  return (
    <span
      className={cn("rounded-full w-2 h-2 inline-block", colorClass, className)}
    />
  );
};
