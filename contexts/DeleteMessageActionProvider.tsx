"use client";

import { deleteMessage, DeleteMessageState } from "@/app/message/messageAction";
import { Message } from "@/types/api/message";
import { createContext, useActionState, useContext, useState } from "react";

const initialState: DeleteMessageState = {
  error: "",
  message: "",
  ok: false,
};

const DeleteMessageActionContext = createContext<{
  deleteMessageAction: (payload: FormData) => void;
  isMessageDeleting: boolean;
  setIsMessageDeleting: (isMessageDeleting: boolean) => void;
  deleteMessageState: DeleteMessageState;
  message: Message | null;
  setMessage: (message: Message | null) => void;
}>({
  deleteMessageAction: () => {},
  isMessageDeleting: false,
  setIsMessageDeleting: () => {},
  deleteMessageState: initialState,
  message: null,
  setMessage: () => {},
});

export const DeleteMessageActionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isMessageDeleting, setIsMessageDeleting] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [deleteMessageState, deleteMessageAction] = useActionState(
    deleteMessage,
    initialState,
  );
  return (
    <DeleteMessageActionContext.Provider
      value={{
        deleteMessageAction,
        isMessageDeleting,
        setIsMessageDeleting,
        deleteMessageState,
        message,
        setMessage,
      }}
    >
      {children}
    </DeleteMessageActionContext.Provider>
  );
};

export const useDeleteMessageAction = () => {
  return useContext(DeleteMessageActionContext);
};
