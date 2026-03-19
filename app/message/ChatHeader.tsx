import { Avatar } from "@/components/Avatar";
import { useUser } from "@/contexts/UserProvider";
import { Room } from "@/types/api/message";

export const ChatHeader = ({ room }: { room: Room }) => {
  const { user: currentUser } = useUser();
  const friend = room.users.find((user) => user.id !== currentUser?.id);
  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <Avatar size="medium" user={friend} />
        <h1 className="font-bold">{friend?.name}</h1>
      </div>
    </div>
  );
};
