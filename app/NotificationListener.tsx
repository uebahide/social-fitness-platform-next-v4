"use client";

import { useUser } from "@/contexts/UserProvider";
import { useRealtimeNotifications } from "@/hooks/useRealtimeNotifications";
import {
  addNotification,
  setNotifications,
  updateNotification,
} from "@/lib/redux/features/notification/notificationSlice";
import { Notification } from "@/types/api/notification";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

export const NotificationListener = ({
  notifications,
  children,
}: {
  notifications: Notification[];
  children: React.ReactNode;
}) => {
  const { user } = useUser();
  const dispatch = useDispatch();

  // set notifications to redux store
  useEffect(() => {
    dispatch(setNotifications(notifications));
  }, [dispatch, notifications]);

  // handle insert notification
  const onInsertNotification = (notification: Notification) => {
    dispatch(addNotification(notification));
    toast.custom(() => (
      <div className="flex w-[360px] items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-xl">
        <div className="flex-1">
          {notification.type === "message" ? (
            <div className="flex items-center gap-2">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
              <span className="text-blue-500">Message</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="mt-1 h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-green-500">Friend request</span>
            </div>
          )}
          <div>
            <h3>{notification.actor_display_name}</h3>
            <p className="text-sm text-muted-foreground">
              {notification.message_preview}
            </p>
          </div>
        </div>
      </div>
    ));
  };

  const onUpdateNotification = (notification: Notification) => {
    dispatch(updateNotification(notification));
  };

  useRealtimeNotifications(
    user?.id,
    onInsertNotification,
    onUpdateNotification,
  );

  return children;
};
