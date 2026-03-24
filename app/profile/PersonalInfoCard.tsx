"use client";

import { SubmitButton } from "@/components/buttons/SubmitButton";
import { Card } from "@/components/Card";
import { FormRow } from "@/components/form/FormRow";
import { Input } from "@/components/form/Input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User } from "@/types/api/user";
import { useActionState, useState } from "react";
import { updateProfile, UpdateProfileState } from "./action";
import { SuccessMessage } from "@/components/form/SuccessMessage";
import { ErrorMessage } from "@/components/form/ErrorMessage";

const initialState: UpdateProfileState = {
  errors: {
    first_name: [],
    last_name: [],
    display_name: [],
    gender: [],
    nationality: [],
    website: [],
    about: [],
  },
  message: "",
  error: "",
  data: {
    first_name: "",
    last_name: "",
    display_name: "",
    gender: "",
    nationality: "",
    website: "",
    about: "",
  },
};

export const PersonalInfoCard = ({ user }: { user: User }) => {
  const [state, formAction] = useActionState(updateProfile, initialState);
  const [gender, setGender] = useState<string | undefined>(
    user?.gender ?? undefined,
  );
  const handleGenderChange = (value: string) => {
    setGender(value);
  };

  return (
    <Card className="col-span-1 row-span-2">
      <form className="space-y-8 p-4" action={formAction}>
        <div className="space-y-4">
          <header className="text-lg font-bold">Profile information</header>
          <div className="grid grid-cols-2 gap-4 pl-3">
            <FormRow>
              <label htmlFor="name">First Name</label>
              <ErrorMessage>{state.errors?.first_name}</ErrorMessage>
              <Input
                id="first_name"
                name="first_name"
                defaultValue={state.data?.first_name || user?.first_name}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="name">Last Name</label>
              <ErrorMessage>{state.errors?.last_name}</ErrorMessage>
              <Input
                id="last_name"
                name="last_name"
                defaultValue={state.data?.last_name || user?.last_name}
              />
            </FormRow>
            <FormRow>
              <label htmlFor="name">Display Name</label>
              <ErrorMessage>{state.errors?.display_name}</ErrorMessage>
              <Input
                id="display_name"
                name="display_name"
                defaultValue={state.data?.display_name || user?.display_name}
              />
            </FormRow>

            <FormRow>
              <label htmlFor="name">Nationality</label>
              <ErrorMessage>{state.errors?.nationality}</ErrorMessage>
              <Input
                id="nationality"
                name="nationality"
                defaultValue={state.data?.nationality || user?.nationality}
              />
            </FormRow>

            <FormRow>
              <label htmlFor="name">Gender</label>
              <ErrorMessage>{state.errors?.gender}</ErrorMessage>
              <Select value={gender} onValueChange={handleGenderChange}>
                <SelectTrigger className="w-fit cursor-pointer">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <input type="hidden" name="gender" value={gender ?? ""} />
            </FormRow>
          </div>
        </div>
        <div className="space-y-4">
          <header className="text-lg font-bold">Contact Info</header>
          <div className="grid grid-cols-2 gap-4 pl-3">
            <FormRow>
              <label htmlFor="name">Email</label>
              <Input id="email" defaultValue={user?.email} readOnly />
            </FormRow>
            <FormRow>
              <label htmlFor="name">Website</label>
              <ErrorMessage>{state.errors?.website}</ErrorMessage>
              <Input
                id="website"
                name="website"
                defaultValue={state.data?.website || user?.website}
              />
            </FormRow>
          </div>
        </div>
        <div className="space-y-4">
          <header className="text-lg font-bold">About the User</header>
          <div className="pl-3">
            <FormRow>
              <label htmlFor="name">Biographical Info</label>
              <ErrorMessage>{state.errors?.about}</ErrorMessage>
              <textarea
                id="about"
                name="about"
                className="w-full border border-gray-200 rounded-sm p-2 h-18"
                defaultValue={state.data?.about || user?.about}
              />
            </FormRow>
          </div>
        </div>
        <div className="flex justify-between">
          <SuccessMessage>{state.message}</SuccessMessage>
          <ErrorMessage>{state.error}</ErrorMessage>
          <SubmitButton className=" h-12" color="secondary">
            Update
          </SubmitButton>
        </div>
      </form>
    </Card>
  );
};
