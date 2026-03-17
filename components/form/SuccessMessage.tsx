import React from "react";

export const SuccessMessage = ({ children }: { children: React.ReactNode }) => {
  return <div className="text-green-500">{children}</div>;
};
