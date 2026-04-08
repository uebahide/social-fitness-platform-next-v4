import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import { FaceIcon } from "@radix-ui/react-icons";
import { EmojiClickData } from "emoji-picker-react";
import { startTransition, useActionState, useEffect, useState } from "react";
import {
  addReaction,
  deleteReaction,
  ReactionActionState,
  ReactionDeleteActionState,
  ReactionUpdateActionState,
  updateReaction,
} from "./reactionAction";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/message";
import { useUser } from "@/contexts/UserProvider";
import {
  optimisticInsertReaction,
  rollbackReactionInsert,
  reconcileInsertReaction,
  optimisticUpdateReaction,
  rollbackUpdateReaction,
  reconcileUpdateReaction,
  optimisticDeleteReaction,
  reconcileDeleteReaction,
  rollbackDeleteReaction,
} from "@/lib/redux/features/message/messageSlice";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { MessageReaction } from "@/types/api/messageReactions";

const initialState: ReactionActionState = {
  errors: {},
  message: "",
  data: null,
  ok: false,
};

const initialStateUpdate: ReactionUpdateActionState = {
  errors: {},
  message: "",
  data: null,
  ok: false,
  oldEmoji: "",
  snapshotReaction: {} as MessageReaction,
};

const initialStateDelete: ReactionDeleteActionState = {
  errors: {},
  message: "",
  data: null,
  ok: false,
  snapshotReaction: {} as MessageReaction,
};

export const ReactionMenu = ({
  setIsSubMenuOpen,
  message,
  isMyMessage,
}: {
  setIsSubMenuOpen: (show: boolean) => void;
  message: Message;
  isMyMessage: boolean;
}) => {
  const [stateInsert, formActionInsert] = useActionState(
    addReaction,
    initialState,
  );
  const [stateUpdate, formActionUpdate] = useActionState(
    updateReaction,
    initialStateUpdate,
  );
  const [stateDelete, formActionDelete] = useActionState(
    deleteReaction,
    initialStateDelete,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useUser();
  const dispatch = useDispatch();
  const reactions = message.reactions;
  const confirmedReaction = reactions?.find(
    (reaction) => reaction.user_id === user?.id && reaction.id > 0,
  );
  const pendingReaction = reactions?.find(
    (reaction) => reaction.user_id === user?.id && reaction.id < 0,
  );
  const notReactedYet = confirmedReaction ? false : true;

  const onSelectEmoji = (emojiObject: EmojiClickData) => {
    // if there is a pending reaction or is updating, do not allow to select / update / delete an emoji
    if (pendingReaction || isUpdating || isDeleting) {
      return;
    }
    // if there is a confirmed reaction, update the reaction
    const formData = new FormData();
    formData.append("messageId", String(message.id));
    formData.append("emoji", emojiObject.emoji);
    formData.append("reactionId", String(confirmedReaction?.id));

    // insert new reaction
    if (notReactedYet) {
      //optimistic insert reaction to redux store
      dispatch(
        optimisticInsertReaction({
          roomId: message.room_id,
          emoji: emojiObject.emoji,
          messageId: message.id,
          userId: user?.id as number,
        }),
      );
      //submit reaction to server
      startTransition(() => {
        formActionInsert(formData);
      });
      return;
    }

    const isSameReaction = confirmedReaction?.emoji === emojiObject.emoji;
    //save snapshot of reaction to rollback
    formData.append(
      "snapshotReaction",
      JSON.stringify(confirmedReaction as MessageReaction),
    );
    if (isSameReaction) {
      //delete reaction
      setIsDeleting(true);
      dispatch(
        optimisticDeleteReaction({
          confirmedReaction: confirmedReaction as MessageReaction,
        }),
      );
      startTransition(() => {
        console.log("delete reaction");
        formActionDelete(formData);
      });
    } else {
      //update reaction
      setIsUpdating(true);
      const newEmoji = emojiObject.emoji;
      const oldEmoji = confirmedReaction?.emoji;
      formData.append("oldEmoji", oldEmoji as string);
      dispatch(
        optimisticUpdateReaction({
          confirmedReaction: confirmedReaction as MessageReaction,
          newEmoji: newEmoji,
        }),
      );
      startTransition(() => {
        console.log("update reaction");
        formActionUpdate(formData);
      });
    }
  };

  // rollback insert reaction if inserting failed
  useEffect(() => {
    if (Object.keys(stateInsert.errors).length > 0) {
      toast.error("Failed to add reaction");
      dispatch(
        rollbackReactionInsert({
          roomId: message.room_id,
          userId: user?.id as number,
          messageId: message.id,
        }),
      );
    }
  }, [stateInsert.errors, dispatch, message.room_id, message.id, user?.id]);

  // reconcile insert reaction if inserting succeeded
  useEffect(() => {
    if (stateInsert.ok) {
      dispatch(reconcileInsertReaction(stateInsert.data as MessageReaction));
    }
  }, [stateInsert.ok, dispatch, stateInsert.data]);

  // rollback update reaction if updating failed
  useEffect(() => {
    if (Object.keys(stateUpdate.errors).length > 0) {
      toast.error("Failed to update reaction");
      dispatch(
        rollbackUpdateReaction({
          confirmedReaction: stateUpdate.snapshotReaction as MessageReaction,
          oldEmoji: stateUpdate.oldEmoji,
        }),
      );
      startTransition(() => {
        setIsUpdating(false);
      });
    }
  }, [
    stateUpdate.errors,
    dispatch,
    stateUpdate.snapshotReaction,
    stateUpdate.oldEmoji,
  ]);

  // reconcile update reaction if updating succeeded
  useEffect(() => {
    if (stateUpdate.ok) {
      dispatch(reconcileUpdateReaction(stateUpdate.data as MessageReaction));
      startTransition(() => {
        setIsUpdating(false);
      });
    }
  }, [stateUpdate.ok, dispatch, stateUpdate.data]);

  // rollback delete reaction if deleting failed
  useEffect(() => {
    if (Object.keys(stateDelete.errors).length > 0) {
      toast.error("Failed to delete reaction");
      dispatch(
        rollbackDeleteReaction(stateDelete.snapshotReaction as MessageReaction),
      );
      startTransition(() => {
        setIsDeleting(false);
      });
    }
  }, [stateDelete.errors, dispatch, stateDelete.snapshotReaction]);

  // reconcile delete reaction if deleting succeeded
  useEffect(() => {
    if (stateDelete.ok) {
      dispatch(reconcileDeleteReaction(stateDelete.data as MessageReaction));
      startTransition(() => {
        setIsDeleting(false);
      });
    }
  }, [stateDelete.ok, dispatch, stateDelete.data]);

  return (
    <EmojiPickerButton
      onEmojiClick={onSelectEmoji}
      closeOnEmojiClick={true}
      reactionsDefaultOpen={true}
      pickerClassName={cn(
        "absolute bottom-12",
        isMyMessage ? "right-0" : "left-0",
        isUpdating ? "opacity-50" : "",
      )}
      onShowChange={(show: boolean) => setIsSubMenuOpen(show)}
    >
      <FaceIcon className="size-4" />
    </EmojiPickerButton>
  );
};
