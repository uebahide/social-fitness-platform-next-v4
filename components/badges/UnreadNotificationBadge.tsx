"use client";

import { selectUnreadCount } from "@/lib/redux/features/notification/notificationSelector";
import { useSelector } from "react-redux";
import { PurpleBadge } from "./PurpleBadge";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";

export const SimpleNotificationBadge = ({
  className,
}: {
  className?: string;
}) => {
  const unreadCount = useSelector(selectUnreadCount);
  return unreadCount > 0 ? <PurpleBadge className={className} /> : null;
};

export const PulseBellNotificationBadge = ({
  className,
}: {
  className?: string;
}) => {
  const unreadCount = useSelector(selectUnreadCount);
  return unreadCount > 0 ? (
    <Bell className={cn("animate-pulse text-purple-500", className)} />
  ) : null;
};
