"use client";

import { CategoryBreakDownChart } from "./CategoryBreakDownChart";
import { useState } from "react";
import { DashboardAnalyticsType } from "@/types/api/analytics";

import { TrendLineChart } from "./TrendLineChart";
import { Card } from "@/components/Card";
import { CategoryFilter } from "./CategoryFilter";
import { CategoryType } from "@/types/api/category";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn, formatDate, uppercaseFirstLetter } from "@/lib/utils";

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
    <section className="space-y-5">
      <h2
        data-testid="activity-overview-title"
        className="text-lg font-semibold"
      >
        Activity Overview
      </h2>
      <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CategoryFilter currentFilter={categoryFilter} />
        <select
          className="bg-card rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm"
          onChange={(e) => setDays(Number(e.target.value))}
          value={days}
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="60">Last 60 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </nav>

      <main className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_minmax(320px,1fr)]">
        {categoryFilter ? (
          <Card className="flex min-h-[320px] items-center justify-center bg-gradient-to-br from-brand-secondary-50 via-white to-brand-primary-50 p-8">
            <div className="flex h-full w-full flex-col items-center justify-center gap-5 text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
                <CategoryIcon category={categoryFilter} size="large" />
              </div>
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                  Focus Mode
                </p>
                <h3 className="text-xl font-semibold text-gray-900 md:text-2xl">
                  Viewing {filteredCategoryLabel} only
                </h3>
                <p className="mx-auto max-w-sm text-sm leading-6 text-gray-500">
                  Breakdown is available when all categories are selected.
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="min-h-[320px] space-y-4 p-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
                Category Mix
              </p>
              <h3 className="text-base font-semibold text-gray-900">
                Breakdown by activity type
              </h3>
            </div>
            <div className="flex items-center justify-center">
              <CategoryBreakDownChart data={categoryBreakDownData} />
            </div>
          </Card>
        )}

        <Card className="min-h-[320px] space-y-4 p-5">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Distance Trend
            </p>
            <h3 className="text-base font-semibold text-gray-900">
              Movement over the last {days} days
            </h3>
          </div>
          <div className="flex items-center justify-center">
            <TrendLineChart trendData={trendData} />
          </div>
        </Card>

        <Card className="min-h-[320px] space-y-4 p-5">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              Quick Stats
            </p>
            <h3 className="text-base font-semibold text-gray-900">
              Snapshot for the current view
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <MetricTile
              label="Activity count"
              value={String(totalActivityCount)}
              tone="primary"
            />
            <MetricTile
              label="Total distance"
              value={`${totalDistance.toFixed(2)} km`}
            />
            <MetricTile
              label="Longest distance"
              value={`${longestDistance.toFixed(2)} km`}
            />
            <MetricTile
              label="Longest duration"
              value={`${longestDuration.toFixed(2)} min`}
            />
            <MetricTile
              label="Total duration"
              value={`${totalDuration.toFixed(2)} min`}
            />
            <MetricTile
              label="Average distance"
              value={`${averageDistance.toFixed(2)} km`}
            />
            <MetricTile
              label="Average duration"
              value={`${averageDuration.toFixed(2)} min`}
            />
            <MetricTile label="Active days" value={String(activeDays)} />
            <MetricTile
              label="Current streak"
              value={`${currentStreak} day${currentStreak === 1 ? "" : "s"}`}
            />
            <MetricTile
              label="Latest activity"
              value={latestActivityDate ? formatDate(latestActivityDate) : "-"}
            />
            {!categoryFilter && (
              <MetricTile
                label="Most frequent category"
                value={
                  mostFrequentCategory
                    ? uppercaseFirstLetter(mostFrequentCategory)
                    : "-"
                }
                className="sm:col-span-2"
              />
            )}
          </div>
        </Card>
      </main>
    </section>
  );
};

function MetricTile({
  label,
  value,
  tone = "neutral",
  className,
}: {
  label: string;
  value: string;
  tone?: "neutral" | "primary";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-200 bg-white p-4 shadow-sm",
        tone === "primary" &&
          "border-brand-primary-200 bg-gradient-to-br from-brand-primary-50 via-white to-brand-secondary-50",
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold tracking-tight text-gray-900">
        {value}
      </p>
    </div>
  );
}
