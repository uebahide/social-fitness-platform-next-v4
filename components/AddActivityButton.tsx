'use client';

import { useActionState, useEffect, useState } from 'react';
import { createActivity } from '@/app/activity/action';
import { Category } from '@/types/api/category';
import DialogFormOpenButton from './DialogFormOpenButton';
import { Button } from './buttons/Button';
import { ActivityForm } from './ActivityForm';
import { useCategories } from '@/contexts/CategoriesProvider';

const createActivityInitialState = {
  errors: {
    title: '',
    description: '',
    category: '',
    details: {},
    location: '',
    distance: '',
    duration: '',
    date: '',
    time: '',
  },
  message: '',
  data: {},
  ok: false,
};

export type CreateActivityState = typeof createActivityInitialState;

export default function AddActivityButton() {
  const { categories } = useCategories();
  const [state, formAction] = useActionState(createActivity, createActivityInitialState);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (state?.ok) {
      setOpen(false);
    }
  }, [state]);

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
      setOpen={setOpen}
    >
      {/* Dialog content here */}
      <ActivityForm categories={categories} state={state} />
    </DialogFormOpenButton>
  );
}
