import React from "react";

export const ErrorMessage = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-red-500">{children}</div>;
};
