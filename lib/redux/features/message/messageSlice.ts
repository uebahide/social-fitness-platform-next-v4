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
  friendLastReadMessageIdsByRoom: Record<number, number | null>;
};

const initialState: MessageState = {
  selectedRoomId: null,
  selectedRoom: null,
  messagesByRoom: {},
  latestMessagesByRoom: {},
  loadStatusByRoom: {},
  myLastReadMessageIdsByRoom: {},
  friendLastReadMessageIdsByRoom: {},
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
      action: PayloadAction<{ roomId: number; message: Message | null }>,
    ) {
      state.latestMessagesByRoom[action.payload.roomId] =
        action.payload.message;
    },
    setRoomIdle(state, action: PayloadAction<number>) {
      state.loadStatusByRoom[action.payload] = "idle";
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
    optimisticInsertReaction: (
      state,
      action: PayloadAction<{
        roomId: number;
        reaction: string;
        messageId: number;
        userId: number;
      }>,
    ) => {
      const { roomId, reaction, messageId, userId } = action.payload;
      const targetMessage = state.messagesByRoom[roomId]?.find(
        (message) => message.id === messageId,
      );
      if (!targetMessage) return;
      targetMessage.reactions.push({
        id: -(Date.now() + Math.floor(Math.random() * 1000)), //temp id
        reaction,
        user_id: userId,
        message_id: messageId,
        created_at: new Date().toISOString(),
      });
    },
    reconcileInsertReaction: (
      state,
      action: PayloadAction<{
        reaction: MessageReaction;
        userId: number;
        messageId: number;
      }>,
    ) => {
      const { reaction, userId, messageId } = action.payload;
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
        // remove optimistic reactions first by filtering only positive ids
        message.reactions = message.reactions.filter(
          (reaction) =>
            !(
              reaction.id < 0 &&
              reaction.user_id === userId &&
              reaction.message_id === messageId
            ),
        );
        message.reactions.push(reaction);
      }
    },
    reconcileUpdateReaction: (
      state,
      action: PayloadAction<MessageReaction>,
    ) => {
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
    reconcileDeleteReaction: (
      state,
      action: PayloadAction<MessageReaction>,
    ) => {
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
    rollbackReactionInsert: (
      state,
      action: PayloadAction<{
        roomId: number;
        userId: number;
        messageId: number;
      }>,
    ) => {
      const { roomId, userId, messageId } = action.payload;
      const targetMessage = state.messagesByRoom[roomId]?.find(
        (message) => message.id === messageId,
      );
      if (!targetMessage) return;
      targetMessage.reactions = targetMessage.reactions.filter(
        (reaction) =>
          !(
            reaction.id < 0 &&
            reaction.user_id === userId &&
            reaction.message_id === messageId
          ),
      );
    },
    setMyLastReadMessageId: (
      state,
      action: PayloadAction<{ roomId: number; messageId: number }>,
    ) => {
      state.myLastReadMessageIdsByRoom[action.payload.roomId] =
        action.payload.messageId;
    },
    setFriendLastReadMessageId: (
      state,
      action: PayloadAction<{ roomId: number; messageId: number }>,
    ) => {
      state.friendLastReadMessageIdsByRoom[action.payload.roomId] =
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
  optimisticInsertReaction,
  reconcileInsertReaction,
  reconcileUpdateReaction,
  reconcileDeleteReaction,
  rollbackReactionInsert,
  setMyLastReadMessageId,
  setFriendLastReadMessageId,
  setRoomIdle,
} = messageSlice.actions;

export default messageSlice.reducer;
