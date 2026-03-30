import { useClickOutside } from "@/hooks/useClickOutside";
import { cn } from "@/lib/utils";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect } from "react";

export const EmojiPickerButton = ({
  onEmojiClick,
  closeOnEmojiClick = false,
  reactionsDefaultOpen = false,
  className,
  pickerClassName,
  children,
  onShowChange,
}: {
  onEmojiClick: (emojiObject: EmojiClickData) => void;
  closeOnEmojiClick?: boolean;
  reactionsDefaultOpen?: boolean;
  className?: string;
  pickerClassName?: string;
  children?: React.ReactNode;
  onShowChange?: (show: boolean) => void;
}) => {
  const { ref, boolean: show, setBoolean: setShow } = useClickOutside();

  useEffect(() => {
    onShowChange?.(show);
  }, [show, onShowChange]);

  return (
    <div ref={ref} className={className}>
      <div
        className="flex items-center justify-center h-5 w-5 cursor-pointer"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        {children}
      </div>
      {show && (
        <div className={cn(pickerClassName)}>
          <EmojiPicker
            onEmojiClick={(emojiObject: EmojiClickData) => {
              onEmojiClick(emojiObject);
              if (closeOnEmojiClick) {
                setShow(false);
              }
            }}
            autoFocusSearch={false}
            reactionsDefaultOpen={reactionsDefaultOpen}
          />
        </div>
      )}
    </div>
  );
};
