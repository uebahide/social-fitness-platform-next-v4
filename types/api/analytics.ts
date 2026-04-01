export type DashboardAnalyticsType = {
  last7DaysActivityTotal: number;
  last30DaysActivityTotal: number;
  last60DaysActivityTotal: number;
  last90DaysActivityTotal: number;
  last7DaysCategoryActivityTotal: CategoryActivityTotal[];
  last30DaysCategoryActivityTotal: CategoryActivityTotal[];
  last60DaysCategoryActivityTotal: CategoryActivityTotal[];
  last90DaysCategoryActivityTotal: CategoryActivityTotal[];
  dailyDistanceAndDurationValues: DailyDistanceAndDurationValues[];
};

export type CategoryActivityTotal = {
  category: string;
  total: number;
};

export type DailyDistanceAndDurationValues = {
  date: string;
  distance: number;
  duration: number;
};
