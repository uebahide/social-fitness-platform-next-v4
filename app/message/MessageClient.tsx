"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MessagePanel } from "./MessagePanel";
import { MessageSidebar } from "./MessageSidebar";
import { Message, Room } from "@/types/api/message";
import { useRealtimeMessages } from "@/hooks/useRealtimeMessages";
import { useDispatch, useSelector } from "react-redux";
import {
  realtimeInsertTextMessage,
  ensureRoomLoadStatuses,
  setSelectedRoom,
  reconcileUpdateMessage,
  reconcileDeleteMessage,
  setMyLastReadMessageId,
  setFriendLastReadMessageId,
  setLatestMessagesByRoom,
  reconcileUpdateReaction,
  reconcileDeleteReaction,
  reconcileInsertReaction,
  rollbackInsertTextMessage,
  reconcileInsertTextMessage,
  rollbackInsertImagesMessage,
  reconcileInsertImagesMessage,
  rollbackUpdateMessage,
  rollbackDeleteMessage,
} from "@/lib/redux/features/message/messageSlice";
import { getUserById } from "@/lib/client/getUserById";
import { roomUser } from "@/types/api/roomUser";
import { useRealtimeReadStatus } from "@/hooks/useRealtimeReadStatus";
import { useUser } from "@/contexts/UserProvider";
import { MessageReaction } from "@/types/api/messageReactions";
import { useRealtimeMessageReactions } from "@/hooks/useRealtimeMessageReactions";
import {
  DeleteMessageActionProvider,
  useDeleteMessageAction,
} from "@/contexts/DeleteMessageActionProvider";
import { selectSelectedRoom } from "@/lib/redux/features/message/messageSelector";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  EditMessageState,
  editTextMessage,
  sendImages,
  SendImagesState,
  sendText,
  SendTextState,
} from "./messageAction";
import { toast } from "sonner";

const initialState: EditMessageState = {
  error: "",
  message: "",
  data: null,
  ok: false,
  snapshotSelectedMessage: {} as Message,
};

const initialSendTextState: SendTextState = {
  error: "",
  message: "",
  data: null,
  ok: false,
  optimisticMessageId: 0,
  roomId: -1,
};

const initialSendImagesState: SendImagesState = {
  error: "",
  message: "",
  data: null,
  ok: false,
  optimisticMessageId: 0,
  roomId: -1,
};

