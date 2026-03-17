import { cn } from "@/lib/utils";
import { HTMLInputTypeAttribute } from "react";

export const Input = ({
  defaultValue = "",
  id,
  name,
  type = "text",
  placeholder,
  required = false,
  className,
}: {
  defaultValue?: string;
  id: string;
  name: string;
  type?: HTMLInputTypeAttribute | undefined;
  placeholder?: string;
  required?: boolean;
  className?: string;
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      className={cn(
        "h-11 w-full rounded-sm border border-neutral-200 bg-white px-3 pr-12 text-sm text-neutral-900 transition outline-none placeholder:text-neutral-400 focus:border-neutral-400 focus:ring-4 focus:ring-neutral-100",
        className,
      )}
      required={required}
      defaultValue={defaultValue}
      id={id}
      name={name}
    />
  );
};
