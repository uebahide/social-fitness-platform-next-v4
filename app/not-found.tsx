import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen flex-col gap-4">
      <h1 className="text-2xl font-bold" data-testid="not-found-title">
        404 - Page Not Found 🙈
      </h1>
      <p className="text-gray-500">
        The page you are looking for does not exist.
      </p>
      <Link href="/" className="text-blue-500">
        Go back to the home page
      </Link>
    </div>
  );
}
