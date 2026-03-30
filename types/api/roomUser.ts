export type roomUser = {
  id: number;
  room_id: number;
  user_id: number;
  last_read_message_id: number | null;
  created_at: string;
};
