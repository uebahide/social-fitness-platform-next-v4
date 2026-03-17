"use client";

import { SubmitButton } from "./buttons/SubmitButton";
import { LogOutIcon } from "lucide-react";

export const LogoutButton = () => {
  return (
    <form className="w-full">
      <SubmitButton
        color="transparent"
        className="focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 [&_svg:not([class*='text-'])]:text-muted-foreground data-[variant=destructive]:*:[svg]:text-destructive! relative flex w-full cursor-default items-center justify-start gap-2 rounded-sm p-0 text-sm font-normal text-black outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
      >
        <LogOutIcon className="h-4 w-4" />
        Log out
      </SubmitButton>
    </form>
  );
};
