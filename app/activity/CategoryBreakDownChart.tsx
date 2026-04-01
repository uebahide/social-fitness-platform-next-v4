"use client";

import { getCategoryColor } from "@/lib/utils";
import { PieChart, Pie, Tooltip, Legend } from "recharts";
import { CategoryActivityTotal } from "@/types/api/analytics";
import { EmptyState } from "@/components/states/EmptyState";

export const CategoryBreakDownChart = ({
  data,
}: {
  data: CategoryActivityTotal[];
}) => {
  const dataWithColors = data.map((entry) => ({
    ...entry,
    fill: getCategoryColor(entry.category),
  }));

  if (dataWithColors.length === 0) {
    return (
      <EmptyState
        description="Breakdown chart is not available yet"
        containerClassName="w-[400px] h-[300px]"
      />
    );
  }
  return (
    <PieChart width={400} height={300}>
      <Pie
        data={dataWithColors}
        dataKey="total"
        nameKey="category"
        cx="50%"
        cy="50%"
        outerRadius={100}
        label
      />

      <Tooltip />
      <Legend />
    </PieChart>
  );
};
