import { Card } from "@/components/Card";
import { UserProfileCard } from "../(home)/UserProfileCard";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";
import { Input } from "@/components/form/Input";
import { FormRow } from "@/components/form/FormRow";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { getCurrentUser } from "@/lib/server/getCurrentUser";
import { PersonalInfoCard } from "./PersonalInfoCard";

export default async function Profile() {
  const latestActivity = await getLatestActivity();
  const activityCount = await getTotalActivityCount();
  const user = await getCurrentUser();

  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 grid-rows-[3fr_2fr]">
      <UserProfileCard
        latestActivity={latestActivity}
        activityCount={activityCount}
        showMyActivitiesLink={false}
        className="col-span-1"
      />
      <PersonalInfoCard user={user} />

      <Card>
        <form className="space-y-4 p-4">
          <FormRow>
            <label htmlFor="name">Old Password</label>
            <Input
              id="old_password"
              name="old_password"
              defaultValue={user?.password}
            />
          </FormRow>
          <FormRow>
            <label htmlFor="name">New Password</label>
            <Input id="new_password" name="new_password" />
          </FormRow>
          <div className="flex justify-center w-full">
            <SubmitButton className="w-full h-12" color="secondary">
              Change Password
            </SubmitButton>
          </div>
        </form>
      </Card>
    </div>
  );
}
