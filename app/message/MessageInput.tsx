import Image from "next/image";
import { TextareaSimple } from "@/components/form/TextAreaSimple";
import { Message, Room } from "@/types/api/message";
import { FaceIcon } from "@radix-ui/react-icons";
import { ImageIcon, SendIcon, XIcon } from "lucide-react";
import { SetStateAction, startTransition, useRef, useState } from "react";
import { EmojiClickData } from "emoji-picker-react";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/contexts/UserProvider";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedRoom } from "@/lib/redux/features/message/messageSelector";
import { EmojiPickerButton } from "@/components/buttons/EmojiPickerButton";
import {
  optimisticInsertImagesMessage,
  optimisticInsertTextMessage,
  rollbackInsertImagesMessage,
} from "@/lib/redux/features/message/messageSlice";
import { User } from "@/types/api/user";
import { useSearchParams } from "next/navigation";

type SelectedImage = {
  id: string;
  file: File;
};

export const MessageInput = ({
  formActionSendText,
  formActionSendImages,
}: {
  formActionSendText: (formData: FormData) => void;
  formActionSendImages: (formData: FormData) => void;
}) => {
  const searchParams = useSearchParams();
  const forceSendFailure = searchParams.get("forceSendFailure");
  const selectedRoom = useSelector(selectSelectedRoom) as Room;
  const [message, setMessage] = useState("");
  const [images, setImages] = useState<SelectedImage[]>([]);
  const { user } = useUser();
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement | null>(null);
  const dispatch = useDispatch();

  //handle key down
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!message.trim() && images.length === 0) return;

      formRef.current?.requestSubmit();
    }
  };

  //handle images upload to supabase bucket
  const handleImagesUploadToSupabase = async (
    selectedImages: SelectedImage[],
  ) => {
    const uploadedFilePaths: string[] = [];

    for (const image of selectedImages) {
      const fileExt = image.file.name.split(".").pop();
      const filePath = `${selectedRoom.id}/${user?.id}/message-${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("messages")
        .upload(filePath, image.file, {
          upsert: true,
          contentType: image.file.type,
        });

      if (uploadError) {
        return {
          ok: false,
          errors: uploadError.message,
          filePaths: [] as string[],
        };
      }

      uploadedFilePaths.push(filePath);
    }
    return {
      ok: true,
      errors: {},
      filePaths: uploadedFilePaths,
    };
  };

  //handle images message
  const handleImagesMessage = async (formData: FormData) => {
    const optimisticMessageForImages: Message = {
      id: -(Date.now() + Math.floor(Math.random() * 1000)), // temp id
      body: message,
      user_id: user?.id ?? 0,
      room_id: selectedRoom.id,
      created_at: new Date().toISOString(),
      updated_at: null,
      user: user as User,
      reactions: [],
      deleted: false,
      image_path: "",
      type: "images_placeholder",
      pending: true,
      failed: false,
    };
    const temp_images = [...images];
    setImages([]);
    // insert optimistic message for images
    dispatch(optimisticInsertImagesMessage(optimisticMessageForImages));
    formData.append(
      "optimisticMessageIdForImages",
      String(optimisticMessageForImages.id),
    );
    //upload images to supabase if there are attached images
    const uploadResult = await handleImagesUploadToSupabase(temp_images);
    if (!uploadResult.ok) {
      console.error(uploadResult.errors);
      dispatch(
        rollbackInsertImagesMessage({
          roomId: selectedRoom.id,
          optimisticMessageId: optimisticMessageForImages.id,
        }),
      );
      return;
    }
    // add file paths to form data
    uploadResult.filePaths.forEach((filePath) => {
      formData.append("filePaths", filePath);
    });

    startTransition(() => {
      formActionSendImages(formData);
    });
  };

  //handle text message
  const handleTextMessage = async (formData: FormData) => {
    const optimisticMessage: Message = {
      id: -(Date.now() + Math.floor(Math.random() * 1000)), // temp id
      body: message,
      user_id: user?.id ?? 0,
      room_id: selectedRoom.id,
      created_at: new Date().toISOString(),
      updated_at: null,
      user: user as User,
      reactions: [],
      deleted: false,
      image_path: "",
      type: "text",
      pending: true,
      failed: false,
    };
    setMessage("");
    dispatch(optimisticInsertTextMessage(optimisticMessage));
    formData.append("optimisticMessageId", String(optimisticMessage.id));
    startTransition(() => {
      formActionSendText(formData);
    });
  };

  //handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() && images.length === 0) return;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("roomId", String(selectedRoom.id));
    formData.append("forceSendFailure", forceSendFailure ?? "");
    // text message handling
    if (message.trim() !== "") {
      handleTextMessage(formData);
    }
    // images handling
    if (images.length > 0) {
      handleImagesMessage(formData);
    }
  };

  return (
    <div className="gap-4 rounded-lg p-5">
      <form
        ref={formRef}
        className="flex flex-col items-end gap-2 rounded-lg border border-gray-200 px-4 py-2 relative"
        onSubmit={handleSubmit}
      >
        {images.length > 0 && (
          <SelectedImagesSection images={images} setImages={setImages} />
        )}

        <div className="flex w-full min-w-0 items-end justify-between gap-2">
          <EmojiPickerButton
            onEmojiClick={(emojiObject: EmojiClickData) => {
              setMessage(message + emojiObject.emoji);
            }}
            pickerClassName="absolute bottom-12 left-0"
          >
            <FaceIcon className="hover:scale-110 transition-all duration-300 size-6 pb-1" />
          </EmojiPickerButton>

          <MessageTextarea
            message={message}
            setMessage={setMessage}
            handleKeyDown={handleKeyDown}
          />

          {message.length > 0 || images.length > 0 ? (
            <MessageSubmitButton>
              <SendIcon className="h-5 w-5" />
            </MessageSubmitButton>
          ) : (
            <FileUploadButton setImages={setImages} />
          )}
        </div>
        <input
          type="hidden"
          name="roomId"
          id="roomId"
          value={selectedRoom.id}
        />
      </form>
    </div>
  );
};

const SelectedImagesSection = ({
  images,
  setImages,
}: {
  images: SelectedImage[];
  setImages: (value: SetStateAction<SelectedImage[]>) => void;
}) => {
  return (
    <div className="flex items-center gap-3 justify-start w-full overflow-x-auto">
      {images.map((image) => (
        <div className="relative mt-2" key={image.id}>
          <Image
            src={URL.createObjectURL(image.file)}
            alt="image"
            width={100}
            height={100}
            className="rounded-sm"
          />
          <XIcon
            className="h-5 w-5 cursor-pointer absolute -top-2 -right-2 border border-gray-200 bg-gray-100 opacity-70 rounded-full p-1 text-gray-500 hover:scale-110 transition-all duration-300"
            onClick={() =>
              setImages((prev) =>
                prev.filter((prevImage) => prevImage.id !== image.id),
              )
            }
          />
        </div>
      ))}
    </div>
  );
};

export const MessageTextarea = ({
  message,
  setMessage,
  handleKeyDown,
}: {
  message: string;
  setMessage: (value: string) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}) => {
  return (
    <TextareaSimple
      data-testid="message-textarea"
      id="message"
      name="message"
      placeholder="Message..."
      onChange={(e) => setMessage(e)}
      value={message}
      onKeyDown={handleKeyDown}
      className="block max-h-15 min-h-[24px] min-w-0 flex-1 resize-none overflow-y-auto break-all bg-transparent leading-6 whitespace-pre-wrap focus:outline-none"
    />
  );
};

export const MessageSubmitButton = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <button
      className="cursor-pointer hover:scale-110 transition-all"
      type="submit"
      data-testid="message-submit-button"
    >
      {children}
    </button>
  );
};

const FileUploadButton = ({
  setImages,
}: {
  setImages: (value: SetStateAction<SelectedImage[]>) => void;
}) => {
  return (
    <label className="cursor-pointer hover:scale-110 transition-all">
      <ImageIcon className="h-5 w-5" />
      <input
        data-testid="images-input"
        type="file"
        id="image"
        name="image"
        multiple
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          const nextImages = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
          }));

          setImages((prev) => [...prev, ...nextImages]);

          e.currentTarget.value = ""; // reset the file input
        }}
      />
    </label>
  );
};
