"use client";

import { selectUnreadMessageCount } from "@/lib/redux/features/notification/notificationSelector";
import { useSelector } from "react-redux";
import { PurpleBadge } from "./PurpleBadge";

export const UnreadMessageBadge = ({ className }: { className?: string }) => {
  const unreadCount = useSelector(selectUnreadMessageCount);
  return unreadCount > 0 ? <PurpleBadge className={className} /> : null;
};
