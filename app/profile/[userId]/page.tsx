import { FormRow } from "@/components/form/FormRow";
import { Card } from "@/components/Card";
import { createClient } from "@/lib/supabase/server";
import ActivityCard from "@/components/ActivityCard";
import { UserProfileCard } from "@/app/(home)/UserProfileCard";
import { notFound } from "next/navigation";
import { EmptyState } from "@/components/states/EmptyState";
import { PageHeader } from "@/components/PageHeader";
import { PageContainer } from "@/components/PageContainer";

export default async function OtherUserProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ forceError?: string }>;
}) {
  const { forceError } = await searchParams;
  const { userId } = await params;
  const supabase = await createClient();

  const { data: user, error: userError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (userError) {
    throw new Error(userError.message);
  }

  const { data: activities, error: activitiesError } = await supabase
    .from("activities")
    .select(
      "*, details:activity_details(distance, duration, location), user:user_id(*), category:category_id(*)",
    )
    .eq("user_id", userId);

  if (process.env.APP_ENV === "test" && forceError === "1") {
    throw new Error("Test error");
  }

  if (activitiesError) {
    throw new Error(activitiesError.message);
  }

  if (!user) {
    notFound();
  }

  return (
    <PageContainer
      eyebrow="Member Profile"
      title={user.display_name}
      description="View this member's public profile, background, and recently shared activities."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_4fr] gap-4 z-10">
        <div className="flex flex-col gap-4">
          <UserProfileCard user={user} />
          <Card>
            <FormRow>
              <p>About this user</p>
              <textarea
                value={user.about ?? ""}
                readOnly
                placeholder="No about this user yet"
                className="w-full h-[150px] border border-gray-200 rounded-sm p-2 resize-none disabled:bg-gray-100 disabled:text-gray-500 focus:outline-none focus:ring-0"
              />
            </FormRow>
          </Card>
        </div>

        <ul className="flex h-[740px] flex-col gap-4 overflow-y-auto">
          {activities.length === 0 ? (
            <li className="flex h-full flex-col items-center justify-center">
              <EmptyState
                title="No activities yet"
                description="This user has not shared any activities yet."
              />
            </li>
          ) : (
            <>
              {activities.map((activity) => (
                <li key={activity.id}>
                  <ActivityCard activity={activity} showMenu={false} />
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </PageContainer>
  );
}
