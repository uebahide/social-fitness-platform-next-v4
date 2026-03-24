"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { updateActivity } from "@/app/activity/action";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "./buttons/Button";
import { SubmitButton } from "./buttons/SubmitButton";
import RunIcon from "./icons/Run";
import { ActivityForm } from "./ActivityForm";
import { useCategories } from "@/contexts/CategoriesProvider";
import { ActivityType } from "@/types/api/activity";

const updateActivityInitialState = {
  errors: {
    title: [],
    description: [],
    category: [],
    details: [],
  },
  error: "",
  message: "",
  data: {
    title: "",
    description: "",
    category: "",
    details: {},
  },
  ok: false,
};

export const UpdateActivityDialogForm = ({
  updateOpen,
  setUpdateOpen,
  activity,
}: {
  updateOpen: boolean;
  setUpdateOpen: (boolean: boolean) => void;
  activity: ActivityType;
}) => {
  const { categories } = useCategories();
  const [state, formAction] = useActionState(
    updateActivity,
    updateActivityInitialState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const isOpen = state?.ok ? false : updateOpen;

  useEffect(() => {
    if (state?.ok) {
      setUpdateOpen(false);
    }
  }, [state, setUpdateOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setUpdateOpen}>
      <DialogContent>
        <form
          action={formAction}
          className="space-y-4"
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
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
            <DialogDescription className="text-black">
              Edit Activity
            </DialogDescription>
          </DialogHeader>

          <ActivityForm
            categories={categories}
            state={state}
            activity={activity}
          />
          <input name="id" value={activity.id} id="id" type="hidden" />
          <hr />

          <DialogFooter>
            <DialogClose asChild>
              <Button color="transparent">Cancel</Button>
            </DialogClose>
            <SubmitButton color="primary">Update Activity</SubmitButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
