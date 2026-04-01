import { Skeleton } from "../ui/skeleton";

export const MessageListSkeleton = () => {
  return (
    <div className="flex h-[calc(100vh-258px)] min-w-0 flex-col gap-4 overflow-x-hidden overflow-y-auto p-4">
      <FriendMessageSkeleton />
      {Array.from({ length: 2 }).map((_, index) => (
        <MyMessageSkeleton key={index} />
      ))}
      <FriendMessageSkeleton />
      <MyMessageSkeleton />
      {Array.from({ length: 2 }).map((_, index) => (
        <FriendMessageSkeleton key={index} />
      ))}
      <MyMessageSkeleton />
    </div>
  );
};

const FriendMessageSkeleton = () => {
  return (
    <div className="h-10 w-full flex gap-2">
      <Skeleton className="h-8 w-8 rounded-full" />
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
  );
};

const MyMessageSkeleton = () => {
  return (
    <div className="h-10 w-full flex gap-2 justify-end">
      <Skeleton className="h-8 w-24 rounded-full" />
    </div>
  );
};
