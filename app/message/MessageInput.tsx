import { TextareaSimple } from "@/components/form/TextAreaSimple";
import { Room } from "@/types/api/message";
import { FaceIcon } from "@radix-ui/react-icons";
import { SendIcon } from "lucide-react";
import { useActionState, useRef, useState } from "react";
import { sendMessage } from "./action";

export const MessageInput = ({
  selectedRoom,
}: {
  selectedRoom: Room;
}) => {
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement | null>(null);

  const [, formAction] = useActionState(sendMessage, {
    errors: {},
    message: "",
    data: {},
    ok: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    if (!message.trim()) {
      e.preventDefault();
      return;
    }

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!message.trim()) return;

      formRef.current?.requestSubmit();
      setMessage("");
    }
  };

  return (
    <div className="gap-4 rounded-lg p-5">
      <form
        ref={formRef}
        className="flex items-end gap-2 rounded-lg border border-gray-200 px-4 py-2"
        onSubmit={handleSubmit}
        action={formAction}
      >
        <FaceIcon className="h-5 w-5" />

        <TextareaSimple
          id="message"
          name="message"
          placeholder="Message..."
          onChange={(e) => setMessage(e)}
          value={message}
          onKeyDown={handleKeyDown}
          className="block max-h-15 min-h-[24px] w-full resize-none overflow-y-auto bg-transparent leading-6 focus:outline-none"
        />

        <input
          type="hidden"
          name="roomId"
          id="roomId"
          value={selectedRoom.id}
        />

        {message.length > 0 && (
          <button className="cursor-pointer" type="submit">
            <SendIcon className="h-5 w-5" />
          </button>
        )}
      </form>
    </div>
  );
};
