import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-screen w-full overflow-y-auto bg-gray-100 p-8">
      {children}
    </div>
  );
}
