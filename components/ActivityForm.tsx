"use client";

import React, { useState } from "react";
import { FormRow } from "./form/FormRow";
import { TextareaSimple } from "./form/TextAreaSimple";
import { ErrorMessage } from "./form/ErrorMessage";
import { Category } from "@/types/api/category";
import { SelectSimple } from "./form/SelectSimple";
import { CreateActivityState } from "./AddActivityButton";
import { InputWithLabel } from "./form/InputWithLabel";
import { Input } from "./form/Input";
import { ActivityType, HikingActivityDetailsType } from "@/types/api/activity";
import { uppercaseFirstLetter } from "@/lib/utils";

export const ActivityForm = ({
  categories,
  state,
  activity,
}: {
  categories: Category[];
  state: CreateActivityState;
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
    (uppercaseFirstLetter(defaultValue ?? "") ?? "null") as unknown as Category,
  );

  const handleCategoryChange = (value: string) => {
    setCategory(
      categories.find((c: Category) => String(c) === value) ||
        ("Running" as unknown as Category),
    );
  };

  return (
    <>
      <InputFields category={category} activity={activity} />
      <SelectSimple
        items={categories.map((c: Category) => ({
          value: String(c),
          label: String(c),
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
  if (String(category) === "Running") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (String(category) === "Walking") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (String(category) === "Cycling") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (String(category) === "Swimming") {
    return (
      <DistanceAndDurationFields
        defaultDistance={activity?.details.distance}
        defaultDuration={activity?.details.duration}
      />
    );
  }
  if (String(category) === "Hiking") {
    const hikingDetails = activity?.details as HikingActivityDetailsType;
    return (
      <>
        <DistanceAndDurationFields
          defaultDistance={activity?.details.distance}
          defaultDuration={activity?.details.duration}
        />
        <InputWithLabel label="Location" unit="optional">
          <Input
            type="text"
            id="location"
            name="location"
            placeholder="eg. The Peak, Hong Kong"
            defaultValue={hikingDetails.location}
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
