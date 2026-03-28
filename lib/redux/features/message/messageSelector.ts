import { RootState } from "@/lib/redux/store";
import { Message } from "@/types/api/message";

export const selectMessagesByRoom = (state: RootState, roomId: number) => {
  return state.message.messagesByRoom[roomId] ?? [];
};

export const selectSelectedRoomId = (state: RootState) => {
  return state.message.selectedRoomId;
};

export const selectSelectedRoom = (state: RootState) => {
  return state.message.selectedRoom;
};

export const selectRoomLoadStatus = (state: RootState, roomId: number) => {
  return state.message.loadStatusByRoom[roomId];
};

export const selectRoomLoadStatusByRoom = (state: RootState) => {
  return state.message.loadStatusByRoom;
};

export const selectSelectedRoomMessages = (state: RootState) => {
  return state.message.selectedRoomId
    ? state.message.messagesByRoom[state.message.selectedRoomId as number]
    : [];
};

export const selectLatestMessagesByRoom = (state: RootState) => {
  const entries = Object.entries(
    state.message.messagesByRoom as Record<number, Message[]>,
  ).map(([roomId, messages]) => [
    Number(roomId),
    messages[messages.length - 1] ?? null,
  ]);

  return Object.fromEntries(entries) as Record<number, Message | null>;
};
