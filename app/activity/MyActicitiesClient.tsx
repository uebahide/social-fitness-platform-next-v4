"use client";

import { CategoryIcon } from "@/components/CategoryIcon";
import { ActivityType } from "@/types/api/activity";
import { Category } from "@/types/api/category";
import ActivityCard from "@/components/ActivityCard";
import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/Button";
import { useCategories } from "@/contexts/CategoriesProvider";
import { useState } from "react";

export const MyActivitiesClient = ({
  activities,
}: {
  activities: ActivityType[];
}) => {
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  return (
    <div className="space-y-6">
      <CategoryFilter
        setCategoryFilter={setCategoryFilter}
        categoryFilter={categoryFilter}
      />
      <div className="max-h-[520px] overflow-y-auto">
        <ActivityList activities={activities} categoryFilter={categoryFilter} />
      </div>
    </div>
  );
};

function CategoryFilter({
  setCategoryFilter,
  categoryFilter,
}: {
  setCategoryFilter: (category: Category | null) => void;
  categoryFilter: Category | null;
}) {
  const { categories } = useCategories();
  const handleCategoryFilter = (category: Category) => {
    setCategoryFilter(category);
    if (String(categoryFilter) === String(category)) {
      setCategoryFilter(null);
    } else {
      setCategoryFilter(category);
    }
  };
  return (
    <nav className="flex gap-2">
      {categories.map((category: Category) => {
        return (
          <Button
            color="secondary"
            className={cn(
              "h-8 w-10",
              String(categoryFilter) === String(category)
                ? "bg-gray-200 shadow-md"
                : "",
            )}
            onClick={() => handleCategoryFilter(category)}
            key={String(category)}
          >
            <CategoryIcon
              category={String(category).toLowerCase()}
              className="cursor-pointer"
              size="small"
            />
          </Button>
        );
      })}
    </nav>
  );
}

function ActivityList({
  activities,
  categoryFilter,
}: {
  activities: ActivityType[];
  categoryFilter: Category | null;
}) {
  const filteredActivities = categoryFilter
    ? activities.filter(
        (activity: ActivityType) =>
          String(activity.category).toLowerCase() ===
          String(categoryFilter).toLowerCase(),
      )
    : activities;

  return (
    <div className="space-y-4">
      {filteredActivities?.length > 0 &&
        filteredActivities.map((activity: ActivityType) => {
          return <ActivityCard activity={activity} key={activity.id} />;
        })}
    </div>
  );
}
