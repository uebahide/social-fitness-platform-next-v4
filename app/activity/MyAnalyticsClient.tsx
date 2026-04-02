"use client";

import { CategoryBreakDownChart } from "./CategoryBreakDownChart";
import { useState } from "react";
import { DashboardAnalyticsType } from "@/types/api/analytics";
import { Card } from "@/components/Card";
import { CategoryFilter } from "./CategoryFilter";
import { CategoryType } from "@/types/api/category";
import { CategoryIcon } from "@/components/CategoryIcon";
import { cn, formatDate, uppercaseFirstLetter } from "@/lib/utils";
import { MetricLineChart } from "./MetricLineChart";
import { ConsistencyBarChart } from "./ConsistencyBarChart";

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

  const selectedDailyValues = dailyDistanceAndDurationValues.slice(
    dailyDistanceAndDurationValues.length - days,
    dailyDistanceAndDurationValues.length,
  );

  const distanceTrendData = selectedDailyValues.map((item) => ({
    name: formatChartDate(item.date),
    value: Number(item.distance),
  }));

  const durationTrendData = selectedDailyValues.map((item) => ({
    name: formatChartDate(item.date),
    value: Number(item.duration),
  }));

  const weeklyConsistencyData = buildWeeklyConsistencyData(selectedDailyValues);

  const totalDistance = distanceTrendData.reduce(
    (acc, curr) => acc + Number(curr.value),
    0,
  );

  return (
    <section className="space-y-5" data-testid="analytics-section">
      <h2
        data-testid="activity-overview-title"
        className="text-lg font-semibold"
      >
        Activity Overview
      </h2>
      <nav className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <CategoryFilter currentFilter={categoryFilter} />
        <DateRangePicker days={days} setDays={setDays} />
      </nav>

      <main className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(320px,0.95fr)]">
        <CategoryMixCard
          categoryFilter={categoryFilter}
          categoryBreakDownData={categoryBreakDownData}
        />
        <DistanceTrendCard days={days} distanceTrendData={distanceTrendData} />
        <QuickStatsCard
          categoryFilter={categoryFilter}
          totalActivityCount={totalActivityCount}
          totalDistance={totalDistance}
          analyticsDashboardData={analyticsDashboardData}
        />
        <ConsistencyBarCard weeklyConsistencyData={weeklyConsistencyData} />
        <DurationTrendCard days={days} durationTrendData={durationTrendData} />
      </main>
    </section>
  );
};

function MetricTile({
  label,
  value,
  tone = "neutral",
  className,
  ...props
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
      {...props}
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

function formatChartDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}

function buildWeeklyConsistencyData(
  values: DashboardAnalyticsType["dailyDistanceAndDurationValues"],
) {
  const weekMap = new Map<string, number>();

  values.forEach((item) => {
    const isActive = Number(item.distance) > 0 || Number(item.duration) > 0;
    if (!isActive) return;

    const date = new Date(item.date);
    const weekStart = new Date(date);
    const day = weekStart.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    weekStart.setDate(weekStart.getDate() + diff);

    const key = weekStart.toISOString().slice(0, 10);
    weekMap.set(key, (weekMap.get(key) ?? 0) + 1);
  });

  return Array.from(weekMap.entries()).map(([weekStart, activeDays]) => ({
    name: formatChartDate(weekStart),
    activeDays,
  }));
}

const CategoryMixCard = ({
  categoryFilter,
  categoryBreakDownData,
}: {
  categoryFilter: CategoryType | null;
  categoryBreakDownData: DashboardAnalyticsType["last7DaysCategoryActivityTotal"];
}) => {
  const filteredCategoryLabel = categoryFilter
    ? uppercaseFirstLetter(categoryFilter)
    : null;
  if (categoryFilter) {
    return (
      <Card
        className="flex min-h-[280px] items-center justify-center bg-gradient-to-br from-brand-secondary-50 via-white to-brand-primary-50 p-8"
        data-testid="category-mix-card-focus-mode"
      >
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
    );
  }
  return (
    <Card
      className="min-h-[280px] space-y-4 p-5"
      data-testid="category-mix-card"
    >
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
  );
};

const DateRangePicker = ({
  days,
  setDays,
}: {
  days: number;
  setDays: (days: number) => void;
}) => {
  return (
    <select
      className="bg-card rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 shadow-sm"
      onChange={(e) => setDays(Number(e.target.value))}
      value={days}
      data-testid="date-range-picker"
    >
      <option value="7">Last 7 days</option>
      <option value="30">Last 30 days</option>
      <option value="60">Last 60 days</option>
      <option value="90">Last 90 days</option>
    </select>
  );
};

const DistanceTrendCard = ({
  days,
  distanceTrendData,
}: {
  days: number;
  distanceTrendData: { name: string; value: number }[];
}) => {
  return (
    <Card
      className="min-h-[280px] space-y-4 p-5"
      data-testid="distance-trend-card"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
          Distance Trend
        </p>
        <h3 className="text-base font-semibold text-gray-900">
          Movement over the last {days} days
        </h3>
      </div>
      <MetricLineChart
        data={distanceTrendData}
        stroke="#0F766E"
        valueLabel="Distance"
      />
    </Card>
  );
};

const DurationTrendCard = ({
  days,
  durationTrendData,
}: {
  days: number;
  durationTrendData: { name: string; value: number }[];
}) => {
  return (
    <Card
      className="min-h-[280px] space-y-4 p-5"
      data-testid="duration-trend-card"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
          Duration Trend
        </p>
        <h3 className="text-base font-semibold text-gray-900">
          Time spent over the last {days} days
        </h3>
      </div>
      <MetricLineChart
        data={durationTrendData}
        stroke="#C2410C"
        valueLabel="Duration"
      />
    </Card>
  );
};

const ConsistencyBarCard = ({
  weeklyConsistencyData,
}: {
  weeklyConsistencyData: { name: string; activeDays: number }[];
}) => {
  return (
    <Card
      className="min-h-[280px] space-y-4 p-5"
      data-testid="consistency-bar-card"
    >
      <div className="space-y-1">
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
          Consistency
        </p>
        <h3 className="text-base font-semibold text-gray-900">
          Active days by week
        </h3>
      </div>
      <ConsistencyBarChart data={weeklyConsistencyData} />
    </Card>
  );
};

const QuickStatsCard = ({
  totalActivityCount,
  totalDistance,
  categoryFilter,
  analyticsDashboardData,
}: {
  totalActivityCount: number;
  totalDistance: number;
  categoryFilter: CategoryType | null;
  analyticsDashboardData: DashboardAnalyticsType;
}) => {
  const {
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
  return (
    <Card
      className="space-y-4 p-5 xl:row-span-2"
      data-testid="quick-stats-card"
    >
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
            data-testid="most-frequent-category-metric"
          />
        )}
      </div>
    </Card>
  );
};
