import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import { FaceIcon } from "@radix-ui/react-icons";
import { EmojiClickData } from "emoji-picker-react";
import { startTransition, useActionState } from "react";
import { addReaction } from "./action";

const initialState = {
  errors: {},
  message: "",
  data: {},
  ok: false,
};

export const ReactionMenu = ({
  setIsSubMenuOpen,
  messageId,
}: {
  setIsSubMenuOpen: (show: boolean) => void;
  messageId: number;
}) => {
  const [, formAction] = useActionState(addReaction, initialState);

  const onSelectEmoji = (emojiObject: EmojiClickData) => {
    const formData = new FormData();
    formData.append("messageId", String(messageId));
    formData.append("reaction", emojiObject.emoji);
    startTransition(() => {
      formAction(formData);
    });
  };
  return (
    <EmojiPickerButton
      onEmojiClick={onSelectEmoji}
      closeOnEmojiClick={true}
      reactionsDefaultOpen={true}
      pickerClassName="absolute bottom-12 right-0"
      onShowChange={(show: boolean) => setIsSubMenuOpen(show)}
    >
      <FaceIcon className="size-4" />
    </EmojiPickerButton>
  );
};
