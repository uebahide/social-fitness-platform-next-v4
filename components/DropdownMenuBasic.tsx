import * as React from 'react';
import { DropdownMenu } from 'radix-ui';
import { cn } from '@/lib/utils';

export const DropdownMenuBasic = ({
  buttonText,
  className,
  children,
}: {
  buttonText: string;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="cursor-pointer focus-visible:outline-none"
          aria-label="Customise options"
        >
          {buttonText}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="data-[side=bottom]:animate-slide-up-and-fade data-[side=left]:animate-slide-right-and-fade data-[side=right]:animate-slide-left-and-fade data-[side=top]:animate-slide-down-and-fade rounded-md bg-white p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,23,24,0.35),0px_10px_20px_-15px_rgba(22,23,24,0.2)] will-change-[opacity,transform]"
          sideOffset={5}
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export const DropdownMenuItem = ({
  children,
  className,
  onSelect,
}: {
  children: React.ReactNode;
  className?: string;
  onSelect?: (e: Event) => void;
}) => {
  return (
    <DropdownMenu.Item
      className={cn(
        'group text-violet11 data-highlighted:bg-violet9 data-disabled:text-mauve8 data-highlighted:text-violet1 relative flex h-[25px] cursor-pointer items-center rounded-[3px] px-[10px] text-[13px] leading-none outline-none select-none hover:bg-gray-200 data-disabled:pointer-events-none',
        className,
      )}
      onSelect={onSelect}
    >
      {children}
    </DropdownMenu.Item>
  );
};
