import { RootState } from "@/lib/redux/store";

export const selectUnreadCount = (state: RootState) => {
  return state.notification.notifications.filter(
    (notification) => !notification.read_at,
  ).length;
};

export const selectNotifications = (state: RootState) => {
  return state.notification.notifications;
};

export const selectIsNotificationPageOpen = (state: RootState) => {
  return state.notification.isNotificationPageOpen;
};

export const selectUnreadMessageCount = (state: RootState) => {
  return state.notification.notifications.filter(
    (notification) => notification.type === "message",
  ).length;
};
