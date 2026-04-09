import { useUser } from "@/contexts/UserProvider";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectSelectedRoom,
  selectSelectedRoomId,
  selectSelectedRoomMessages,
} from "@/lib/redux/features/message/messageSelector";
import { createClient } from "@/lib/supabase/client";
import { useAutoScrollDown } from "@/hooks/useAutoScrollDownByProps";
import {
  setFriendLastReadMessageId,
  setMyLastReadMessageId,
} from "@/lib/redux/features/message/messageSlice";
import { Room } from "@/types/api/message";
import { MessageGroup } from "./MessageGroup";
import { EmptyState } from "@/components/states/EmptyState";
import { Avatar } from "@/components/Avatar";

export const MessageList = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectSelectedRoomMessages);
  const selectedRoomId = useSelector(selectSelectedRoomId) as number;
  const { containerRef } = useAutoScrollDown(messages?.length, selectedRoomId);
  const selectedRoom = useSelector(selectSelectedRoom) as Room;

  const user = useUser();
  const friend = selectedRoom.users.find((_user) => _user.id !== user.user?.id);

  const handledMessageIdRef = useRef<number | null>(null);

  // fetch friend's last read message id when the room is selected
  useEffect(() => {
    const supabase = createClient();
    const fetchFriendLastReadMessageId = async () => {
      const { data, error } = await supabase
        .from("room_user")
        .select("last_read_message_id")
        .eq("room_id", selectedRoom.id)
        .eq("user_id", friend?.id)
        .single();
      if (error) {
        console.error(error);
        return;
      }
      dispatch(
        setFriendLastReadMessageId({
          roomId: selectedRoomId,
          messageId: data.last_read_message_id ?? 0,
        }),
      );
    };
    void fetchFriendLastReadMessageId();
  }, [selectedRoomId, user?.user?.id, dispatch, selectedRoom, friend?.id]);

  // sync my last read status when the room is selected or receive a new message
  useEffect(() => {
    if (selectedRoomId == null) return;
    if (!user.user?.id) return;
    if (!messages || messages.length === 0) return;

    // get the latest message
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage) return;

    // prevent running the same latest message multiple times
    if (handledMessageIdRef.current === latestMessage.id) return;

    // if the latest message is my message, don't update my last read status
    if (latestMessage.user_id === user.user.id) {
      handledMessageIdRef.current = latestMessage.id;
      return;
    }

    // sync my last read status to the database
    const syncFriendLastReadMessageId = async () => {
      const supabase = createClient();
      const { error } = await supabase
        .from("room_user")
        .update({
          last_read_message_id: latestMessage.id,
        })
        .eq("room_id", selectedRoomId)
        .eq("user_id", user?.user?.id);

      if (error) {
        console.error(error);
        return;
      }
    };

    // set the my last read message id to the redux store
    dispatch(
      setMyLastReadMessageId({
        roomId: selectedRoomId,
        messageId: latestMessage.id,
      }),
    );

    // set the handled message id to the ref to prevent running the same latest message multiple times
    handledMessageIdRef.current = latestMessage.id;

    void syncFriendLastReadMessageId();
  }, [selectedRoomId, messages, user.user?.id, dispatch]);

  const friendDisplayName = selectedRoom.users.find(
    (_user) => _user.id !== user.user?.id,
  )?.display_name;
  return (
    <section
      ref={containerRef}
      className="flex h-[calc(100vh-258px)] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4"
    >
      <header className="flex items-center justify-center flex-col gap-4 mt-4 mb-8">
        <Avatar size="large" user={friend} />
        <h2 className="text-xl font-bold">{friendDisplayName}</h2>
      </header>

      {messages && messages.length > 0 ? (
        messages.map((message) => (
          <MessageGroup key={message.id} message={message} />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 h-1/2">
          <EmptyState
            data-testid="message-empty-conversation-state"
            title="No messages yet"
            description={`Start a conversation with ${friendDisplayName} to see your messages here 💬`}
          />
        </div>
      )}
    </section>
  );
};
