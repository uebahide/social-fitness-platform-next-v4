import { User } from "./user";

export type Room = {
  created_at: string;
  id: number;
  latest_message: Message;
  // pivot: {
  //   user_id: number;
  //   room_id: number;
  //   created_at: string;
  //   updated_at: string;
  // };
  type: string;
  users: User[];
};

export type Message = {
  id: number;
  body: string;
  user_id: number;
  room_id: number;
  created_at: string;
  user: User;
};
