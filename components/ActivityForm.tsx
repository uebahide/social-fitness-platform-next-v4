"use client";

import React, { useState } from "react";
import { FormRow } from "./form/FormRow";
import { TextareaSimple } from "./form/TextAreaSimple";
import { ErrorMessage } from "./form/ErrorMessage";
import { Category } from "@/types/api/category";
import { SelectSimple } from "./form/SelectSimple";
import { InputWithLabel } from "./form/InputWithLabel";
import { Input } from "./form/Input";
import { ActivityType } from "@/types/api/activity";
import {
  CreateActivityState,
  UpdateActivityState,
} from "@/app/activity/action";

export const ActivityForm = ({
  categories,
  state,
  activity,
}: {
  categories: Category[];
  state: UpdateActivityState | CreateActivityState;
  activity?: ActivityType;
}) => {
  return (
    <>
      {/* Dialog content here */}
      <FormRow>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="Title"
          className="font-bold focus:outline-none"
          defaultValue={activity?.title ?? ""}
        />
        <ErrorMessage>{state?.errors.title}</ErrorMessage>
      </FormRow>
      <FormRow>
        <TextareaSimple
          id="description"
          name="description"
          placeholder="Add description..."
          className="resize-none overflow-hidden focus:outline-none"
          defaultValue={activity?.description ?? ""}
        />
      </FormRow>
      <CategoryAndDetailsFields
        categories={categories}
        defaultValue={activity?.category.name}
        readonly={!!activity}
        activity={activity}
      />
    </>
  );
};

export const CategoryAndDetailsFields = ({
  categories,
  defaultValue,
  readonly = false,
  activity,
}: {
  categories: Category[];
  defaultValue?: string;
  readonly?: boolean;
  activity?: ActivityType;
}) => {
  const [category, setCategory] = useState<Category>(
    (categories.find((c: Category) => c.name === defaultValue) ??
      categories[0]) as Category,
  );

  const handleCategoryChange = (value: string) => {
    setCategory(
      categories.find((c: Category) => c.name === value) || categories[0],
    );
  };

  return (
    <>
      <InputFields category={category} activity={activity} />
      <SelectSimple
        items={categories.map((c: Category) => ({
          value: c.name,
          label: c.name,
        }))}
        onValueChange={handleCategoryChange}
        id="category"
        name="category"
        defaultValue={defaultValue}
        required
        readonly={readonly}
      />
    </>
  );
};

const InputFields = ({
  category,
  activity,
}: {
  category: Category;
  activity?: ActivityType;
}) => {
  if (category.name === "running") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (category.name === "walking") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (category.name === "cycling") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (category.name === "swimming") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (category.name === "hiking") {
    const hikingDetails = activity?.details;
    return (
      <>
        <DistanceAndDurationFields
          defaultDistance={hikingDetails?.distance}
          defaultDuration={hikingDetails?.duration}
        />
        <InputWithLabel label="Location" unit="optional">
          <Input
            type="text"
            id="location"
            name="location"
            placeholder="eg. The Peak, Hong Kong"
            defaultValue={hikingDetails?.location}
          />
        </InputWithLabel>
      </>
    );
  }
};

const DistanceAndDurationFields = ({
  defaultDistance,
  defaultDuration,
}: {
  defaultDistance?: number;
  defaultDuration?: number;
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <InputWithLabel label="Distance" unit="km">
        <Input
          type="number"
          placeholder="0.0"
          id="distance"
          name="distance"
          defaultValue={defaultDistance?.toString()}
        />
      </InputWithLabel>

      <InputWithLabel label="Duration" unit="min">
        <Input
          type="number"
          placeholder="0"
          id="duration"
          name="duration"
          defaultValue={defaultDuration?.toString()}
        />
      </InputWithLabel>
    </div>
  );
};
