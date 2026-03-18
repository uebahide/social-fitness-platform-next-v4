"use client";

import { CategoryIcon } from "@/components/CategoryIcon";
import { ActivityType } from "@/types/api/activity";
import { Category } from "@/types/api/category";
import ActivityCard from "@/components/ActivityCard";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/buttons/Button";
import { useCategories } from "@/contexts/CategoriesProvider";
import { PER_PAGE } from "@/constants";
import { useUser } from "@/contexts/UserProvider";

export const MyActivities = ({ page }: { page: number }) => {
  const { user } = useUser();
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<Category | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      const response = await fetch(
        `/api/activity?page=${page}&per_page=${PER_PAGE}&userId=${user?.id}`,
      );
      const data = await response.json();
      setActivities(data);
    };
    fetchActivities();
  }, [page, user?.id]);

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
