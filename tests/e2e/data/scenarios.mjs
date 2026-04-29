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

export const scenarios = {
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
