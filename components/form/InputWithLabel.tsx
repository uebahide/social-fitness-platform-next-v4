import { cn } from "@/lib/utils";
import React from "react";

export const InputWithLabel = ({
  children,
  label,
  className,
  labelClassName,
  unit,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  labelClassName?: string;
  unit?: string;
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <label
        className={cn("text-sm font-medium text-neutral-700", labelClassName)}
      >
        {label}
      </label>
      <div className="relative">
        {children}
        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-neutral-400">
          {unit}
        </span>
      </div>
    </div>
  );
};
