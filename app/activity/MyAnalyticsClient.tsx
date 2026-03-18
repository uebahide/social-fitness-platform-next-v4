"use client";

import { CategoryBreakDownChart } from "./CategoryBreakDownChart";
import { useState } from "react";
import {
  dailyDistanceAndDurationValues,
  CategoryActivityTotal,
} from "@/types/api/analytics";

import { TrendLineChart } from "./TrendLineChart";

export const MyAnalyticsClient = ({
  last7DaysActivityTotal,
  last30DaysActivityTotal,
  last60DaysActivityTotal,
  last90DaysActivityTotal,
  last7DaysCategoryActivityTotal,
  last30DaysCategoryActivityTotal,
  last60DaysCategoryActivityTotal,
  last90DaysCategoryActivityTotal,
  dailyDistanceAndDurationValues,
}: {
  last7DaysActivityTotal: number;
  last30DaysActivityTotal: number;
  last60DaysActivityTotal: number;
  last90DaysActivityTotal: number;
  last7DaysCategoryActivityTotal: CategoryActivityTotal[];
  last30DaysCategoryActivityTotal: CategoryActivityTotal[];
  last60DaysCategoryActivityTotal: CategoryActivityTotal[];
  last90DaysCategoryActivityTotal: CategoryActivityTotal[];
  dailyDistanceAndDurationValues: dailyDistanceAndDurationValues[];
}) => {
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
    <div className="bg-card h-auto space-y-8 rounded-lg border border-gray-300 px-7 py-4 shadow-sm focus-within:outline-none">
      <nav className="flex justify-end gap-2">
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

      <ul className="flex flex-col gap-2">
        <li>
          <TrendLineChart trendData={trendData} />
        </li>

        <li>
          <CategoryBreakDownChart data={categoryBreakDownData} />
        </li>
        <hr />
        <li>Activity count: {totalActivityCount}</li>
        <li>Total distance: {totalDistance.toFixed(2)} km</li>
      </ul>
    </div>
  );
};
