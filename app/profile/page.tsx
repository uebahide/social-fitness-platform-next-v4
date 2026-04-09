import { Card } from "@/components/Card";
import { Input } from "@/components/form/Input";
import { FormRow } from "@/components/form/FormRow";
import { SubmitButton } from "@/components/buttons/SubmitButton";
import { getCurrentUser } from "@/lib/server/getCurrentUser";
import { PersonalInfoCard } from "./PersonalInfoCard";
import { UserProfileCard } from "../(home)/UserProfileCard";
import { PageContainer } from "@/components/PageContainer";

export default async function Profile() {
  const user = await getCurrentUser();

  return (
    <PageContainer
      eyebrow="Account"
      title="My Profile"
      description="Manage your public profile, personal information, and account settings from one place."
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4 lg:grid-rows-[3fr_2fr] z-10">
        <UserProfileCard className="col-span-1" />
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
    </PageContainer>
  );
}
