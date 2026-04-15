import { PageContainer } from "@/components/PageContainer";
import { NotificationClient } from "./NotificationClient";

export default async function NotificationsPage() {
  return (
    <PageContainer
      eyebrow="Notifications"
      title="Notifications"
      description="View your notifications"
    >
      <NotificationClient />
    </PageContainer>
  );
}
