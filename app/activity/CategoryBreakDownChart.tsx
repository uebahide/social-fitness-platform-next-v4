"use client";

import { getCategoryColor } from "@/lib/utils";
import { PieChart, Pie, Tooltip, Legend } from "recharts";
import { CategoryActivityTotal } from "@/types/api/analytics";

export const CategoryBreakDownChart = ({
  data,
}: {
  data: CategoryActivityTotal[];
}) => {
  const dataWithColors = data.map((entry, index) => ({
    ...entry,
    fill: getCategoryColor(entry.category),
  }));

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
