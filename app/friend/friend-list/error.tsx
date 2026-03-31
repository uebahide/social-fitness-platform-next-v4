"use client";

import RouteErrorStates from "@/components/states/RouteErrorStates";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <RouteErrorStates
      title="Could not load your friends or friend requests."
      reset={reset}
    />
  );
}
