"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";

type UpdateImageState = {
  error: string;
} | null;

export async function updateImage(
  _prevState: UpdateImageState,
  formData: FormData,
): Promise<UpdateImageState> {
  const supabase = await createClient();
  const image = formData.get("image") as File;
  const userId = await getCurrentUserId();
  const fileExt = image.name.split(".").pop();
  const filePath = `${userId}/avatar-${Date.now()}.${fileExt}`;
  console.log(image);

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, image, {
      upsert: true,
      contentType: image.type,
    });

  if (uploadError) {
    return {
      error: uploadError.message,
    };
  }

  const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);
  const publicUrl = data.publicUrl;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      image_path: publicUrl,
    })
    .eq("id", userId);

  if (updateError) {
    return {
      error: updateError.message,
    };
  }

  revalidatePath("/profile", "layout");
  redirect("/profile");
}

export type UpdateProfileState = {
  errors: {
    first_name?: string[];
    last_name?: string[];
    display_name?: string[];
    gender?: string[];
    nationality?: string[];
    website?: string[];
    about?: string[];
  };
  message: string;
  error: string;
  data: {
    first_name: string;
    last_name: string;
    display_name: string;
    gender: string;
    nationality: string;
    website: string;
    about: string;
  };
};

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  display_name: z.string().min(1, "Display name is required"),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  website: z.string().optional(),
  about: z.string().optional(),
});

export async function updateProfile(
  prevState: UpdateProfileState,
  formData: FormData,
): Promise<UpdateProfileState> {
  const supabase = await createClient();
  const currentUserId = await getCurrentUserId();
  const first_name = String(formData.get("first_name") ?? "");
  const last_name = String(formData.get("last_name") ?? "");
  const display_name = String(formData.get("display_name") ?? "");
  const gender = String(formData.get("gender") ?? "");
  const nationality = String(formData.get("nationality") ?? "");
  const website = String(formData.get("website") ?? "");
  const about = String(formData.get("about") ?? "");
  const validatedFields = schema.safeParse({
    first_name,
    last_name,
    display_name,
    gender,
    nationality,
    website,
    about,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "",
      error: "",
      data: {
        first_name,
        last_name,
        display_name,
        gender,
        nationality,
        website,
        about,
      },
    };
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({
      first_name,
      last_name,
      display_name,
      gender: gender === "" ? null : gender,
      nationality,
      website,
      about,
    })
    .eq("id", currentUserId)
    .select()
    .single();

  if (error) {
    return {
      errors: {},
      message: "",
      error: error.message ?? "An unknown error occurred",
      data: {
        first_name,
        last_name,
        display_name,
        gender,
        nationality,
        website,
        about,
      },
    };
  }

  revalidatePath("/profile", "layout");

  return {
    errors: {},
    message: "Profile was updated successfully",
    error: "",
    data: {
      first_name: data?.first_name ?? "",
      last_name: data?.last_name ?? "",
      display_name: data?.display_name ?? "",
      gender: data?.gender ?? "",
      nationality: data?.nationality ?? "",
      website: data?.website ?? "",
      about: data?.about ?? "",
    },
  };
}
