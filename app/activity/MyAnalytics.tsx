import { MyAnalyticsClient } from "./MyAnalyticsClient";
import { getDashboardAnalytics } from "@/lib/server/getDashboardAnalytics";

export const MyAnalytics = async () => {
  const analyticsDashboardData = await getDashboardAnalytics();

  return <MyAnalyticsClient analyticsDashboardData={analyticsDashboardData} />;
};
