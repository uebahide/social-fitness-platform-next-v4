"use client";

import { Input } from "@/components/ui/input";
import { User } from "@/types/api/user";
import { useEffect, useState } from "react";

import { useUser } from "@/contexts/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { UserItem } from "./UserItem";
import { EmptyState } from "@/components/states/EmptyState";
import { UserListSkeleton } from "@/components/skeletons/UserListSkeleton";
import { Button } from "@/components/buttons/Button";

export const UserList = ({ forceError }: { forceError?: string }) => {
  const { user: currentUser } = useUser();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState<User[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [retryKey, setRetryKey] = useState(0);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchSearchResult() {
      if (!debouncedSearch) {
        setSearchResult([]);
        setStatus("idle");
        return;
      }

      try {
        setStatus("loading");

        const supabase = createClient();
        const { data: users, error } = await supabase
          .from("profiles")
          .select(
            "*, friend_requests_sent:friend_requests!sender_id(id, sender_id, receiver_id, status), friend_requests_received:friend_requests!receiver_id(id, sender_id, receiver_id, status), friends:friends!user_id(id, user_id, friend_id)",
          )
          .not("id", "eq", currentUser?.id.toString())
          .ilike("display_name", `%${debouncedSearch}%`)
          .abortSignal(controller.signal);

        if (controller.signal.aborted) return;

        if (error) {
          setStatus("error");
          return;
        }

        if (forceError === "1") {
          throw new Error("Force error");
          return;
        }

        setSearchResult(users ?? []);
        setStatus("success");
      } catch {
        if (controller.signal.aborted) return;
        setStatus("error");
      }
    }

    void fetchSearchResult();

    return () => {
      controller.abort();
    };
  }, [debouncedSearch, currentUser?.id, retryKey]);

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
        {status === "idle" && (
          <li>
            <EmptyState
              description="Search for a user by name 🔎"
              data-testid="friend-search-idle-state"
            />
          </li>
        )}

        {status === "loading" && <UserListSkeleton />}

        {status === "success" && searchResult.length === 0 && (
          <li>
            <EmptyState
              title="No users found"
              description="Try another name."
              data-testid="friend-search-empty-state"
            />
          </li>
        )}

        {status === "success" &&
          searchResult.map((user, index) => (
            <UserItem
              key={user.id}
              user={user}
              currentUser={currentUser}
              data-testid={`friend-search-result-${index}`}
            />
          ))}

        {status === "error" && (
          <li className="p-2" data-testid="friend-search-error-state">
            <div className="flex flex-col items-center gap-3 py-6">
              <p className="text-sm font-medium text-gray-700">
                Could not load users.
              </p>
              <Button
                color="secondary"
                onClick={() => setRetryKey((prev) => prev + 1)}
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
