import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import { FaceIcon } from "@radix-ui/react-icons";
import { EmojiClickData } from "emoji-picker-react";
import { startTransition, useActionState } from "react";
import { addReaction, deleteReaction, updateReaction } from "./action";
import { cn } from "@/lib/utils";
import { Message } from "@/types/api/message";
import { useUser } from "@/contexts/UserProvider";

const initialState = {
  errors: {},
  message: "",
  data: {},
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
  const [, formActionInsert] = useActionState(addReaction, initialState);
  const [, formActionUpdate] = useActionState(updateReaction, initialState);
  const [, formActionDelete] = useActionState(deleteReaction, initialState);
  const { user } = useUser();
  const reactions = message.reactions;
  const myReaction = reactions.find(
    (reaction) => reaction.user_id === user?.id,
  );
  const notReactedYet = myReaction ? false : true;

  const onSelectEmoji = (emojiObject: EmojiClickData) => {
    const formData = new FormData();
    formData.append("messageId", String(message.id));
    formData.append("reaction", emojiObject.emoji);
    formData.append("reactionId", String(myReaction?.id));

    if (notReactedYet) {
      startTransition(() => {
        formActionInsert(formData);
      });
      return;
    }

    const isSameReaction = myReaction?.reaction === emojiObject.emoji;
    if (isSameReaction) {
      startTransition(() => {
        console.log("delete reaction");
        formActionDelete(formData);
      });
    } else {
      startTransition(() => {
        console.log("update reaction");
        formActionUpdate(formData);
      });
    }
  };

  return (
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
  );
};
