"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function updateImage(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/user/image/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  const resJson = await res.json();

  if (!res.ok) {
    throw new Error(`${resJson.error}: ${res.status}, ${res.statusText}`);
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
