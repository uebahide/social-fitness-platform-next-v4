import { cn } from "@/lib/utils";
import React from "react";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn("bg-card rounded-sm border border-gray-200 p-4", className)}
    >
      {children}
    </section>
  );
};
