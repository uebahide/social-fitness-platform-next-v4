"use client";

import { createContext, useContext, useState } from "react";

type FriendLastReadMessageIdContextType = {
  friendLastReadMessageId: number | null;
  setFriendLastReadMessageId: (friendLastReadMessageId: number | null) => void;
};

const FriendLastReadMessageIdContext = createContext<
  FriendLastReadMessageIdContextType | undefined
>(undefined);

export const FriendLastReadMessageIdProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [friendLastReadMessageId, setFriendLastReadMessageId] = useState<
    number | null
  >(null);

  return (
    <FriendLastReadMessageIdContext.Provider
      value={{ friendLastReadMessageId, setFriendLastReadMessageId }}
    >
      {children}
    </FriendLastReadMessageIdContext.Provider>
  );
};

export const useLastReadMessageId = () => {
  const context = useContext(FriendLastReadMessageIdContext);
  if (!context)
    throw new Error(
      "useFriendLastReadMessageId must be used within FriendLastReadMessageIdProvider",
    );
  return context;
};
