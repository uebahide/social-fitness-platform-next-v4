import { cn } from "@/lib/utils";
import React from "react";

export const EmptyState = ({
  title,
  description,
  containerClassName,
  ...props
}: {
  title?: string;
  description?: string;
  containerClassName?: string;
}) => {
  return (
    <div
      data-testid="empty-state-container"
      className={cn(
        "flex flex-col items-center justify-center gap-4",
        containerClassName,
      )}
      {...props}
    >
      {title && <h2 className="text-2xl font-bold">{title}</h2>}
      {description && <p className="text-sm text-gray-500">{description}</p>}
    </div>
  );
};
