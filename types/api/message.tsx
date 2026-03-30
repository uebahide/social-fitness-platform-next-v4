import { MessageReaction } from "./messageReactions";
import { User } from "./user";

export type Room = {
  created_at: string;
  id: number;
  latest_message: Message;
  type: string;
  users: User[];
  // pivot: {
  //   user_id: number;
  //   room_id: number;
  //   created_at: string;
  //   updated_at: string;
  // };
};

export type Message = {
  id: number;
  body: string;
  user_id: number;
  room_id: number;
  user: User;
  reactions: MessageReaction[];
  deleted: boolean;
  image_path: string;
  type: string;
  updated_at: string;
  created_at: string;
};
