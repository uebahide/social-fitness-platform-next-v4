import React from "react";
import { BaseBadge } from "./BaseBadge";

export const PurpleBadge = ({ className }: { className?: string }) => {
  return <BaseBadge color="purple" className={className} />;
};
