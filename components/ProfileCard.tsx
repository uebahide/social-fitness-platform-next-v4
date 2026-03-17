"use client";

import { useUser } from "@/contexts/UserProvider";
import { SubmitButton } from "./buttons/SubmitButton";
import { Input } from "./form/Input";
import { FormRow } from "./form/FormRow";
import Image from "next/image";
import { useActionState, useState } from "react";
import { User } from "@/types/api/user";
import { updateImage, updateProfile } from "@/app/profile/action";
import { ErrorMessage } from "./form/ErrorMessage";
import { Avatar } from "./Avatar";

export default function ProfileCard() {
  const { user } = useUser();

  return (
    <div className="bg-card w-[700px] space-y-10 rounded-sm p-10 shadow-sm">
      <div className="space-y-5">
        <p className="text-2xl">Image</p>
        <ImageForm user={user} />
      </div>
      <hr />
      <div className="space-y-5">
        <div className="text-2xl">Profile</div>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}

const ImageForm = ({ user }: { user: User | null }) => {
  const [state, formAction] = useActionState(updateImage, null);
  const [error, setError] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 1 * 1024 * 1024; // 1MB

    if (file.size > maxSize) {
      setError("Image must be 1MB or smaller.");
      e.target.value = "";
      return;
    }

    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  return (
    <form action={formAction} className="flex items-end justify-between gap-5">
      <label className="cursor-pointer">
        {image ? (
          <div className="relative h-24 w-24 overflow-hidden rounded-full">
            <Image
              src={URL.createObjectURL(image)}
              alt="avatar"
              fill
              className="object-cover"
            />
          </div>
        ) : (
          <Avatar size="xlarge" />
        )}
        <ErrorMessage>{error}</ErrorMessage>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
      </label>
      {image && <SubmitButton className="h-10">Save Image</SubmitButton>}
    </form>
  );
};

const initialState = {
  errors: {},
  message: "",
  data: {
    name: "",
    email: "",
  },
};

const ProfileForm = ({ user }: { user: User | null }) => {
  const [state, formAction] = useActionState(updateProfile, initialState);
  return (
    <form
      action={formAction}
      className="grid grid-cols-[1fr_1fr] gap-x-4 gap-y-8"
    >
      <FormRow>
        <label>Name</label>
        <Input
          defaultValue={state.data.name || user?.name || ""}
          type="text"
          name="name"
          id="name"
          className="h-10"
          required
        />
        <ErrorMessage>{state.errors.name}</ErrorMessage>
      </FormRow>
      <FormRow>
        <label>Email</label>
        <Input
          defaultValue={state.data.email || user?.email || ""}
          type="email"
          name="email"
          id="email"
          className="h-10"
          required
        />
        <ErrorMessage>{state.errors.email}</ErrorMessage>
      </FormRow>
      <div className="col-span-2 flex justify-end">
        <SubmitButton className="h-10">Update</SubmitButton>
      </div>
    </form>
  );
};
