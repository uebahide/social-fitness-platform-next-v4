import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function loading() {
  return (
    <div className="grid grid-cols-[3fr_7fr] gap-4">
      <aside className="bg-card flex h-[calc(100vh-92px)] flex-col gap-4 rounded-sm border border-gray-200 p-3">
        <Input type="text" placeholder="Search" className="w-full" />

        <nav>
          <ul className="flex justify-between gap-2">
            <li>Friend</li>
            <li className="text-gray-500">Request</li>
          </ul>
        </nav>

        <ul className="flex flex-col overflow-y-auto">
          {Array.from({ length: 12 }).map((_, index) => (
            <li className="flex items-center justify-between gap-5" key={index}>
              <div className="flex w-full cursor-pointer items-center gap-2 rounded-sm p-2 hover:bg-gray-50">
                <Skeleton className="rounded-full h-10 w-10" />
                <Skeleton className="w-1/3 h-5" />
              </div>
              <Skeleton className="rounded-md h-10 w-18" />
            </li>
          ))}
        </ul>
      </aside>
      <div className="flex justify-center items-center">
        <p data-testid="friend-list-description">
          Select a friend from the list to view their profile
        </p>
      </div>
    </div>
  );
}
