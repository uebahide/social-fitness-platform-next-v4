import { cn } from "@/lib/utils";
import { buttonColor } from "@/types/buttonType";
import React from "react";

export const Button = ({
  color = "primary",
  type = undefined,
  className,
  disabled = false,
  onClick,
  children,
}: {
  color: buttonColor;
  type?: "submit" | "reset" | "button" | "button" | undefined;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) => {
  return (
    <button
      type={type}
      className={cn(
        "flex w-fit cursor-pointer items-center justify-center rounded-sm border border-gray-300 px-4 py-2 text-xs font-semibold hover:shadow-md disabled:cursor-not-allowed",
        color == "primary" &&
          "bg-brand-primary-400 hover:bg-brand-primary-500 disabled:bg-brand-primary-300 text-white",
        color == "secondary" &&
          "bg-brand-secondary-100 hover:bg-brand-secondary-200 disabled:bg-brand-secondary-100 text-gray-600",
        color == "transparent" &&
          "border-none bg-transparent text-gray-600 hover:shadow-none",
        color == "danger" &&
          "bg-rose-500 text-white hover:bg-rose-600 disabled:bg-rose-400",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
