"use client";

import { Button } from "@/components/buttons/Button";

export default function RouteErrorStates({
  title,
  reset,
}: {
  error?: Error & { digest?: string };
  title?: string;
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <p className="text-lg font-bold" data-testid="route-error-title">
        {title}
      </p>
      <Button
        color="primary"
        onClick={() => reset()}
        data-testid="route-error-reset"
      >
        Try again
      </Button>
    </div>
  );
}
