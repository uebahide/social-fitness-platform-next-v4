import { useEffect, useState } from "react";
import { MessageList } from "./MessageList";
import { Message, Room } from "@/types/api/message";
import { ChatHeader } from "./ChatHeader";
import { MessageInput } from "./MessageInput";
import { useMessageEditor } from "@/contexts/MessageEditorProvider";
import { MessageEditInput } from "./MessageEditInput";
import { useMessages } from "@/hooks/useMessages";

export const MessagePanel = ({
  selectedRoom,
  realtimeMessages,
  updatedMessage,
  setUpdatedMessage,
}: {
  selectedRoom: Room | null;
  realtimeMessages: Message[];
  updatedMessage: Message | null;
  setUpdatedMessage: (message: Message | null) => void;
}) => {
  const { selectedMessage } = useMessageEditor();
  const { messages, setMessages } = useMessages(selectedRoom);

  //handle new messages realtime update
  useEffect(() => {
    if (!selectedRoom || realtimeMessages.length === 0) return;

    setMessages((prev) => {
      const newMessages = realtimeMessages.filter(
        (message) =>
          message.room_id === selectedRoom.id &&
          !prev.some((prevMessage) => prevMessage.id === message.id),
      );

      if (newMessages.length === 0) return prev;
      return [...prev, ...newMessages];
    });
  }, [realtimeMessages, selectedRoom, setMessages]);

  //handle edited & deleted message realtime update
  useEffect(() => {
    if (!updatedMessage) return;

    setMessages((prev) =>
      prev.map((message) =>
        message.id === updatedMessage.id ? updatedMessage : message,
      ),
    );
    setUpdatedMessage(null);
  }, [updatedMessage, setMessages, setUpdatedMessage]);

  return (
    <div className="bg-card flex min-w-0 w-full flex-col rounded-r-sm border border-gray-200">
      {!selectedRoom ? (
        <div className="flex h-[calc(100vh-95px)] flex-col items-center justify-center gap-4">
          <h1 className="text-center text-sm font-medium text-gray-500">
            Select a message room to start chatting
          </h1>
        </div>
      ) : (
        <>
          <ChatHeader room={selectedRoom} />
          <MessageList messages={messages} />
          {selectedMessage ? (
            <MessageEditInput />
          ) : (
            <MessageInput selectedRoom={selectedRoom} />
          )}
        </>
      )}
    </div>
  );
};
