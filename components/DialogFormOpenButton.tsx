'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from './buttons/Button';
import React, { useRef } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { SubmitButton } from './buttons/SubmitButton';

export default function DialogFormOpenButton({
  formAction,
  buttonText,
  dialogTitle,
  dialogDescription,
  subitButtonText,
  open,
  setOpen,
  children,
}: {
  formAction: (formData: FormData) => void | Promise<void>;
  buttonText: string | React.ReactNode;
  dialogTitle: string | React.ReactNode;
  dialogDescription: string | React.ReactNode;
  subitButtonText: string | React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{buttonText}</DialogTrigger>

      <DialogContent>
        <form
          ref={formRef}
          action={formAction}
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
        >
          <DialogHeader className="flex flex-row items-center gap-2">
            <DialogTitle className="flex flex-row gap-1 rounded-sm border border-gray-300 px-2 py-1 text-sm font-medium">
              {/* <RunIcon className="h-5 w-5" /> My Activity */}
              {dialogTitle}
            </DialogTitle>
            <ChevronDownIcon className="size-4 rotate-270 text-black" />
            <DialogDescription className="text-black">{dialogDescription}</DialogDescription>
          </DialogHeader>

          {children}

          <hr />

          <DialogFooter>
            <DialogClose asChild>
              <Button color="transparent">Cancel</Button>
            </DialogClose>
            <SubmitButton color="primary">{subitButtonText}</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
