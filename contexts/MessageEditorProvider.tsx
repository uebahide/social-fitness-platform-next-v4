"use client";

import { Message } from "@/types/api/message";
import { createContext, useContext, useState } from "react";

type MessageEditorContextType = {
  selectedMessage: Message | null;
  setSelectedMessage: (message: Message | null) => void;
};

const MessageEditorContext = createContext<
  MessageEditorContextType | undefined
>(undefined);

export const MessageEditorProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  return (
    <MessageEditorContext.Provider
      value={{ selectedMessage, setSelectedMessage }}
    >
      {children}
    </MessageEditorContext.Provider>
  );
};

export const useMessageEditor = () => {
  const context = useContext(MessageEditorContext);
  if (!context)
    throw new Error(
      "useMessageEditor must be used within MessageEditorProvider",
    );
  return context;
};
