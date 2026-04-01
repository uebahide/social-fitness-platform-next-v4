"use client";

import { CategoryBreakDownChart } from "./CategoryBreakDownChart";
import { useState } from "react";
import { DashboardAnalyticsType } from "@/types/api/analytics";

import { TrendLineChart } from "./TrendLineChart";
import { Card } from "@/components/Card";

export const MyAnalyticsClient = ({
  analyticsDashboardData,
}: {
  analyticsDashboardData: DashboardAnalyticsType;
}) => {
  const {
    last7DaysActivityTotal,
    last30DaysActivityTotal,
    last60DaysActivityTotal,
    last90DaysActivityTotal,
    last7DaysCategoryActivityTotal,
    last30DaysCategoryActivityTotal,
    last60DaysCategoryActivityTotal,
    last90DaysCategoryActivityTotal,
    dailyDistanceAndDurationValues,
  } = analyticsDashboardData;

  const [days, setDays] = useState<number>(7);
  const categoryBreakDownData =
    days === 7
      ? last7DaysCategoryActivityTotal
      : days === 30
        ? last30DaysCategoryActivityTotal
        : days === 60
          ? last60DaysCategoryActivityTotal
          : last90DaysCategoryActivityTotal;
  const totalActivityCount =
    days === 7
      ? last7DaysActivityTotal
      : days === 30
        ? last30DaysActivityTotal
        : days === 60
          ? last60DaysActivityTotal
          : last90DaysActivityTotal;

  const trendData = dailyDistanceAndDurationValues
    .slice(
      dailyDistanceAndDurationValues.length - days,
      dailyDistanceAndDurationValues.length,
    )
    .map((item) => ({
      name: item.date,
      distance: item.distance,
    }));
  const totalDistance = trendData.reduce(
    (acc, curr) => acc + Number(curr.distance),
    0,
  );

  return (
    <section className="space-y-4 mt-4">
      <h1>Activity Overview</h1>
      <nav className="flex justify-start gap-2">
        <select
          className="bg-card rounded-lg border border-gray-300 px-2 py-1"
          onChange={(e) => setDays(Number(e.target.value))}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </nav>

      <main className="flex gap-4">
        <Card className="h-[300px] flex items-center justify-center">
          <TrendLineChart trendData={trendData} />
        </Card>

        <Card className="h-[300px] flex items-center justify-center">
          <CategoryBreakDownChart data={categoryBreakDownData} />
        </Card>
        <Card className="h-[300px] flex flex-col flex-1 w-full">
          <div>Activity count: {totalActivityCount}</div>
          <div>Total distance: {totalDistance.toFixed(2)} km</div>
        </Card>
      </main>
    </section>
  );
};
