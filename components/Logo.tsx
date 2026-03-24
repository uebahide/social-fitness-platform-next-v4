import Image from "next/image";
import React from "react";
import logo from "../public/images/SFA-LOGO.png";
import { cn } from "@/lib/utils";

export default function Logo({
  size = "medium",
}: {
  size?: "extra-small" | "small" | "medium" | "large";
}) {
  return (
    <Image
      src={logo}
      alt="logo"
      className={cn(
        size === "medium" && "h-20 w-20",
        size === "extra-small" && "h-9 w-9",
        size === "small" && "h-15 w-15",
        size === "large" && "h-25 w-25",
        "rounded-full cursor-pointe",
      )}
    />
  );
}
