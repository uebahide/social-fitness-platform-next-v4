import { Avatar } from "@/components/Avatar";
import { useUser } from "@/contexts/UserProvider";
import { Room } from "@/types/api/message";
import { useSelector } from "react-redux";
import { selectSelectedRoom } from "@/lib/redux/features/message/messageSelector";

export const ChatHeader = () => {
  const selectedRoom = useSelector(selectSelectedRoom) as Room;
  const { user: currentUser } = useUser();
  const friend = selectedRoom.users.find((user) => user.id !== currentUser?.id);
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Avatar size="medium" user={friend} />
        <h1 className="font-bold">{friend?.display_name}</h1>
      </div>
    </div>
  );
};
