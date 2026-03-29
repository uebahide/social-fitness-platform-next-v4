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
  return state.message.latestMessagesByRoom;
};

export const selectMyLastReadMessageIdByRoom = (
  state: RootState,
  roomId: number,
) => {
  return state.message.myLastReadMessageIdsByRoom[roomId] ?? null;
};
