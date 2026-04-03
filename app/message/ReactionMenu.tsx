import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import { FaceIcon } from "@radix-ui/react-icons";
import { EmojiClickData } from "emoji-picker-react";
import { startTransition, useActionState, useEffect } from "react";
import {
  addReaction,
  deleteReaction,
  ReactionActionState,
  updateReaction,
} from "./reactionAction";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/message";
import { useUser } from "@/contexts/UserProvider";
import {
  optimisticInsertReaction,
  rollbackReactionInsert,
  reconcileInsertReaction,
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
  const [, formActionUpdate] = useActionState(updateReaction, initialState);
  const [, formActionDelete] = useActionState(deleteReaction, initialState);
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
    // if there is a pending reaction, do not allow to select / update / delete an emoji
    if (pendingReaction) {
      return;
    }
    // if there is a confirmed reaction, update the reaction
    const formData = new FormData();
    formData.append("messageId", String(message.id));
    formData.append("reaction", emojiObject.emoji);
    formData.append("reactionId", String(confirmedReaction?.id));

    // insert new reaction
    if (notReactedYet) {
      //optimistic insert reaction to redux store
      dispatch(
        optimisticInsertReaction({
          roomId: message.room_id,
          reaction: emojiObject.emoji,
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

    const isSameReaction = confirmedReaction?.reaction === emojiObject.emoji;
    if (isSameReaction) {
      //delete reaction
      startTransition(() => {
        console.log("delete reaction");
        formActionDelete(formData);
      });
    } else {
      //update reaction
      startTransition(() => {
        console.log("update reaction");
        formActionUpdate(formData);
      });
    }
  };

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

  useEffect(() => {
    if (stateInsert.ok) {
      dispatch(
        reconcileInsertReaction({
          reaction: stateInsert.data as MessageReaction,
          userId: user?.id as number,
          messageId: message.id,
        }),
      );
    }
  }, [
    stateInsert.ok,
    dispatch,
    message.room_id,
    message.id,
    stateInsert.data,
    user?.id,
  ]);

  return (
    <>
      <EmojiPickerButton
        onEmojiClick={onSelectEmoji}
        closeOnEmojiClick={true}
        reactionsDefaultOpen={true}
        pickerClassName={cn(
          "absolute bottom-12",
          isMyMessage ? "right-0" : "left-0",
        )}
        onShowChange={(show: boolean) => setIsSubMenuOpen(show)}
      >
        <FaceIcon className="size-4" />
      </EmojiPickerButton>
    </>
  );
};
