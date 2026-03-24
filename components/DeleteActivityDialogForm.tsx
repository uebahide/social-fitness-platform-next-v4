'use client';

import { useActionState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { deleteActivity } from '@/app/activity/action';
import { ChevronDownIcon } from 'lucide-react';
import { Button } from './buttons/Button';
import { SubmitButton } from './buttons/SubmitButton';
import RunIcon from './icons/Run';

const deleteActivityInitialState = {
  ok: false,
  message: '',
  data: {},
  errors: {},
};

export const DeleteActivityDialogForm = ({
  deleteOpen,
  setDeleteOpen,
  activityId,
}: {
  deleteOpen: boolean;
  setDeleteOpen: (boolean: boolean) => void;
  activityId: string;
}) => {
  const [state, formAction] = useActionState(deleteActivity, deleteActivityInitialState);
  const formRef = useRef<HTMLFormElement>(null);
  const isOpen = state?.ok ? false : deleteOpen;

  useEffect(() => {
    if (state?.ok) {
      setDeleteOpen(false);
    }
  }, [state, setDeleteOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setDeleteOpen}>
      <DialogContent className="w-[400px]">
        <form
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
              <RunIcon className="h-5 w-5" /> My Activity
            </DialogTitle>
            <ChevronDownIcon className="size-4 rotate-270 text-black" />
            <DialogDescription className="text-black">Delete Activity</DialogDescription>
          </DialogHeader>

          <input name="id" value={activityId} id="id" type="hidden" />
          <p>Are you sure you want to delete this activity?</p>
          <hr />

          <DialogFooter>
            <DialogClose asChild>
              <Button color="transparent">Cancel</Button>
            </DialogClose>
            <SubmitButton color="danger">Delete Activity</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
