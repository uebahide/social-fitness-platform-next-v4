"use client";

import { useActionState, useState } from "react";
import { createActivity } from "@/app/activity/action";
import DialogFormOpenButton from "./DialogFormOpenButton";
import { Button } from "./buttons/Button";
import { ActivityForm } from "./ActivityForm";
import { useCategories } from "@/contexts/CategoriesProvider";

const createActivityInitialState = {
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

export type CreateActivityState = typeof createActivityInitialState;

export default function AddActivityButton() {
  const { categories } = useCategories();
  const [state, formAction] = useActionState(
    createActivity,
    createActivityInitialState,
  );
  const [isOpen, setIsOpen] = useState(false);
  const open = state?.ok ? false : isOpen;

  return (
    <DialogFormOpenButton
      formAction={formAction}
      buttonText={
        <Button type="button" color="secondary">
          + New
        </Button>
      }
      dialogTitle="My Activity"
      dialogDescription="New Activity"
      subitButtonText="Create Activity"
      open={open}
      setOpen={setIsOpen}
    >
      {/* Dialog content here */}
      <ActivityForm categories={categories} state={state} />
    </DialogFormOpenButton>
  );
}
