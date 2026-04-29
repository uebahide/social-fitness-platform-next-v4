type ActorKey =
  | "viewer.default"
  | "viewer.empty_friends"
  | "friend.empty_messages"
  | "friend.text_history";

type ScenarioKey =
  | "friend_list.empty"
  | "message.empty_conversation"
  | "message.with_text_history";

type Scenario = {
  actor: ActorKey;
  friend?: ActorKey;
  friendship?: boolean;
  room?: {
    exists: boolean;
    messages: Array<{
      sender: ActorKey;
      type: "text" | "image";
      body?: string;
    }>;
  };
  notification?: Array<{
    type: "message" | "friend_request" | "friend_request_accepted";
    sender: ActorKey;
    read: boolean;
  }>;
};

export const actors = {
  "viewer.default": {
    email: "hidekazu.ueba@example.com",
    displayName: "Hidekazu Ueba",
  },
  "viewer.empty_friends": {
    email: "empty.friends@example.com",
    displayName: "Empty Friends",
  },
  "friend.empty_messages": {
    email: "empty.messages@example.com",
    displayName: "Empty Messages",
  },
  "friend.text_history": {
    email: "alex.walker@example.com",
    displayName: "Alex Walker",
  },
};

export const scenarios: Record<ScenarioKey, Scenario> = {
  "friend_list.empty": {
    actor: "viewer.empty_friends",
  },
  "message.empty_conversation": {
    actor: "viewer.default",
    friend: "friend.empty_messages",
    friendship: true,
    room: {
      exists: true,
      messages: [],
    },
  },
  "message.with_text_history": {
    actor: "viewer.default",
    friend: "friend.text_history",
    friendship: true,
    room: {
      exists: true,
      messages: [
        { sender: "friend.text_history", type: "text", body: "Hey" },
        { sender: "viewer.default", type: "text", body: "Hello" },
      ],
    },
  },
};
