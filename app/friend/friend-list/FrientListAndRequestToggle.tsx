import { cn } from "@/lib/utils";

export const FriendListAndRequestToggle = ({
  currentTab,
  setCurrentTab,
  setSearch,
}: {
  currentTab: "friend" | "request";
  setCurrentTab: (tab: "friend" | "request") => void;
  setSearch: (search: string) => void;
}) => {
  return (
    <nav>
      <ul className="flex justify-between gap-2">
        <li
          onClick={() => {
            setCurrentTab("friend");
            setSearch("");
          }}
          className={cn(
            currentTab === "friend" ? "text-black" : "text-gray-500",
            "cursor-pointer select-none",
          )}
        >
          Friend
        </li>
        <li
          onClick={() => {
            setCurrentTab("request");
            setSearch("");
          }}
          className={cn(
            currentTab === "request" ? "text-black" : "text-gray-500",
            "cursor-pointer select-none",
          )}
        >
          Request
        </li>
      </ul>
    </nav>
  );
};
