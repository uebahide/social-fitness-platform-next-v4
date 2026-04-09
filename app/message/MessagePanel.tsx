"use client";

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
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RootState } from "@/lib/redux/store";
import {
  setRoomLoaded,
  setRoomLoading,
  setRoomError,
  setRoomIdle,
} from "@/lib/redux/features/message/messageSlice";
import { MessageListSkeleton } from "@/components/skeletons/MessageListSkeleton";
import { Button } from "@/components/ui/button";

export const MessagePanel = ({
  formActionSendText,
  formActionSendImages,
  isUpdating,
  setIsUpdating,
  editTextMessageformAction,
}: {
  formActionSendText: (formData: FormData) => void;
  formActionSendImages: (formData: FormData) => void;
  isUpdating: boolean;
  setIsUpdating: (value: boolean) => void;
  editTextMessageformAction: (formData: FormData) => void;
}) => {
  const dispatch = useDispatch();
  const [retryKey, setRetryKey] = useState<number>(0);
  const { selectedMessage } = useMessageEditor();
  const selectedRoom = useSelector(selectSelectedRoom) as Room | null;
  const selectedRoomId = useSelector(selectSelectedRoomId);
  const roomLoadStatus = useSelector((state: RootState) =>
    selectRoomLoadStatus(state, selectedRoomId as number),
  );

  const handleRetry = () => {
    dispatch(setRoomIdle(selectedRoomId as number));
    setRetryKey((prev) => prev + 1);
  };

  // fetch messages when the room is selected
  useEffect(() => {
    if (selectedRoomId == null) return;

    const supabase = createClient();
    const fetchMessages = async () => {
      dispatch(setRoomLoading(selectedRoomId as number));
      const { data, error } = await supabase
        .from("messages")
        .select(
          "*, user:profiles(id, display_name, email, image_path, created_at), reactions:message_reactions(*)",
        )
        .eq("room_id", selectedRoomId as number)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(error);
        dispatch(setRoomError(selectedRoomId as number));
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
  }, [selectedRoomId, dispatch, retryKey, roomLoadStatus]);

  return (
    <div
      className="bg-card flex min-w-0 w-full flex-col rounded-r-sm border border-gray-200"
      data-testid="message-panel"
    >
      {!selectedRoom ? (
        <EmptyMessagePanel />
      ) : (
        <>
          <ChatHeader />
          {roomLoadStatus === "loading" && <MessageListSkeleton />}
          {roomLoadStatus === "loaded" && <MessageList />}
          {roomLoadStatus === "error" && (
            <div className="flex h-[calc(100vh-95px)] flex-col items-center justify-center gap-4">
              <p className="text-center text-sm font-medium text-gray-500">
                Could not load messages.
              </p>
              <Button variant="outline" onClick={handleRetry}>
                Retry
              </Button>
            </div>
          )}
          {selectedMessage ? (
            <MessageEditInput
              isUpdating={isUpdating}
              setIsUpdating={setIsUpdating}
              editTextMessageformAction={editTextMessageformAction}
            />
          ) : (
            <MessageInput
              formActionSendText={formActionSendText}
              formActionSendImages={formActionSendImages}
            />
          )}
        </>
      )}
    </div>
  );
};

export const EmptyMessagePanel = () => {
  return (
    <div className="flex h-[calc(100vh-95px)] flex-col items-center justify-center gap-4">
      <h1 className="text-center text-sm font-medium text-gray-500">
        Select a message room to start chatting
      </h1>
    </div>
  );
};
