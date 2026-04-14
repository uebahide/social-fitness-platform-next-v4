export type Notification = {
  id: number;
  created_at: string;
  read_at: string | null;
  type: NotificationType;
  recipient_user_id: number;
  actor_user_id: number;
  actor_display_name: string;
  actor_image_path: string | null;
  message_id: number | null;
  friend_request_id: number | null;
  room_id: number | null;
  message_preview: string | null;
  message_type: string | null;
};

export type NotificationType =
  | "message"
  | "friend_request"
  | "friend_request_accepted";
