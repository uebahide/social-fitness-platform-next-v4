import { CategoryType } from "@/types/api/category";
import { MyAnalyticsClient } from "./MyAnalyticsClient";
import { getDashboardAnalytics } from "@/lib/server/getDashboardAnalytics";

export const MyAnalytics = async ({
  categoryFilter,
}: {
  categoryFilter: CategoryType | null;
}) => {
  const analyticsDashboardData = await getDashboardAnalytics();

  return (
    <MyAnalyticsClient
      analyticsDashboardData={analyticsDashboardData}
      categoryFilter={categoryFilter}
    />
  );
};
