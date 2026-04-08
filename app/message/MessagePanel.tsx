"use client";

import { MessageList } from "./MessageList";
import { Message, Room } from "@/types/api/message";
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
import { startTransition, useActionState, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { RootState } from "@/lib/redux/store";
import {
  setRoomLoaded,
  setRoomLoading,
  setRoomError,
  setRoomIdle,
  rollbackUpdateMessage,
  reconcileUpdateMessage,
  rollbackDeleteMessage,
  reconcileDeleteMessage,
} from "@/lib/redux/features/message/messageSlice";
import { MessageListSkeleton } from "@/components/skeletons/MessageListSkeleton";
import { Button } from "@/components/ui/button";
import { EditMessageState, editTextMessage } from "./messageAction";
import { toast } from "sonner";
import { useDeleteMessageAction } from "@/contexts/DeleteMessageActionProvider";

const initialState: EditMessageState = {
  error: "",
  message: "",
  data: null,
  ok: false,
  snapshotSelectedMessage: {} as Message,
};

export const MessagePanel = () => {
  const { selectedMessage } = useMessageEditor();
  const selectedRoom = useSelector(selectSelectedRoom) as Room | null;
  const dispatch = useDispatch();
  const selectedRoomId = useSelector(selectSelectedRoomId);
  const roomLoadStatus = useSelector((state: RootState) =>
    selectRoomLoadStatus(state, selectedRoomId as number),
  );
  const [retryKey, setRetryKey] = useState<number>(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTextMessageState, editTextMessageformAction] = useActionState(
    editTextMessage,
    initialState,
  );
  const { setIsMessageDeleting, deleteMessageState, message, setMessage } =
    useDeleteMessageAction();

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

  // if the message update fails, rollback the message
  useEffect(() => {
    if (
      editTextMessageState.error !== "" &&
      editTextMessageState.ok === false
    ) {
      toast.error("Updating message failed");
      dispatch(
        rollbackUpdateMessage(editTextMessageState.snapshotSelectedMessage),
      );
      startTransition(() => {
        setIsUpdating(false);
      });
    }
  }, [
    editTextMessageState.error,
    editTextMessageState.ok,
    dispatch,
    editTextMessageState.snapshotSelectedMessage,
  ]);

  // if the messageupdate succeeds, set the message to the new message
  useEffect(() => {
    if (editTextMessageState.ok === true && editTextMessageState.data) {
      dispatch(reconcileUpdateMessage(editTextMessageState.data));
      startTransition(() => {
        setIsUpdating(false);
      });
    }
  }, [editTextMessageState.ok, dispatch, editTextMessageState.data]);

  // rollback delete message if deleting message is failed
  useEffect(() => {
    if (
      deleteMessageState.error !== "" &&
      deleteMessageState.ok === false &&
      message !== null
    ) {
      toast.error("Failed to delete message");
      dispatch(rollbackDeleteMessage(message as Message));
      startTransition(() => {
        setIsMessageDeleting(false);
        setMessage(null);
      });
    }
  }, [message, dispatch, deleteMessageState, setIsMessageDeleting, setMessage]);

  // reconcile delete message if deleting message is successful
  useEffect(() => {
    if (deleteMessageState.ok && message !== null) {
      dispatch(reconcileDeleteMessage(message as Message));
      startTransition(() => {
        setIsMessageDeleting(false);
        setMessage(null);
      });
    }
  }, [
    deleteMessageState.ok,
    message,
    dispatch,
    setIsMessageDeleting,
    setMessage,
  ]);

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
            <MessageInput />
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
