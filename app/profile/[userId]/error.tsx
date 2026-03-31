"use client";

import RouteErrorStates from "@/components/states/RouteErrorStates";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorStates title="Could not load user profile." reset={reset} />
  );
}
