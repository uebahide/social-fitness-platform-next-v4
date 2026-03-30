import { Message, Room } from "@/types/api/message";
import { MessageReaction } from "@/types/api/messageReactions";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageState = {
  selectedRoom: Room | null;
  selectedRoomId: number | null;
  messagesByRoom: Record<number, Message[]>;
  latestMessagesByRoom: Record<number, Message | null>;
  loadStatusByRoom: Record<number, "idle" | "loading" | "loaded" | "error">;
  myLastReadMessageIdsByRoom: Record<number, number | null>;
};

const initialState: MessageState = {
  selectedRoomId: null,
  selectedRoom: null,
  messagesByRoom: {},
  latestMessagesByRoom: {},
  loadStatusByRoom: {},
  myLastReadMessageIdsByRoom: {},
};

const findMessageLocationByReaction = (
  messagesByRoom: Record<number, Message[]>,
  reaction: MessageReaction,
) => {
  for (const [roomId, messages] of Object.entries(messagesByRoom)) {
    const messageIndex = messages.findIndex(
      (message) => message.id === reaction.message_id,
    );

    if (messageIndex !== -1) {
      return {
        roomId: Number(roomId),
        messageIndex,
      };
    }
  }

  return null;
};

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    ensureRoomLoadStatuses(state, action: PayloadAction<number[]>) {
      action.payload.forEach((roomId) => {
        if (state.loadStatusByRoom[roomId] == null) {
          state.loadStatusByRoom[roomId] = "idle";
        }
      });
    },
    setLatestMessagesByRoom(
      state,
      action: PayloadAction<{ roomId: number; message: Message }>,
    ) {
      state.latestMessagesByRoom[action.payload.roomId] =
        action.payload.message;
    },
    setRoomLoading(state, action: PayloadAction<number>) {
      state.loadStatusByRoom[action.payload] = "loading";
    },

    setRoomLoaded(
      state,
      action: PayloadAction<{ roomId: number; messages: Message[] }>,
    ) {
      state.messagesByRoom[action.payload.roomId] = action.payload.messages;
      state.loadStatusByRoom[action.payload.roomId] = "loaded";
    },

    setRoomError(state, action: PayloadAction<number>) {
      state.loadStatusByRoom[action.payload] = "error";
    },
    setSelectedRoom: (state, action: PayloadAction<Room>) => {
      state.selectedRoom = action.payload;
      state.selectedRoomId = action.payload.id;
    },
    setRoomMessages(
      state,
      action: PayloadAction<{ roomId: number; messages: Message[] }>,
    ) {
      state.messagesByRoom[action.payload.roomId] = action.payload.messages;
    },
    insertMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const current = state.messagesByRoom[message.room_id] ?? [];

      const exists = current.some((item) => item.id === message.id);
      if (!exists) {
        state.messagesByRoom[message.room_id] = [
          ...current,
          message,
        ] as Message[];
      }
      state.latestMessagesByRoom[message.room_id] = message;
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const current = state.messagesByRoom[message.room_id] ?? [];
      const index = current.findIndex((item) => item.id === message.id);
      if (index !== -1) {
        // update message with same reactions as the original message
        current[index] = { ...message, reactions: current[index].reactions };
        state.messagesByRoom[message.room_id] = current;
      }
      state.latestMessagesByRoom[message.room_id] = message;
    },
    insertReaction: (state, action: PayloadAction<MessageReaction>) => {
      const reaction = action.payload;
      const location = findMessageLocationByReaction(
        state.messagesByRoom,
        reaction,
      );

      if (!location) return;

      const message =
        state.messagesByRoom[location.roomId][location.messageIndex];
      const alreadyExists = message.reactions?.some(
        (item) => item.id === reaction.id,
      );

      if (!alreadyExists) {
        message.reactions.push(reaction);
      }
    },
    updateReaction: (state, action: PayloadAction<MessageReaction>) => {
      const reaction = action.payload;
      const location = findMessageLocationByReaction(
        state.messagesByRoom,
        reaction,
      );

      if (!location) return;

      const message =
        state.messagesByRoom[location.roomId][location.messageIndex];
      message.reactions = message.reactions.map((item) =>
        item.id === reaction.id ? reaction : item,
      );
    },

    deleteReaction: (state, action: PayloadAction<MessageReaction>) => {
      const reaction = action.payload;
      const location = findMessageLocationByReaction(
        state.messagesByRoom,
        reaction,
      );

      if (!location) return;

      const message =
        state.messagesByRoom[location.roomId][location.messageIndex];
      message.reactions = message.reactions.filter(
        (item) => item.id !== reaction.id,
      );
    },
    setMyLastReadMessageId: (
      state,
      action: PayloadAction<{ roomId: number; messageId: number }>,
    ) => {
      state.myLastReadMessageIdsByRoom[action.payload.roomId] =
        action.payload.messageId;
    },
  },
});

export const {
  setSelectedRoom,
  ensureRoomLoadStatuses,
  setLatestMessagesByRoom,
  setRoomLoading,
  setRoomLoaded,
  setRoomError,
  setRoomMessages,
  insertMessage,
  updateMessage,
  insertReaction,
  updateReaction,
  deleteReaction,
  setMyLastReadMessageId,
} = messageSlice.actions;

export default messageSlice.reducer;