export const MessageClient = ({
  rooms,
  friendId,
  myLastReadMessageIdsByRoom,
  friendLastReadMessageIdsByRoom,
  latestMessagesByRoom,
}: {
  rooms: Room[];
  friendId?: string;
  myLastReadMessageIdsByRoom: {
    room_id: number;
    last_read_message_id: number;
  }[];
  friendLastReadMessageIdsByRoom: {
    room_id: number;
    last_read_message_id: number;
  }[];
  latestMessagesByRoom: Record<number, Message | null>;
}) => {
  const isMobile = useIsMobile();
  const selectedRoom = useSelector(selectSelectedRoom);
  const dispatch = useDispatch();
  const user = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [editTextMessageState, editTextMessageformAction] = useActionState(
    editTextMessage,
    initialState,
  );
  const { setIsMessageDeleting, deleteMessageState, message, setMessage } =
    useDeleteMessageAction();
  const [sendTextState, formActionSendText] = useActionState(
    sendText,
    initialSendTextState,
  );
  const [sendImagesState, formActionSendImages] = useActionState(
    sendImages,
    initialSendImagesState,
  );
  const roomIds = useMemo(() => rooms.map((room) => room.id), [rooms]);
  const realtimeRoomIds = useMemo(
    () => rooms.map((room) => room.id.toString()),
    [rooms],
  );
  const preferredRoom = useMemo(() => {
    if (friendId) {
      return (
        rooms.find((room) =>
          room.users.some((user) => user.id === Number(friendId)),
        ) ?? null
      );
    }

    if (rooms.length === 1) {
      return rooms[0];
    }

    return null;
  }, [friendId, rooms]);

  // set latest messages by room in redux
  useEffect(() => {
    roomIds.forEach((roomId) => {
      dispatch(
        setLatestMessagesByRoom({
          roomId: roomId,
          message: latestMessagesByRoom[roomId] ?? null,
        }),
      );
    });
  }, [dispatch, latestMessagesByRoom, roomIds]);

  // set my last read message id for each room in redux
  useEffect(() => {
    myLastReadMessageIdsByRoom.forEach((item) => {
      dispatch(
        setMyLastReadMessageId({
          roomId: item.room_id,
          messageId: item.last_read_message_id,
        }),
      );
    });
  }, [dispatch, myLastReadMessageIdsByRoom]);

  // set friend last read message id for each room in redux
  useEffect(() => {
    friendLastReadMessageIdsByRoom.forEach((item) => {
      dispatch(
        setFriendLastReadMessageId({
          roomId: item.room_id,
          messageId: item.last_read_message_id ?? 0,
        }),
      );
    });
  }, [dispatch, friendLastReadMessageIdsByRoom]);

  // ensure room load statuses in redux
  useEffect(() => {
    dispatch(ensureRoomLoadStatuses(roomIds));
  }, [dispatch, roomIds]);

  useEffect(() => {
    if (preferredRoom) {
      dispatch(setSelectedRoom(preferredRoom));
    }
  }, [dispatch, preferredRoom, rooms]);

  // realtime insert message
  const onInsert = async (newMessage: Message) => {
    const user = await getUserById(newMessage.user_id);
    newMessage.user = user;
    newMessage.reactions = [];
    dispatch(realtimeInsertTextMessage(newMessage));
  };

  // realtime update message
  const onUpdate = async (message: Message) => {
    const user = await getUserById(message.user_id);
    message.user = user;
    dispatch(reconcileUpdateMessage(message));
  };

  // realtime update message
  const onDelete = async (message: Message) => {
    dispatch(reconcileDeleteMessage(message));
  };

  useRealtimeMessages(realtimeRoomIds, onInsert, onUpdate, onDelete);

  // realtime update read status
  const onReadUpdate = (roomUser: roomUser) => {
    if (roomUser.user_id !== user.user?.id) {
      dispatch(
        setFriendLastReadMessageId({
          roomId: roomUser.room_id,
          messageId: roomUser.last_read_message_id ?? 0,
        }),
      );
    }
  };

  useRealtimeReadStatus(realtimeRoomIds, onReadUpdate);

  // realtime update reaction
  const onReactionInsert = (reaction: MessageReaction) => {
    dispatch(reconcileInsertReaction(reaction));
  };

  const onReactionUpdate = (reaction: MessageReaction) => {
    dispatch(reconcileUpdateReaction(reaction));
  };

  const onReactionDelete = (reaction: MessageReaction) => {
    dispatch(reconcileDeleteReaction(reaction));
  };

  useRealtimeMessageReactions(
    realtimeRoomIds,
    onReactionInsert,
    onReactionUpdate,
    onReactionDelete,
  );

  // rollback update message if update message is failed
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

  // reconcile update message if update message is successful
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

  //rollback optimistic text message if error occurs
  useEffect(() => {
    if (sendTextState.error && !sendTextState.ok) {
      toast.error(sendTextState.error);
      dispatch(
        rollbackInsertTextMessage({
          roomId: sendTextState.roomId,
          optimisticMessageId: sendTextState.optimisticMessageId,
        }),
      );
    }
  }, [
    sendTextState.error,
    sendTextState.ok,
    sendTextState.roomId,
    sendTextState.optimisticMessageId,
    dispatch,
  ]);

  //reconcile optimistic text message with confirmed message
  useEffect(() => {
    if (sendTextState.ok && sendTextState.data) {
      dispatch(
        reconcileInsertTextMessage({
          message: sendTextState.data,
          optimisticMessageId: sendTextState.optimisticMessageId,
        }),
      );
    }
  }, [
    sendTextState.ok,
    sendTextState.data,
    dispatch,
    sendTextState.optimisticMessageId,
  ]);

  //rollback optimistic images message if error occurs
  useEffect(() => {
    if (sendImagesState.error && !sendImagesState.ok) {
      toast.error(sendImagesState.error);
      dispatch(
        rollbackInsertImagesMessage({
          roomId: sendImagesState.roomId,
          optimisticMessageId: sendImagesState.optimisticMessageId,
        }),
      );
    }
  }, [
    sendImagesState.error,
    sendImagesState.ok,
    sendImagesState.roomId,
    sendImagesState.optimisticMessageId,
    dispatch,
  ]);

  //reconcile optimistic images message with confirmed message
  useEffect(() => {
    if (sendImagesState.ok && sendImagesState.data) {
      dispatch(
        reconcileInsertImagesMessage({
          messages: sendImagesState.data,
          optimisticMessageId: sendImagesState.optimisticMessageId,
        }),
      );
    }
  }, [
    sendImagesState.ok,
    sendImagesState.data,
    dispatch,
    sendImagesState.optimisticMessageId,
  ]);

  // mobile view
  if (isMobile) {
    return (
      <div className="grid grid-cols-1 min-w-0 z-0">
        {selectedRoom ? (
          <MessagePanel
            formActionSendText={formActionSendText}
            formActionSendImages={formActionSendImages}
            isUpdating={isUpdating}
            setIsUpdating={setIsUpdating}
            editTextMessageformAction={editTextMessageformAction}
          />
        ) : (
          <MessageSidebar rooms={rooms} />
        )}
      </div>
    );
  }

  // desktop view
  return (
    <div className="grid min-w-0 grid-cols-[4fr_9fr] z-0">
      <MessageSidebar rooms={rooms} />
      <MessagePanel
        formActionSendText={formActionSendText}
        formActionSendImages={formActionSendImages}
        isUpdating={isUpdating}
        setIsUpdating={setIsUpdating}
        editTextMessageformAction={editTextMessageformAction}
      />
    </div>
  );
};
