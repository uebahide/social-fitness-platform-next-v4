"use client";

import { getCategoryColor } from "@/lib/utils";
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer } from "recharts";
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
        containerClassName="h-[220px] w-full"
      />
    );
  }
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithColors}
            dataKey="total"
            nameKey="category"
            cx="50%"
            cy="50%"
            outerRadius={88}
            label
          />

          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
