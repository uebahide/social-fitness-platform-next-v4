"use client";

import { Input } from "@/components/ui/input";
import { User } from "@/types/api/user";
import { useEffect, useState } from "react";

import { useUser } from "@/contexts/UserProvider";
import { UserItem } from "./UserItem";
import { EmptyState } from "@/components/states/EmptyState";
import { UserListSkeleton } from "@/components/skeletons/UserListSkeleton";
import { Button } from "@/components/buttons/Button";
import { useQuery } from "@tanstack/react-query";
import { searchUsers } from "@/lib/client/searchUsers";

export const UserList = ({ forceError }: { forceError?: string }) => {
  const { user: currentUser } = useUser();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const {
    data: searchResult = [],
    isPending,
    isSuccess,
    isError,
    refetch,
  } = useQuery<User[]>({
    queryKey: ["search-users", currentUser?.id, debouncedSearch],
    queryFn: ({ signal }: { signal: AbortSignal }) =>
      searchUsers(currentUser as User, debouncedSearch, signal, forceError),
    enabled: Boolean(currentUser?.id && debouncedSearch.trim() !== ""),
  });
  const isIdle = debouncedSearch === "";
  const isLoading = isPending && !isIdle;

  return (
    <aside className="bg-card flex h-[calc(100vh-92px)] flex-col gap-4 rounded-sm border border-gray-200 p-3">
      <Input
        id="search"
        name="search"
        type="text"
        placeholder="Search"
        className="w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        data-testid="friend-search-search-input"
      />

      <ul className="flex flex-col overflow-y-auto">
        {isIdle && (
          <li>
            <EmptyState
              description="Search for a user by name 🔎"
              data-testid="friend-search-idle-state"
            />
          </li>
        )}

        {isLoading && <UserListSkeleton />}

        {isSuccess && searchResult.length === 0 && (
          <li>
            <EmptyState
              title="No users found"
              description="Try another name."
              data-testid="friend-search-empty-state"
            />
          </li>
        )}

        {isSuccess &&
          searchResult.map((user, index) => (
            <UserItem
              key={user.id}
              user={user}
              currentUser={currentUser}
              data-testid={`friend-search-result-${index}`}
            />
          ))}

        {isError && (
          <li className="p-2" data-testid="friend-search-error-state">
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm font-medium text-gray-700">
                Could not load users.
              </p>
              <Button
                color="secondary"
                onClick={refetch}
                className="cursor-pointer"
              >
                Try again
              </Button>
            </div>
          </li>
        )}
      </ul>
    </aside>
  );
};
