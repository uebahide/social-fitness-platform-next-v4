import { User } from './user';

export type Room = {
  created_at: string;
  id: number;
  latest_message: Message;
  pivot: { user_id: number; room_id: number; created_at: string; updated_at: string };
  type: string;
  updated_at: string;
  users: User[];
};

export type Message = {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user_id: number;
  room_id: number;
  body: string;
  user: User;
};
