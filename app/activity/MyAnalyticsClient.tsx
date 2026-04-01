"use client";

import { CategoryBreakDownChart } from "./CategoryBreakDownChart";
import { useState } from "react";
import { DashboardAnalyticsType } from "@/types/api/analytics";

import { TrendLineChart } from "./TrendLineChart";
import { Card } from "@/components/Card";
import { CategoryFilter } from "./CategoryFilter";
import { CategoryType } from "@/types/api/category";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatDate, uppercaseFirstLetter } from "@/lib/utils";

export const MyAnalyticsClient = ({
  analyticsDashboardData,
  categoryFilter,
}: {
  analyticsDashboardData: DashboardAnalyticsType;
  categoryFilter: CategoryType | null;
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
    longestDistance,
    longestDuration,
    totalDuration,
    averageDistance,
    averageDuration,
    activeDays,
    currentStreak,
    latestActivityDate,
    mostFrequentCategory,
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
  const filteredCategoryLabel = categoryFilter
    ? uppercaseFirstLetter(categoryFilter)
    : null;

  return (
    <section className="space-y-4 ">
      <h2
        data-testid="activity-overview-title"
        className="text-lg font-semibold"
      >
        Activity Overview
      </h2>
      <nav className="flex justify-between gap-2">
        <CategoryFilter currentFilter={categoryFilter} />
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
        {categoryFilter ? (
          <Card className="h-[300px] flex items-center justify-center bg-gradient-to-br from-brand-secondary-50 via-white to-brand-primary-50">
            <div className="flex h-full w-full flex-col items-center justify-center gap-4 px-8 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                <CategoryIcon category={categoryFilter} size="large" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-gray-900">
                  Viewing {filteredCategoryLabel} only
                </h3>
                <p className="text-sm leading-6 text-gray-500">
                  Breakdown is available when all categories are selected.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="h-[300px] flex items-center justify-center">
            <CategoryBreakDownChart data={categoryBreakDownData} />
          </Card>
        )}

        <Card className="h-[300px] flex items-center justify-center">
          <TrendLineChart trendData={trendData} />
        </Card>

        <Card className="h-[300px] flex flex-col flex-1 w-full">
          <div>Activity count: {totalActivityCount}</div>
          <div>Total distance: {totalDistance.toFixed(2)} km</div>
          <div>Longest distance: {longestDistance.toFixed(2)} km</div>
          <div>Longest duration: {longestDuration.toFixed(2)} hours</div>
          <div>Total duration: {totalDuration.toFixed(2)} hours</div>
          <div>Average distance: {averageDistance.toFixed(2)} km</div>
          <div>Average duration: {averageDuration.toFixed(2)} hours</div>
          <div>Active days: {activeDays}</div>
          <div>Current streak: {currentStreak}</div>
          {latestActivityDate && (
            <div>Latest activity: {formatDate(latestActivityDate)}</div>
          )}
          {!categoryFilter && (
            <div>
              Most frequent category:{" "}
              {mostFrequentCategory
                ? uppercaseFirstLetter(mostFrequentCategory)
                : "-"}
            </div>
          )}
        </Card>
      </main>
    </section>
  );
};
