import { MyAnalyticsClient } from "./MyAnalyticsClient";
import { getDashboardAnalytics } from "@/lib/services/analytics";

export const MyAnalytics = async () => {
  const analyticsDashboardData = await getDashboardAnalytics();

  const last7DaysActivityTotal = analyticsDashboardData?.last7DaysActivityTotal;
  const last30DaysActivityTotal =
    analyticsDashboardData?.last30DaysActivityTotal;
  const last60DaysActivityTotal =
    analyticsDashboardData?.last60DaysActivityTotal;
  const last90DaysActivityTotal =
    analyticsDashboardData?.last90DaysActivityTotal;
  const last7DaysCategoryActivityTotal =
    analyticsDashboardData?.last7DaysCategoryActivityTotal;
  const last30DaysCategoryActivityTotal =
    analyticsDashboardData?.last30DaysCategoryActivityTotal;
  const last60DaysCategoryActivityTotal =
    analyticsDashboardData?.last60DaysCategoryActivityTotal;
  const last90DaysCategoryActivityTotal =
    analyticsDashboardData?.last90DaysCategoryActivityTotal;
  const dailyDistanceAndDurationValues =
    analyticsDashboardData?.dailyDistanceAndDurationValues;

  return (
    <MyAnalyticsClient
      last7DaysActivityTotal={last7DaysActivityTotal}
      last30DaysActivityTotal={last30DaysActivityTotal}
      last60DaysActivityTotal={last60DaysActivityTotal}
      last90DaysActivityTotal={last90DaysActivityTotal}
      last7DaysCategoryActivityTotal={last7DaysCategoryActivityTotal}
      last30DaysCategoryActivityTotal={last30DaysCategoryActivityTotal}
      last60DaysCategoryActivityTotal={last60DaysCategoryActivityTotal}
      last90DaysCategoryActivityTotal={last90DaysCategoryActivityTotal}
      dailyDistanceAndDurationValues={dailyDistanceAndDurationValues}
    />
  );
};
