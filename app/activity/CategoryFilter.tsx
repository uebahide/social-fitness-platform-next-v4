"use client";

import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { useCategories } from "@/contexts/CategoriesProvider";
import { Category, CategoryType } from "@/types/api/category";
import { cn } from "@/lib/utils";

export function CategoryFilter({
  currentFilter,
}: {
  currentFilter: CategoryType | null;
}) {
  const { categories } = useCategories();

  return (
    <nav className="flex gap-2">
      {categories.map((category: Category) => {
        const isSelected = currentFilter === category.name;
        const href = isSelected
          ? "/activity?page=1"
          : `/activity?page=1&category=${category.name}`;

        return (
          <Link
            key={category.id}
            href={href}
            className={cn(
              "bg-card flex h-8 w-10 items-center justify-center rounded-sm border border-gray-300 hover:shadow-md",
              isSelected ? "bg-gray-200 shadow-md" : "",
            )}
          >
            <CategoryIcon category={category.name} size="small" />
          </Link>
        );
      })}
    </nav>
  );
}
