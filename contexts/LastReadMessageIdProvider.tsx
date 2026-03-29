"use client";

import { createContext, useContext, useState } from "react";

type LastReadMessageIdContextType = {
  friendLastReadMessageId: number | null;
  setFriendLastReadMessageId: (friendLastReadMessageId: number | null) => void;
};

const LastReadMessageIdContext = createContext<
  LastReadMessageIdContextType | undefined
>(undefined);

export const LastReadMessageIdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friendLastReadMessageId, setFriendLastReadMessageId] = useState<
    number | null
  >(null);

  return (
    <LastReadMessageIdContext.Provider
      value={{ friendLastReadMessageId, setFriendLastReadMessageId }}
    >
      {children}
    </LastReadMessageIdContext.Provider>
  );
};

export const useLastReadMessageId = () => {
  const context = useContext(LastReadMessageIdContext);
  if (!context)
    throw new Error(
      "useLastReadMessageId must be used within LastReadMessageIdProvider",
    );
  return context;
};
