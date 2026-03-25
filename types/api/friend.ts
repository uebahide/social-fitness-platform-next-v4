import { User } from "./user";

export type Friend = {
  id: number;
  user_id: number;
  friend_id: number;
  created_at: string;
  profile: User;
};
