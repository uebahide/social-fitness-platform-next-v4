import { Avatar } from "@/components/Avatar";
import { useUser } from "@/contexts/UserProvider";
import { Room } from "@/types/api/message";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectedRoom } from "@/lib/redux/features/message/messageSelector";
import { Button } from "@/components/ui/button";
import { setSelectedRoom } from "@/lib/redux/features/message/messageSlice";
import { ArrowLeftIcon } from "lucide-react";

export const ChatHeader = () => {
  const dispatch = useDispatch();
  const selectedRoom = useSelector(selectSelectedRoom);
  const { user: currentUser } = useUser();
  const friend = selectedRoom
    ? selectedRoom.users.find((user) => user.id !== currentUser?.id)
    : null;
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => dispatch(setSelectedRoom(null))}
          className="block sm:hidden"
        >
          <ArrowLeftIcon />
        </Button>
        {friend && (
          <>
            <Avatar size="medium" user={friend} />
            <h1 className="font-bold">{friend?.display_name}</h1>
          </>
        )}
      </div>
    </div>
  );
};
