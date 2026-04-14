import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/types/api/notification";

type NotificationState = {
  unreadMessageCount: number;
  notifications: Notification[];
  isNotificationPageOpen: boolean;
};

const initialState: NotificationState = {
  unreadMessageCount: 0,
  notifications: [],
  isNotificationPageOpen: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.unreadMessageCount = action.payload;
    },
    incrementUnreadMessageCount: (state) => {
      state.unreadMessageCount++;
    },
    decrementUnreadMessageCount: (state) => {
      state.unreadMessageCount--;
    },
    setNotificationReadAt: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(
        (notification) => notification.id === action.payload,
      );
      if (notification) {
        notification.read_at = new Date().toISOString();
      }
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...state.notifications];
    },
    setIsNotificationPageOpen: (state, action: PayloadAction<boolean>) => {
      state.isNotificationPageOpen = action.payload;
    },
    updateNotification: (state, action: PayloadAction<Notification>) => {
      const notification = state.notifications.find(
        (notification) => notification.id === action.payload.id,
      );
      if (notification) {
        notification.read_at = action.payload.read_at;
      } else {
        state.notifications.push(action.payload);
      }

      state.notifications = state.notifications.filter(
        (notification) => notification.read_at === null,
      );
    },
  },
});

export const {
  setNotificationReadAt,
  setNotifications,
  addNotification,
  setIsNotificationPageOpen,
  updateNotification,
} = notificationSlice.actions;

export default notificationSlice.reducer;
