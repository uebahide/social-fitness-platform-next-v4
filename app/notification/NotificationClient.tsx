"use client";
import { selectNotifications } from "@/lib/redux/features/notification/notificationSelector";
import { formatDate, formatTime } from "@/lib/utils";
import { MessageCircleIcon, UserPlusIcon } from "lucide-react";
import Link from "next/link";
import { useSelector } from "react-redux";

export const NotificationClient = () => {
  const notifications = useSelector(selectNotifications);

  if (notifications.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <div>
      <ul className="space-y-2">
        {notifications?.map((notification) => (
          <li
            key={notification.id}
            className="bg-card rounded-md p-4 border shadow-sm relative"
          >
            <Link
              href={`/message?friendId=${notification.actor_user_id}`}
              className="flex justify-between items-center"
            >
              <div className="flex flex-col gap-2">
                <header>
                  {notification.type === "message" ? (
                    <div className="flex items-center gap-2">
                      <MessageCircleIcon className="w-4 h-4" />
                      <span className="text-blue-500">Message</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlusIcon className="w-4 h-4" />
                      <span className="text-green-500">Friend request</span>
                    </div>
                  )}
                </header>
                <div>
                  <h3>{notification.actor_display_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {notification.type === "message" &&
                      notification.message_type === "text" &&
                      notification.message_preview}
                    {notification.type === "message" &&
                      notification.message_type === "image" &&
                      `${notification.actor_display_name} sent an image`}
                    {notification.type === "friend_request" &&
                      `${notification.actor_display_name} sent a friend request`}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDate(notification.created_at)}{" "}
                {formatTime(notification.created_at)}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
