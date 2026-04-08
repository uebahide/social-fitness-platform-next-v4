import { startTransition, useEffect, useRef, useState } from "react";
import { MessageSubmitButton, MessageTextarea } from "./MessageInput";

import { useMessageEditor } from "@/contexts/MessageEditorProvider";
import { CheckIcon, XIcon } from "lucide-react";
import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import { EmojiClickData } from "emoji-picker-react";
import { FaceIcon } from "@radix-ui/react-icons";
import { optimisticUpdateMessage } from "@/lib/redux/features/message/messageSlice";
import { useDispatch } from "react-redux";

export const MessageEditInput = ({
  isUpdating,
  setIsUpdating,
  editTextMessageformAction,
}: {
  isUpdating: boolean;
  setIsUpdating: (isUpdating: boolean) => void;
  editTextMessageformAction: (formData: FormData) => void;
}) => {
  const dispatch = useDispatch();
  const formRef = useRef<HTMLFormElement | null>(null);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { selectedMessage, setSelectedMessage } = useMessageEditor();
  const [message, setMessage] = useState(selectedMessage?.body ?? "");

  //handle click outside emoji picker
  useEffect(() => {
    if (!showEmojiPicker) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  //handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage || isUpdating) return;
    if (!message.trim()) return;

    setIsUpdating(true);
    dispatch(
      optimisticUpdateMessage({
        selectedMessage: selectedMessage,
        newBody: message,
      }),
    );

    const formData = new FormData();
    formData.append("message", message);
    formData.append("messageId", String(selectedMessage?.id));
    formData.append("snapshotSelectedMessage", JSON.stringify(selectedMessage));

    startTransition(() => {
      editTextMessageformAction(formData);
    });

    setMessage("");
    setShowEmojiPicker(false);
    setSelectedMessage(null);
  };

  //handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!message.trim()) return;

      formRef.current?.requestSubmit();
    }
  };

  return (
    <div className="space-y-4 p-5 border-t border-gray-200">
      <div className="flex items-center gap-2 justify-between">
        <p>Edit message</p>
        <XIcon
          className="h-5 w-5 cursor-pointer rounded-full p-1  bg-gray-200"
          onClick={() => setSelectedMessage(null)}
        />
      </div>
      <form
        onSubmit={handleSubmit}
        ref={formRef}
        className="flex flex-col items-end gap-2 rounded-lg border border-gray-200 px-4 py-2 relative"
      >
        <div className="flex w-full min-w-0 items-end justify-between gap-2">
          <EmojiPickerButton
            onEmojiClick={(emojiObject: EmojiClickData) => {
              setMessage(message + emojiObject.emoji);
            }}
            pickerClassName="absolute bottom-12 left-0"
          >
            <FaceIcon />
          </EmojiPickerButton>

          <MessageTextarea
            message={message}
            setMessage={setMessage}
            handleKeyDown={handleKeyDown}
          />

          {/* If the message is not the same as the selected message, show the submit button */}
          {message.length > 0 && message !== selectedMessage?.body && (
            <MessageSubmitButton>
              <CheckIcon className="h-6 w-6 rounded-full p-1 bg-gray-200  duration-300" />
            </MessageSubmitButton>
          )}
        </div>
      </form>
    </div>
  );
};
