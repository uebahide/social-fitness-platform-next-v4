import { Card } from "@/components/Card";
import { UserProfileCard } from "../(home)/UserProfileCard";
import { getLatestActivity } from "@/lib/server/getLatestActivity";
import { getTotalActivityCount } from "@/lib/server/getTotalActivityCount";
import { Input } from "@/components/form/Input";
import { FormRow } from "@/components/form/FormRow";
import { SubmitButton } from "@/components/buttons/SubmitButton";

export default async function Profile() {
  const latestActivity = await getLatestActivity();
  const activityCount = await getTotalActivityCount();
  return (
    <div className="grid grid-cols-[1fr_2fr] gap-4 grid-rows-[3fr_2fr]">
      <UserProfileCard
        latestActivity={latestActivity}
        activityCount={activityCount}
        showMyActivitiesLink={false}
        className="col-span-1"
      />
      <Card className="col-span-1 row-span-2">
        <form className="space-y-8 p-4">
          <div className="space-y-4">
            <header className="text-lg font-bold">Profile information</header>
            <div className="grid grid-cols-2 gap-4 pl-3">
              <FormRow>
                <label htmlFor="name">First Name</label>
                <Input id="first_name" name="first_name" />
              </FormRow>
              <FormRow>
                <label htmlFor="name">Last Name</label>
                <Input id="last_name" name="last_name" />
              </FormRow>
              <FormRow>
                <label htmlFor="name">Display Name</label>
                <Input id="display_name" name="display_name" />
              </FormRow>
              <FormRow>
                <label htmlFor="name">Gender</label>
                <Input id="gender" name="gender" />
              </FormRow>
              <FormRow>
                <label htmlFor="name">Nationality</label>
                <Input id="nationality" name="nationality" />
              </FormRow>
            </div>
          </div>
          <div className="space-y-4">
            <header className="text-lg font-bold">Contact Info</header>
            <div className="grid grid-cols-2 gap-4 pl-3">
              <FormRow>
                <label htmlFor="name">Email</label>
                <Input id="first_name" name="first_name" />
              </FormRow>
              <FormRow>
                <label htmlFor="name">Website</label>
                <Input id="display_name" name="display_name" />
              </FormRow>
            </div>
          </div>
          <div className="space-y-4">
            <header className="text-lg font-bold">About the User</header>
            <div className="pl-3">
              <FormRow>
                <label htmlFor="name">Biographical Info</label>
                <textarea
                  id="about"
                  name="about"
                  className="w-full border border-gray-200 rounded-sm p-2 h-30"
                />
              </FormRow>
            </div>
          </div>
        </form>
      </Card>

      <Card>
        <form className="space-y-4 p-4">
          <FormRow>
            <label htmlFor="name">Old Password</label>
            <Input id="old_password" name="old_password" />
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
