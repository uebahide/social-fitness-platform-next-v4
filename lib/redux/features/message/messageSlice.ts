import { Message, Room } from "@/types/api/message";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type MessageState = {
  selectedRoom: Room | null;
  selectedRoomId: number | null;
  messagesByRoom: Record<number, Message[]>;
  loadStatusByRoom: Record<number, "idle" | "loading" | "loaded" | "error">;
};

const initialState: MessageState = {
  selectedRoomId: null,
  selectedRoom: null,
  messagesByRoom: {},
  loadStatusByRoom: {},
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
    },
    updateMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const current = state.messagesByRoom[message.room_id] ?? [];
      const index = current.findIndex((item) => item.id === message.id);
      if (index !== -1) {
        current[index] = message;
        state.messagesByRoom[message.room_id] = current;
      }
    },
  },
});

export const {
  setSelectedRoom,
  ensureRoomLoadStatuses,
  setRoomLoading,
  setRoomLoaded,
  setRoomError,
  setRoomMessages,
  insertMessage,
  updateMessage,
} = messageSlice.actions;

export default messageSlice.reducer;
