import { cn } from "@/lib/utils";
import React from "react";

export const Card = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <section
      className={cn("bg-card border-gray-200 p-4 border rounded-xl", className)}
      {...props}
    >
      {children}
    </section>
  );
};
