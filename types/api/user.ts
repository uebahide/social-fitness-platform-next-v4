export type User = {
  id: number;
  name: string;
  email: string;
  //   email_verified_at: null;
  image_path: string;
  created_at: string;
  friend_requests_received: FriendRequest[];
  friend_requests_sent: FriendRequest[];
  friends: Friend[];
};

export type FriendRequest = {
  id: number;
  sender_id: number;
  receiver_id: number;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  updated_at: string;
  sender: User;
  receiver: User;
};

export type Friend = {
  id: number;
  user_id: number;
  friend_id: number;
  created_at: string;
  updated_at: string;
  friend: User;
};
