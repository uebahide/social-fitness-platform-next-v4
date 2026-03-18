// import { getAnalyticsDashboard } from "@/lib/api/analytics";
import { dashboard } from "@/types/api/analytics";
import { MyAnalyticsClient } from "./MyAnalyticsClient";

export const MyAnalytics = async ({ token }: { token: string }) => {
  // const analyticsDashboardData: dashboard = await getAnalyticsDashboard(token);

  // const last7DaysActivityTotal = analyticsDashboardData?.last7DaysActivityTotal;
  // const last30DaysActivityTotal =
  //   analyticsDashboardData?.last30DaysActivityTotal;
  // const last60DaysActivityTotal =
  //   analyticsDashboardData?.last60DaysActivityTotal;
  // const last90DaysActivityTotal =
  //   analyticsDashboardData?.last90DaysActivityTotal;
  // const last7DaysCategoryActivityTotal =
  //   analyticsDashboardData?.last7DaysCategoryActivityTotal;
  // const last30DaysCategoryActivityTotal =
  //   analyticsDashboardData?.last30DaysCategoryActivityTotal;
  // const last60DaysCategoryActivityTotal =
  //   analyticsDashboardData?.last60DaysCategoryActivityTotal;
  // const last90DaysCategoryActivityTotal =
  //   analyticsDashboardData?.last90DaysCategoryActivityTotal;
  // const dailyDistanceAndDurationValues =
  //   analyticsDashboardData?.dailyDistanceAndDurationValues;

  return (
    <MyAnalyticsClient
      last7DaysActivityTotal={0}
      last30DaysActivityTotal={0}
      last60DaysActivityTotal={0}
      last90DaysActivityTotal={0}
      last7DaysCategoryActivityTotal={[]}
      last30DaysCategoryActivityTotal={[]}
      last60DaysCategoryActivityTotal={[]}
      last90DaysCategoryActivityTotal={[]}
      dailyDistanceAndDurationValues={[]}
    />
  );
};
