import { MessageList } from "./MessageList";
import { Room } from "@/types/api/message";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { useMessageEditor } from "@/contexts/MessageEditorProvider";
import { MessageEditInput } from "./MessageEditInput";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRoomLoadStatus,
  selectSelectedRoom,
  selectSelectedRoomId,
} from "@/lib/redux/features/message/messageSelector";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RootState } from "@/lib/redux/store";
import { setRoomLoaded } from "@/lib/redux/features/message/messageSlice";

export const MessagePanel = () => {
  const { selectedMessage } = useMessageEditor();
  const selectedRoom = useSelector(selectSelectedRoom) as Room | null;
  const dispatch = useDispatch();
  const supabase = createClient();
  const selectedRoomId = useSelector(selectSelectedRoomId);
  const roomLoadStatus = useSelector((state: RootState) =>
    selectRoomLoadStatus(state, selectedRoomId as number),
  );

  // fetch messages when the room is selected
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          "*, user:profiles(id, display_name, email, image_path, created_at), reactions:message_reactions(*)",
        )
        .eq("room_id", selectedRoomId as number);

      if (error) {
        console.error(error);
        return;
      }

      dispatch(
        setRoomLoaded({
          roomId: selectedRoomId as number,
          messages: data ?? [],
        }),
      );
    };

    if (roomLoadStatus === "idle") {
      fetchMessages();
    }
  }, [roomLoadStatus, selectedRoomId, dispatch, supabase]);

  return (
    <div className="bg-card flex min-w-0 w-full flex-col rounded-r-sm border border-gray-200">
      {!selectedRoom ? (
        <EmptyMessagePanel />
      ) : (
        <>
          <ChatHeader />
          <MessageList />
          {selectedMessage ? <MessageEditInput /> : <MessageInput />}
        </>
      )}
    </div>
  );
};

const EmptyMessagePanel = () => {
  return (
    <div className="flex h-[calc(100vh-95px)] flex-col items-center justify-center gap-4">
      <h1 className="text-center text-sm font-medium text-gray-500">
        Select a message room to start chatting
      </h1>
    </div>
  );
};
