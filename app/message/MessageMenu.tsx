"use client";

import { DropdownMenuBasic } from "@/components/DropdownMenuBasic";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVerticalIcon, Pencil, Trash2Icon } from "lucide-react";
import { Message } from "@/types/api/message";
import { formatDate, formatTime } from "@/lib/utils";
import { useMessageEditor } from "@/contexts/MessageEditorProvider";
import { deleteMessage } from "./messageAction";
import { startTransition, useActionState } from "react";

export const MessageMenu = ({ message }: { message: Message }) => {
  const { setSelectedMessage } = useMessageEditor();
  const [, deleteMessageAction] = useActionState(deleteMessage, {
    errors: {},
    message: "",
    data: {},
    ok: false,
  });

  const handleEdit = () => {
    setSelectedMessage(message as Message);
  };

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("messageId", message.id.toString());
    startTransition(() => {
      deleteMessageAction(formData);
    });
  };

  return (
    <DropdownMenuBasic
      buttonText={
        <div className="flex items-center gap-2">
          <MoreVerticalIcon className="size-6 rotate-90 hover:bg-gray-200 rounded-full p-1 cursor-pointer" />
        </div>
      }
    >
      <div className="flex flex-col gap-1 w-[150px]">
        <p className="text-sm text-gray-500 pl-2 mt-2 mb-1">
          {formatDate(message?.created_at) +
            " " +
            formatTime(message?.created_at)}
        </p>
        <hr />
        {message.type === "text" && (
          <DropdownMenuItem className="space-x-1 pl-2 mt-2">
            <div
              className="flex items-center gap-2 justify-between w-full cursor-pointer"
              onClick={handleEdit}
            >
              <p>Edit</p>
              <Pencil className="h-4 w-4" />
            </div>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="space-x-1 pl-2 mt-2"
          onSelect={handleDelete}
        >
          <div className="flex items-center gap-2 justify-between w-full cursor-pointer">
            <p>Unsend</p>
            <Trash2Icon className="h-4 w-4" />
          </div>
        </DropdownMenuItem>
      </div>
    </DropdownMenuBasic>
  );
};
